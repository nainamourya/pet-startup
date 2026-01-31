import express from "express";
import Booking from "../models/Booking.js";
import mongoose from "mongoose";

const router = express.Router();

/* ============================
   GET BOOKINGS
============================ */
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

/* ============================
   CREATE BOOKING
============================ */
router.post("/", async (req, res) => {
  try {
    const { sitterId, ownerId, service, date, walk, boarding, pet } = req.body;

    const isWalking = service?.toLowerCase().includes("walk");
    const isBoarding = service?.toLowerCase().includes("board");

    // 1️⃣ Get all active bookings for sitter
    const existingBookings = await Booking.find({
      sitterId,
      status: { $in: ["pending", "confirmed"] },
    });

    /* ============================
       BLOCK BOARDING OVERLAP
    ============================ */
    if (isBoarding && boarding?.startDate && boarding?.endDate) {
      const newStart = new Date(boarding.startDate);
      const newEnd = new Date(boarding.endDate);

      const overlap = existingBookings.some((b) => {
        if (!b.boarding?.startDate || !b.boarding?.endDate) return false;

        const start = new Date(b.boarding.startDate);
        const end = new Date(b.boarding.endDate);

        return newStart <= end && newEnd >= start;
      });

      if (overlap) {
        return res.status(400).json({
          message: "This sitter is already booked for these boarding dates.",
        });
      }
    }

    /* ============================
       WALK TIME OVERLAP
    ============================ */
    if (isWalking && walk) {
      const sameDayWalks = existingBookings.filter(
        (b) => b.walk?.date === walk.date
      );

      const overlap = sameDayWalks.some((b) => {
        const aFrom = Number(b.walk.from);
        const aTo = Number(b.walk.to);
        const bFrom = Number(walk.from);
        const bTo = Number(walk.to);

        return bFrom < aTo && bTo > aFrom;
      });

      if (overlap) {
        return res.status(400).json({
          message: "This sitter is already booked in this time slot.",
        });
      }
    }

    /* ============================
       SINGLE DATE BLOCK
    ============================ */
    if (!isWalking && !isBoarding && date) {
      const exists = existingBookings.some((b) => b.date === date);
      if (exists) {
        return res.status(400).json({
          message: "This sitter is already booked on this date.",
        });
      }
    }

    /* ============================
       CREATE BOOKING
    ============================ */
    const booking = await Booking.create({
      sitterId,
      ownerId,
      service,
      date: !isWalking && !isBoarding ? date : undefined,
      walk: isWalking ? walk : undefined,
      boarding: isBoarding ? boarding : undefined,
      pet,
      status: "pending",
    });

    res.json(booking);
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ message: err.message });
  }
});

/* ============================
   UPDATE BOOKING STATUS (🔥 FIX)
============================ */
router.patch("/:id", async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "confirmed", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = status;
    await booking.save(); // 🔥 THIS WAS MISSING EARLIER

    res.json(booking);
  } catch (err) {
    console.error("Patch error:", err);
    res.status(500).json({ message: "Failed to update booking" });
  }
});

export default router;
