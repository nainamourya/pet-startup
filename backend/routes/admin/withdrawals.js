import express from "express";
import Withdrawal from "../../models/Withdrawal.js";

const router = express.Router();

/* =========================
   3.1 VIEW ALL WITHDRAWALS
========================= */
router.get("/", async (req, res) => {
  const withdrawals = await Withdrawal.find()
    .populate("sitterId")
    .sort({ createdAt: -1 });

  res.json(withdrawals);
});

/* =========================
   3.1.5 CREATE WITHDRAWAL (Admin)
========================= */
router.post("/", async (req, res) => {
  try {
    const { sitterId, amount } = req.body;

    if (!sitterId || !amount) {
      return res.status(400).json({ message: "sitterId and amount are required" });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: "Amount must be greater than 0" });
    }

    const withdrawal = await Withdrawal.create({
      sitterId,
      amount,
      status: "approved",
      requestedAt: new Date(),
    });

    res.json({
      message: "Withdrawal created by admin ✅",
      withdrawal,
    });
  } catch (err) {
    res.status(500).json({ message: "Error creating withdrawal", error: err.message });
  }
});

/* =========================
   3.2 APPROVE WITHDRAWAL
========================= */
router.post("/:id/approve", async (req, res) => {
  try {
    const withdrawal = await Withdrawal.findById(req.params.id);

    if (!withdrawal) {
      return res.status(404).json({ message: "Withdrawal not found" });
    }

    if (withdrawal.status !== "requested") {
      return res.status(400).json({ message: "Withdrawal already processed" });
    }

    withdrawal.status = "approved";
    await withdrawal.save();

    res.json({
      message: "Withdrawal approved ✅",
      withdrawal,
    });
  } catch (err) {
    res.status(500).json({ message: "Error approving withdrawal", error: err.message });
  }
});

/* =========================
   3.3 MARK WITHDRAWAL AS PAID
========================= */
router.patch("/:id/pay", async (req, res) => {
  try {
    const withdrawal = await Withdrawal.findById(req.params.id);

    if (!withdrawal) {
      return res.status(404).json({ message: "Withdrawal not found" });
    }

    if (withdrawal.status === "paid") {
      return res.status(400).json({ message: "Already paid" });
    }

    withdrawal.status = "paid";
    withdrawal.paidAt = new Date();

    await withdrawal.save();

    res.json({
      message: "Withdrawal marked as PAID ✅",
      withdrawal,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error marking withdrawal as paid",
      error: error.message,
    });
  }
});

export default router;
