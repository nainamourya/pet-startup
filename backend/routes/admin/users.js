import express from "express";
import User from "../../models/User.js";
import { requireAdmin } from "../../middleware/requireAdmin.js";

const router = express.Router();

// GET all users
router.get("/", requireAdmin, async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

// BLOCK user
router.patch("/:id/block", requireAdmin, async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isBlocked: true },
    { new: true }
  );
  res.json(user);
});

// UNBLOCK user
router.patch("/:id/unblock", requireAdmin, async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isBlocked: false },
    { new: true }
  );
  res.json(user);
});

export default router;
