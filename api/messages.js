import { supabase } from "./_supabase.js";
import { isAuthorized, setCorsHeaders, parseBody } from "./_auth.js";

export default async function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // ---------------- POST: Save new contact message (Public) ----------------
  if (req.method === "POST") {
    try {
      const body = parseBody(req);
      const { name, email, message } = body || {};

      if (!name || !email || !message) {
        return res.status(400).json({
          success: false,
          error: "All fields (name, email, message) are required.",
        });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          error: "Please provide a valid email address.",
        });
      }

      // Insert message into Supabase
      const { data: saved, error: dbErr } = await supabase
        .from("messages")
        .insert([
          {
            name: String(name).trim(),
            email: String(email).trim(),
            message: String(message).trim(),
            is_read: false,
          },
        ])
        .select("id, name, email, message, is_read, created_at")
        .single();

      if (dbErr) {
        console.error("Supabase insert error:", dbErr);
        return res.status(500).json({
          success: false,
          error: "Database error. Failed to save message.",
        });
      }

      // Trigger Discord Webhook Notification if configured
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
                    { name: "👤 Sender", value: String(name).trim(), inline: true },
                    { name: "📧 Email", value: String(email).trim(), inline: true },
                    { name: "💬 Message", value: String(message).trim() },
                  ],
                  footer: {
                    text: "Yassin's Portfolio • Supabase Database",
                  },
                  timestamp: new Date().toISOString(),
                },
              ],
            }),
          });
        } catch (webhookErr) {
          console.error("Discord Webhook notification error:", webhookErr);
        }
      }

      return res.status(201).json({
        success: true,
        message: "Thank you! Your message has been sent successfully.",
        data: saved,
      });
    } catch (err) {
      console.error("Error processing contact form message:", err);
      return res.status(500).json({
        success: false,
        error: "Internal server error. Failed to save message.",
      });
    }
  }

  // ---------------- Protected Admin Routes (GET, PATCH, DELETE) ----------------
  if (!isAuthorized(req)) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized. Valid admin password required.",
    });
  }

  // ---------------- GET: Retrieve messages with optional search & filter ----------------
  if (req.method === "GET") {
    try {
      const search = req.query.search ? String(req.query.search).trim() : null;
      const status = req.query.status ? String(req.query.status).trim() : null; // 'read', 'unread', or null

      let query = supabase
        .from("messages")
        .select("id, name, email, message, is_read, created_at")
        .order("created_at", { ascending: false })
        .limit(100);

      if (status === "unread") {
        query = query.eq("is_read", false);
      } else if (status === "read") {
        query = query.eq("is_read", true);
      }

      if (search) {
        query = query.or(
          `name.ilike.%${search}%,email.ilike.%${search}%,message.ilike.%${search}%`
        );
      }

      const { data: messages, error: fetchErr } = await query;

      if (fetchErr) {
        console.error("Supabase fetch messages error:", fetchErr);
        return res.status(500).json({
          success: false,
          error: "Failed to retrieve messages from database.",
        });
      }

      return res.status(200).json({
        success: true,
        count: messages ? messages.length : 0,
        data: messages || [],
      });
    } catch (err) {
      console.error("Error fetching messages:", err);
      return res.status(500).json({
        success: false,
        error: "Failed to retrieve messages from database.",
      });
    }
  }

  // ---------------- PATCH: Update read/unread status ----------------
  if (req.method === "PATCH") {
    try {
      const body = parseBody(req);
      const id = req.query.id || body.id;
      const is_read = body.is_read !== undefined ? Boolean(body.is_read) : true;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: "Message id is required.",
        });
      }

      const { data: updated, error: updateErr } = await supabase
        .from("messages")
        .update({ is_read })
        .eq("id", Number(id))
        .select("id, name, email, message, is_read, created_at")
        .single();

      if (updateErr || !updated) {
        return res.status(404).json({
          success: false,
          error: "Message not found or update failed.",
        });
      }

      return res.status(200).json({
        success: true,
        message: `Message marked as ${is_read ? "read" : "unread"}.`,
        data: updated,
      });
    } catch (err) {
      console.error("Error updating message status:", err);
      return res.status(500).json({
        success: false,
        error: "Failed to update message.",
      });
    }
  }

  // ---------------- DELETE: Remove message by ID ----------------
  if (req.method === "DELETE") {
    try {
      const body = parseBody(req);
      const id = req.query.id || body.id;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: "Message id is required.",
        });
      }

      const { data: deleted, error: deleteErr } = await supabase
        .from("messages")
        .delete()
        .eq("id", Number(id))
        .select("id")
        .single();

      if (deleteErr || !deleted) {
        return res.status(404).json({
          success: false,
          error: "Message not found or already deleted.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Message deleted successfully.",
      });
    } catch (err) {
      console.error("Error deleting message:", err);
      return res.status(500).json({
        success: false,
        error: "Failed to delete message.",
      });
    }
  }

  return res.status(405).json({
    success: false,
    error: `Method ${req.method} Not Allowed`,
  });
}

