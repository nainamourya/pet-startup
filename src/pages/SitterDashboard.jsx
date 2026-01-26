import { useEffect, useState } from "react";

export default function SitterDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) return;

      const res = await fetch(
        `http://localhost:5000/api/bookings?sitterId=${user.id}`
      );
      const data = await res.json();
      setBookings(data);
      setLoading(false);
    };

    load();
  }, []);

  if (loading) {
    return <div className="pt-24 px-6">Loading...</div>;
  }

  return (
    <div className="pt-24 px-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold">Sitter Dashboard</h1>

      {bookings.length === 0 ? (
        <p className="mt-6 text-gray-500">No bookings yet.</p>
      ) : (
        <div className="mt-8 grid gap-4">
          {bookings.map((b) => (
            <div key={b._id} className="p-5 rounded-xl border">
              <h3 className="font-semibold">
                {b.ownerId?.name || "Pet Owner"}
              </h3>
              <p className="text-sm text-gray-600">
                {b.service} • {b.date}
              </p>
              <p className="text-sm mt-1">
                Status: <b>{b.status}</b>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
