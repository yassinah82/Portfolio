import { supabase } from "./_supabase.js";
import { isAuthorized, setCorsHeaders, parseBody } from "./_auth.js";

export default async function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // ---------------- GET: Retrieve projects (Public) ----------------
  if (req.method === "GET") {
    try {
      const { featured } = req.query || {};

      let query = supabase
        .from("projects")
        .select(
          "id, title, description, image_url, tags, live_url, details_url, is_featured, created_at"
        )
        .order("id", { ascending: true });

      if (featured === "true") {
        query = query.eq("is_featured", true);
      }

      const { data: projects, error } = await query;

      if (error) {
        console.error("Supabase fetch projects error:", error);
        return res.status(500).json({
          success: false,
          error: "Failed to retrieve projects from database.",
        });
      }

      return res.status(200).json({
        success: true,
        count: projects ? projects.length : 0,
        data: projects || [],
      });
    } catch (err) {
      console.error("Error fetching projects:", err);
      return res.status(500).json({
        success: false,
        error: "Failed to retrieve projects.",
      });
    }
  }

  // ---------------- Protected Admin Operations (POST, DELETE) ----------------
  if (!isAuthorized(req)) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized. Valid admin password required.",
    });
  }

  // ---------------- POST: Create new project card ----------------
  if (req.method === "POST") {
    try {
      const body = await parseBody(req);
      const {
        title,
        description,
        image_url,
        tags,
        live_url,
        details_url,
        is_featured,
      } = body || {};

      if (!title || !description) {
        return res.status(400).json({
          success: false,
          error: "Project title and description are required.",
        });
      }

      let formattedTags = [];
      if (Array.isArray(tags)) {
        formattedTags = tags.map((t) => String(t).trim()).filter(Boolean);
      } else if (typeof tags === "string") {
        formattedTags = tags.split(",").map((t) => t.trim()).filter(Boolean);
      }

      const featuredFlag = is_featured !== undefined ? Boolean(is_featured) : true;
      const img = image_url && String(image_url).trim() ? String(image_url).trim() : "Images/background.png";
      const live = live_url && String(live_url).trim() ? String(live_url).trim() : "#";
      const details = details_url && String(details_url).trim() ? String(details_url).trim() : "";

      const { data: saved, error } = await supabase
        .from("projects")
        .insert([
          {
            title: String(title).trim(),
            description: String(description).trim(),
            image_url: img,
            tags: formattedTags,
            live_url: live,
            details_url: details,
            is_featured: featuredFlag,
          },
        ])
        .select(
          "id, title, description, image_url, tags, live_url, details_url, is_featured, created_at"
        )
        .single();

      if (error) {
        console.error("Supabase insert project error:", error);
        return res.status(500).json({
          success: false,
          error: "Failed to create project card in database.",
        });
      }

      return res.status(201).json({
        success: true,
        message: "Project card added successfully!",
        data: saved,
      });
    } catch (err) {
      console.error("Error creating project:", err);
      return res.status(500).json({
        success: false,
        error: "Failed to create project card.",
      });
    }
  }

  // ---------------- DELETE: Remove project card ----------------
  if (req.method === "DELETE") {
    try {
      const body = await parseBody(req);
      const id = req.query.id || body.id;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: "Project id is required.",
        });
      }

      const { data: deleted, error } = await supabase
        .from("projects")
        .delete()
        .eq("id", Number(id))
        .select("id")
        .single();

      if (error || !deleted) {
        return res.status(404).json({
          success: false,
          error: "Project not found or already deleted.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Project card deleted successfully.",
      });
    } catch (err) {
      console.error("Error deleting project:", err);
      return res.status(500).json({
        success: false,
        error: "Failed to delete project.",
      });
    }
  }

  return res.status(405).json({
    success: false,
    error: `Method ${req.method} Not Allowed`,
  });
}

