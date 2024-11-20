const mongoose = require("mongoose");

// Booking Schema
const bookingSchema = new mongoose.Schema({
  destination: String,
  people: Number,
  arrival: Date,
  departure: Date,
  details: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  }, // No user reference required
  createdAt: { type: Date, default: Date.now },
});

// Export the Booking model
const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
