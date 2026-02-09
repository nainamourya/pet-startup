import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import API_BASE_URL from "../config/api";

export default function LeaveReview() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { sitterId, sitterName } = location.state || {};

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);


  const handleSubmit = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;
  
    setLoading(true);
  
    await fetch(`${API_BASE_URL}/api/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bookingId,
        sitterId,
        ownerId: user.id,
        rating,
        comment,
      }),
    });
  
    alert(
      `Thank you, ${user.name}! 🌟\n\nYour review for ${sitterName} has been submitted successfully.`
    );
  
    navigate("/my-bookings");
  };

  return (
    <div className="pt-24 px-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold">Leave a Review</h1>

      <div className="mt-6">
        <label className="block text-sm font-medium">Rating</label>
        <select
          className="mt-1 w-full border p-3 rounded-lg"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        >
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>
              {r} Star{r > 1 ? "s" : ""}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium">Comment</label>
        <textarea
          className="mt-1 w-full border p-3 rounded-lg"
          rows="4"
          placeholder="Share your experience..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-6 w-full px-6 py-3 rounded-full bg-black text-white hover:bg-gray-800"
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </div>
  );
}
