import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ["owner", "sitter"], default: "owner" },

    // 👇 Link sitter users to their Sitter profile
    sitterProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sitter",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
