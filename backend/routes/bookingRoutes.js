import express from "express";
import Booking from "../models/Booking.js";
import Sitter from "../models/Sitter.js";
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

// 🔹 Normal GET
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
    let { sitterId, ownerId, service, date, walk, pet } = req.body;

    // Normalize date for non-walking services
    if (date && date.includes("-")) {
      const [y, m, d] = date.split("-");
      date = `${m}/${d}/${y}`;
    }

    const sitter = await Sitter.findById(sitterId);
    if (!sitter) {
      return res.status(404).json({ message: "Sitter not found" });
    }

    // 🐕 Walking-specific overlap check
    if (service?.toLowerCase().includes("walk") && walk) {
      let { date: wDate, from, to } = walk;

      if (wDate && wDate.includes("-")) {
        const [y, m, d] = wDate.split("-");
        wDate = `${m}/${d}/${y}`;
      }

      const existing = await Booking.find({
        sitterId,
        "walk.date": wDate,
        status: { $in: ["pending", "confirmed"] },
      });

      const overlap = existing.some((b) => {
        const aFrom = Number(b.walk.from);
        const aTo = Number(b.walk.to);
        const bFrom = Number(from);
        const bTo = Number(to);

        // allow touching edges (10–11 after 9–10)
        return bFrom < aTo && bTo > aFrom;
      });

      if (overlap) {
        return res.status(400).json({
          message: "This sitter already has a walk in this time slot.",
        });
      }

      const booking = await Booking.create({
        sitterId,
        ownerId,
        service,
        walk: { date: wDate, from, to },
        pet,
        status: "pending",
      });

      return res.json(booking);
    }

    // 🌟 Non-walking services (simple date-based)
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
