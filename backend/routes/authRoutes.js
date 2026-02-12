import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import process from "process";
import User from "../models/User.js";
import crypto from "crypto";

const router = express.Router();

// GET /api/auth (quick test)
router.get("/", (req, res) => {
  res.send("Auth API is running");
});

// POST /api/auth/register
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({ message: "Email already exists" });
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashed,
    role,
  });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || "petsitter_secret",
    { expiresIn: "7d" }
  );

  // Ensure sitterProfile is properly serialized as string
  const sitterProfileId = user.sitterProfile ? String(user.sitterProfile) : null;

  res.json({
    token,
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      sitterProfile: sitterProfileId,
    },
  });
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || "petsitter_secret",
    { expiresIn: "7d" }
  );

  // Ensure sitterProfile is properly serialized as string
  const sitterProfileId = user.sitterProfile ? String(user.sitterProfile) : null;

  res.json({
    token,
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      sitterProfile: sitterProfileId,
    },
  });
}); // ← CLOSE THE LOGIN ROUTE HERE

// POST /api/auth/forgot-password
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = token; // Changed from resetToken
    user.resetPasswordExpire = Date.now() + 60 * 60 * 1000; // Changed from resetTokenExpiry
    await user.save();

    console.log("RESET TOKEN:", token);

    res.json({
      message: "Password reset link generated",
      token: token, // You can remove this in production
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/auth/reset-password/:token
// POST /api/auth/reset-password/:token
router.post("/reset-password/:token", async (req, res) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token, // Keep this as resetPasswordToken
      resetPasswordExpire: { $gt: Date.now() }, // Keep this as resetPasswordExpire
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // DON'T hash here - let the pre-save hook do it
    user.password = req.body.password; // Just assign the plain password
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save(); // The pre-save hook will hash it automatically

    res.json({ message: "Password updated successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
export default router;