// scripts/createAdmin.js
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");

async function createAdminUser() {
  try {
    // 🧩 1. Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // 🧠 2. Define your admin credentials
    const username = process.env.ADMIN_USERNAME;
    const email = process.env.ADMIN_EMAIL;
    const plainPassword = process.env.ADMIN_PASSWORD;

    // 🕵️ 3. Check if admin already exists
    const existingAdmin = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (existingAdmin) {
      console.log("⚠️ Admin user already exists:", existingAdmin.username);
      process.exit(0);
    }

    // 🔐 4. Hash password
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // 🧱 5. Create admin user
    const adminUser = new User({
      username,
      email,
      password: hashedPassword,
      role: "admin",
    });

    await adminUser.save();

    console.log("✅ Admin user created successfully:");
    console.log({
      username: adminUser.username,
      email: adminUser.email,
      role: adminUser.role,
    });

    // 🚪 6. Exit
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
    process.exit(1);
  }
}

createAdminUser();
