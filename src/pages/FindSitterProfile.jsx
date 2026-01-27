import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";


export default function FindSitterProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [sitter, setSitter] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const load = async () => {
      const s = await fetch(`http://localhost:5000/api/sitters?id=${id}`);
      const sitterData = await s.json();

      const r = await fetch(`http://localhost:5000/api/reviews?sitterId=${id}`);
      const reviewData = await r.json();

      setSitter(sitterData[0]);
      setReviews(reviewData);
    };

    load();
  }, [id]);

  if (!sitter) {
    return <div className="pt-24 px-6">Loading...</div>;
  }

  const avg =
    reviews.length > 0
      ? (
          reviews.reduce((a, c) => a + c.rating, 0) / reviews.length
        ).toFixed(1)
      : null;

  return (
    <div className="pt-24 px-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold">{sitter.name}</h1>
      <p className="text-gray-600 mt-1">
        {sitter.city} • {sitter.experience}
      </p>

      {avg ? (
        <p className="mt-2 text-sm text-gray-700">
          ⭐ {avg} ({reviews.length} reviews)
        </p>
      ) : (
        <p className="mt-2 text-sm text-gray-400">No reviews yet</p>
      )}

      <div className="mt-6 p-4 border rounded-xl">
        <p><b>Services:</b> {sitter.services.join(", ")}</p>
        <p className="mt-1"><b>Price:</b> {sitter.price}</p>
      </div>

      <button
        onClick={() => navigate("/find")}
        className="mt-6 px-6 py-2 rounded-full bg-black text-white"
      >
        Back to Search
      </button>

      <h2 className="text-xl font-semibold mt-10">Reviews</h2>

      <div className="mt-4 space-y-3">
        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet.</p>
        ) : (
          reviews.map((r) => (
            <div key={r._id} className="p-3 border rounded-lg">
              <p className="text-sm">⭐ {r.rating}</p>
              <p className="text-sm text-gray-700 mt-1">{r.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
