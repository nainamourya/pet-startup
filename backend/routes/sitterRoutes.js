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


// Add this route to your sitters.js route file

// POST /api/sitters/bank-details (Professional bank details endpoint)
router.post("/bank-details", requireAuth, async (req, res) => {
  try {
    console.log("🏦 Bank details submission received");
    
    const { 
      accountHolderName, 
      accountNumber, 
      ifscCode, 
      bankName, 
      branchName, 
      accountType 
    } = req.body;

    // Validation
    if (!accountHolderName || !accountNumber || !ifscCode || !bankName) {
      return res.status(400).json({ 
        message: "Account holder name, account number, IFSC code, and bank name are required" 
      });
    }

    // Validate IFSC format (4 letters + 0 + 6 alphanumeric)
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    if (!ifscRegex.test(ifscCode.toUpperCase())) {
      return res.status(400).json({ 
        message: "Invalid IFSC code format" 
      });
    }

    // Validate account number (9-18 digits)
    const accountRegex = /^\d{9,18}$/;
    if (!accountRegex.test(accountNumber)) {
      return res.status(400).json({ 
        message: "Account number must be between 9 and 18 digits" 
      });
    }

    // Get user and sitter profile
    const user = await User.findById(req.user.id);
    
    if (!user || !user.sitterProfile) {
      return res.status(404).json({ 
        message: "Sitter profile not found for this user" 
      });
    }

    // Find and update sitter
    const sitter = await Sitter.findById(user.sitterProfile);

    if (!sitter) {
      return res.status(404).json({ 
        message: "Sitter profile not found in database" 
      });
    }

    // Update bank details
    sitter.bankDetails = {
      accountHolderName: accountHolderName.trim(),
      accountNumber: accountNumber,
      ifscCode: ifscCode.toUpperCase(),
      bankName: bankName.trim(),
      branchName: branchName ? branchName.trim() : "",
      accountType: accountType || "savings",
      verified: false, // Will be verified by admin later
      addedAt: new Date()
    };

    await sitter.save();

    console.log("✅ Bank details saved successfully for sitter:", sitter._id);

    // Return sanitized data (hide full account number in response)
    const sanitizedBankDetails = {
      ...sitter.bankDetails.toObject(),
      accountNumber: sitter.bankDetails.accountNumber // Frontend will handle masking
    };

    res.json({ 
      message: "Bank details saved successfully",
      bankDetails: sanitizedBankDetails
    });
    
  } catch (err) {
    console.error("❌ Error saving bank details:", err);
    res.status(500).json({ 
      message: "Failed to save bank details",
      error: err.message 
    });
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