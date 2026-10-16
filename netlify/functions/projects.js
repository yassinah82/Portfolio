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

  // Auto-seed existing default projects if table is empty
  try {
    const existing = await db.sql`SELECT id FROM projects LIMIT 1;`;
    if (!existing || existing.length === 0) {
      const defaultProjects = [
        {
          title: "Web Password Generator",
          desc: "Generate strong, randomized passwords with customizable length and character options — security made simple",
          image_url: "/Images/Password-Gen.png",
          tags: ["HTML", "CSS", "JavaScript"],
          live_url: "https://pleasepassword.netlify.app/",
          details_url: "/html/project-details/passgen.html",
          is_featured: true,
        },
        {
          title: "Temperature Convertor",
          desc: "Seamlessly convert between Celsius, Fahrenheit, and Kelvin with real-time calculations and a clean interface",
          image_url: "/Images/Temp-conv.png",
          tags: ["HTML", "CSS", "JavaScript"],
          live_url: "https://thetemperature-convertor.vercel.app/",
          details_url: "/html/project-details/tempconv.html",
          is_featured: true,
        },
        {
          title: "Countries Guide",
          desc: "Explore any country in the world — instantly access flags, capitals, population data, and more via a live REST API",
          image_url: "/Images/Countries-Guide.png",
          tags: ["HTML", "CSS", "JavaScript", "REST API"],
          live_url: "https://countrysguide.netlify.app/",
          details_url: "/html/project-details/contriesguide.html",
          is_featured: true,
        },
        {
          title: "Todo List Web App",
          desc: "A modern web-based task management application with real-time updates and task categorization.",
          image_url: "/Images/Todo.png",
          tags: ["Task Management", "Authentication", "Web App"],
          live_url: "https://yourtodos-list.netlify.app/",
          details_url: "/html/project-details/todolistwebsite.html",
          is_featured: false,
        },
        {
          title: "Egypt Website",
          desc: "A comprehensive website showcasing Egyptian culture, history, and tourism.",
          image_url: "/Images/Egypt Website.png",
          tags: ["Tourism", "Culture", "Modern UI/UX", "Responsive"],
          live_url: "https://egypt-culture.netlify.app/",
          details_url: "/html/project-details/egyptwebsite.html",
          is_featured: false,
        },
        {
          title: "Trip To Egypt",
          desc: "A travel planning platform for exploring Egypt's wonders with customizable itineraries and interactive maps.",
          image_url: "/Images/trip.png",
          tags: ["Travel", "Itineraries", "Interactive Maps"],
          live_url: "https://trip-to-egypt-example.netlify.app/",
          details_url: "/html/project-details/triptoegypt.html",
          is_featured: false,
        },
        {
          title: "Todo List App (Flutter)",
          desc: "A cross-platform mobile application for task management with offline functionality and cloud sync.",
          image_url: "/Images/Flut-todolist.png",
          tags: ["Flutter", "Dart", "Mobile", "Cross-Platform"],
          live_url: "https://drive.usercontent.google.com/download?id=18GD6s731ExdMC7FBlskcUa5q27VXGxRw&export=download&authuser=0&confirm=t&uuid=f5258266-6931-4150-8a48-b65eab14dab8&at=AEz70l7c2rYNBYu6hQZTn1Q5wt19%3A1742767622305",
          details_url: "/html/project-details/todolistapp.html",
          is_featured: false,
        },
      ];

      for (const p of defaultProjects) {
        await db.sql`
          INSERT INTO projects (title, description, image_url, tags, live_url, details_url, is_featured)
          VALUES (${p.title}, ${p.desc}, ${p.image_url}, ${p.tags}, ${p.live_url}, ${p.details_url}, ${p.is_featured});
        `;
      }
    }
  } catch (err) {
    console.error("Auto-seed projects error:", err.message);
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

