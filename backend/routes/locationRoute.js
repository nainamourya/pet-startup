import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.get("/reverse-geocode", async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ message: "lat and lon required" });
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
      {
        headers: {
          "User-Agent": "PetSitterApp/1.0 (contact@petsitter.com)",
        },
      }
    );

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch address" });
  }
});

export default router;
