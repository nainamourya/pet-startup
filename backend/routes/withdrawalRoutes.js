  import express from "express";
  import Booking from "../models/Booking.js";
  import Withdrawal from "../models/Withdrawal.js";
  import User from "../models/User.js";
  import mongoose from "mongoose";

  const router = express.Router();

  // Configuration
  const HOLD_DAYS = 3;
  const MIN_WITHDRAWAL = 500;
  const MAX_WITHDRAWAL = 100000; // ₹1 lakh max per transaction
  const DAILY_WITHDRAWAL_LIMIT = 200000; // ₹2 lakhs per day
  const WITHDRAWAL_COOLDOWN_HOURS = 24; // 24 hours between withdrawals
  
  /* ===========================
    HELPER: Calculate Available Balance
  =========================== */
  async function calculateBalance(sitterId) {
    const holdDate = new Date();
    holdDate.setDate(holdDate.getDate() - HOLD_DAYS); // ✅ FIXED
  
    const sitterObjectId = new mongoose.Types.ObjectId(sitterId);
  
    // Get completed, paid bookings that are past hold period
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
  
    // Get all non-rejected/cancelled withdrawals
    const withdrawals = await Withdrawal.find({
      sitterId: sitterObjectId,
      status: { $in: ["pending", "approved", "processing", "completed"] },
    });
  
    const withdrawnAmount = withdrawals.reduce((sum, w) => sum + w.amount, 0);
  
    // ✅ Ensure balance never goes negative
    const availableBalance = Math.max(0, totalEarnings - withdrawnAmount);
  
    return {
      totalEarnings,
      withdrawnAmount,
      availableBalance,
      pendingWithdrawals: withdrawals.filter((w) => w.status === "pending").length,
    };
  }
  /* ===========================
    HELPER: Validate Withdrawal Limits
  =========================== */
  async function validateWithdrawalLimits(sitterId, amount) {
    const errors = [];

    // Check minimum
    if (amount < MIN_WITHDRAWAL) {
      errors.push(`Minimum withdrawal is ₹${MIN_WITHDRAWAL}`);
    }

    // Check maximum per transaction
    if (amount > MAX_WITHDRAWAL) {
      errors.push(`Maximum withdrawal per transaction is ₹${MAX_WITHDRAWAL}`);
    }

    // Check daily limit
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayWithdrawals = await Withdrawal.find({
      sitterId,
      createdAt: { $gte: today },
      status: { $in: ["pending", "approved", "processing", "completed"] },
    });

    const todayTotal = todayWithdrawals.reduce((sum, w) => sum + w.amount, 0);

    if (todayTotal + amount > DAILY_WITHDRAWAL_LIMIT) {
      errors.push(
        `Daily withdrawal limit of ₹${DAILY_WITHDRAWAL_LIMIT} would be exceeded. You've already withdrawn ₹${todayTotal} today.`
      );
    }

    // Check cooldown period
    const lastWithdrawal = await Withdrawal.findOne({
      sitterId,
      status: { $in: ["pending", "approved", "processing", "completed"] },
    }).sort({ createdAt: -1 });

    if (lastWithdrawal) {
      const hoursSinceLastWithdrawal =
        (Date.now() - lastWithdrawal.createdAt) / (1000 * 60 * 60);

      if (hoursSinceLastWithdrawal < WITHDRAWAL_COOLDOWN_HOURS) {
        const hoursRemaining = Math.ceil(
          WITHDRAWAL_COOLDOWN_HOURS - hoursSinceLastWithdrawal
        );
        errors.push(
          `Please wait ${hoursRemaining} hour(s) before making another withdrawal request.`
        );
      }
    }

    return errors;
  }

  /* ===========================
    GET SITTER BALANCE
  =========================== */
  router.get("/balance/:sitterId", async (req, res) => {
    try {
      const { sitterId } = req.params;

      // Validate sitterId
      if (!mongoose.Types.ObjectId.isValid(sitterId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid sitter ID format",
        });
      }

      const balance = await calculateBalance(sitterId);

      // Get recent withdrawals for display
      const recentWithdrawals = await Withdrawal.find({
        sitterId: new mongoose.Types.ObjectId(sitterId),
      })
        .sort({ createdAt: -1 })
        .limit(5)
        .select("amount status createdAt completedAt");

      res.json({
        success: true,
        ...balance,
        limits: {
          minWithdrawal: MIN_WITHDRAWAL,
          maxWithdrawal: MAX_WITHDRAWAL,
          dailyLimit: DAILY_WITHDRAWAL_LIMIT,
          cooldownHours: WITHDRAWAL_COOLDOWN_HOURS,
        },
        recentWithdrawals,
      });
    } catch (err) {
      console.error("❌ Balance Error:", err);
      res.status(500).json({
        success: false,
        message: "Failed to fetch balance",
        error: err.message,
      });
    }
  });

  /* ===========================
    REQUEST WITHDRAWAL
  =========================== */
  router.post("/", async (req, res) => {
    try {
      const { sitterId, amount, paymentMethod } = req.body;

      // Validate required fields
      if (!sitterId || !amount || !paymentMethod) {
        return res.status(400).json({
          success: false,
          message: "sitterId, amount, and paymentMethod are required",
        });
      }

      // Validate sitterId
      if (!mongoose.Types.ObjectId.isValid(sitterId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid sitter ID format",
        });
      }

      // Validate payment method structure
      if (!paymentMethod.type || !["bank", "upi", "paypal"].includes(paymentMethod.type)) {
        return res.status(400).json({
          success: false,
          message: "Invalid payment method type. Must be 'bank', 'upi', or 'paypal'",
        });
      }

      // Validate payment method details
      if (paymentMethod.type === "bank") {
        if (
          !paymentMethod.bankDetails?.accountHolderName ||
          !paymentMethod.bankDetails?.accountNumber ||
          !paymentMethod.bankDetails?.ifsc
        ) {
          return res.status(400).json({
            success: false,
            message: "Bank details (accountHolderName, accountNumber, ifsc) are required for bank transfer",
          });
        }
      } else if (paymentMethod.type === "upi") {
        if (!paymentMethod.upiId) {
          return res.status(400).json({
            success: false,
            message: "UPI ID is required for UPI payment",
          });
        }
      } else if (paymentMethod.type === "paypal") {
        if (!paymentMethod.paypalEmail) {
          return res.status(400).json({
            success: false,
            message: "PayPal email is required for PayPal payment",
          });
        }
      }

      // Validate withdrawal limits
      const limitErrors = await validateWithdrawalLimits(sitterId, amount);
      if (limitErrors.length > 0) {
        return res.status(400).json({
          success: false,
          message: limitErrors.join(". "),
          errors: limitErrors,
        });
      }

      // Check available balance
      const balance = await calculateBalance(sitterId);
      if (amount > balance.availableBalance) {
        return res.status(400).json({
          success: false,
          message: "Insufficient balance",
          availableBalance: balance.availableBalance,
          requestedAmount: amount,
        });
      }

      // Create withdrawal request
      const withdrawal = await Withdrawal.create({
        sitterId: new mongoose.Types.ObjectId(sitterId),
        amount,
        paymentMethod,
        ipAddress: req.ip,
        userAgent: req.get("user-agent"),
        statusHistory: [
          {
            status: "pending",
            timestamp: new Date(),
          },
        ],
      });

      console.log("✅ Withdrawal created:", withdrawal._id);

      // TODO: Send email notification to sitter
      // TODO: Send notification to admin panel

      res.status(201).json({
        success: true,
        message: "Withdrawal request submitted successfully",
        withdrawal: {
          id: withdrawal._id,
          amount: withdrawal.amount,
          status: withdrawal.status,
          createdAt: withdrawal.createdAt,
        },
      });
    } catch (err) {
      console.error("❌ Withdrawal Error:", err);
      res.status(500).json({
        success: false,
        message: "Failed to process withdrawal request",
        error: err.message,
      });
    }
  });

  /* ===========================
    GET WITHDRAWAL HISTORY
  =========================== */
  router.get("/history/:sitterId", async (req, res) => {
    try {
      const { sitterId } = req.params;
      const { status, page = 1, limit = 10 } = req.query;

      if (!mongoose.Types.ObjectId.isValid(sitterId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid sitter ID",
        });
      }

      const query = { sitterId: new mongoose.Types.ObjectId(sitterId) };
      if (status) {
        query.status = status;
      }

      const withdrawals = await Withdrawal.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .select("-ipAddress -userAgent");

      const total = await Withdrawal.countDocuments(query);

      res.json({
        success: true,
        withdrawals,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (err) {
      console.error("❌ History Error:", err);
      res.status(500).json({
        success: false,
        message: "Failed to fetch withdrawal history",
        error: err.message,
      });
    }
  });

  /* ===========================
    CANCEL WITHDRAWAL (by sitter)
  =========================== */
  router.patch("/:withdrawalId/cancel", async (req, res) => {
    try {
      const { withdrawalId } = req.params;
      const { sitterId, reason } = req.body;

      if (!mongoose.Types.ObjectId.isValid(withdrawalId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid withdrawal ID",
        });
      }

      const withdrawal = await Withdrawal.findById(withdrawalId);

      if (!withdrawal) {
        return res.status(404).json({
          success: false,
          message: "Withdrawal not found",
        });
      }

      // Verify ownership
      if (withdrawal.sitterId.toString() !== sitterId) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized",
        });
      }

      // Can only cancel pending withdrawals
      if (withdrawal.status !== "pending") {
        return res.status(400).json({
          success: false,
          message: `Cannot cancel withdrawal with status: ${withdrawal.status}`,
        });
      }

      withdrawal.status = "cancelled";
      withdrawal.cancelledAt = new Date();
      withdrawal.cancellationReason = reason || "Cancelled by user";
      await withdrawal.save();

      res.json({
        success: true,
        message: "Withdrawal cancelled successfully",
      });
    } catch (err) {
      console.error("❌ Cancel Error:", err);
      res.status(500).json({
        success: false,
        message: "Failed to cancel withdrawal",
        error: err.message,
      });
    }
  });

  /* ===========================
    ADMIN: GET ALL WITHDRAWALS
  =========================== */
  router.get("/admin/all", async (req, res) => {
    try {
      const { status, page = 1, limit = 20 } = req.query;

      // TODO: Add admin authentication middleware

      const query = {};
      if (status) {
        query.status = status;
      }

      const withdrawals = await Withdrawal.find(query)
        .populate("sitterId", "name email phone")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

      const total = await Withdrawal.countDocuments(query);

      // Get statistics
      const stats = await Withdrawal.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
            totalAmount: { $sum: "$amount" },
          },
        },
      ]);

      res.json({
        success: true,
        withdrawals,
        stats,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (err) {
      console.error("❌ Admin List Error:", err);
      res.status(500).json({
        success: false,
        message: "Failed to fetch withdrawals",
        error: err.message,
      });
    }
  });

  /* ===========================
    ADMIN: UPDATE WITHDRAWAL STATUS
  =========================== */
  router.patch("/admin/:withdrawalId/status", async (req, res) => {
    try {
      const { withdrawalId } = req.params;
      const { status, notes, transactionId, adminId } = req.body;

      // TODO: Add admin authentication middleware

      if (!mongoose.Types.ObjectId.isValid(withdrawalId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid withdrawal ID",
        });
      }

      const withdrawal = await Withdrawal.findById(withdrawalId);

      if (!withdrawal) {
        return res.status(404).json({
          success: false,
          message: "Withdrawal not found",
        });
      }

      // Validate status transition
      const validTransitions = {
        pending: ["approved", "rejected"],
        approved: ["processing", "rejected"],
        processing: ["completed", "rejected"],
      };

      if (
        !validTransitions[withdrawal.status] ||
        !validTransitions[withdrawal.status].includes(status)
      ) {
        return res.status(400).json({
          success: false,
          message: `Cannot change status from ${withdrawal.status} to ${status}`,
        });
      }

      withdrawal.status = status;

      if (status === "approved") {
        // Add approved timestamp if needed
      } else if (status === "processing") {
        withdrawal.processingNotes = notes;
        if (transactionId) {
          withdrawal.transactionId = transactionId;
        }
      } else if (status === "completed") {
        withdrawal.completedAt = new Date();
        withdrawal.processedBy = adminId;
        if (transactionId) {
          withdrawal.transactionId = transactionId;
        }
      } else if (status === "rejected") {
        withdrawal.rejectedAt = new Date();
        withdrawal.rejectionReason = notes;
        withdrawal.rejectedBy = adminId;
      }

      await withdrawal.save();

      // TODO: Send email notification to sitter

      res.json({
        success: true,
        message: `Withdrawal ${status} successfully`,
        withdrawal,
      });
    } catch (err) {
      console.error("❌ Status Update Error:", err);
      res.status(500).json({
        success: false,
        message: "Failed to update withdrawal status",
        error: err.message,
      });
    }
  });

  export default router;