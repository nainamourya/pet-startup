import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function SitterDashboard() {
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const location = useLocation();

  const [availableDates, setAvailableDates] = useState([]);
  const [newDate, setNewDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [newCount, setNewCount] = useState(0);
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);

  const load = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.sitterProfile) {
      setError("This account is not linked to a sitter profile.");
      setLoading(false);
      return;
    }

    const profileRes = await fetch(
      `http://localhost:5000/api/sitters/${user.sitterProfile}`
    );
    const profileData = await profileRes.json();
    setProfile(profileData);

    const bookingsRes = await fetch(
      `http://localhost:5000/api/bookings?sitterId=${user.sitterProfile}`
    );
    const bookingsData = await bookingsRes.json();
    setBookings(bookingsData);
    
    // 🔔 New booking detection
    const lastSeen = localStorage.getItem("lastSeenBookingsAt");
    const lastSeenTime = lastSeen ? new Date(lastSeen) : new Date(0);
    
    const fresh = bookingsData.filter(
      (b) =>
        b.status === "pending" &&
        new Date(b.createdAt) > lastSeenTime
    );
    
    setNewCount(fresh.length);

    const reviewsRes = await fetch(
      `http://localhost:5000/api/reviews?sitterId=${user.sitterProfile}`
    );
    const reviewsData = await reviewsRes.json();
    setReviews(reviewsData);

    const availRes = await fetch(
      `http://localhost:5000/api/sitters/${user.sitterProfile}/availability`
    );
    const availData = await availRes.json();
    setAvailableDates(availData.availableDates || []);

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
      prev.map((b) => (b._id === id ? { ...b, status } : b))
    );
  
    // 🔕 Mark bookings as seen after action
    localStorage.setItem("lastSeenBookingsAt", new Date().toISOString());
    setNewCount(0);
  };

  const saveAvailability = async (dates) => {
    const user = JSON.parse(localStorage.getItem("user"));
    setSaving(true);

    await fetch(
      `http://localhost:5000/api/sitters/${user.sitterProfile}/availability`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dates }),
      }
    );

    setAvailableDates(dates);
    setSaving(false);
  };

  if (loading) return <div className="pt-24 px-6">Loading...</div>;

  const confirmedCount = bookings.filter(
    (b) => b.status === "confirmed"
  ).length;

  return (
    
    <div className="pt-24 px-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold">Sitter Dashboard</h1>
      {newCount > 0 && (
  <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-sm">
    🔔 You have {newCount} new booking request
    {newCount > 1 ? "s" : ""}
  </div>
)}
      {error && <p className="mt-4 text-red-500">{error}</p>}

      {/* Stats */}
      <div className="mt-6 p-4 rounded-xl border bg-gray-50">
        <p className="text-sm text-gray-600">Confirmed Bookings</p>
        <p className="text-2xl font-bold">{confirmedCount}</p>
      </div>

      {/* Profile */}
      {profile && (
        <div className="mt-8 p-5 border rounded-xl">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Your Profile</h2>
            <button
              onClick={() => setEditing(!editing)}
              className="text-sm text-blue-600 underline"
            >
              {editing ? "Cancel" : "Edit"}
            </button>
          </div>

          {editing ? (
            <div className="mt-4 space-y-3">
              <input
                className="w-full border p-2 rounded"
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
              />
              <input
                className="w-full border p-2 rounded"
                value={profile.city}
                onChange={(e) =>
                  setProfile({ ...profile, city: e.target.value })
                }
              />
              <input
                className="w-full border p-2 rounded"
                value={profile.experience}
                onChange={(e) =>
                  setProfile({ ...profile, experience: e.target.value })
                }
              />
              <input
                className="w-full border p-2 rounded"
                value={profile.price}
                onChange={(e) =>
                  setProfile({ ...profile, price: e.target.value })
                }
              />

              <button
                onClick={async () => {
                  await fetch(
                    `http://localhost:5000/api/sitters/${profile._id}`,
                    {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(profile),
                    }
                  );
                  setEditing(false);
                  alert("Profile updated");
                }}
                className="px-4 py-2 rounded bg-black text-white text-sm"
              >
                Save Changes
              </button>
            </div>
          ) : (
            <div className="mt-3 text-sm text-gray-700">
              <p><b>Name:</b> {profile.name}</p>
              <p><b>City:</b> {profile.city}</p>
              <p><b>Experience:</b> {profile.experience}</p>
              <p><b>Price:</b> {profile.price}</p>
            </div>
          )}
        </div>
      )}

      {/* Availability */}
      <div className="mt-10 p-5 border rounded-xl">
        <h2 className="text-xl font-semibold">Your Availability</h2>

        <div className="mt-3 flex gap-3 items-center">
          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className="border p-2 rounded"
          />

          <button
            onClick={() => {
              if (!newDate || availableDates.includes(newDate)) return;
              const updated = [...availableDates, newDate];
              saveAvailability(updated);
              setNewDate("");
            }}
            className="px-4 py-2 rounded bg-black text-white text-sm"
          >
            Add Date
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {availableDates.map((d) => (
            <span
              key={d}
              className="px-3 py-1 rounded-full text-xs bg-gray-200 flex items-center gap-2"
            >
              {d}
              <button
                onClick={() =>
                  saveAvailability(availableDates.filter((x) => x !== d))
                }
                className="text-red-500"
              >
                ×
              </button>
            </span>
          ))}
        </div>

        {saving && <p className="text-sm text-gray-500 mt-2">Saving…</p>}
      </div>

      {/* Bookings */}
      <h2 className="text-xl font-semibold mt-10">Bookings</h2>

      {bookings.length === 0 ? (
        <p className="mt-4 text-gray-500">No bookings yet.</p>
      ) : (
        <div className="mt-6 grid gap-4">
          {bookings.map((b) => (
            <div key={b._id} className="p-5 rounded-xl border">
              <h3 className="font-semibold">
                {b.ownerId?.name || "Pet Owner"}
              </h3>

              <p className="text-sm text-gray-600">
  {b.service} •{" "}
  {b.walk
    ? `${b.walk.date} (${b.walk.from}:00 – ${b.walk.to}:00)`
    : b.date}
</p>
{b.pet?.name && (
  <div className="mt-2 text-sm text-gray-700">
    <p>
      <b>Pet:</b> {b.pet.name} ({b.pet.type},{" "}
      {b.pet.age ? `${b.pet.age} yrs` : "age not specified"})
    </p>
    {b.pet.notes && (
      <p className="text-xs text-gray-500 mt-1">
        Notes: {b.pet.notes}
      </p>
    )}
  </div>
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
                  <button
                    onClick={() => updateStatus(b._id, "confirmed")}
                    className="px-4 py-2 rounded-full bg-green-600 text-white text-sm"
                  >
                    Accept
                  </button>

                  <button
                    onClick={() => updateStatus(b._id, "rejected")}
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

      {/* Reviews */}
      <h2 className="text-xl font-semibold mt-12">Your Reviews</h2>

      {reviews.length === 0 ? (
        <p className="mt-4 text-gray-500">No reviews yet.</p>
      ) : (
        <div className="mt-4 space-y-3">
          {reviews.map((r) => (
            <div key={r._id} className="p-4 border rounded-lg">
              <p className="text-sm">⭐ {r.rating}</p>
              <p className="text-sm text-gray-700 mt-1">
                “{r.comment}”
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
