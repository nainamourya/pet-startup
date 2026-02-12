import mongoose from "mongoose";
import bcrypt from "bcrypt";
const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ["owner", "sitter", "admin"], default: "owner" },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    // 👇 Link sitter users to their Sitter profile
    sitterProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sitter",
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpire: {
      type: Date,
    },
  },
  
  { timestamps: true }
);
// 🔐 HASH PASSWORD BEFORE SAVE
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});
export default mongoose.model("User", userSchema);