const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { apiLimiter } = require("./middleware/rateLimiter");
const errorHandler = require("./middleware/errorHandler");

// Route imports
const authRoutes = require("./routes/auth");
const projectRoutes = require("./routes/projects");
const messageRoutes = require("./routes/messages");

const app = express();

// Trust proxy (required for Netlify/serverless environments)
app.set("trust proxy", 1);

// --------------- Security Middleware ---------------
app.use(helmet());
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow all origins (including file:// which sends null)
      callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);
app.use(apiLimiter);

// --------------- Body Parser ---------------
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

// --------------- API Routes ---------------
app.get("/api", (req, res) => {
  res.json({
    success: true,
    message: "Yassin's Portfolio API v1.0",
    endpoints: {
      auth: "/api/auth",
      projects: "/api/projects",
      messages: "/api/messages",
    },
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/messages", messageRoutes);

// --------------- 404 Handler ---------------
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// --------------- Error Handler ---------------
app.use(errorHandler);

module.exports = app;
