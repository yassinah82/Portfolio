const rateLimit = require("express-rate-limit");

// Fallback key generator for serverless environments where req.ip may be undefined
const getKey = (req) => {
  return req.ip || req.headers["x-forwarded-for"] || req.headers["x-nf-client-connection-ip"] || "unknown";
};

// Contact form: 5 requests per 15 minutes per IP
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: "Too many messages sent. Please try again in 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: getKey,
  validate: false,
});

// General API: 100 requests per 15 minutes per IP
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Too many requests. Please slow down.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: getKey,
  validate: false,
});

module.exports = { contactLimiter, apiLimiter };

