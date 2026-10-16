import { getDatabase } from "@netlify/database";

const db = getDatabase();

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, x-admin-key, Authorization",
};

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

function isAuthorized(req) {
  if (!ADMIN_PASSWORD) return false;
  const headerKey = req.headers.get("x-admin-key");
  const authHeader = req.headers.get("authorization");

  if (headerKey && headerKey === ADMIN_PASSWORD) return true;
  if (authHeader) {
    const token = authHeader.replace(/^Bearer\s+/i, "");
    if (token === ADMIN_PASSWORD) return true;
  }
  return false;
}

export default async (req, context) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  // Ensure table exists
  try {
    await db.sql`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        image_url TEXT,
        tags TEXT[] DEFAULT '{}',
        live_url TEXT,
        details_url TEXT,
        is_featured BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
  } catch (err) {
    console.error("Projects table check:", err.message);
  }

  const url = new URL(req.url);

  // ---------------- GET: Retrieve projects (Public) ----------------
  if (req.method === "GET") {
    try {
      const featured = url.searchParams.get("featured");

      let projects;
      if (featured === "true") {
        projects = await db.sql`
          SELECT id, title, description, image_url, tags, live_url, details_url, is_featured, created_at
          FROM projects
          WHERE is_featured = true
          ORDER BY id ASC;
        `;
      } else {
        projects = await db.sql`
          SELECT id, title, description, image_url, tags, live_url, details_url, is_featured, created_at
          FROM projects
          ORDER BY id ASC;
        `;
      }

      return new Response(
        JSON.stringify({
          success: true,
          count: projects.length,
          data: projects,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    } catch (err) {
      console.error("Error fetching projects:", err);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to retrieve projects." }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
  }

  // ---------------- Protected Admin Operations (POST, DELETE) ----------------
  if (!isAuthorized(req)) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Unauthorized. Valid admin password required.",
      }),
      {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }

  // ---------------- POST: Create new project card ----------------
  if (req.method === "POST") {
    try {
      let body;
      try {
        body = await req.json();
      } catch {
        return new Response(
          JSON.stringify({ success: false, error: "Invalid JSON body." }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      const { title, description, image_url, tags, live_url, details_url, is_featured } = body || {};

      if (!title || !description) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "Project title and description are required.",
          }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Format tags array
      let formattedTags = [];
      if (Array.isArray(tags)) {
        formattedTags = tags.map((t) => String(t).trim()).filter(Boolean);
      } else if (typeof tags === "string") {
        formattedTags = tags.split(",").map((t) => t.trim()).filter(Boolean);
      }

      const featuredFlag = is_featured !== undefined ? Boolean(is_featured) : true;
      const img = image_url && image_url.trim() ? image_url.trim() : "Images/background.png";
      const live = live_url && live_url.trim() ? live_url.trim() : "#";
      const details = details_url && details_url.trim() ? details_url.trim() : "";

      const [saved] = await db.sql`
        INSERT INTO projects (title, description, image_url, tags, live_url, details_url, is_featured)
        VALUES (${title.trim()}, ${description.trim()}, ${img}, ${formattedTags}, ${live}, ${details}, ${featuredFlag})
        RETURNING id, title, description, image_url, tags, live_url, details_url, is_featured, created_at;
      `;

      return new Response(
        JSON.stringify({
          success: true,
          message: "Project card added successfully!",
          data: saved,
        }),
        {
          status: 201,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    } catch (err) {
      console.error("Error creating project:", err);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to create project card." }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
  }

  // ---------------- DELETE: Remove project card ----------------
  if (req.method === "DELETE") {
    try {
      let body = {};
      try {
        body = await req.json();
      } catch {}

      const id = url.searchParams.get("id") || body.id;

      if (!id) {
        return new Response(
          JSON.stringify({ success: false, error: "Project id is required." }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      const [deleted] = await db.sql`
        DELETE FROM projects
        WHERE id = ${Number(id)}
        RETURNING id;
      `;

      if (!deleted) {
        return new Response(
          JSON.stringify({ success: false, error: "Project not found." }),
          { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, message: "Project card deleted successfully." }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    } catch (err) {
      console.error("Error deleting project:", err);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to delete project." }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
  }

  return new Response(
    JSON.stringify({ success: false, error: `Method ${req.method} Not Allowed` }),
    { status: 405, headers: { "Content-Type": "application/json", ...corsHeaders } }
  );
};

export const config = {
  path: "/api/projects",
};

