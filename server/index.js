require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const User = require("./models/User");
const cors = require("cors");

 // Allow React frontend

const app = express();
app.use(express.json());
app.use(cors());
// Connect DB
connectDB().then(async () => {
  try {
    // ✅ Drop old email index if it exists (prevents duplicate key error)
    await User.collection.dropIndex("email_1").catch(() => {
      console.log("ℹ️ No old email index to drop");
    });
    console.log("✅ Checked and removed old email index if present");

    // ✅ Ensure admin user exists
    const admin = await User.findOne({ username: process.env.ADMIN_USERNAME });
    if (!admin) {
      await User.create({ username: process.env.ADMIN_USERNAME });
      console.log(`👑 Admin user '${process.env.ADMIN_USERNAME}' created`);
    } else {
      console.log(`👑 Admin user '${process.env.ADMIN_USERNAME}' already exists`);
    }
  } catch (err) {
    console.error("Error checking/creating admin user:", err);
  }
});

// Routes
app.use("/", require("./routes/urlRoutes"));
app.use("/users", require("./routes/userRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on ${process.env.BASE_URL}`));
