import express from "express";
import Sitter from "../models/Sitter.js";
import User from "../models/User.js";

const router = express.Router();

// GET /api/sitters?city=Mumbai
router.get("/", async (req, res) => {
  const { city } = req.query;
  const filter = city ? { city: new RegExp(city, "i") } : {};
  const sitters = await Sitter.find(filter);
  res.json(sitters);
});

// GET /api/sitters/:id
router.get("/:id", async (req, res) => {
  try {
    const sitter = await Sitter.findById(req.params.id);
    if (!sitter) {
      return res.status(404).json({ message: "Sitter not found" });
    }
    res.json(sitter);
  } catch (err) {
    res.status(400).json({ message: "Invalid sitter id" });
  }
});

// POST /api/sitters  (Become a PetSitter)
router.post("/", async (req, res) => {
  const { userId, name, city, experience, services, price, bio, photo } = req.body;

  const sitter = await Sitter.create({
    name,
    city,
    experience,
    services,
    price,
    bio,
    photo,
    availableDates: [],
  });

  await User.findByIdAndUpdate(userId, {
    role: "sitter",
    sitterProfile: sitter._id,
  });

  res.json({ sitter });
});

// GET /api/sitters/:id/availability
router.get("/:id/availability", async (req, res) => {
  try {
    const sitter = await Sitter.findById(req.params.id);
    if (!sitter) {
      return res.status(404).json({ message: "Sitter not found" });
    }

    res.json({ availableDates: sitter.availableDates || [] });
  } catch (err) {
    res.status(400).json({ message: "Invalid sitter id" });
  }
});

// PATCH /api/sitters/:id/availability
router.patch("/:id/availability", async (req, res) => {
  const { dates } = req.body;

  if (!Array.isArray(dates)) {
    return res.status(400).json({ message: "dates must be an array" });
  }

  try {
    const sitter = await Sitter.findByIdAndUpdate(
      req.params.id,
      { availableDates: dates },
      { new: true }
    );

    if (!sitter) {
      return res.status(404).json({ message: "Sitter not found" });
    }

    res.json({ availableDates: sitter.availableDates });
  } catch (err) {
    res.status(400).json({ message: "Invalid sitter id" });
  }
});

// PATCH /api/sitters/:id  (Update sitter profile)
router.patch("/:id", async (req, res) => {
  try {
    const updated = await Sitter.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Sitter not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
