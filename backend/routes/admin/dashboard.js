import express from "express";
import User from "../../models/User.js";
import Booking from "../../models/Booking.js";
import Withdrawal from "../../models/Withdrawal.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalSitters = await User.countDocuments({ role: "sitter" });
  const totalBookings = await Booking.countDocuments();
  const totalWithdrawals = await Withdrawal.countDocuments();

  res.json({
    message: "Admin dashboard working ✅",
    totalUsers,
    totalSitters,
    totalBookings,
    totalWithdrawals,
  });
});

export default router;
 