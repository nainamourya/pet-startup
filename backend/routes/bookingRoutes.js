import { io } from "../server.js";
import express from "express";
import Booking from "../models/Booking.js";
import Sitter from "../models/Sitter.js";
import { getRazorpayInstance } from "../config/razorpay.js";
const router = express.Router();

/* ============================
   PRICE PARSER (SAFE)
============================ */
const parsePrice = (value) => {
  if (!value) return 0;
  const num = Number(String(value).replace(/[^\d.]/g, ""));
  return isNaN(num) ? 0 : num;
};

/* ============================
   AUTO COMPLETE CHECK
============================ */
const isBookingCompleted = (booking) => {
  const now = new Date();

  // WALK
  if (booking.walk?.date && booking.walk?.to) {
    const end = new Date(booking.walk.date);
    end.setHours(Number(booking.walk.to), 0, 0, 0);
    return now > end;
  }

  // BOARDING
  if (booking.boarding?.endDate) {
    const end = new Date(booking.boarding.endDate);
    end.setHours(23, 59, 59, 999);
    return now > end;
  }

  // SINGLE DAY
  if (booking.date) {
    const end = new Date(booking.date);
    end.setHours(23, 59, 59, 999);
    return now > end;
  }

  return false; // ✅ important
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

    // Fetch bookings
    let bookings = await Booking.find(filter)
      .populate("sitterId", "name city price phone")
      .populate("ownerId", "name email")
      .lean(); // IMPORTANT: makes delete work safely

    console.log("DEBUG: Bookings fetched:", bookings.length);

    const allowedPhoneStatuses = ["confirmed", "on_the_way", "arrived"];

    for (let booking of bookings) {

      // ----------------------------
      // AUTO COMPLETE LOGIC
      // ----------------------------
      if (
        booking.status === "confirmed" &&
        booking.payment?.paid &&
        isBookingCompleted(booking)
      ) {
        await Booking.findByIdAndUpdate(booking._id, {
          status: "completed",
          completedAt: new Date(),
        });

        booking.status = "completed";
      }

      // ----------------------------
      // PHONE VISIBILITY LOGIC
      // Only show phone if:
      // 1. Status is active (confirmed, on_the_way, arrived)
      // ----------------------------
      if (booking.sitterId) {
        const isActive = allowedPhoneStatuses.includes(booking.status);

        console.log(`DEBUG: Booking ${booking._id}, Status: ${booking.status}, Active: ${isActive}, SitterPhone: ${booking.sitterId.phone}`);

        if (!isActive) {
          delete booking.sitterId.phone;
        }
      }
    }

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

    if (!sitterId || !ownerId || !service) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const sitter = await Sitter.findById(sitterId);
    if (!sitter) {
      return res.status(404).json({ message: "Sitter not found" });
    }

    let servicePrice = 0;

    // Detect if price is the new object structure
    if (sitter.price && typeof sitter.price === 'object' && (sitter.price.dayCare || sitter.price.walking60 || sitter.price.boarding)) {
      if (service === "Day Care") servicePrice = Number(sitter.price.dayCare) || 0;
      else if (service === "Boarding") servicePrice = Number(sitter.price.boarding) || 0;
      else if (service === "Hourly Sitting") servicePrice = Number(sitter.price.hourly) || 0;
      else if (service === "Walk") {
        // Calculate duration if time range is provided
        const duration = (walk && walk.to && walk.from) ? (Number(walk.to) - Number(walk.from)) : 1;
        // If duration is 30 mins (0.5) or less, use walking30. Default to walking60 for 1h+.
        servicePrice = duration <= 0.5 ? (Number(sitter.price.walking30) || 0) : (Number(sitter.price.walking60) || 0);
      }
    } else {
      // Fallback for old price format (string)
      servicePrice = parsePrice(sitter.price);
    }

    if (servicePrice <= 0) {
      return res.status(400).json({ message: "Invalid sitter price" });
    }

    const booking = await Booking.create({
      sitterId,
      ownerId,
      service,
      servicePrice,
      date,
      walk,
      boarding,
      pet,
      phone: sitter.phone, // Phone is now always available from sitter profile
      status: "pending",
    });

    res.json(booking);
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ message: "Booking failed" });
  }
});

/* ============================
   UPDATE BOOKING STATUS
============================ */
router.patch("/:id", async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "confirmed",
      "rejected",
      "completed",
      "on_the_way",
      "arrived",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = status;

    if (status === "completed") {
      booking.completedAt = new Date();
      // 🛑 Prevent double credit if already completed
      if (!booking.earningsCredited) {
        const commissionPercent = 10;
        const commission = (booking.servicePrice * commissionPercent) / 100;
        const sitterEarning = booking.servicePrice - commission;

        await Sitter.findByIdAndUpdate(booking.sitterId, {
          $inc: {
            balance: sitterEarning,
            totalEarnings: sitterEarning,
          },
        });

        booking.earningsCredited = true;
      }
    }

    await booking.save();

    // 🔥 REAL-TIME UPDATE
    io.to(booking._id.toString()).emit("status-updated", {
      bookingId: booking._id,
      status: booking.status,
    });

    res.json(booking);
  } catch (err) {
    console.error("Patch error:", err);
    res.status(500).json({ message: "Failed to update booking" });
  }
});

/* ============================
   GET LIVE LOCATION
============================ */
router.get("/:id/location", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking || !booking.liveLocation) {
      return res.json(null);
    }

    res.json(booking.liveLocation);
  } catch (err) {
    console.error("Location fetch error:", err);
    res.status(500).json({ message: "Failed to fetch location" });
  }
});
// ===============================
// CANCEL BOOKING
// ===============================
router.patch("/:id/cancel", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    const razorpay = getRazorpayInstance();
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (booking.status === "completed") return res.status(400).json({ message: "Cannot cancel completed booking" });

    const now = new Date();
    let serviceStart;

    if (booking.walk?.date) serviceStart = new Date(booking.walk.date);
    else if (booking.boarding?.startDate) serviceStart = new Date(booking.boarding.startDate);
    else if (booking.date) serviceStart = new Date(booking.date);

    let refundPercent = 0;
    if (serviceStart) {
      const hoursDiff = (serviceStart - now) / (1000 * 60 * 60);
      if (booking.service === "Boarding") {
        if (hoursDiff > 48) refundPercent = 100;
        else if (hoursDiff > 24) refundPercent = 50;
      } else {
        if (hoursDiff > 24) refundPercent = 100;
        else if (hoursDiff > 2) refundPercent = 50;
      }
    }

    const refundAmount = booking.payment?.paid
      ? Math.floor((booking.payment.amount * refundPercent) / 100)
      : 0;

    // ✅ TRIGGER RAZORPAY REFUND
    let razorpayRefund = null;
    if (refundAmount > 0 && booking.payment?.razorpayPaymentId) {
      razorpayRefund = await razorpay.payments.refund(booking.payment.razorpayPaymentId, {
        amount: refundAmount * 100, // Razorpay uses paise
        speed: "normal",           // or "optimum" for instant (extra fee)
        notes: {
          reason: "Booking cancelled by pet owner",
          bookingId: booking._id.toString(),
        },
      });
    }

    booking.status = "cancelled";
    booking.cancelledAt = now;
    booking.refundAmount = refundAmount;
    booking.refunded = refundAmount > 0;
    booking.refundedAt = refundAmount > 0 ? now : undefined;

    await booking.save();

    res.json({
      message: "Booking cancelled",
      refundPercent,
      refundAmount,
      refundId: razorpayRefund?.id || null, // Razorpay refund ID for tracking
    });

  } catch (err) {
    console.error("Cancel error:", err);
    res.status(500).json({ message: "Cancellation failed" });
  }
});
export default router;