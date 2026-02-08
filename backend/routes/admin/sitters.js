import express from "express";
import Sitter from "../../models/Sitter.js";
import requireAuth from "../../middleware/auth.js";
import { requireAdmin } from "../../middleware/requireAdmin.js";

const router = express.Router();

// List all sitters
router.get(
  "/sitters",
  requireAuth,
  requireAdmin,
  async (req, res) => {
    const sitters = await Sitter.find();
    res.json(sitters);
  }
);

// Disable sitter
router.patch(
  "/sitters/:id/disable",
  requireAuth,
  requireAdmin,
  async (req, res) => {
    await Sitter.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: "Sitter disabled" });
  }
);

// Enable sitter
router.patch(
  "/sitters/:id/enable",
  requireAuth,
  requireAdmin,
  async (req, res) => {
    await Sitter.findByIdAndUpdate(req.params.id, { isActive: true });
    res.json({ message: "Sitter enabled" });
  }
);

export default router;
