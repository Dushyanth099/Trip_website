const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const router = express.Router();

// Models
const User = require("./models/User");
const Booking = require("./models/Bookings");

// Constants
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware
app.use(express.json());
app.use(cors());
app.use(
  cors({
    origin: "http://localhost:3000", // Allow requests from React front-end
  })
);

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/tour-booking", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Failed to connect to MongoDB:", error));

// Booking Routes
router.post("/bookings", async (req, res) => {
  const { destination, people, arrival, departure, details } = req.body;

  if (!destination || !people || !arrival || !departure) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  try {
    const newBooking = new Booking({
      destination,
      people,
      arrival,
      departure,
      details,
      userId: null,
    });

    await newBooking.save();
    res
      .status(201)
      .json({ success: true, message: "Booking successfully created!" });
  } catch (error) {
    console.error("Error creating booking:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to create booking. Please try again.",
      });
  }
});

// Mount the router
app.use("/api", router);

// Start the server
app.listen(5000, () => {
  console.log("Server is running on http://localhost:5000");
});
