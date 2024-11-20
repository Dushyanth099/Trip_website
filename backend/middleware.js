const jwt = require("jsonwebtoken");

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
// Protect the booking routes
app.post("/api/bookings", protect, async (req, res) => {
  try {
    const booking = new Booking({ ...req.body, userId: req.user });
    await booking.save();
    res.status(201).send({ message: "Booking saved successfully" });
  } catch (error) {
    res.status(500).send({ error: "Failed to save booking" });
  }
});

app.get("/api/bookings", protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user });
    res.status(200).send(bookings);
  } catch (error) {
    res.status(500).send({ error: "Failed to fetch bookings" });
  }
});
