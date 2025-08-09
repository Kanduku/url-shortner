// controllers/userController.js
const User = require("../models/User");
const Url = require("../models/Url"); // used for optional cascade delete

/**
 * Get all users (sorted newest first)
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ created_at: -1 });
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Get a single user by username
 */
exports.getUserByUsername = async (req, res) => {
  try {
    const username = req.params.username;
    if (!username) return res.status(400).json({ error: "username param required" });

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Create a new user
 * Body: { username }
 */
exports.createUser = async (req, res) => {
  try {
    let { username } = req.body;
    if (!username || typeof username !== "string" || !username.trim()) {
      return res.status(400).json({ error: "Username is required" });
    }

    username = username.trim(); // simple normalization

    // Check if exists
    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(409).json({ error: "Username already exists" });
    }

    const newUser = new User({ username });
    await newUser.save();

    return res.status(201).json(newUser);
  } catch (err) {
    // Handle duplicate key race condition
    if (err.code === 11000) {
      return res.status(409).json({ error: "Username already exists" });
    }
    console.error("Error creating user:", err);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Delete a user (and optionally cascade-delete their URLs)
 * Params: :username
 */
exports.deleteUser = async (req, res) => {
  try {
    const username = req.params.username;
    if (!username) return res.status(400).json({ error: "username param required" });

    const deleted = await User.findOneAndDelete({ username });
    if (!deleted) return res.status(404).json({ error: "User not found" });

    // Optional: remove all URLs for this user to clean DB
    await Url.deleteMany({ username }).catch((err) => {
      console.warn(`Failed to delete URLs for ${username}:`, err);
    });

    return res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: "Server error" });
  }
};
