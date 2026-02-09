
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import "./cron/autoCompleteBookings.js";
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
import withdrawalRoutes from "./routes/withdrawalRoutes.js";
import Booking from "./models/Booking.js";
import locationRoute from "./routes/locationRoute.js";
// admin routes
import adminAuthRoutes from "./routes/admin/auth.js";
import adminDashboardRoutes from "./routes/admin/dashboard.js";
import adminWithdrawalRoutes from "./routes/admin/withdrawals.js";
import adminTestRoutes from "./routes/admin/test.js";

// middleware
import { requireAuth } from "./middleware/auth.js";
import { requireAdmin } from "./middleware/requireAdmin.js";
import adminUserRoutes from "./routes/admin/users.js";
import adminReviewRoutes from "./routes/admin/reviews.js";
import adminSitterRoutes from "./routes/admin/sitters.js";
const app = express();

// 2. Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      process.env.CLIENT_URL,
    ],
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/sitters", sitterRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/payments", paymentRoute);
app.use("/api/withdrawals", withdrawalRoutes);
app.use("/api/location", locationRoute);
/* ================= ADMIN ROUTES ================= */

// admin login (NO requireAdmin here)
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/admin/reviews", adminReviewRoutes);
app.use("/api/admin", adminSitterRoutes);
// protected admin routes
app.use(
  "/api/admin/dashboard",
  requireAuth,
  requireAdmin,
  adminDashboardRoutes
);

app.use(
  "/api/admin/withdrawals",
  requireAuth,
  requireAdmin,
  adminWithdrawalRoutes
);

app.use(
  "/api/admin/test",
  requireAuth,
  requireAdmin,
  adminTestRoutes
);

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
    origin: [
      "http://localhost:5173",
      process.env.CLIENT_URL,
    ],
    methods: ["GET", "POST"],
  },
});
const liveWalkLocations = {};
/* ============================
   SOCKET.IO LOGIC (LIVE WALK)
============================ */
io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);

  /* =====================
     JOIN WALK ROOM
  ===================== */
  socket.on("join-walk", ({ bookingId }) => {
    socket.join(bookingId);
    console.log("👣 Joined walk room:", bookingId);

    // 🔥 SEND LAST LOCATION IMMEDIATELY
    if (liveWalkLocations[bookingId]) {
      socket.emit("receive-location", liveWalkLocations[bookingId]);
    }
  });

  /* =====================
     WALK STARTED 🔔
  ===================== */
  socket.on("walk-started", ({ bookingId }) => {
    console.log("🚶 Walk started:", bookingId);

    socket.to(bookingId).emit("notify-owner", {
      type: "walk-started",
      message: "🐕 Your pet’s walk has started!",
    });
  });

  /* =====================
     LIVE LOCATION 📍
  ===================== */
  socket.on("send-location", ({ bookingId, lat, lng }) => {
    const payload = { lat, lng };

    // 🔥 SAVE LAST LOCATION
    liveWalkLocations[bookingId] = payload;

    socket.to(bookingId).emit("receive-location", payload);
  });

  /* =====================
     WALK ENDED 🛑
  ===================== */
  socket.on("end-walk",async  ({ bookingId }) => {
    console.log("🛑 Walk ended for booking:", bookingId);

    // 🧹 remove cached location
    if (liveWalkLocations[bookingId]) {
      delete liveWalkLocations[bookingId];
    }
    // ✅ MARK BOOKING AS COMPLETED
    await Booking.findByIdAndUpdate(bookingId, {
      status: "completed",
      completedAt: new Date(),
    });
    // stop map for owner
    io.to(bookingId).emit("walk-ended");

    // 🔔 push notification
    io.to(bookingId).emit("notify-owner", {
      type: "walk-ended",
      message: "🏁 Your pet’s walk has ended!",
    });
  });

  /* =====================
     DISCONNECT
  ===================== */
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
      console.log(`✓ Server + Socket.IO running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("✗ MongoDB connection failed:", err.message);
  });