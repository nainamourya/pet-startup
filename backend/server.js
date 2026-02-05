
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import process from "process";
import sitterRoutes from "./routes/sitterRoutes.js";
import Sitter from "./models/Sitter.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import paymentRoute from "./routes/paymentRoute.js";


const app = express();

// 2. Middleware
app.use(cors());
app.use(express.json());
app.use("/api/sitters", sitterRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/payments", paymentRoute);

// 3. Routes
app.get("/", (req, res) => {
  res.send("PetSitter API is running");
});
console.log("KEY ID:", process.env.RAZORPAY_KEY_ID);
console.log("SECRET:", process.env.RAZORPAY_KEY_SECRET ? "LOADED" : "MISSING");

/* ============================
   SERVER + SOCKET.IO
============================ */

const httpServer = http.createServer(app);

export const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

/* ============================
   SOCKET.IO LOGIC (LIVE WALK)
============================ */
io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);

  socket.on("join-walk", ({ bookingId }) => {
    socket.join(bookingId);
    console.log("👣 Joined walk room:", bookingId);
  });

  socket.on("send-location", ({ bookingId, lat, lng }) => {
    socket.to(bookingId).emit("receive-location", { lat, lng });
  });

  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected:", socket.id);
  });
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

    httpServer.listen(PORT, () => {
      console.log(`✓ Server + Socket.IO running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("✗ MongoDB connection failed:", err.message);
  });