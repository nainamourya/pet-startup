import express from "express";
import Booking from "../models/Booking.js";
import mongoose from "mongoose";
const router = express.Router();

// 🔹 THIS MUST COME FIRST
// GET /api/bookings/unavailable?sitterId=...
router.get("/unavailable", async (req, res) => {
  const { sitterId } = req.query;

  if (!sitterId || !mongoose.Types.ObjectId.isValid(sitterId)) {
    return res.status(400).json({ message: "Invalid sitterId" });
  }

  const bookings = await Booking.find({
    sitterId,
    status: { $in: ["pending", "confirmed"] },
  }).select("date");

  const dates = bookings.map((b) => b.date);
  res.json(dates);
});
// 🔹 THEN your normal GET
// GET /api/bookings?ownerId=... OR ?sitterId=...
router.get("/", async (req, res) => {
  const { ownerId, sitterId } = req.query;

  const filter = {};
  if (ownerId) filter.ownerId = ownerId;
  if (sitterId) filter.sitterId = sitterId;

  const bookings = await Booking.find(filter)
    .populate("sitterId")
    .populate("ownerId");

  res.json(bookings);
});

// POST /api/bookings
router.post("/", async (req, res) => {
  try {
    const { sitterId, ownerId, service, date, pet } = req.body;

    const existing = await Booking.findOne({
      sitterId,
      date,
      status: { $in: ["pending", "confirmed"] },
    });

    if (existing) {
      return res.status(400).json({
        message: "This sitter is already booked on this date.",
      });
    }

    const booking = await Booking.create({
      sitterId,
      ownerId,
      service,
      date,
      pet,
      status: "pending",
    });

    res.json(booking);
  } catch (err) {
    console.error("Booking error:", err.message);
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/bookings/:id
router.patch("/:id", async (req, res) => {
  const { status } = req.body;

  const booking = await Booking.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  res.json(booking);
});

export default router;
