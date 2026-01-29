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

    // For non-walk services (Day Care / Boarding)
    date: String,

    // For Walk service (time-based)
    walk: {
      date: String,
      from: String,
      to: String,
    },

    status: { type: String, default: "pending" },

    pet: {
      name: { type: String },
      type: { type: String },
      age: { type: String },
      notes: { type: String },
    },
  },
  { timestamps: true }
);

// IMPORTANT: prevent model overwrite issues in dev
export default mongoose.models.Booking ||
  mongoose.model("Booking", bookingSchema);
