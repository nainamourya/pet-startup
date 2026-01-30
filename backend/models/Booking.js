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
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
