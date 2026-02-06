import express from "express";
import Booking from "../models/Booking.js";
import Withdrawal from "../models/Withdrawal.js";
import mongoose from "mongoose";
const router = express.Router();

const HOLD_DAYS = 3;
const MIN_WITHDRAWAL = 500;

/* ===========================
   GET SITTER BALANCE
=========================== */
router.get("/balance/:sitterId", async (req, res) => {
  try {
    const { sitterId } = req.params;

    console.log("📊 Balance request for sitterId:", sitterId, "(Length:", sitterId.length + ")");

    // ✅ Validate if sitterId is a valid MongoDB ObjectId (24 char hex string)
    if (!sitterId || sitterId.length !== 24 || !/^[a-f0-9]{24}$/.test(sitterId)) {
      console.error("❌ Invalid sitterId format:", sitterId, "Length:", sitterId.length);
      return res.status(400).json({ 
        message: "Invalid sitter ID format. Expected 24 character hexadecimal string.",
        receivedId: sitterId,
        receivedLength: sitterId.length,
        support: "Make sure you're sending a valid MongoDB ObjectId",
        example: "Expected format: 507f1f77bcf86cd799439011"
      });
    }
    
    // Extra validation with mongoose
    if (!mongoose.Types.ObjectId.isValid(sitterId)) {
      console.error("❌ Mongoose validation failed for:", sitterId);
      return res.status(400).json({ 
        message: "Sitter ID failed MongoDB validation",
        receivedId: sitterId
      });
    }

    const holdDate = new Date();
    holdDate.setDate(holdDate.getDate() - HOLD_DAYS);

    const sitterObjectId = new mongoose.Types.ObjectId(sitterId);
    console.log("✅ Converted to ObjectId:", sitterObjectId);

    const bookings = await Booking.find({
      sitterId: sitterObjectId,
      status: "completed",
      "payment.paid": true,
      completedAt: { $lte: holdDate },
    });

    console.log("📦 Found", bookings.length, "completed paid bookings");

    const totalEarnings = bookings.reduce(
      (sum, b) => sum + (b.payment.amount || 0),
      0
    );

    // ✅ withdrawals already requested/paid
    const withdrawals = await Withdrawal.find({
      sitterId: sitterObjectId,
      status: { $in: ["requested", "approved", "paid"] },
    });

    console.log("💸 Found", withdrawals.length, "withdrawals");

    const withdrawnAmount = withdrawals.reduce(
      (sum, w) => sum + w.amount,
      0
    );

    const availableBalance = totalEarnings - withdrawnAmount;

    console.log("💰 Balance: Total:", totalEarnings, "Withdrawn:", withdrawnAmount, "Available:", availableBalance);

    res.json({
      totalEarnings,
      withdrawnAmount,
      availableBalance,
      minWithdrawal: MIN_WITHDRAWAL,
    });
  } catch (err) {
    console.error("❌ Balance Error:", err.message);
    console.error("Stack:", err.stack);
    res.status(500).json({ message: "Failed to calculate balance", error: err.message });
  }
});

/* ===========================
   REQUEST WITHDRAWAL
=========================== */
router.post("/", async (req, res) => {
  try {
    const { sitterId, amount } = req.body;

    console.log("💳 Withdrawal request: sitterId =", sitterId, "amount =", amount);

    if (!sitterId) {
      return res.status(400).json({
        message: "sitterId is required",
      });
    }

    // ✅ Validate sitterId format (24 char hex string)
    if (sitterId.length !== 24 || !/^[a-f0-9]{24}$/.test(sitterId)) {
      console.error("❌ Invalid withdrawal sitterId:", sitterId, "Length:", sitterId.length);
      return res.status(400).json({
        message: "Invalid sitter ID format. Expected 24 character hexadecimal string.",
        receivedId: sitterId,
        receivedLength: sitterId.length,
        example: "Expected format: 507f1f77bcf86cd799439011"
      });
    }
    
    if (!mongoose.Types.ObjectId.isValid(sitterId)) {
      return res.status(400).json({
        message: "Sitter ID failed MongoDB validation",
        receivedId: sitterId,
      });
    }

    if (!amount || amount < MIN_WITHDRAWAL) {
      return res.status(400).json({
        message: `Minimum withdrawal is ₹${MIN_WITHDRAWAL}`,
      });
    }

    // 🔁 reuse balance logic
    const holdDate = new Date();
    holdDate.setDate(holdDate.getDate() - HOLD_DAYS);

    const sitterObjectId = new mongoose.Types.ObjectId(sitterId);

    const bookings = await Booking.find({
      sitterId: sitterObjectId,
      status: "completed",
      "payment.paid": true,
      completedAt: { $lte: holdDate },
    });

    const totalEarnings = bookings.reduce(
      (sum, b) => sum + (b.payment.amount || 0),
      0
    );

    const withdrawals = await Withdrawal.find({
      sitterId: sitterObjectId,
      status: { $in: ["requested", "approved", "paid"] },
    });

    const withdrawnAmount = withdrawals.reduce(
      (sum, w) => sum + w.amount,
      0
    );

    const availableBalance = totalEarnings - withdrawnAmount;

    if (amount > availableBalance) {
      return res.status(400).json({
        message: "Insufficient balance",
        availableBalance,
        requestedAmount: amount,
      });
    }

    const withdrawal = await Withdrawal.create({
      sitterId: sitterObjectId,
      amount,
    });

    console.log("✅ Withdrawal created:", withdrawal);

    res.json(withdrawal);
  } catch (err) {
    console.error("❌ Withdrawal Error:", err.message);
    console.error("Stack:", err.stack);
    res.status(500).json({ message: "Withdrawal request failed", error: err.message });
  }
});

export default router;
