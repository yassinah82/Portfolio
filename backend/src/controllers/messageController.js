const Message = require("../models/Message");
const sendEmail = require("../utils/sendEmail");

// @desc    Submit contact message (public)
// @route   POST /api/messages
// @access  Public (rate-limited)
exports.createMessage = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;

    const newMessage = await Message.create({ name, email, message });

    // Send response immediately — don't wait for email
    res.status(201).json({
      success: true,
      message: "Message sent successfully! I will get back to you soon.",
    });

    // Try to send email after response (best effort, with timeout)
    try {
      const emailPromise = sendEmail({ name, email, message });
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Email timeout")), 8000)
      );
      await Promise.race([emailPromise, timeoutPromise]);
    } catch (emailErr) {
      console.error("📧 Email skipped:", emailErr.message);
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all messages
// @route   GET /api/messages
// @access  Private (Admin)
exports.getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark message as read
// @route   PATCH /api/messages/:id/read
// @access  Private (Admin)
exports.markAsRead = async (req, res, next) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Message marked as read",
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete message
// @route   DELETE /api/messages/:id
// @access  Private (Admin)
exports.deleteMessage = async (req, res, next) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
