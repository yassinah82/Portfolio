const express = require("express");
const router = express.Router();
const {
  createMessage,
  getMessages,
  markAsRead,
  deleteMessage,
} = require("../controllers/messageController");
const auth = require("../middleware/auth");
const { contactLimiter } = require("../middleware/rateLimiter");

// Public (rate-limited)
router.post("/", contactLimiter, createMessage);

// Admin-only
router.get("/", auth, getMessages);
router.patch("/:id/read", auth, markAsRead);
router.delete("/:id", auth, deleteMessage);

module.exports = router;
