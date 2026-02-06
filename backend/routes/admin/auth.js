import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import process from "process";
import User from "../../models/User.js";

const router = express.Router();

/* =========================
   ADMIN LOGIN
========================= */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // 1️⃣ Find user
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // 2️⃣ Check role
  if (user.role !== "admin") {
    return res.status(403).json({ message: "Not an admin account" });
  }

  // 3️⃣ Check password
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // 4️⃣ Create token
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || "petsitter_secret",
    { expiresIn: "7d" }
  );

  res.json({
    token,
    admin: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});

export default router;
