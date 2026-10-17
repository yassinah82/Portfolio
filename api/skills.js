import { supabase } from "./_supabase.js";
import { isAuthorized, setCorsHeaders, parseBody } from "./_auth.js";

export default async function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // ---------------- GET: Retrieve all skills (Public) ----------------
  if (req.method === "GET") {
    try {
      const { data: skills, error } = await supabase
        .from("skills")
        .select("id, title, description, icon, tags, created_at")
        .order("id", { ascending: true });

      if (error) {
        console.error("Supabase fetch skills error:", error);
        return res.status(500).json({
          success: false,
          error: "Failed to retrieve skills from database.",
        });
      }

      return res.status(200).json({
        success: true,
        count: skills ? skills.length : 0,
        data: skills || [],
      });
    } catch (err) {
      console.error("Error fetching skills:", err);
      return res.status(500).json({
        success: false,
        error: "Failed to retrieve skills.",
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

  // ---------------- POST: Create new skill card ----------------
  if (req.method === "POST") {
    try {
      const body = parseBody(req);
      const { title, description, icon, tags } = body || {};

      if (!title || !description) {
        return res.status(400).json({
          success: false,
          error: "Title and description are required.",
        });
      }

      let formattedTags = [];
      if (Array.isArray(tags)) {
        formattedTags = tags.map((t) => String(t).trim()).filter(Boolean);
      } else if (typeof tags === "string") {
        formattedTags = tags.split(",").map((t) => t.trim()).filter(Boolean);
      }

      const iconClass = icon && String(icon).trim() ? String(icon).trim() : "fas fa-code";

      const { data: saved, error } = await supabase
        .from("skills")
        .insert([
          {
            title: String(title).trim(),
            description: String(description).trim(),
            icon: iconClass,
            tags: formattedTags,
          },
        ])
        .select("id, title, description, icon, tags, created_at")
        .single();

      if (error) {
        console.error("Supabase insert skill error:", error);
        return res.status(500).json({
          success: false,
          error: "Failed to create skill card in database.",
        });
      }

      return res.status(201).json({
        success: true,
        message: "Skill card added successfully!",
        data: saved,
      });
    } catch (err) {
      console.error("Error creating skill:", err);
      return res.status(500).json({
        success: false,
        error: "Failed to create skill card.",
      });
    }
  }

  // ---------------- DELETE: Remove skill card ----------------
  if (req.method === "DELETE") {
    try {
      const body = parseBody(req);
      const id = req.query.id || body.id;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: "Skill id is required.",
        });
      }

      const { data: deleted, error } = await supabase
        .from("skills")
        .delete()
        .eq("id", Number(id))
        .select("id")
        .single();

      if (error || !deleted) {
        return res.status(404).json({
          success: false,
          error: "Skill not found or already deleted.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Skill card deleted successfully.",
      });
    } catch (err) {
      console.error("Error deleting skill:", err);
      return res.status(500).json({
        success: false,
        error: "Failed to delete skill.",
      });
    }
  }

  return res.status(405).json({
    success: false,
    error: `Method ${req.method} Not Allowed`,
  });
}

