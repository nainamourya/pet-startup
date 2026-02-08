import { useEffect, useState } from "react";
import { getReviews, toggleReview } from "../services/adminApi";

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);

  const loadReviews = async () => {
    const res = await getReviews();
    setReviews(res.data);
  };

  const toggle = async (id) => {
    await toggleReview(id);
    loadReviews();
  };

  useEffect(() => {
    loadReviews();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Reviews</h2>

      {reviews.map((r) => (
        <div
          key={r._id}
          style={{
            border: "1px solid #ccc",
            padding: 12,
            marginBottom: 10,
          }}
        >
          <p><b>Sitter:</b> {r.sitterId?.name}</p>
          <p><b>User:</b> {r.ownerId?.name}</p>
          <p><b>Rating:</b> ⭐ {r.rating}</p>
          <p>{r.comment}</p>

          <p>Status: {r.isHidden ? "Hidden" : "Visible"}</p>

          <button
            onClick={() => toggle(r._id)}
            style={{
              background: r.isHidden ? "green" : "red",
              color: "white",
              border: "none",
              padding: "6px 12px",
            }}
          >
            {r.isHidden ? "Unhide" : "Hide"}
          </button>
        </div>
      ))}
    </div>
  );
}
