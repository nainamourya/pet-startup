import mongoose from "mongoose";

const sitterSchema = new mongoose.Schema(
  {
    name: String,
    city: String,
    experience: String,
    services: [String],
    price: String,
    rating: Number,
  },
  { timestamps: true }
);

export default mongoose.model("Sitter", sitterSchema);
