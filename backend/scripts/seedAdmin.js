require("dotenv").config();
const dns = require("dns");
const mongoose = require("mongoose");
const Admin = require("../src/models/Admin");

// Use Google DNS for SRV resolution
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Check if admin already exists
    const existing = await Admin.findOne({ username: process.env.ADMIN_USERNAME });
    if (existing) {
      console.log("⚠️  Admin user already exists. Skipping seed.");
      process.exit(0);
    }

    // Create admin
    const admin = await Admin.create({
      username: process.env.ADMIN_USERNAME,
      password: process.env.ADMIN_PASSWORD,
    });

    console.log(`✅ Admin user created successfully!`);
    console.log(`   Username: ${admin.username}`);
    console.log(`   Password: (as set in .env)`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error.message);
    process.exit(1);
  }
};

seedAdmin();
