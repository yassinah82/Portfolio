const express = require("express");
const router = express.Router();
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");
const auth = require("../middleware/auth");

// Public routes
router.get("/", getProjects);
router.get("/:id", getProject);

// Admin-only routes
router.post("/", auth, createProject);
router.put("/:id", auth, updateProject);
router.delete("/:id", auth, deleteProject);

module.exports = router;
