import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function SitterDashboard() {
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [weeklyEarnings, setWeeklyEarnings] = useState([]);
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

    const lastSeen = localStorage.getItem("lastSeenBookingsAt");
    const lastSeenTime = lastSeen ? new Date(lastSeen) : new Date(0);
    const fresh = bookingsData.filter(
      (b) => b.status === "pending" && new Date(b.createdAt) > lastSeenTime
    );
    setNewCount(fresh.length);

    const reviewsRes = await fetch(
      `http://localhost:5000/api/reviews?sitterId=${user.sitterProfile}`
    );
    setReviews(await reviewsRes.json());

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

  /* =========================
     WEEKLY EARNINGS LOGIC
  ========================= */
  useEffect(() => {
    if (!bookings.length || !profile?.price) return;

    const today = new Date();
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(today.getDate() - i);
      return d.toDateString();
    }).reverse();

    const earningsMap = {};
    last7Days.forEach((d) => (earningsMap[d] = 0));

    bookings.forEach((b) => {
      if (b.status === "confirmed") {
        const day = new Date(b.createdAt).toDateString();
        if (earningsMap[day] !== undefined) {
          earningsMap[day] += Number(profile.price || 0);
        }
      }
    });

    setWeeklyEarnings(
      last7Days.map((d) => ({
        day: d.split(" ").slice(0, 3).join(" "),
        amount: earningsMap[d],
      }))
    );
  }, [bookings, profile]);

  /* =========================
     UPDATE BOOKING STATUS
  ========================= */
  const updateStatus = async (id, status) => {
    await fetch(`http://localhost:5000/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    setBookings((prev) =>
      prev.map((b) => (b._id === id ? { ...b, status } : b))
    );

    localStorage.setItem("lastSeenBookingsAt", new Date().toISOString());
    setNewCount(0);
  };

  /* =========================
     AVAILABILITY
  ========================= */
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

  /* =========================
     INCOME CALCULATIONS
  ========================= */
  const confirmedCount = bookings.filter(
    (b) => b.status === "confirmed"
  ).length;

  const today = new Date();

  const todayIncome =
    bookings.filter(
      (b) =>
        b.status === "confirmed" &&
        new Date(b.createdAt).toDateString() === today.toDateString()
    ).length * Number(profile?.price || 0);

  const monthlyIncome =
    bookings.filter((b) => {
      const d = new Date(b.createdAt);
      return (
        b.status === "confirmed" &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear()
      );
    }).length * Number(profile?.price || 0);
  return (
    <div className="pt-24 px-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold">Sitter Dashboard</h1>

      {newCount > 0 && (
        <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-sm">
          🔔 You have {newCount} new booking request{newCount > 1 ? "s" : ""}
        </div>
      )}

      {error && <p className="mt-4 text-red-500">{error}</p>}

      {/* Stats */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
  <div className="p-4 rounded-xl border bg-gray-50">
    <p className="text-sm text-gray-600">Confirmed Bookings</p>
    <p className="text-2xl font-bold">{confirmedCount}</p>
  </div>

  <div className="p-4 rounded-xl border bg-green-50">
    <p className="text-sm text-gray-600">Today's Income</p>
    <p className="text-2xl font-bold text-green-700">
      ₹{todayIncome}
    </p>
  </div>

  <div className="p-4 rounded-xl border bg-blue-50">
    <p className="text-sm text-gray-600">This Month</p>
    <p className="text-2xl font-bold text-blue-700">
      ₹{monthlyIncome}
    </p>
  </div>
</div>


      {/* ================= EARNINGS CHART ================= */}
      <div className="mt-10 p-5 border rounded-xl bg-white">
        <h2 className="text-xl font-semibold mb-4">
          Earnings (Last 7 Days)
        </h2>

        <div className="flex items-end gap-3 h-40">
          {weeklyEarnings.map((e, i) => (
            <div key={i} className="flex-1 text-center">
              <div
                className="bg-green-500 rounded-t"
                style={{ height: `${Math.max(e.amount / 10, 5)}px` }}
              />
              <p className="text-xs mt-2 text-gray-600">{e.day}</p>
              <p className="text-xs font-medium">₹{e.amount}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ================= PROFILE ================
{/* =====================
    SITTER PROFILE
===================== */}
{profile && (
  <div className="mt-10 p-5 border rounded-xl bg-white">
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
          value={profile.name || ""}
          onChange={(e) =>
            setProfile({ ...profile, name: e.target.value })
          }
        />

        <input
          className="w-full border p-2 rounded"
          value={profile.city || ""}
          onChange={(e) =>
            setProfile({ ...profile, city: e.target.value })
          }
        />

        <input
          className="w-full border p-2 rounded"
          value={profile.experience || ""}
          onChange={(e) =>
            setProfile({ ...profile, experience: e.target.value })
          }
        />

        <input
          className="w-full border p-2 rounded"
          value={profile.price || ""}
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
      <div className="mt-4 text-sm text-gray-700 space-y-1">
        <p><b>Name:</b> {profile.name}</p>
        <p><b>City:</b> {profile.city}</p>
        <p><b>Experience:</b> {profile.experience}</p>
        <p><b>Price:</b> ₹{profile.price}</p>
      </div>
    )}
  </div>
)}

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

              {/* Pet */}
              {b.pet && (
                <div className="mt-2 text-sm text-gray-700">
                  <p>
                    <b>Pet:</b> {b.pet.name} ({b.pet.type}, {b.pet.age} yrs)
                  </p>
                  {b.pet.notes && (
                    <p className="text-xs text-gray-500">
                      Notes: {b.pet.notes}
                    </p>
                  )}
                </div>
              )}

              {/* ✅ BOARDING DETAILS ADDED */}
              {b.boarding && (
                <div className="mt-3 text-sm text-gray-700 space-y-1">
                  <p>
                    <b>Boarding:</b>{" "}
                    {b.boarding.startDate} → {b.boarding.endDate}
                  </p>

                  {b.boarding.vetNumber && (
                    <p>
                      <b>Vet Contact:</b> {b.boarding.vetNumber}
                    </p>
                  )}

                  {b.boarding.medicine && (
                    <p>
                      <b>Medicine:</b> {b.boarding.medicine}
                    </p>
                  )}

                  {b.boarding.emergencyNotes && (
                    <p className="text-xs text-gray-500">
                      <b>Emergency Notes:</b>{" "}
                      {b.boarding.emergencyNotes}
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
