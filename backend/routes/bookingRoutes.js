import express from "express";
import Booking from "../models/Booking.js";
import Sitter from "../models/Sitter.js";
import mongoose from "mongoose";

const router = express.Router();
const parsePrice = (value) => {
  if (!value) return 0;
  const num = parseInt(String(value).replace(/[^\d]/g, ""), 10);
  return isNaN(num) ? 0 : num;
};

/* ============================
   GET BOOKINGS
============================ */
router.get("/", async (req, res) => {
  try {
    const { ownerId, sitterId } = req.query;

    const filter = {};
    if (ownerId) filter.ownerId = ownerId;
    if (sitterId) filter.sitterId = sitterId;

    const bookings = await Booking.find(filter)
      .populate("sitterId")
      .populate("ownerId");

    res.json(bookings);
  } catch (error) {
    console.error("Fetch bookings error:", error);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
});


/* ============================
   CREATE BOOKING
============================ */
router.post("/", async (req, res) => {
  try {
    const { sitterId, ownerId, service, date, walk, boarding, pet } = req.body;

    const sitter = await Sitter.findById(sitterId);
    if (!sitter) {
      return res.status(404).json({ message: "Sitter not found" });
    }

    // 🔥 SINGLE SOURCE OF PRICE
    const servicePrice = parsePrice(sitter.price);

    if (!servicePrice || servicePrice <= 0) {
      return res.status(400).json({ message: "Invalid sitter price" });
    }

    const booking = await Booking.create({
      sitterId,
      ownerId,
      service,
      servicePrice, // ✅ STORED FOREVER
      date,
      walk,
      boarding,
      pet,
      status: "pending",
    });

    res.json(booking);
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ message: "Booking failed" });
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