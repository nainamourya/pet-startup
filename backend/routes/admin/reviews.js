import express from "express";
import Review from "../../models/Review.js";
import { requireAdmin } from "../../middleware/requireAdmin.js";

const router = express.Router();

router.get("/", requireAdmin, async (req, res) => {
  const reviews = await Review.find()
    .populate("ownerId", "name email")
    .populate("sitterId", "name");
  res.json(reviews);
});

router.patch("/:id/toggle", requireAdmin, async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return res.status(404).json({ message: "Review not found" });
  }

  review.isHidden = !review.isHidden;
  await review.save();

  res.json(review);
});

export default router;
