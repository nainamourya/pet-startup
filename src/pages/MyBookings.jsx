import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

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
  }, [location.pathname]); // re-run when you navigate back

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
              <p className="text-sm mt-1">Status: {b.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
