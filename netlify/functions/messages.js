import { getDatabase } from "@netlify/database";

const db = getDatabase();

export default async (req, context) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  // Ensure table exists (safeguard for cold start / initial migration sync)
  try {
    await db.sql`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
  } catch (initErr) {
    console.error("Table initialization check:", initErr.message);
  }

  // POST: Receive and store new contact message
  if (req.method === "POST") {
    try {
      let body;
      try {
        body = await req.json();
      } catch {
        return new Response(
          JSON.stringify({
            success: false,
            error: "Invalid JSON in request body.",
          }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          }
        );
      }

      const { name, email, message } = body || {};

      if (!name || !email || !message) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "All fields (name, email, message) are required.",
          }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          }
        );
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "Please provide a valid email address.",
          }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          }
        );
      }

      const [saved] = await db.sql`
        INSERT INTO messages (name, email, message)
        VALUES (${name.trim()}, ${email.trim()}, ${message.trim()})
        RETURNING id, name, email, created_at;
      `;

      return new Response(
        JSON.stringify({
          success: true,
          message: "Thank you! Your message has been sent successfully.",
          data: saved,
        }),
        {
          status: 201,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    } catch (err) {
      console.error("Error storing message in Netlify Database:", err);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Database error. Failed to save message.",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }
  }

  // GET: Retrieve recent messages
  if (req.method === "GET") {
    try {
      const messages = await db.sql`
        SELECT id, name, email, message, created_at
        FROM messages
        ORDER BY created_at DESC
        LIMIT 50;
      `;

      return new Response(
        JSON.stringify({
          success: true,
          count: messages.length,
          data: messages,
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    } catch (err) {
      console.error("Error fetching messages:", err);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Failed to retrieve messages from database.",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }
  }

  // Disallow other methods
  return new Response(
    JSON.stringify({
      success: false,
      error: `Method ${req.method} Not Allowed`,
    }),
    {
      status: 405,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
};

export const config = {
  path: "/api/messages",
};

