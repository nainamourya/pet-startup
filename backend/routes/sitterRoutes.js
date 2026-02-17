import express from "express";
import Sitter from "../models/Sitter.js";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();
async function geocodeAddress(address) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`,
      {
        headers: {
          "User-Agent": "PetSitterApp/1.0",
        },
      }
    );

    const data = await response.json();

    if (!data || data.length === 0) {
      return null;
    }

    return {
      lat: parseFloat(data[0].lat),
      lon: parseFloat(data[0].lon),
    };
  } catch (err) {
    console.error("Geocoding error:", err);
    return null;
  }
}
// GET /api/sitters?city=Mumbai OR /api/sitters?lat=X&lng=Y&radius=2000
router.get("/", async (req, res) => {
  const { lat, lng, radius } = req.query;

  let sitters;

  if (lat && lng) {
    const maxDistance = radius ? parseInt(radius) : 2000; // Default 2km in meters
    
    console.log(`🔍 Searching sitters within ${maxDistance}m of (${lat}, ${lng})`);

    sitters = await Sitter.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: maxDistance,
        },
      },
      isActive: true,
    });

    console.log(`✅ Found ${sitters.length} sitters`);
  } else {
    sitters = await Sitter.find({ isActive: true });
  }

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

// POST /api/sitters/upload-photo (Upload photo to Cloudinary) - MUST BE BEFORE /:id ROUTES
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'));
    }
    cb(null, true);
  }
});

router.post("/upload-photo", upload.single("photo"), async (req, res) => {
  try {
    console.log("📸 Upload request received");
    
    if (!req.file) {
      console.log("❌ No file in request");
      return res.status(400).json({ message: "No file uploaded" });
    }

    console.log("📄 File details:", {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    });

    console.log("☁️ Starting Cloudinary upload...");

    // Use promise-based approach instead of stream
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "petsitter_profiles",
          resource_type: "image",
          transformation: [
            { width: 800, height: 800, crop: "limit" },
            { quality: "auto" }
          ]
        },
        (error, result) => {
          if (error) {
            console.error("❌ Cloudinary upload error:", error);
            reject(error);
          } else {
            console.log("✅ Upload successful:", result.secure_url);
            resolve(result);
          }
        }
      );

      uploadStream.end(req.file.buffer);
    });

    res.json({ 
      imageUrl: result.secure_url,
      publicId: result.public_id
    });

  } catch (err) {
    console.error("❌ Upload failed:", err);
    res.status(500).json({ 
      message: "Upload failed", 
      error: err.message,
      details: err.toString()
    });
  }
});

// POST /api/sitters  (Become a PetSitter)
router.post("/", async (req, res) => {
  try {
    console.log("📝 Creating sitter profile with data:", req.body);
    
    const { 
      userId, 
      name, 
      city, 
      experience, 
      services, 
      price, 
      bio, 
      photo,
      address,
      aadhaarNumber,
      panNumber,
      homePhoto,
      phone, 
    } = req.body;

    // Validation
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    if (!name || !city || !experience || !services || !price || !bio) {
      return res.status(400).json({ 
        message: "Missing required fields: name, city, experience, services, price, bio" 
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create sitter data object
    const sitterData = {
      name,
      city,
      experience,
      services,
      price,
      bio,
      photo: photo || "",
      address: address || "",
      aadhaarNumber: aadhaarNumber || "",
      panNumber: panNumber || "",
      homePhoto: homePhoto || "",
      phone: phone || "",   // ✅ FIX 3: Added phone to sitterData object
      availableDates: [],
      isActive: true,
    };

    // Add default location (prevents validation error)
    // Geocode address
    let coordinates = null;
    
    if (address) {
      coordinates = await geocodeAddress(address);
    }
    
    if (!coordinates) {
      return res.status(400).json({
        message: "Could not find valid location for this address"
      });
    }
    
    sitterData.location = {
      type: "Point",
      coordinates: [coordinates.lon, coordinates.lat]
    };
    const sitter = await Sitter.create(sitterData);

    await User.findByIdAndUpdate(userId, {
      role: "sitter",
      sitterProfile: sitter._id,
    });

    console.log("✅ Sitter profile created successfully:", sitter._id);

    res.json({ sitter });
  } catch (err) {
    console.error("❌ Error creating sitter:", err);
    res.status(500).json({ 
      message: "Failed to create sitter profile",
      error: err.message 
    });
  }
});

// POST /api/sitters/bank-details
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
      verified: false,
      addedAt: new Date()
    };

    await sitter.save();

    console.log("✅ Bank details saved successfully for sitter:", sitter._id);

    res.json({ 
      message: "Bank details saved successfully",
      bankDetails: sitter.bankDetails.toObject()
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
    const sitter = await Sitter.findById(req.params.id);
    if (!sitter) return res.status(404).json({ message: "Sitter not found" });

    const requester = req.user;
    if (requester.role !== "admin" && requester.sitterProfile !== req.params.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    sitter.availableDates = dates;
    await sitter.save();

    res.json({ availableDates: sitter.availableDates });
  } catch (err) {
    res.status(400).json({ message: "Invalid sitter id" });
  }
});

// PATCH /api/sitters/:id  (Update sitter profile)
router.patch("/:id", requireAuth, async (req, res) => {
  try {
    const sitter = await Sitter.findById(req.params.id);
    if (!sitter) return res.status(404).json({ message: "Sitter not found" });

    const requester = req.user;
    if (requester.role !== "admin" && requester.sitterProfile !== req.params.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const allowed = ["name", "city", "experience", "services", "price", "bio", "photo", "availableDates", "address", "homePhoto", "phone"];
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

export default router;