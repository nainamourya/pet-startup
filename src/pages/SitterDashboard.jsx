import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function SitterDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const location = useLocation();

  const load = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("Dashboard user:", user);

    if (!user || !user.sitterProfile) {
      setError("This account is not linked to a sitter profile.");
      setLoading(false);
      return;
    }

    setLoading(true);
    const url = `http://localhost:5000/api/bookings?sitterId=${user.sitterProfile}`;
    console.log("Fetching:", url);

    const res = await fetch(url);
    const data = await res.json();

    console.log("Dashboard bookings:", data);

    setBookings(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [location.pathname]);

  const updateStatus = async (id, status) => {
    await fetch(`http://localhost:5000/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  
    setBookings((prev) =>
      prev.map((b) =>
        b._id === id ? { ...b, status } : b
      )
    );
  };
  
  if (loading) {
    return <div className="pt-24 px-6">Loading...</div>;
  }

  return (
    <div className="pt-24 px-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold">Sitter Dashboard</h1>

      {error ? (
        <p className="mt-6 text-red-500">{error}</p>
      ) : bookings.length === 0 ? (
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

              {b.pet?.name ? (
                <p className="text-sm text-gray-600 mt-1">
                  Pet: {b.pet.name} ({b.pet.type}, {b.pet.age})
                </p>
              ) : (
                <p className="text-xs text-gray-400 mt-1">
                  Pet details not provided
                </p>
              )}

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

              {b.status === "pending" && (
                <div className="mt-3 flex gap-3">
                  <button onClick={() => updateStatus(b._id, "confirmed")}
                    className="px-4 py-2 rounded-full bg-green-600 text-white text-sm"
                  >
                    Accept
                  </button>

                  <button onClick={() => updateStatus(b._id, "rejected")}
                    className="px-4 py-2 rounded-full bg-red-500 text-white text-sm"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
