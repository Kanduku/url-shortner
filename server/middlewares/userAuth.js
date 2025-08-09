const User = require("../models/User");

const userAuth = async (req, res, next) => {
  const username = req.headers["x-username"] || req.query.username;
  if (!username) {
    return res.status(401).json({
      error: "Username required in x-username header or ?username query param",
    });
  }
  try {
    let user = await User.findOne({ username });
    if (!user) {
      user = new User({ username });
      await user.save();
      console.log(`👤 Created new user: ${username}`);
    }
    req.username = username;
    next();
  } catch (err) {
    console.error("User auth error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = userAuth;
