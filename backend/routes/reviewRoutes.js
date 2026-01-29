import express from "express";
import Review from "../models/Review.js";
import mongoose from "mongoose";
import Booking from "../models/Booking.js";

const router = express.Router();

// POST /api/reviews
router.post("/", async (req, res) => {
  const { bookingId, sitterId, ownerId, rating, comment } = req.body;

  if (
    !mongoose.Types.ObjectId.isValid(bookingId) ||
    !mongoose.Types.ObjectId.isValid(sitterId) ||
    !mongoose.Types.ObjectId.isValid(ownerId)
  ) {
    return res.status(400).json({ message: "Invalid IDs provided" });
  }

  // 🔒 Prevent duplicate review for same booking
  const existing = await Review.findOne({ bookingId });
  if (existing) {
    return res.status(400).json({ message: "Review already submitted" });
  }

  const review = await Review.create({
    bookingId,
    sitterId,
    ownerId,
    rating,
    comment,
  });

  // Mark booking as reviewed
  await Booking.findByIdAndUpdate(bookingId, {
    reviewed: true,
  });

  res.json(review);
});

// GET /api/reviews?sitterId=...
router.get("/", async (req, res) => {
  const { sitterId } = req.query;

  if (sitterId && !mongoose.Types.ObjectId.isValid(sitterId)) {
    return res.status(400).json({ message: "Invalid sitterId" });
  }

  const filter = sitterId ? { sitterId } : {};
  const reviews = await Review.find(filter).populate("ownerId", "name");

  res.json(reviews);
});

export default router;
