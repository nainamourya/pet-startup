import express from "express";
import Booking from "../models/Booking.js";

const router = express.Router();

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
