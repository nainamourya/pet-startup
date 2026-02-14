import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { socket } from "../socket";
import toast from "react-hot-toast";
import API_BASE_URL from "../config/api";
import BankDetailsSection from "./Bankdetailssection.jsx";
import WithdrawalSection from "./Withdrawalsection.jsx";

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

  const [activeWalkId, setActiveWalkId] = useState(
    () => localStorage.getItem("activeWalkId")
  );
  const [newCount, setNewCount] = useState(0);

  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  
  /* =========================
  START WALK FUNCTION ✅
========================= */
const startWalk = (bookingId) => {
  console.log("🚶 Walk started for booking:", bookingId);
  localStorage.setItem("activeWalkId", bookingId);
  setActiveWalkId(bookingId);
  socket.emit("join-walk", { bookingId });
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
  setActiveWalkId(null);
  toast.success("Walk ended successfully 🏁");
};

// Add this handler function for bank details update
const handleBankDetailsUpdate = (updatedBankDetails) => {
  setProfile((prev) => ({
    ...prev,
    bankDetails: updatedBankDetails,
  }));
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
    setActiveWalkId(null);
  });

  return () => {
    socket.off("walk-ended");
  };
}, []);

  const load = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("📝 User from localStorage:", user);
    
    if (!user || !user.sitterProfile) {
      setError("This account is not linked to a sitter profile.");
      setLoading(false);
      return;
    }

    const profileRes = await fetch(
      `${API_BASE_URL}/api/sitters/${user.sitterProfile}`
    );
    const profileData = await profileRes.json();
    console.log("👤 Profile data fetched:", profileData);
    setProfile(profileData);
    
    const bookingsRes = await fetch(
      `${API_BASE_URL}/api/bookings?sitterId=${user.sitterProfile}`
    );
    const bookingsData = await bookingsRes.json();
    setBookings(bookingsData);

    const lastSeen = localStorage.getItem("lastSeenBookingsAt");
    const lastSeenTime = lastSeen ? new Date(lastSeen) : new Date(0);
    console.log(bookingsData);
    const fresh = bookingsData.filter(
      (b) => b.status === "pending" && new Date(b.createdAt) > lastSeenTime
    );
    setNewCount(fresh.length);

    const reviewsRes = await fetch(
      `${API_BASE_URL}/api/reviews?sitterId=${user.sitterProfile}`
    );
    setReviews(await reviewsRes.json());

    const availRes = await fetch(
      `${API_BASE_URL}/api/sitters/${user.sitterProfile}/availability`
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
    await fetch(`${API_BASE_URL}/api/bookings/${id}`, {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-200 border-t-orange-500 mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

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
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50">
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* HEADER SECTION */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-400 to-pink-400 shadow-lg">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>

              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                  Sitter Dashboard
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage your bookings, earnings & profile
                </p>
              </div>
            </div>

            {newCount > 0 && (
              <div className="mt-6 p-4 rounded-2xl border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-pink-50 flex items-center gap-3 shadow-sm animate-pulse">
                <div className="p-2 rounded-full bg-orange-500">
                  <svg className="w-5 h-5 text-white animate-bounce" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 22a2 2 0 01-2-2h4a2 2 0 01-2 2zm6-6V11a6 6 0 10-12 0v5l-2 2h16l-2-2z" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-gray-800">
                  🎉 You have {newCount} new booking request{newCount > 1 ? "s" : ""}
                </span>
              </div>
            )}

            {error && (
              <div className="mt-6 p-4 rounded-2xl bg-red-50 border-2 border-red-200">
                <p className="text-red-600 font-medium">{error}</p>
              </div>
            )}
          </div>

          {/* STATS CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Confirmed Bookings */}
            <div className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-blue-100">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">Bookings</span>
                </div>
                <p className="text-sm font-medium text-gray-500 mb-1">Confirmed Bookings</p>
                <p className="text-4xl font-bold text-gray-900">{confirmedCount}</p>
              </div>
            </div>

            {/* Today's Income */}
            <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-400 to-pink-400 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -mr-16 -mt-16 opacity-10"></div>
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-white bg-opacity-20 backdrop-blur-sm">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-white bg-white bg-opacity-20 px-3 py-1 rounded-full backdrop-blur-sm">Today</span>
                </div>
                <p className="text-sm font-medium text-white text-opacity-90 mb-1">Today's Income</p>
                <p className="text-4xl font-bold text-white">₹{todayIncome.toLocaleString()}</p>
              </div>
            </div>

            {/* Monthly Income */}
            <div className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-100 to-green-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-green-100">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full">This Month</span>
                </div>
                <p className="text-sm font-medium text-gray-500 mb-1">Monthly Earnings</p>
                <p className="text-4xl font-bold text-gray-900">₹{monthlyIncome.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* EARNINGS CHART */}
          <div className="mb-8 p-8 rounded-3xl bg-white border border-gray-100 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Earnings Overview</h2>
                <p className="text-sm text-gray-500 mt-1">Your earnings for the last 7 days</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-orange-100 to-pink-100">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>

            <div className="flex items-end gap-4 h-64 mt-8">
              {weeklyEarnings.map((e, i) => {
                const maxAmount = Math.max(...weeklyEarnings.map(w => w.amount), 100);
                const barHeight = e.amount > 0 ? Math.max((e.amount / maxAmount) * 240, 8) : 8;
                
                return (
                  <div key={i} className="flex-1 flex flex-col justify-end items-center group">
                    <div className="relative w-full flex flex-col items-center">
                      {/* Tooltip */}
                      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap z-10 pointer-events-none">
                        ₹{e.amount.toLocaleString()}
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                      </div>
                      
                      {/* Bar */}
                      <div 
                        className="w-full rounded-t-xl transition-all duration-700 ease-out group-hover:scale-105"
                        style={{
                          height: `${barHeight}px`,
                          background: `linear-gradient(180deg, ${brand}, #ffb199)`,
                          boxShadow: e.amount > 0 ? '0 4px 20px rgba(255, 155, 122, 0.3)' : 'none'
                        }}
                      />
                    </div>
                    
                    <div className="text-center mt-3">
                      <p className="text-xs font-medium text-gray-600">{e.day.split(' ').slice(1, 3).join(' ')}</p>
                      <p className="text-sm font-bold text-gray-900 mt-0.5">₹{e.amount}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* PROFILE SECTION */}
          {profile && (
            <div className="mb-8 p-8 rounded-3xl bg-white border border-gray-100 shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Your Profile</h2>
                  <p className="text-sm text-gray-500 mt-1">Manage your professional information</p>
                </div>
                <button
                  onClick={() => setEditing(!editing)}
                  className="px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-105"
                  style={{ 
                    backgroundColor: editing ? '#f3f4f6' : brand,
                    color: editing ? '#374151' : 'white'
                  }}
                >
                  {editing ? "Cancel" : "Edit Profile"}
                </button>
              </div>

              {editing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition"
                      value={profile.name || ""}
                      onChange={(e) =>
                        setProfile({ ...profile, name: e.target.value })
                      }
                      placeholder="Enter your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input
                      className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition"
                      value={profile.city || ""}
                      onChange={(e) =>
                        setProfile({ ...profile, city: e.target.value })
                      }
                      placeholder="Enter your city"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                    <input
                      className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition"
                      value={profile.experience || ""}
                      onChange={(e) =>
                        setProfile({ ...profile, experience: e.target.value })
                      }
                      placeholder="Years of experience"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price per Hour (₹)</label>
                    <input
                      className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition"
                      value={profile.price || ""}
                      onChange={(e) =>
                        setProfile({ ...profile, price: e.target.value })
                      }
                      placeholder="Enter your hourly rate"
                    />
                  </div>

                  <button
                    onClick={async () => {
                      const token = localStorage.getItem("token");
                      const headers = { "Content-Type": "application/json" };
                      if (token) headers.Authorization = `Bearer ${token}`;

                      await fetch(
                        `${API_BASE_URL}/api/sitters/${profile._id}`,
                        {
                          method: "PATCH",
                          headers,
                          body: JSON.stringify(profile),
                        }
                      );
                      setEditing(false);
                      toast.success("Profile updated successfully! 🎉");
                    }}
                    className="w-full px-6 py-3 rounded-xl font-semibold text-white transition-all duration-200 hover:scale-105 shadow-lg"
                    style={{ backgroundColor: brand }}
                  >
                    Save Changes
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-orange-50 to-pink-50 border border-orange-100">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-white shadow-sm">
                        <svg className="w-6 h-6" fill="none" stroke={brand} strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Name</p>
                        <p className="text-lg font-bold text-gray-900">{profile.name}</p>
                      </div>
                    </div>
                  </div>

                  {/* City */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-white shadow-sm">
                        <svg className="w-6 h-6" fill="none" stroke="#3b82f6" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">City</p>
                        <p className="text-lg font-bold text-gray-900">{profile.city}</p>
                      </div>
                    </div>
                  </div>

                  {/* Experience */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-white shadow-sm">
                        <svg className="w-6 h-6" fill="none" stroke="#a855f7" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Experience</p>
                        <p className="text-lg font-bold text-gray-900">{profile.experience}</p>
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-white shadow-sm">
                        <svg className="w-6 h-6" fill="none" stroke="#10b981" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Hourly Rate</p>
                        <p className="text-lg font-bold text-gray-900">₹{profile.price}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* BANK DETAILS */}
          <BankDetailsSection 
            profile={profile} 
            onUpdate={handleBankDetailsUpdate}
          />

          {/* WITHDRAWAL SECTION */}
          {profile && <WithdrawalSection profile={profile} />}

          {/* BOOKINGS SECTION */}
          <div className="mb-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Bookings</h2>
              <p className="text-sm text-gray-500 mt-1">Manage your current and upcoming bookings</p>
            </div>

            {bookings.length === 0 ? (
              <div className="p-12 rounded-3xl bg-white border border-gray-100 shadow-lg text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-orange-100 to-pink-100 mb-4">
                  <svg className="w-10 h-10 text-orange-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings yet</h3>
                <p className="text-gray-500">Your bookings will appear here once pet owners start booking with you</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {bookings.map((b) => {
                  const isAwaitingPayment = b.status === "confirmed" && !b.payment?.paid;

                  return (
                    <div key={b._id} className="p-6 rounded-3xl bg-white border border-gray-100 shadow-md hover:shadow-xl transition-all">
                      {/* HEADER */}
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-start gap-4">
                          <div className="p-3 rounded-xl bg-gradient-to-br from-orange-100 to-pink-100">
                            <svg
                              className="w-6 h-6 text-orange-600"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                          </div>

                          <div>
                            <h3 className="text-lg font-bold text-gray-900">
                              {b.ownerId?.name || "Pet Owner"}
                            </h3>

                            <p className="text-sm text-gray-500 mt-1">
                              {b.service} •{" "}
                              {b.walk
                                ? `${b.walk.date} (${b.walk.from}:00 – ${b.walk.to}:00)`
                                : b.date}
                            </p>

                            {activeWalkId === b._id && (
                              <span className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                Walking in progress
                              </span>
                            )}
                          </div>
                        </div>

                        {/* RIGHT SIDE STATUS */}
                        <div className="flex flex-col items-end">
                          <span
                            className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide"
                            style={{
                              backgroundColor: isAwaitingPayment
                                ? "#fef3c7"
                                : b.status === "pending"
                                ? "#fef3c7"
                                : b.status === "confirmed"
                                ? "#d1fae5"
                                : b.status === "completed"
                                ? "#dbeafe"
                                : "#fee2e2",
                              color: isAwaitingPayment
                                ? "#92400e"
                                : b.status === "pending"
                                ? "#92400e"
                                : b.status === "confirmed"
                                ? "#065f46"
                                : b.status === "completed"
                                ? "#1e40af"
                                : "#991b1b",
                            }}
                          >
                            {isAwaitingPayment ? "Awaiting Payment" : b.status}
                          </span>

                          {isAwaitingPayment && (
                            <p className="text-sm font-semibold text-amber-600 mt-2">
                              ₹{b.payment?.amount || b.servicePrice || b.sitterId?.price} pending
                            </p>
                          )}
                        </div>
                      </div>

                      {/* PROGRESS TRACKER */}
                      <div className="mb-6 p-4 rounded-2xl bg-gray-50">
                        <div className="relative flex items-center justify-between">
                          {/* Base line */}
                          <div className="absolute left-0 right-0 top-1/2 h-1 bg-gray-200 rounded-full" />

                          {/* Progress line */}
                          <div
                            className="absolute left-0 top-1/2 h-1 transition-all duration-700 rounded-full"
                            style={{
                              width: 
                                b.status === "pending" ? "0%" :
                                b.status === "confirmed" ? "50%" :
                                b.status === "completed" ? "100%" : "0%",
                              backgroundColor: b.status === "rejected" ? "#ef4444" : brand,
                            }}
                          />

                          {/* Step 1 - Requested */}
                          <div className="relative z-10 flex flex-col items-center">
                            <div
                              className="w-4 h-4 rounded-full border-4 border-white shadow-md"
                              style={{ backgroundColor: brand }}
                            />
                            <span className="text-xs font-medium mt-2 text-gray-600">
                              Requested
                            </span>
                          </div>

                          {/* Step 2 - Confirmed */}
                          <div className="relative z-10 flex flex-col items-center">
                            <div
                              className="w-4 h-4 rounded-full border-4 border-white shadow-md transition-all duration-500"
                              style={{
                                backgroundColor:
                                  b.status === "pending"
                                    ? "#e5e7eb"
                                    : b.status === "rejected"
                                    ? "#ef4444"
                                    : brand,
                              }}
                            />
                            <span className="text-xs font-medium mt-2 text-gray-600">
                              {b.status === "rejected" ? "Rejected" : "Confirmed"}
                            </span>
                          </div>

                          {/* Step 3 - Completed */}
                          <div className="relative z-10 flex flex-col items-center">
                            <div
                              className="w-4 h-4 rounded-full border-4 border-white shadow-md transition-all duration-500"
                              style={{
                                backgroundColor:
                                  b.status === "completed"
                                    ? brand
                                    : "#e5e7eb",
                              }}
                            />
                            <span className="text-xs font-medium mt-2 text-gray-600">
                              Completed
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* PET INFO */}
                      {b.pet && (
                        <div className="mb-4 p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-white">
                              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
                              </svg>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">
                                {b.pet.name} <span className="text-sm font-normal text-gray-600">({b.pet.type}, {b.pet.age} yrs)</span>
                              </p>
                              {b.pet.notes && (
                                <p className="text-sm text-gray-600 mt-1">
                                  📝 {b.pet.notes}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* BOARDING DETAILS */}
                      {b.boarding && (
                        <div className="mb-4 p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100">
                          <p className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Boarding Duration
                          </p>
                          <div className="space-y-2 text-sm">
                            <p className="text-gray-700">
                              <span className="font-medium">Dates:</span> {b.boarding.startDate} → {b.boarding.endDate}
                            </p>
                            {b.boarding.vetNumber && (
                              <p className="text-gray-700">
                                <span className="font-medium">Vet:</span> {b.boarding.vetNumber}
                              </p>
                            )}
                            {b.boarding.medicine && (
                              <p className="text-gray-700">
                                <span className="font-medium">Medicine:</span> {b.boarding.medicine}
                              </p>
                            )}
                            {b.boarding.emergencyNotes && (
                              <p className="text-amber-700 bg-amber-50 p-2 rounded-lg mt-2">
                                ⚠️ {b.boarding.emergencyNotes}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* ACTIONS */}
                      <div className="flex flex-wrap gap-3">
                        {b.status === "pending" && (
                          <>
                            <button
                              onClick={() => updateStatus(b._id, "confirmed")}
                              className="flex-1 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
                              style={{ backgroundColor: brand }}
                            >
                              ✓ Accept Booking
                            </button>

                            <button
                              onClick={() => updateStatus(b._id, "rejected")}
                              className="flex-1 px-6 py-3 rounded-xl bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
                            >
                              ✕ Reject
                            </button>
                          </>
                        )}

                        {/* START/END WALK BUTTONS */}
                        {b.service === "Walk" &&
                          b.status === "confirmed" &&
                          b.payment?.paid && (
                            <>
                              <button
                                onClick={() => startWalk(b._id)}
                                disabled={activeWalkId === b._id || activeWalkId !== null}
                                className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-md ${
                                  activeWalkId
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-green-600 text-white hover:bg-green-700 hover:scale-105 hover:shadow-lg"
                                }`}
                              >
                                {activeWalkId === b._id ? "🚶 Walking..." : "🚶 Start Walk"}
                              </button>
                              <button
                                onClick={() => endWalk(b._id)}
                                disabled={activeWalkId !== b._id}
                                className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-md ${
                                  activeWalkId === b._id
                                    ? "bg-red-600 text-white hover:bg-red-700 hover:scale-105 hover:shadow-lg"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                }`}
                              >
                                🛑 End Walk
                              </button>
                            </>
                          )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* REVIEWS SECTION */}
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Your Reviews</h2>
              <p className="text-sm text-gray-500 mt-1">See what pet owners are saying about you</p>
            </div>

            {reviews.length === 0 ? (
              <div className="p-12 rounded-3xl bg-white border border-gray-100 shadow-lg text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-yellow-100 to-orange-100 mb-4">
                  <svg className="w-10 h-10 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No reviews yet</h3>
                <p className="text-gray-500">Reviews from pet owners will appear here</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {reviews.map((r) => (
                  <div key={r._id} className="p-6 rounded-2xl bg-white border border-gray-100 shadow-md hover:shadow-lg transition-all">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-100 to-orange-100">
                        <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-5 h-5 ${i < r.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-sm font-semibold text-gray-600">{r.rating}/5</span>
                        </div>
                        <p className="text-gray-700 italic">"{r.comment}"</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}