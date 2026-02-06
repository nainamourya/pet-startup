import mongoose from "mongoose";

const withdrawalSchema = new mongoose.Schema(
  {
    sitterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "paid", "rejected"],
      default: "pending",
    },
    paidAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Withdrawal", withdrawalSchema);
