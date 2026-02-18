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
      // required: true, // 🔥 PRICE IS NOW FIXED HERE
    },
    date: String,
    phone: String, // ✅ NEW FIELD TO STORE SITTER'S PHONE NUMBER AT TIME OF BOOKING  
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
    breed: { type: String },

    status: {
      type: String,
      default: "pending",
    },

    liveLocation: {
      lat: { type: Number },
      lng: { type: Number },
      address: { type: String },
      updatedAt: { type: Date },
    },

    completedAt: {
      type: Date,
    },
    earningsCredited: {
      type: Boolean,
      default: false
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
    refunded: { type: Boolean, default: false },
    refundedAt: Date,
    cancelledAt: Date,

    refundAmount: {
      type: Number,
      default: 0,
    },


  },



  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);