import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: {
      type: String,
      enum: ["owner", "sitter"],
      default: "owner",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
