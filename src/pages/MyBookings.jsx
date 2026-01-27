import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const [reviewingId, setReviewingId] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const load = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) return;

      setLoading(true);

      const res = await fetch(
        `http://localhost:5000/api/bookings?ownerId=${user.id}`
      );
      const data = await res.json();
      setBookings(data);
      setLoading(false);
    };

    load();
  }, [location.pathname]);

  if (loading) {
    return <div className="pt-24 px-6">Loading bookings...</div>;
  }

  return (
    <div className="pt-24 px-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold">My Bookings</h1>

      {bookings.length === 0 ? (
        <p className="mt-4 text-gray-600">No bookings yet.</p>
      ) : (
        <div className="mt-8 grid gap-4">
          {bookings.map((b) => (
            <div key={b._id} className="p-4 rounded-xl border">
              <h3 className="font-semibold">
                {b.sitterId?.name || "Sitter"}
              </h3>

              <p className="text-sm text-gray-600">
                {b.service} • {b.date}
              </p>

              <span
                className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                  b.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : b.status === "confirmed"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {b.status}
              </span>

              {b.pet?.name ? (
                <>
                  <p className="text-sm text-gray-600 mt-2">
                    Pet: {b.pet.name} ({b.pet.type}, {b.pet.age})
                  </p>
                  {b.pet.notes && (
                    <p className="text-xs text-gray-500 mt-1">
                      Notes: {b.pet.notes}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-xs text-gray-400 mt-2">
                  Pet details not provided
                </p>
              )}

              {/* Review Section */}
              {b.status === "confirmed" && (
                <div className="mt-4">
                  {reviewingId === b._id ? (
                    <div className="space-y-2">
                      <select
                        className="border p-2 rounded w-full"
                        value={rating}
                        onChange={(e) =>
                          setRating(Number(e.target.value))
                        }
                      >
                        {[5, 4, 3, 2, 1].map((r) => (
                          <option key={r} value={r}>
                            {r} Stars
                          </option>
                        ))}
                      </select>

                      <textarea
                        placeholder="Write your experience..."
                        className="w-full border p-2 rounded"
                        value={comment}
                        onChange={(e) =>
                          setComment(e.target.value)
                        }
                      />

                      <button
                        onClick={async () => {
                          const user = JSON.parse(
                            localStorage.getItem("user")
                          );

                          await fetch(
                            "http://localhost:5000/api/reviews",
                            {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                              },
                              body: JSON.stringify({
                                bookingId: b._id,
                                sitterId: b.sitterId._id,
                                ownerId: user.id,
                                rating,
                                comment,
                              }),
                            }
                          );

                          setReviewingId(null);
                          setComment("");
                          alert("Review submitted!");
                        }}
                        className="px-4 py-2 rounded bg-black text-white text-sm"
                      >
                        Submit Review
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setReviewingId(b._id)}
                      className="mt-3 text-sm text-blue-600 underline"
                    >
                      Leave Review
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
