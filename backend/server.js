import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import process from "process";
import sitterRoutes from "./routes/sitterRoutes.js";
import Sitter from "./models/Sitter.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import authRoutes from "./routes/authRoutes.js";
dotenv.config();

const app = express();

// 2. Middleware
app.use(cors());
app.use(express.json());
app.use("/api/sitters", sitterRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/auth", authRoutes);
// 3. Routes
app.get("/", (req, res) => {
  res.send("PetSitter API is running");
});

// 4. Configuration constants
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
 console.log("MongoDB URI:", MONGO_URI); // Debugging line to check MONGO_URI
// 5. Database Connection & Server Start
if (!MONGO_URI) {
  console.error("ERROR: MONGO_URI is not defined in your .env file");
  // process.exit(1);
}

mongoose
  .connect(MONGO_URI) // Removed hardcoded string for security
  .then(async () => {
    console.log("✓ MongoDB connected successfully");
    console.log("Connected DB:", mongoose.connection.name);
    // Seed only if empty
    const count = await Sitter.countDocuments();
    if (count === 0) {
      await Sitter.create({
        name: "Riya Mehta",
        city: "Mumbai",
        experience: "3 years",
        services: ["Walk", "Day Care"],
        price: "₹500 / day",
        rating: 4.7,
      });
      console.log("✓ Sample sitter created");
    }

    app.listen(PORT, () =>
      console.log(`✓ Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("✗ MongoDB connection failed:", err.message);
  });