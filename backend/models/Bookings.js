const mongoose = require("mongoose");

// Booking Schema
const bookingSchema = new mongoose.Schema({
  destination: String,
  people: Number,
  arrival: Date,
  departure: Date,
  details: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

// Export the Booking model
const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
