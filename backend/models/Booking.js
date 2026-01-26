import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    sitterId: { type: mongoose.Schema.Types.ObjectId, ref: "Sitter" },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // 👈 new
    service: String,
    date: String,
    status: {
      type: String,
      default: "confirmed",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
