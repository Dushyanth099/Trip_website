const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(cors());

// Import models
const User = require("./models/User");
const Booking = require("./models/Bookings"); // Correctly import the Booking model

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/tour-booking", {
 
});

// Middleware to protect routes
const protect = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    return res.status(401).send({ error: "No token, authorization denied" });
  }

  token = token.split(" ")[1]; // Extract token from "Bearer <token>"

  try {
    const decoded = jwt.verify(token, "your_jwt_secret");
    req.user = decoded.userId;
    next();
  } catch (error) {
    res.status(401).send({ error: "Token is not valid" });
  }
};

// API to handle booking submissions (protected route)
app.post("/api/bookings", protect, async (req, res) => {
  try {
    const booking = new Booking({ ...req.body, userId: req.user });
    await booking.save();
    res.status(201).send({ message: "Booking saved successfully" });
  } catch (error) {
    res.status(500).send({ error: "Failed to save booking" });
  }
});

// API to fetch bookings (for the user, protected route)
app.get("/api/bookings", protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user });
    res.status(200).send(bookings);
  } catch (error) {
    res.status(500).send({ error: "Failed to fetch bookings" });
  }
});

// Register route
app.post("/api/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).send({ error: "User already exists" });

    const user = new User({ username, email, password });
    await user.save();
    res.status(201).send({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).send({ error: "Failed to register user" });
  }
});

// Login route
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send({ error: "Invalid credentials" });

    const isPasswordValid = await user.matchPassword(password);
    if (!isPasswordValid)
      return res.status(400).send({ error: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, "your_jwt_secret", {
      expiresIn: "1h",
    });
    res.status(200).send({ token });
  } catch (error) {
    res.status(500).send({ error: "Failed to login" });
  }
});

// Start the server
app.listen(5000, () => {
  console.log("Server is running on http://localhost:5000");
});
