import express from "express";
import crypto from "crypto";
import Booking from "../models/Booking.js";
import { getRazorpayInstance } from "../config/razorpay.js";

const router = express.Router();


/* ============================
   CREATE ORDER
============================ */
router.post("/create-order", async (req, res) => {
  try {
    console.log("🟢 CREATE ORDER HIT");
    console.log("REQ BODY 👉", req.body);
    console.log("AMOUNT TYPE 👉", typeof req.body.amount);

    let { amount, bookingId } = req.body;
    amount = Number(amount);

    console.log("PARSED AMOUNT 👉", amount);

    if (!amount || isNaN(amount)) {
      console.log("❌ INVALID AMOUNT");
      return res.status(400).json({ message: "Invalid amount" });
    }

    // 🔑 Create instance AFTER env load
    const razorpayInstance = getRazorpayInstance();
    console.log("✅ Razorpay instance created");

    const order = await razorpayInstance.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: bookingId,
    });

    console.log("✅ ORDER CREATED:", order.id);

    res.json(order);
  } catch (err) {
    console.error("❌ CREATE ORDER FULL ERROR 👉", err);
    res.status(500).json({ message: "Payment order failed" });
  }
});


/* ============================
   VERIFY PAYMENT
============================ */
router.post("/verify", async (req, res) => {
  try {
    console.log("🔥 VERIFY API HIT");
    console.log("BODY 👉", req.body);

    const {
      bookingId,
      amount, // ✅ MUST COME FROM FRONTEND
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (!bookingId || !amount) {
      return res
        .status(400)
        .json({ message: "bookingId and amount are required" });
    }

    // 1️⃣ Verify Razorpay signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    // 2️⃣ Update booking payment (NO booking.amount ❌)
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        $set: {
          "payment.paid": true,
          "payment.amount": Number(amount), // ✅ THIS IS THE FIX
          "payment.razorpayOrderId": razorpay_order_id,
          "payment.razorpayPaymentId": razorpay_payment_id,
          "payment.paidAt": new Date(),
        },
      },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    console.log("✅ PAYMENT SAVED:", booking.payment);

    res.json({ success: true });
  } catch (error) {
    console.error("❌ Payment verification failed:", error);
    res.status(500).json({ message: "Verification failed" });
  }
});

export default router;


