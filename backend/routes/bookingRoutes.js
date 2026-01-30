import express from "express";
import Booking from "../models/Booking.js";
import mongoose from "mongoose";

const router = express.Router();

/* ============================
   GET UNAVAILABLE DATES
============================ */
router.get("/unavailable", async (req, res) => {
  const { sitterId } = req.query;

  if (!sitterId || !mongoose.Types.ObjectId.isValid(sitterId)) {
    return res.status(400).json({ message: "Invalid sitterId" });
  }

  const bookings = await Booking.find({
    sitterId,
    status: { $in: ["pending", "confirmed"] },
  }).select("date");

  res.json(bookings.map((b) => b.date));
});

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
  
      console.log("📥 Incoming booking body:", req.body);
      console.log("🧾 Service:", service);
      console.log("🏠 Boarding payload:", boarding);
  
      const isWalking = service?.toLowerCase().includes("walk");
      const isBoarding = service?.toLowerCase().includes("board");

    // 1️⃣ Get ALL active bookings for sitter
    const existingBookings = await Booking.find({
      sitterId,
      status: { $in: ["pending", "confirmed"] },
    });

    /* ============================
       BLOCK BY EXISTING BOARDING
    ============================ */

    // Dates user is trying to book
    const requestedDates = [];

    if (isWalking && walk?.date) {
      requestedDates.push(new Date(walk.date));
    }

    if (!isWalking && !isBoarding && date) {
      requestedDates.push(new Date(date));
    }

    if (isBoarding && boarding?.startDate && boarding?.endDate) {
      let d = new Date(boarding.startDate);
      const end = new Date(boarding.endDate);

      while (d <= end) {
        requestedDates.push(new Date(d));
        d.setDate(d.getDate() + 1);
      }
    }

    // Check against existing boarding bookings
    for (const b of existingBookings) {
      const isExistingBoarding =
        b.service?.toLowerCase().includes("board") &&
        b.boarding?.startDate &&
        b.boarding?.endDate;
    
      if (!isExistingBoarding) continue;
    
      const start = new Date(b.boarding.startDate);
      const end = new Date(b.boarding.endDate);
    
      for (const d of requestedDates) {
        if (d >= start && d <= end) {
          return res.status(400).json({
            message:
              "This sitter is already booked for boarding on these dates.",
          });
        }
      }
    }

    /* ============================
       WALK TIME OVERLAP
    ============================ */
    if (isWalking && walk) {
      const sameDayWalks = existingBookings.filter(
        (b) =>
          b.walk?.date === walk.date &&
          ["pending", "confirmed"].includes(b.status)
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
          message:
            "This sitter is already booked in this time slot.",
        });
      }
    }

    /* ============================
       CREATE BOOKING
    ============================ */
    const newBooking = {
      sitterId,
      ownerId,
      service,
      date: !isWalking && !isBoarding ? date : undefined,
      walk: isWalking ? walk : undefined,
      boarding: isBoarding ? boarding : undefined,
      pet: pet,
      status: "pending",
    }
    console.log("🆕 New booking to create:", newBooking);
    const booking = await Booking.create(newBooking);

    res.json(booking);
  } catch (err) {
    console.error("Booking error:", JSON.stringify(err));
    res.status(500).json({ message: err.message });
  }
});

export default router;
