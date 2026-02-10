import express from "express";
import Sitter from "../models/Sitter.js";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// GET /api/sitters?city=Mumbai
router.get("/", async (req, res) => {
  const { city } = req.query;
  const filter = city ? { city: new RegExp(city, "i") } : {};
  const sitters = await Sitter.find({
    ...filter,
    isActive: true,
  });
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


router.post("/bank-details", requireAuth, async (req, res) => {
  try {
    console.log("🔥 Bank details route hit");
    console.log("📦 Request body:", req.body);
    console.log("👤 Authenticated user:", req.user);

    const { accountHolderName, accountNumber, ifsc, bankName } = req.body;

    if (!accountHolderName || !accountNumber || !ifsc) {
      return res.status(400).json({ message: "All bank fields are required" });
    }

    // ✅ FIX: Find sitter by the sitterProfile ID from the authenticated user
    const user = await User.findById(req.user.id);
    
    if (!user || !user.sitterProfile) {
      console.log("❌ No sitter profile found for user");
      return res.status(404).json({ message: "Sitter profile not found" });
    }

    console.log("🔍 Looking for sitter with ID:", user.sitterProfile);

    // ✅ FIX: Use the sitterProfile ID instead of userId
    const sitter = await Sitter.findById(user.sitterProfile);

    if (!sitter) {
      console.log("❌ Sitter not found in database");
      return res.status(404).json({ message: "Sitter profile not found" });
    }

    console.log("✅ Found sitter:", sitter._id);

    // Update bank details
    sitter.bankDetails = {
      accountHolderName,
      accountNumber,
      ifsc,
      bankName,
      verified: false,
    };

    await sitter.save();

    console.log("✅ Bank details saved successfully");
    console.log("💾 Saved data:", sitter.bankDetails);

    // ✅ FIX: Return the bankDetails so frontend can update the UI
    res.json({ 
      message: "Bank details saved successfully",
      bankDetails: sitter.bankDetails 
    });
    
  } catch (err) {
    console.error("❌ Error saving bank details:", err);
    res.status(500).json({ message: "Failed to save bank details" });
  }
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
router.patch("/:id/availability", requireAuth, async (req, res) => {
  const { dates } = req.body;

  if (!Array.isArray(dates)) {
    return res.status(400).json({ message: "dates must be an array" });
  }

  try {
    // authorization: allow admin or owner of sitter profile
    const sitter = await Sitter.findById(req.params.id);
    if (!sitter) return res.status(404).json({ message: "Sitter not found" });

    const requester = req.user;
    if (requester.role !== "admin" && requester.sitterProfile !== req.params.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    sitter.availableDates = dates;
    await sitter.save();

    if (!sitter) {
      return res.status(404).json({ message: "Sitter not found" });
    }

    res.json({ availableDates: sitter.availableDates });
  } catch (err) {
    res.status(400).json({ message: "Invalid sitter id" });
  }
});

// PATCH /api/sitters/:id  (Update sitter profile)
router.patch("/:id", requireAuth, async (req, res) => {
  try {
    // authorization: only admin or sitter owner can update
    const sitter = await Sitter.findById(req.params.id);
    if (!sitter) return res.status(404).json({ message: "Sitter not found" });

    const requester = req.user;
    if (requester.role !== "admin" && requester.sitterProfile !== req.params.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Prevent changing protected fields unless admin
    const allowed = ["name", "city", "experience", "services", "price", "bio", "photo", "availableDates"];
    const updateData = {};
    Object.keys(req.body).forEach((key) => {
      if (requester.role === "admin" || allowed.includes(key)) {
        updateData[key] = req.body[key];
      }
    });

    Object.assign(sitter, updateData);
    await sitter.save();
    res.json(sitter);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
// ADD / UPDATE BANK DETAILS

export default router;