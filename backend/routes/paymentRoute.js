import express from "express";
import crypto from "crypto";
import Booking from "../models/Booking.js";
import { getRazorpayInstance } from "../config/razorpay.js";
import process from "process";

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
      amount,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (!bookingId || !amount) {
      return res
        .status(400)
        .json({ message: "bookingId and amount are required" });
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res
        .status(400)
        .json({ message: "Payment credentials are missing" });
    }

    // 1️⃣ Verify Razorpay signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
      .update(body)
      .digest("hex");

    console.log("Expected signature:", expectedSignature);
    console.log("Received signature:", razorpay_signature);

    if (expectedSignature !== razorpay_signature) {
      console.error("❌ Signature mismatch!");
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    console.log("✅ Signature verified!");

    // 2️⃣ Check if already paid
    const existingBooking = await Booking.findById(bookingId);
    if (existingBooking?.payment?.paid) {
      console.log("⚠️ Payment already processed for this booking");
      return res.json({ success: true, message: "Payment already processed" });
    }

    // 3️⃣ Update booking payment
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        $set: {
          "payment.paid": true,
          "payment.amount": Number(amount),
          "payment.razorpayOrderId": razorpay_order_id,
          "payment.razorpayPaymentId": razorpay_payment_id,
          "payment.paidAt": new Date(),
        },
      },
      { new: true }
    );

    if (!booking) {
      console.error("❌ Booking not found");
      return res.status(404).json({ message: "Booking not found" });
    }

    console.log("✅ PAYMENT SAVED:", booking.payment);

    res.json({ success: true, message: "Payment verified and saved" });
  } catch (error) {
    console.error("❌ Payment verification failed:", error);
    res
      .status(500)
      .json({ message: "Verification failed: " + error.message });
  }
});
/* ============================
   CANCEL & REFUND BOOKING
============================ */
router.post("/cancel", async (req, res) => {
  try {
    const { bookingId, cancelledBy } = req.body;
    // cancelledBy: "owner" | "sitter"

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (!booking.payment?.paid) {
      booking.status = "cancelled";
      await booking.save();
      return res.json({ success: true, refunded: false });
    }

    // 🔎 Service date check
    let serviceDate = booking.date;

    if (booking.walk?.date) serviceDate = booking.walk.date;
    if (booking.boarding?.startDate) serviceDate = booking.boarding.startDate;

    const isBeforeService =
      serviceDate && new Date(serviceDate) > new Date();

    // ❌ Owner cancels late → no refund
    if (cancelledBy === "owner" && !isBeforeService) {
      booking.status = "cancelled";
      await booking.save();
      return res.json({
        success: true,
        refunded: false,
        message: "Cancelled after service date. No refund.",
      });
    }

    // ✅ Refund allowed
    const razorpay = getRazorpayInstance();

    await razorpay.payments.refund(
      booking.payment.razorpayPaymentId,
      {
        amount: booking.payment.amount * 100, // paise
      }
    );

    booking.status = "refunded";
    booking.payment.refunded = true;
    booking.payment.refundedAt = new Date();

    await booking.save();

    res.json({ success: true, refunded: true });
  } catch (err) {
    console.error("Cancel/Refund error:", err);
    res.status(500).json({ message: "Cancellation failed" });
  }
});
export default router;