import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import process from "process";
import User from "../models/User.js";

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
});

export default router;
