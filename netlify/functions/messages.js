import { getDatabase } from "@netlify/database";

const db = getDatabase();

// CORS Headers helper
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, x-admin-key, Authorization",
};

// Admin authentication verification
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "ya#1982Ya@";

function isAuthorized(req) {
  const headerKey = req.headers.get("x-admin-key");
  const authHeader = req.headers.get("authorization");
  
  if (headerKey && headerKey === ADMIN_PASSWORD) {
    return true;
  }
  if (authHeader) {
    const token = authHeader.replace(/^Bearer\s+/i, "");
    if (token === ADMIN_PASSWORD) return true;
  }
  return false;
}

// Function handler
export default async (req, context) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  // Ensure table and columns exist
  try {
    await db.sql`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await db.sql`
      ALTER TABLE messages ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT FALSE;
    `;
  } catch (initErr) {
    console.error("Table initialization check:", initErr.message);
  }

  // ---------------- POST: Save new contact message ----------------
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
              ...corsHeaders,
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
              ...corsHeaders,
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
              ...corsHeaders,
            },
          }
        );
      }

      // Insert message into database
      const [saved] = await db.sql`
        INSERT INTO messages (name, email, message, is_read)
        VALUES (${name.trim()}, ${email.trim()}, ${message.trim()}, false)
        RETURNING id, name, email, message, is_read, created_at;
      `;

      // Trigger Discord Webhook Notification if DISCORD_WEBHOOK_URL is set
      const discordWebhook = process.env.DISCORD_WEBHOOK_URL;
      if (discordWebhook) {
        try {
          await fetch(discordWebhook, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: "Portfolio Bot",
              avatar_url: "https://about-yassin.netlify.app/Images/background.png",
              embeds: [
                {
                  title: "📬 New Portfolio Message!",
                  color: 3828980, // Hex #3a6cf4
                  fields: [
                    { name: "👤 Sender", value: name.trim(), inline: true },
                    { name: "📧 Email", value: email.trim(), inline: true },
                    { name: "💬 Message", value: message.trim() },
                  ],
                  footer: {
                    text: "Yassin's Portfolio • Netlify Database",
                  },
                  timestamp: new Date().toISOString(),
                },
              ],
            }),
          });
        } catch (webhookErr) {
          console.error("Discord Webhook notification error:", webhookErr);
          // Do not fail user request if webhook notification encounters network error
        }
      }

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
            ...corsHeaders,
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
            ...corsHeaders,
          },
        }
      );
    }
  }

  // ---------------- Protected Admin Routes (GET, PATCH, DELETE) ----------------
  if (!isAuthorized(req)) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Unauthorized. Valid admin password required.",
      }),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }

  const url = new URL(req.url);

  // ---------------- GET: Retrieve messages with optional search & filter ----------------
  if (req.method === "GET") {
    try {
      const search = url.searchParams.get("search");
      const status = url.searchParams.get("status"); // 'read', 'unread', or null

      let messages;
      if (search && status === "unread") {
        const pattern = `%${search.trim()}%`;
        messages = await db.sql`
          SELECT id, name, email, message, is_read, created_at
          FROM messages
          WHERE (name ILIKE ${pattern} OR email ILIKE ${pattern} OR message ILIKE ${pattern})
            AND is_read = false
          ORDER BY created_at DESC
          LIMIT 100;
        `;
      } else if (search && status === "read") {
        const pattern = `%${search.trim()}%`;
        messages = await db.sql`
          SELECT id, name, email, message, is_read, created_at
          FROM messages
          WHERE (name ILIKE ${pattern} OR email ILIKE ${pattern} OR message ILIKE ${pattern})
            AND is_read = true
          ORDER BY created_at DESC
          LIMIT 100;
        `;
      } else if (search) {
        const pattern = `%${search.trim()}%`;
        messages = await db.sql`
          SELECT id, name, email, message, is_read, created_at
          FROM messages
          WHERE name ILIKE ${pattern} OR email ILIKE ${pattern} OR message ILIKE ${pattern}
          ORDER BY created_at DESC
          LIMIT 100;
        `;
      } else if (status === "unread") {
        messages = await db.sql`
          SELECT id, name, email, message, is_read, created_at
          FROM messages
          WHERE is_read = false
          ORDER BY created_at DESC
          LIMIT 100;
        `;
      } else if (status === "read") {
        messages = await db.sql`
          SELECT id, name, email, message, is_read, created_at
          FROM messages
          WHERE is_read = true
          ORDER BY created_at DESC
          LIMIT 100;
        `;
      } else {
        messages = await db.sql`
          SELECT id, name, email, message, is_read, created_at
          FROM messages
          ORDER BY created_at DESC
          LIMIT 100;
        `;
      }

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
            ...corsHeaders,
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
            ...corsHeaders,
          },
        }
      );
    }
  }

  // ---------------- PATCH: Update read/unread status ----------------
  if (req.method === "PATCH") {
    try {
      let body = {};
      try {
        body = await req.json();
      } catch {}

      const id = url.searchParams.get("id") || body.id;
      const is_read = body.is_read !== undefined ? Boolean(body.is_read) : true;

      if (!id) {
        return new Response(
          JSON.stringify({ success: false, error: "Message id is required." }),
          {
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }

      const [updated] = await db.sql`
        UPDATE messages
        SET is_read = ${is_read}
        WHERE id = ${Number(id)}
        RETURNING id, name, email, message, is_read, created_at;
      `;

      if (!updated) {
        return new Response(
          JSON.stringify({ success: false, error: "Message not found." }),
          {
            status: 404,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: `Message marked as ${is_read ? "read" : "unread"}.`,
          data: updated,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    } catch (err) {
      console.error("Error updating message status:", err);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to update message." }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
  }

  // ---------------- DELETE: Remove message by ID ----------------
  if (req.method === "DELETE") {
    try {
      let body = {};
      try {
        body = await req.json();
      } catch {}

      const id = url.searchParams.get("id") || body.id;

      if (!id) {
        return new Response(
          JSON.stringify({ success: false, error: "Message id is required." }),
          {
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }

      const [deleted] = await db.sql`
        DELETE FROM messages
        WHERE id = ${Number(id)}
        RETURNING id;
      `;

      if (!deleted) {
        return new Response(
          JSON.stringify({ success: false, error: "Message not found." }),
          {
            status: 404,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: "Message deleted successfully.",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    } catch (err) {
      console.error("Error deleting message:", err);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to delete message." }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
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
        ...corsHeaders,
      },
    }
  );
};

export const config = {
  path: "/api/messages",
};
