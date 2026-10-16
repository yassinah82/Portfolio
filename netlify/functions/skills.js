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
      CREATE TABLE IF NOT EXISTS skills (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        icon VARCHAR(100) NOT NULL DEFAULT 'fas fa-code',
        tags TEXT[] DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
  } catch (err) {
    console.error("Skills table check:", err.message);
  }

  // Auto-seed existing default skills if table is empty
  try {
    const existing = await db.sql`SELECT COUNT(*)::int as count FROM skills;`;
    if (existing && existing[0] && parseInt(existing[0].count, 10) === 0) {
      await db.sql`
        INSERT INTO skills (title, description, icon, tags) VALUES
        ('Web Development', 'Crafting responsive, modern websites with clean code and smooth user experiences', 'fas fa-code', ARRAY['HTML5', 'CSS3', 'JavaScript', 'Bootstrap']),
        ('Python Development', 'Building automation scripts, CLI tools, and logic-driven applications to solve real-world problems', 'fa-brands fa-python', ARRAY['Python', 'Automation', 'CLI']),
        ('Data Science & ML', 'Learning data science and machine learning with Python — analyzing data and building models using Pandas, NumPy, Scikit-learn, Matplotlib, and Seaborn', 'fa-solid fa-brain', ARRAY['Pandas', 'Scikit-Learn', 'NumPy', 'Matplotlib', 'Seaborn']),
        ('Game Dev with Godot & Unity', 'Building 2D and 3D experiences with foundational game development basics across Godot and Unity', 'fa-solid fa-gamepad', ARRAY['Godot', 'GDScript', 'Unity', 'C#']),
        ('Flutter Mobile Apps', 'Engineering beautiful, cross-platform mobile applications — one codebase, every device', 'fas fa-mobile', ARRAY['Flutter', 'Dart', 'Firebase']);
      `;
    }
  } catch (err) {
    console.error("Auto-seed skills error:", err.message);
  }

  // ---------------- GET: Retrieve all skills (Public) ----------------
  if (req.method === "GET") {
    try {
      const skills = await db.sql`
        SELECT id, title, description, icon, tags, created_at
        FROM skills
        ORDER BY id ASC;
      `;

      return new Response(
        JSON.stringify({
          success: true,
          count: skills.length,
          data: skills,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    } catch (err) {
      console.error("Error fetching skills:", err);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to retrieve skills." }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
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

  // ---------------- POST: Create new skill card ----------------
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

      const { title, description, icon, tags } = body || {};

      if (!title || !description) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "Title and description are required.",
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

      const iconClass = icon && icon.trim() ? icon.trim() : "fas fa-code";

      const [saved] = await db.sql`
        INSERT INTO skills (title, description, icon, tags)
        VALUES (${title.trim()}, ${description.trim()}, ${iconClass}, ${formattedTags})
        RETURNING id, title, description, icon, tags, created_at;
      `;

      return new Response(
        JSON.stringify({
          success: true,
          message: "Skill card added successfully!",
          data: saved,
        }),
        {
          status: 201,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    } catch (err) {
      console.error("Error creating skill:", err);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to create skill card." }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
  }

  // ---------------- DELETE: Remove skill card ----------------
  if (req.method === "DELETE") {
    try {
      const url = new URL(req.url);
      let body = {};
      try {
        body = await req.json();
      } catch {}

      const id = url.searchParams.get("id") || body.id;

      if (!id) {
        return new Response(
          JSON.stringify({ success: false, error: "Skill id is required." }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      const [deleted] = await db.sql`
        DELETE FROM skills
        WHERE id = ${Number(id)}
        RETURNING id;
      `;

      if (!deleted) {
        return new Response(
          JSON.stringify({ success: false, error: "Skill not found." }),
          { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, message: "Skill card deleted successfully." }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    } catch (err) {
      console.error("Error deleting skill:", err);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to delete skill." }),
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
  path: "/api/skills",
};

