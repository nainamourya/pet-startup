import express from "express";

const router = express.Router();

// Geocode address to coordinates
router.get("/geocode", async (req, res) => {
  try {
    const { address } = req.query;

    if (!address) {
      return res.status(400).json({ message: "Address is required" });
    }

    console.log("🗺️ Geocoding address:", address);

    // Use OpenStreetMap Nominatim API for geocoding
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        address
      )}&format=json&limit=1`,
      {
        headers: {
          "User-Agent": "PetSitter-App/1.0",
        },
      }
    );

    const data = await response.json();

    if (!data || data.length === 0) {
      return res.status(404).json({ message: "Location not found" });
    }

    const location = data[0];

    console.log("✅ Geocoded to:", { lat: location.lat, lon: location.lon });

    res.json({
      lat: location.lat,
      lon: location.lon,
      display_name: location.display_name,
      address: location.address || {},
    });
  } catch (err) {
    console.error("❌ Geocoding error:", err);
    res.status(500).json({
      message: "Failed to geocode address",
      error: err.message,
    });
  }
});

// Reverse geocode coordinates to address
router.get("/reverse-geocode", async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({ message: "Latitude and longitude are required" });
    }

    console.log("🗺️ Reverse geocoding:", { lat, lon });

    // Use OpenStreetMap Nominatim API for reverse geocoding
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      {
        headers: {
          "User-Agent": "PetSitter-App/1.0",
        },
      }
    );

    const data = await response.json();

    if (!data || !data.display_name) {
      return res.status(404).json({ message: "Address not found" });
    }

    console.log("✅ Reverse geocoded to:", data.display_name);

    res.json({
      display_name: data.display_name,
      address: data.address || {},
      lat: data.lat,
      lon: data.lon,
    });
  } catch (err) {
    console.error("❌ Reverse geocoding error:", err);
    res.status(500).json({
      message: "Failed to reverse geocode coordinates",
      error: err.message,
    });
  }
});

export default router;