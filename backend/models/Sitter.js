import mongoose from "mongoose";

const sitterSchema = new mongoose.Schema(
  {
    name: String,
    city: String,
    experience: String,
    services: [String],
    price: String,

    // 🔥 Profile fields
    bio: {
      type: String,
      default: "",
    },
    photo: {
      type: String,
      default: "",
    },

    // 🔥 Stats
    totalBookings: {
      type: Number,
      default: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    verified: {
      type: Boolean,
      default: false,
    },

    // 🔴 THIS IS WHAT WAS MISSING
    availableDates: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Sitter", sitterSchema);
