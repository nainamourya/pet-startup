import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const requireAuth = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization required" });
    }

    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "petsitter_secret");

    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "Invalid token user" });

    // attach full user to request
    req.user = {
      id: user._id.toString(),
      role: user.role,
      sitterProfile: user.sitterProfile ? user.sitterProfile.toString() : null,
    };

    next();
  } catch (err) {
    console.error("Auth middleware error:", err.message);
    return res.status(401).json({ message: "Authentication failed" });
  }
};

export default requireAuth;
