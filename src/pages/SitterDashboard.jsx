import { useEffect, useState,useRef  } from "react";
import { useLocation } from "react-router-dom";
import { socket } from "../socket";
import toast from "react-hot-toast";
export default function SitterDashboard() {
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [weeklyEarnings, setWeeklyEarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const location = useLocation();
  const watchIdRef = useRef(null);
  const brand = "#ff9b7a";
  const [availableDates, setAvailableDates] = useState([]);
  // const [newDate, setNewDate] = useState("");
  // const [saving, setSaving] = useState(false);
  const [newCount, setNewCount] = useState(0);

  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  /* =========================
  START WALK FUNCTION ✅
========================= */
const startWalk = (bookingId) => {
  console.log("🚶 Walk started for booking:", bookingId);
  localStorage.setItem("activeWalkId", bookingId);
  socket.emit("join-walk", { bookingId });
  // 🔔 NOTIFY OWNER
  socket.emit("walk-started", { bookingId });
  if (watchIdRef.current) return;

  watchIdRef.current = navigator.geolocation.watchPosition(
    (pos) => {
      console.log("📍 Location:", pos.coords.latitude, pos.coords.longitude);

      socket.emit("send-location", {
        bookingId,
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      });
    },
    (err) => console.error("❌ GPS error", err),
    { enableHighAccuracy: true }
  );
};

const endWalk = (bookingId) => {
  if (watchIdRef.current) {
    navigator.geolocation.clearWatch(watchIdRef.current);
    watchIdRef.current = null;
  }

  socket.emit("end-walk", { bookingId });

  localStorage.removeItem("activeWalkId");

  toast.success("Walk ended successfully 🏁");
};
/* =========================
   RESUME WALK AFTER REFRESH 🔁
========================= */
useEffect(() => {
  const activeWalkId = localStorage.getItem("activeWalkId");

  if (!activeWalkId) return;
  if (watchIdRef.current) return;

  console.log("🔁 Resuming active walk:", activeWalkId);

  socket.emit("join-walk", { bookingId: activeWalkId });

  watchIdRef.current = navigator.geolocation.watchPosition(
    (pos) => {
      socket.emit("send-location", {
        bookingId: activeWalkId,
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      });
    },
    (err) => console.error("❌ GPS error", err),
    { enableHighAccuracy: true }
  );
}, []);
useEffect(() => {
  socket.on("walk-ended", () => {
    console.log("🛑 Walk ended (sitter side)");

    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    localStorage.removeItem("activeWalkId");
  });

  return () => {
    socket.off("walk-ended");
  };
}, []);
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


  useEffect(() => {
    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, []);
  /* =========================
     WEEKLY EARNINGS LOGIC
  ========================= */
  useEffect(() => {
    if (!bookings.length) return;
  
    const today = new Date();
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(today.getDate() - i);
      return d.toDateString();
    }).reverse();
  
    const earningsMap = {};
    last7Days.forEach((d) => (earningsMap[d] = 0));
  
    bookings.forEach((b) => {
      if (b.payment?.paid) {
        const day = new Date(b.payment.paidAt).toDateString();
        if (earningsMap[day] !== undefined) {
          earningsMap[day] += b.payment.amount || 0;
        }
      }
    });
  
    setWeeklyEarnings(
      last7Days.map((d) => ({
        day: d.split(" ").slice(0, 3).join(" "),
        amount: earningsMap[d],
      }))
    );
  }, [bookings]);
  

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
  // const saveAvailability = async (dates) => {
  //   const user = JSON.parse(localStorage.getItem("user"));
  //   setSaving(true);
  //
  //   const token = localStorage.getItem("token");
  //   const headers = { "Content-Type": "application/json" };
  //   if (token) headers.Authorization = `Bearer ${token}`;
  //
  //   await fetch(
  //     `http://localhost:5000/api/sitters/${user.sitterProfile}/availability`,
  //     {
  //       method: "PATCH",
  //       headers,
  //       body: JSON.stringify({ dates }),
  //     }
  //   );
  //
  //   setAvailableDates(dates);
  //   setSaving(false);
  // };

  if (loading) return <div className="pt-24 px-6">Loading...</div>;

  /* =========================
     INCOME CALCULATIONS
  ========================= */
  const paidBookings = bookings.filter((b) => b.payment?.paid);

const confirmedCount = paidBookings.length;

  const today = new Date();

  const todayIncome = paidBookings
  .filter(
    (b) =>
      new Date(b.payment.paidAt).toDateString() ===
      today.toDateString()
  )
  .reduce((sum, b) => sum + (b.payment.amount || 0), 0);
  const monthlyIncome = paidBookings
  .filter((b) => {
    const d = new Date(b.payment.paidAt);
    return (
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  })
  .reduce((sum, b) => sum + (b.payment.amount || 0), 0);

  // let watchId = null;

  

    // let watchId = navigator.geolocation.watchPosition(
    //   (pos) => {
    //     socket.emit("send-location", {
    //       bookingId,
    //       lat: pos.coords.latitude,
    //       lng: pos.coords.longitude,
    //     });
    //   },
    //   (err) => console.error(err),
    //   { enableHighAccuracy: true }
    // );
  
  return (
    <div className="pt-24 px-6 max-w-4xl mx-auto">
     <div className="flex items-center gap-3">
  <svg
    className="w-8 h-8 animate-pulse"
    fill="none"
    stroke={brand}
    strokeWidth="1.8"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
  </svg>

  <h1 className="text-3xl font-bold tracking-tight">
    Sitter Dashboard
  </h1>
</div>
<p className="text-sm text-gray-500 mt-1">
  Manage bookings, earnings & profile
</p>

      {newCount > 0 && (
        <div className="mt-5 p-4 rounded-xl border flex items-center gap-3 animate-slide-in"
        style={{ backgroundColor: "#fff5f2", borderColor: brand }}>
          <svg className="w-5 h-5 animate-bounce" fill={brand} viewBox="0 0 24 24">
  <path d="M12 22a2 2 0 01-2-2h4a2 2 0 01-2 2zm6-6V11a6 6 0 10-12 0v5l-2 2h16l-2-2z" />
</svg>
<span className="text-sm font-medium text-gray-800">
  You have {newCount} new booking request{newCount > 1 ? "s" : ""}
</span>
        </div>
      )}

      {error && <p className="mt-4 text-red-500">{error}</p>}

      {/* Stats */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="p-5 rounded-2xl border bg-white shadow-sm hover:shadow-md transition">
  <p className="text-xs uppercase tracking-wide text-gray-400">
    Confirmed Bookings
  </p>
  <p className="text-3xl font-bold mt-2">{confirmedCount}</p>
</div>

<div
  className="p-5 rounded-2xl border shadow-sm hover:shadow-md transition"
  style={{ backgroundColor: "#fff5f2" }}
>
  <p className="text-xs uppercase tracking-wide text-gray-400">
    Today’s Income
  </p>
  <p className="text-3xl font-bold mt-2" style={{ color: brand }}>
    ₹{todayIncome}
  </p>
</div>

<div className="p-5 rounded-2xl border bg-white shadow-sm hover:shadow-md transition">
  <p className="text-xs uppercase tracking-wide text-gray-400">
    This Month
  </p>
  <p className="text-3xl font-bold mt-2 text-gray-900">
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
  className="rounded-t transition-all duration-700 ease-out"
  style={{
    height: `${Math.max(e.amount / 10, 6)}px`,
    background: `linear-gradient(180deg, ${brand}, #ffb199)`
  }}
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
 <div className="mt-10 p-6 rounded-2xl border bg-white shadow-sm">
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-semibold">Your Profile</h2>
      <button
  onClick={() => setEditing(!editing)}
  className="text-sm font-medium hover:opacity-80"
  style={{ color: brand }}
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
            const token = localStorage.getItem("token");
            const headers = { "Content-Type": "application/json" };
            if (token) headers.Authorization = `Bearer ${token}`;

            await fetch(
              `http://localhost:5000/api/sitters/${profile._id}`,
              {
                method: "PATCH",
                headers,
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
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Name */}
      <div className="p-4 rounded-xl border bg-gray-50 flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "#fff5f2" }}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="#ff9b7a"
            strokeWidth="1.8"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A9 9 0 1118.9 6.1M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
    
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-400">
            Name
          </p>
          <p className="font-semibold text-gray-900">
            {profile.name}
          </p>
        </div>
      </div>
    
      {/* City */}
      <div className="p-4 rounded-xl border bg-gray-50 flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "#fff5f2" }}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="#ff9b7a"
            strokeWidth="1.8"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5 9 6.343 9 8s1.343 3 3 3z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4.5 8-10a8 8 0 10-16 0c0 5.5 8 10 8 10z" />
          </svg>
        </div>
    
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-400">
            City
          </p>
          <p className="font-semibold text-gray-900">
            {profile.city}
          </p>
        </div>
      </div>
    
      {/* Experience */}
      <div className="p-4 rounded-xl border bg-gray-50 flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "#fff5f2" }}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="#ff9b7a"
            strokeWidth="1.8"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
          </svg>
        </div>
    
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-400">
            Experience
          </p>
          <p className="font-semibold text-gray-900">
            {profile.experience}
          </p>
        </div>
      </div>
    
      {/* Price */}
      <div className="p-4 rounded-xl border bg-gray-50 flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "#fff5f2" }}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="#ff9b7a"
            strokeWidth="1.8"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-3 0-3 4 0 4s3 4 0 4m0-12v2m0 12v2" />
          </svg>
        </div>
    
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-400">
            Price
          </p>
          <p className="font-semibold text-gray-900">
            ₹{profile.price}
          </p>
        </div>
      </div>
    </div>
    
    )}
  </div>
)}
     
      <h2 className="text-xl font-semibold mt-10">Bookings</h2>

      {bookings.length === 0 ? (
        <p className="mt-4 text-gray-500">No bookings yet.</p>
      ) : (
        <div className="mt-8 grid gap-6">
          {bookings.map((b) => (
          <div
            key={b._id}
            className="p-6 rounded-2xl border bg-white shadow-sm hover:shadow-md transition"
          >
            {/* HEADER */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg text-gray-900">
                  {b.ownerId?.name || "Pet Owner"}
                </h3>
      
                <p className="text-sm text-gray-500 mt-0.5">
                  {b.service} •{" "}
                  {b.walk
                    ? `${b.walk.date} (${b.walk.from}:00 – ${b.walk.to}:00)`
                    : b.date}
                </p>
              </div>
      
              {/* STATUS */}
              <span
                className="px-4 py-1.5 rounded-full text-xs font-semibold capitalize"
                style={{
                  backgroundColor:
                    b.status === "pending"
                      ? "#fff7e6"
                      : b.status === "confirmed"
                      ? "#e8fff3"
                      : "#ffecec",
                  color:
                    b.status === "pending"
                      ? "#b45309"
                      : b.status === "confirmed"
                      ? "#047857"
                      : "#b91c1c",
                }}
              >
                {b.status}
              </span>
            </div>
      
            {/* DIVIDER */}
            <div className="my-4 h-px bg-gray-100" />
            <div className="mt-4">
  <div className="relative flex items-center justify-between">
    {/* Base line */}
    <div className="absolute left-0 right-0 top-1/2 h-[2px] bg-gray-200" />

    {/* Progress line */}
    <div
      className="absolute left-0 top-1/2 h-[2px] transition-all duration-700"
      style={{
        width: b.status === "pending" ? "33%" : "100%",
        backgroundColor: b.status === "rejected" ? "#ef4444" : brand,
      }}
    />

    {/* Step 1 */}
    <div className="relative z-10 flex flex-col items-center">
      <div
        className="w-3.5 h-3.5 rounded-full"
        style={{ backgroundColor: brand }}
      />
      <span className="text-[10px] mt-1 text-gray-500">
        Requested
      </span>
    </div>

    {/* Step 2 */}
    <div className="relative z-10 flex flex-col items-center">
      <div
        className="w-3.5 h-3.5 rounded-full transition-all duration-500"
        style={{
          backgroundColor:
            b.status === "pending"
              ? "#e5e7eb"
              : b.status === "confirmed"
              ? brand
              : "#ef4444",
        }}
      />
      <span className="text-[10px] mt-1 text-gray-500">
        Decision
      </span>
    </div>

    {/* Step 3 */}
    <div className="relative z-10 flex flex-col items-center">
      <div
        className="w-3.5 h-3.5 rounded-full transition-all duration-500"
        style={{
          backgroundColor:
      b.status === "pending"
        ? "#fff7e6"
        : b.status === "confirmed"
        ? "#e8fff3"
        : b.status === "completed"
        ? "#f0fdf4"
        : "#ffecec",
    color:
      b.status === "pending"
        ? "#b45309"
        : b.status === "confirmed"
        ? "#047857"
        : b.status === "completed"
        ? "#166534"
        : "#b91c1c",
        }}
      />
      <span className="text-[10px] mt-1 text-gray-500">
        Completed
      </span>
    </div>
  </div>

  <p className="mt-2 text-xs font-medium text-gray-600 text-center">
    {b.status === "pending" && "Waiting for your response"}
    {b.status === "confirmed" && "Booking confirmed 🎉"}
    {b.status === "completed" && "Service completed ✅"}
    {b.status === "rejected" && "Booking rejected"}
  </p>
</div>
            {/* PET INFO */}
            {b.pet && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="#ff9b7a"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">
                    <b>{b.pet.name}</b> ({b.pet.type}, {b.pet.age} yrs)
                  </span>
                </div>
      
                {b.pet.notes && (
                  <div className="text-xs text-gray-500 sm:col-span-2">
                    📝 {b.pet.notes}
                  </div>
                )}
              </div>
            )}
      
            {/* BOARDING DETAILS */}
            {b.boarding && (
              <div className="mt-4 p-4 rounded-xl bg-gray-50 text-sm space-y-1">
                <p className="font-medium text-gray-900">
                  🏠 Boarding Duration
                </p>
                <p>
                  {b.boarding.startDate} → {b.boarding.endDate}
                </p>
      
                {b.boarding.vetNumber && (
                  <p className="text-gray-600">
                    🩺 Vet: {b.boarding.vetNumber}
                  </p>
                )}
      
                {b.boarding.medicine && (
                  <p className="text-gray-600">
                    💊 Medicine: {b.boarding.medicine}
                  </p>
                )}
      
                {b.boarding.emergencyNotes && (
                  <p className="text-xs text-gray-500 mt-1">
                    ⚠️ {b.boarding.emergencyNotes}
                  </p>
                )}
              </div>
            )}
      
            {/* ACTIONS */}
            {b.status === "pending" && (
              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => updateStatus(b._id, "confirmed")}
                  className="px-5 py-2 rounded-full text-white text-sm font-medium hover:scale-105 transition"
                  style={{ backgroundColor: "#ff9b7a" }}
                >
                  Accept
                </button>
      
                <button
                  onClick={() => updateStatus(b._id, "rejected")}
                  className="px-5 py-2 rounded-full bg-gray-900 text-white text-sm font-medium hover:scale-105 transition"
                >
                  Reject
                </button>
              </div>
            )}

            {/* START WALK (only for paid walk bookings) */}
            {b.service === "Walk" &&
              b.status === "confirmed" &&
              b.payment?.paid && (
                <div className="mt-4">
                  <button
                    onClick={() => startWalk(b._id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-full text-sm hover:scale-105 transition"
                  >
                    🚶 Start Walk
                  </button>
                  <button
  onClick={() => endWalk(b._id)}
  className="ml-3 px-4 py-2 bg-red-600 text-white rounded-full text-sm"
>
  🛑 End Walk
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