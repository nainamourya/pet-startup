import express from "express";
import Sitter from "../models/Sitter.js";

const router = express.Router();

// GET /api/sitters?city=Mumbai
router.get("/", async (req, res) => {
  const { city } = req.query;

  const filter = city ? { city: new RegExp(city, "i") } : {};
  const sitters = await Sitter.find(filter);

  res.json(sitters);
});

// POST /api/sitters (Become a PetSitter)
router.post("/", async (req, res) => {
  const sitter = await Sitter.create(req.body);
  res.json(sitter);
});

export default router;
