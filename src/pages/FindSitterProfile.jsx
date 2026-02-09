import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import API_BASE_URL from "../config/api";
export default function FindSitterProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [sitter, setSitter] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingCount, setBookingCount] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const s = await fetch(`${API_BASE_URL}/api/sitters/${id}`);
        const sitterData = await s.json();

        const r = await fetch(`${API_BASE_URL}/api/reviews?sitterId=${id}`);
        const reviewData = await r.json();

        const b = await fetch(
          `${API_BASE_URL}/api/bookings?sitterId=${id}`
        );
        const bookingData = await b.json();

        setSitter(sitterData);
        setReviews(Array.isArray(reviewData) ? reviewData : []);
        setBookingCount(
          Array.isArray(bookingData)
            ? bookingData.filter((x) => x.status === "confirmed").length
            : 0
        );
      } catch (err) {
        console.error("Failed to load sitter profile:", err);
        setSitter(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (loading) return <div className="pt-24 px-6">Loading...</div>;
  if (!sitter) return <div className="pt-24 px-6">Sitter not found.</div>;

  const avg =
    reviews.length > 0
      ? (
          reviews.reduce((a, c) => a + c.rating, 0) / reviews.length
        ).toFixed(1)
      : null;

  return (
    <div className="pt-24 px-6 max-w-3xl mx-auto">
      <div className="flex gap-6 items-start">
        <img
          src={sitter.photo || "https://via.placeholder.com/120"}
          alt={sitter.name}
          className="w-28 h-28 rounded-full object-cover border"
        />

        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            {sitter.name}
            {sitter.verified && (
              <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                Verified
              </span>
            )}
          </h1>

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

          <p className="mt-1 text-sm">Total bookings: {bookingCount}</p>
        </div>
      </div>

      <div className="mt-6 p-4 border rounded-xl">
        <p>
          <b>Services:</b> {(sitter.services || []).join(", ")}
        </p>
        <p className="mt-1">
          <b>Price:</b> {sitter.price}
        </p>
      </div>

      {sitter.bio && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold">About</h2>
          <p className="mt-2 text-gray-700">{sitter.bio}</p>
        </div>
      )}

      <button
        onClick={() =>
          navigate("/find", {
            state: location.state || {},
          })
        }
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
              <p className="text-sm font-medium">
                {r.ownerId?.name || "Pet Owner"}
              </p>
              <p className="text-sm">⭐ {r.rating}</p>
              <p className="text-sm text-gray-700 mt-1">{r.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
