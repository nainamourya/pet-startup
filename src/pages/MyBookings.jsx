import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

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

  useEffect(() => {
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
  {b.service} •{" "}
  {b.walk
    ? `${b.walk.date} (${b.walk.from}:00 - ${b.walk.to}:00)`
    : b.date}
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
    <p className="text-sm text-gray-700 mt-2">
      <span className="font-medium">Pet Name:</span> {b.pet.name}
    </p>
    <p className="text-sm text-gray-600">
      <span className="font-medium">Type:</span> {b.pet.type} •{" "}
      <span className="font-medium">Age:</span> {b.pet.age}
    </p>

    {b.pet.notes && (
      <p className="text-xs text-gray-500 mt-1">
        <span className="font-medium">Notes:</span> {b.pet.notes}
      </p>
    )}
  </>
) : (
  <p className="text-xs text-gray-400 mt-2">
    Pet details not provided
  </p>
)}
{b.reviewed ? (
  <p className="mt-3 text-sm text-green-600">
    Review submitted ✔️
  </p>
) : (
  <button
    onClick={() =>
      navigate(`/review/${b._id}`, {
        state: {
          sitterId: b.sitterId._id,
          sitterName: b.sitterId.name,
        },
      })
    }
    className="mt-3 text-sm text-blue-600 underline"
  >
    Leave Review
  </button>
)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
