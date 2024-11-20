const jwt = require("jsonwebtoken"); // For generating JWT tokens
const express = require("express");
const User = require("../models/User");
const router = express.Router();

const JWT_SECRET = "your_jwt_secret_key"; // Replace with a secure key

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email and explicitly include the password field
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ success: true, token });
  } catch (err) {
    console.error("Login error:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
});

module.exports = router;
