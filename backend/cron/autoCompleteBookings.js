// backend/cron/autoCompleteBookings.js

import cron from "node-cron";
import Booking from "../models/Booking.js";

// 🔁 SAME logic you already use
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

  return false;
};

// 🕒 RUN EVERY 10 MINUTES
cron.schedule("*/10 * * * *", async () => {
  console.log("🕒 Cron: checking bookings for auto-completion");

  try {
    const bookings = await Booking.find({
      status: "confirmed",
      "payment.paid": true,
    });

    for (const booking of bookings) {
      if (isBookingCompleted(booking)) {
        booking.status = "completed";
        booking.completedAt = new Date();
        await booking.save();

        console.log(
          `✅ Booking ${booking._id} auto-completed by cron`
        );
      }
    }
  } catch (err) {
    console.error("❌ Cron auto-complete error:", err.message);
  }
});
