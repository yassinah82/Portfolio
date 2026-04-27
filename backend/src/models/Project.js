const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Project title is required"],
    trim: true,
    maxlength: [100, "Title cannot exceed 100 characters"],
  },
  description: {
    type: String,
    required: [true, "Project description is required"],
    trim: true,
    maxlength: [500, "Description cannot exceed 500 characters"],
  },
  technologies: {
    type: [String],
    default: [],
  },
  imageUrl: {
    type: String,
    trim: true,
  },
  githubLink: {
    type: String,
    trim: true,
  },
  liveDemoLink: {
    type: String,
    trim: true,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Project", projectSchema);
