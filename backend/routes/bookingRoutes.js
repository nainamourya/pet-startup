import express from "express";
import Booking from "../models/Booking.js";
import Sitter from "../models/Sitter.js";

const router = express.Router();
const parsePrice = (value) => {
  if (!value) return 0;
  const num = parseInt(String(value).replace(/[^\d]/g, ""), 10);
  return isNaN(num) ? 0 : num;
};
/* ============================
   AUTO COMPLETE CHECK
============================ */
const isBookingCompleted = (booking) => {
  const now = new Date();

  // 🐕 WALK
  if (booking.walk?.date && booking.walk?.to) {
    const end = new Date(booking.walk.date);
    end.setHours(Number(booking.walk.to), 0, 0, 0);
    return now > end;
  }

  // 🏠 BOARDING
  if (booking.boarding?.endDate) {
    const end = new Date(booking.boarding.endDate);
    end.setHours(23, 59, 59, 999);
    return now > end;
  }

  // 📅 SINGLE DAY
  if (booking.date) {
    const end = new Date(booking.date);
    end.setHours(23, 59, 59, 999);
    return now > end;
  }

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

    let bookings = await Booking.find(filter)
      .populate("sitterId")
      .populate("ownerId");
      // 🔥 AUTO COMPLETE LOGIC
      for (const booking of bookings) {
        if (
          booking.status === "confirmed" &&
          booking.payment?.paid &&
          isBookingCompleted(booking)
        ) {
          booking.status = "completed";
          booking.completedAt = new Date();
          await booking.save();
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

    if (!["pending", "confirmed", "rejected", "completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = status;
    if (status === "completed") {
      booking.completedAt = new Date(); // ✅ ADD THIS
    }
    await booking.save(); // 🔥 THIS WAS MISSING EARLIER

    res.json(booking);
  } catch (err) {
    console.error("Patch error:", err);
    res.status(500).json({ message: "Failed to update booking" });
  }
});
// kive live location fetch karna hai
router.get("/:id/location", async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking || !booking.liveLocation) {
    return res.json(null);
  }
  res.json(booking.liveLocation);
});
export default router;