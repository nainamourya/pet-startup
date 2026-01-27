import express from "express";
import Sitter from "../models/Sitter.js";
import User from "../models/User.js"; // 👈 this was missing

const router = express.Router();

// GET /api/sitters?city=Mumbai
router.get("/", async (req, res) => {
  const { city } = req.query;

  const filter = city ? { city: new RegExp(city, "i") } : {};
  const sitters = await Sitter.find(filter);

  res.json(sitters);
});

// POST /api/sitters/create (Become a PetSitter)
router.post("/create", async (req, res) => {
  const { userId, name, city, experience, services, price } = req.body;

  // 1. Create Sitter profile
  const sitter = await Sitter.create({
    name,
    city,
    experience,
    services,
    price,
  });

  // 2. Link Sitter to User
  await User.findByIdAndUpdate(userId, {
    role: "sitter",
    sitterProfile: sitter._id,
  });

  res.json({ sitter });
});

export default router;
