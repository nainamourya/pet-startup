import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    sitterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sitter",
      required: true,
    },

    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    service: String,
    servicePrice: {
      type: Number,
      required: true, // 🔥 PRICE IS NOW FIXED HERE
    },
    date: String,

    walk: {
      date: String,
      from: String,
      to: String,
    },

    boarding: {
      startDate: String,
      endDate: String,
      medicine: String,
      vetNumber: String,
      emergencyNotes: String,
    },

    pet: {
      name: { type: String },
      type: { type: String },
      age: { type: String },
      notes: { type: String },
    },


    status: {
      type: String,
      default: "pending",
    },

    // ✅ ADD THIS BLOCK
    payment: {
      paid: {
        type: Boolean,
        default: false,
      },
      amount: { type: Number },   
      razorpayOrderId: { type: String },
      razorpayPaymentId: { type: String },
      paidAt: { type: Date },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);