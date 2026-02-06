import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Admin access confirmed ✅" });
});

export default router;