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
  const [activeWalkId, setActiveWalkId] = useState(() => localStorage.getItem("activeWalkId"));
  const [newCount, setNewCount] = useState(0);
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);

  /* ─── START WALK ─── */
  const startWalk = (bookingId) => {
    localStorage.setItem("activeWalkId", bookingId);
    setActiveWalkId(bookingId);
    socket.emit("join-walk", { bookingId });
    socket.emit("walk-started", { bookingId });
    if (watchIdRef.current) return;
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => socket.emit("send-location", { bookingId, lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => console.error("GPS error", err),
      { enableHighAccuracy: true }
    );
    toast.success("Walk started! 🚶");
  };

  const endWalk = async (bookingId) => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  
    socket.emit("end-walk", { bookingId });
  
    await fetch(`${API_BASE_URL}/api/bookings/${bookingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "completed" }),
    });
  
    setBookings((prev) =>
      prev.map((b) =>
        b._id === bookingId ? { ...b, status: "completed" } : b
      )
    );
  
    localStorage.removeItem("activeWalkId");
    setActiveWalkId(null);
    toast.success("Service completed ✅ Owner can pay anytime");
  };

  const handleBankDetailsUpdate = (updatedBankDetails) =>
    setProfile((prev) => ({ ...prev, bankDetails: updatedBankDetails }));

  /* ─── RESUME WALK ON REFRESH ─── */
  useEffect(() => {
    const savedId = localStorage.getItem("activeWalkId");
    if (!savedId || watchIdRef.current) return;
    socket.emit("join-walk", { bookingId: savedId });
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => socket.emit("send-location", { bookingId: savedId, lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => console.error("GPS error", err),
      { enableHighAccuracy: true }
    );
  }, []);

  useEffect(() => {
    socket.on("walk-ended", () => {
      if (watchIdRef.current) { navigator.geolocation.clearWatch(watchIdRef.current); watchIdRef.current = null; }
      localStorage.removeItem("activeWalkId");
      setActiveWalkId(null);
    });
    return () => socket.off("walk-ended");
  }, []);

  /* ─── LOAD DATA ─── */
  const load = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.sitterProfile) {
      setError("This account is not linked to a sitter profile.");
      setLoading(false);
      return;
    }
    try {
      const [profileRes, bookingsRes, reviewsRes, availRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/sitters/${user.sitterProfile}`),
        fetch(`${API_BASE_URL}/api/bookings?sitterId=${user.sitterProfile}`),
        fetch(`${API_BASE_URL}/api/reviews?sitterId=${user.sitterProfile}`),
        fetch(`${API_BASE_URL}/api/sitters/${user.sitterProfile}/availability`),
      ]);
      const [profileData, bookingsData, reviewsData, availData] = await Promise.all([
        profileRes.json(), bookingsRes.json(), reviewsRes.json(), availRes.json(),
      ]);
      setProfile(profileData);
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
      setReviews(Array.isArray(reviewsData) ? reviewsData : []);
      setAvailableDates(availData.availableDates || []);

      const lastSeen = localStorage.getItem("lastSeenBookingsAt");
      const lastSeenTime = lastSeen ? new Date(lastSeen) : new Date(0);
      setNewCount((Array.isArray(bookingsData) ? bookingsData : []).filter(
        (b) => b.status === "pending" && new Date(b.createdAt) > lastSeenTime
      ).length);
    } catch (e) {
      console.error("Load error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [location.pathname]);
  useEffect(() => () => { if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current); }, []);

  /* ─── WEEKLY EARNINGS ─── */
  useEffect(() => {
    if (!bookings.length) return;
    const today = new Date();
    const last7 = [...Array(7)].map((_, i) => { const d = new Date(); d.setDate(today.getDate() - i); return d.toDateString(); }).reverse();
    const map = Object.fromEntries(last7.map((d) => [d, 0]));
    bookings.forEach((b) => {
      if (b.payment?.paid) { const d = new Date(b.payment.paidAt).toDateString(); if (d in map) map[d] += b.payment.amount || 0; }
    });
    setWeeklyEarnings(last7.map((d) => ({ day: d.split(" ").slice(0, 3).join(" "), amount: map[d] })));
  }, [bookings]);

  /* ─── UPDATE STATUS — immediately updates local state + calls API ─── */
  const updateStatus = async (bookingId, newStatus) => {
    // ✅ Update local state IMMEDIATELY so button disappears/changes right away
    setBookings((prev) =>
      prev.map((b) => b._id === bookingId ? { ...b, status: newStatus } : b)
    );
    // Then call API in background
    try {
      await fetch(`${API_BASE_URL}/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (newStatus === "confirmed") {
        localStorage.setItem("lastSeenBookingsAt", new Date().toISOString());
        setNewCount(0);
      }
    } catch (e) {
      console.error("Status update failed:", e);
      toast.error("Failed to update status. Retrying...");
      // Revert on failure
      setBookings((prev) =>
        prev.map((b) => b._id === bookingId ? { ...b, status: b.status } : b)
      );
    }
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

  const paidBookings = bookings.filter((b) => b.payment?.paid);
  const today = new Date();
  const todayIncome = paidBookings.filter((b) => new Date(b.payment.paidAt).toDateString() === today.toDateString()).reduce((s, b) => s + (b.payment.amount || 0), 0);
  const monthlyIncome = paidBookings.filter((b) => { const d = new Date(b.payment.paidAt); return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear(); }).reduce((s, b) => s + (b.payment.amount || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50">
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">

          {/* ── HEADER ── */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-400 to-pink-400 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">Sitter Dashboard</h1>
                <p className="text-gray-600 mt-1">Manage your bookings, earnings & profile</p>
              </div>
            </div>
            {newCount > 0 && (
              <div className="mt-6 p-4 rounded-2xl border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-pink-50 flex items-center gap-3 shadow-sm animate-pulse">
                <div className="p-2 rounded-full bg-orange-500"><svg className="w-5 h-5 text-white animate-bounce" fill="currentColor" viewBox="0 0 24 24"><path d="M12 22a2 2 0 01-2-2h4a2 2 0 01-2 2zm6-6V11a6 6 0 10-12 0v5l-2 2h16l-2-2z" /></svg></div>
                <span className="text-sm font-semibold text-gray-800">🎉 You have {newCount} new booking request{newCount > 1 ? "s" : ""}</span>
              </div>
            )}

            {/* ✅ ADDED: phone missing warning — shows if sitter hasn't set phone */}
            {profile && !profile.phone && (
              <div className="mt-4 p-4 rounded-2xl border-2 border-red-300 bg-red-50 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📵</span>
                  <div>
                    <p className="font-bold text-red-800">Phone number missing!</p>
                    <p className="text-sm text-red-600">Pet owners cannot call you after booking. Add it in Edit Profile.</p>
                  </div>
                </div>
                <button
                  onClick={() => setEditing(true)}
                  className="flex-shrink-0 px-4 py-2 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all text-sm">
                  Add Now
                </button>
              </div>
            )}

            {error && <div className="mt-6 p-4 rounded-2xl bg-red-50 border-2 border-red-200"><p className="text-red-600 font-medium">{error}</p></div>}
          </div>

          {/* ── STATS ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { label: "Confirmed Bookings", value: paidBookings.length, tag: "Bookings", tagColor: "text-blue-600 bg-blue-100", bg: "from-blue-100 to-blue-50", iconColor: "text-blue-600", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
              { label: "Today's Income", value: `₹${todayIncome.toLocaleString()}`, tag: "Today", tagColor: "text-white bg-white/20", gradient: true, iconColor: "text-white", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
              { label: "Monthly Earnings", value: `₹${monthlyIncome.toLocaleString()}`, tag: "This Month", tagColor: "text-green-600 bg-green-100", bg: "from-green-100 to-green-50", iconColor: "text-green-600", icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" },
            ].map(({ label, value, tag, tagColor, bg, gradient, iconColor, icon }, i) => (
              <div key={i} className={`group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${gradient ? "bg-gradient-to-br from-orange-400 to-pink-400" : "bg-white border border-gray-100"}`}>
                <div className={`absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 opacity-50 ${gradient ? "bg-white" : `bg-gradient-to-br ${bg}`}`}></div>
                <div className="relative p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl ${gradient ? "bg-white/20" : `bg-${iconColor.split("-")[1]}-100`}`}>
                      <svg className={`w-6 h-6 ${gradient ? "text-white" : iconColor}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={icon} /></svg>
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${tagColor}`}>{tag}</span>
                  </div>
                  <p className={`text-sm font-medium mb-1 ${gradient ? "text-white/90" : "text-gray-500"}`}>{label}</p>
                  <p className={`text-4xl font-bold ${gradient ? "text-white" : "text-gray-900"}`}>{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── EARNINGS CHART ── */}
          <div className="mb-8 p-8 rounded-3xl bg-white border border-gray-100 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Earnings Overview <span className="text-sm font-normal text-gray-400">— last 7 days</span></h2>
            <div className="flex items-end gap-4 h-48">
              {weeklyEarnings.map((e, i) => {
                const max = Math.max(...weeklyEarnings.map((w) => w.amount), 100);
                const h = e.amount > 0 ? Math.max((e.amount / max) * 180, 8) : 8;
                return (
                  <div key={i} className="flex-1 flex flex-col justify-end items-center group">
                    <div className="relative w-full">
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap z-10">₹{e.amount.toLocaleString()}</div>
                      <div className="w-full rounded-t-xl transition-all duration-700 group-hover:scale-105" style={{ height: `${h}px`, background: `linear-gradient(180deg, ${brand}, #ffb199)` }} />
                    </div>
                    <p className="text-xs font-medium text-gray-600 mt-2">{e.day.split(" ").slice(1, 3).join(" ")}</p>
                    <p className="text-xs font-bold text-gray-900">₹{e.amount}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── PROFILE ── */}
          {profile && (
            <div className="mb-8 p-8 rounded-3xl bg-white border border-gray-100 shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <div><h2 className="text-2xl font-bold text-gray-900">Your Profile</h2><p className="text-sm text-gray-500 mt-1">Manage your professional information</p></div>
                <button onClick={() => setEditing(!editing)} className="px-5 py-2.5 rounded-xl font-semibold text-sm transition-all hover:scale-105" style={{ backgroundColor: editing ? "#f3f4f6" : brand, color: editing ? "#374151" : "white" }}>
                  {editing ? "Cancel" : "Edit Profile"}
                </button>
              </div>
              {editing ? (
                <div className="space-y-4">
                  {/* ✅ CHANGED: added Phone Number field — was missing from original */}
                  {[
                    ["Full Name",          "name",       "text"],
                    ["Phone Number",       "phone",      "tel"],
                    ["City",               "city",       "text"],
                    ["Experience",         "experience", "text"],
                    ["Price per Hour (₹)", "price",      "text"],
                  ].map(([label, key, type]) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {label}
                        {key === "phone" && (
                          <span className="ml-2 text-xs font-semibold text-orange-600">
                            ← pet owners see this after booking is confirmed
                          </span>
                        )}
                      </label>
                      <input
                        type={type}
                        className={`w-full border-2 p-3 rounded-xl outline-none transition ${
                          key === "phone" && !profile[key]
                            ? "border-red-300 focus:border-red-400 bg-red-50"
                            : "border-gray-200 focus:border-orange-400"
                        }`}
                        value={profile[key] || ""}
                        placeholder={key === "phone" ? "e.g. 9876543210" : ""}
                        onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
                      />
                    </div>
                  ))}
                  <button onClick={async () => {
                    const token = localStorage.getItem("token");
                    const headers = { "Content-Type": "application/json" };
                    if (token) headers.Authorization = `Bearer ${token}`;
                    await fetch(`${API_BASE_URL}/api/sitters/${profile._id}`, { method: "PATCH", headers, body: JSON.stringify(profile) });
                    setEditing(false);
                    toast.success("Profile updated! 🎉");
                  }} className="w-full px-6 py-3 rounded-xl font-semibold text-white hover:scale-105 shadow-lg transition-all" style={{ backgroundColor: brand }}>Save Changes</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* ✅ CHANGED: added Phone to profile view with red warning if missing */}
                  {[
                    { l: "Name",        k: "name"       },
                    { l: "Phone",       k: "phone"      },
                    { l: "City",        k: "city"       },
                    { l: "Experience",  k: "experience" },
                    { l: "Hourly Rate", k: "price", pfx: "₹" },
                  ].map(({ l, k, pfx = "" }) => (
                    <div key={k} className={`p-5 rounded-2xl border ${k === "phone" && !profile[k] ? "bg-red-50 border-red-200" : "bg-gray-50 border-gray-100"}`}>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{l}</p>
                      {k === "phone" && !profile[k] ? (
                        <p className="text-base font-bold text-red-600 mt-1">⚠️ Not set — click Edit Profile</p>
                      ) : (
                        <p className="text-lg font-bold text-gray-900 mt-1">{pfx}{profile[k]}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <BankDetailsSection profile={profile} onUpdate={handleBankDetailsUpdate} />
          {profile && <WithdrawalSection profile={profile} />}

          {/* ══════════════════════════════════════
              BOOKINGS — RAPIDO FLOW
          ══════════════════════════════════════ */}
          <div className="mb-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Bookings</h2>
              <p className="text-sm text-gray-500 mt-1">Manage your current and upcoming bookings</p>
            </div>

            {bookings.length === 0 ? (
              <div className="p-12 rounded-3xl bg-white border border-gray-100 shadow-lg text-center">
                <p className="text-5xl mb-4">📋</p>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings yet</h3>
                <p className="text-gray-500">Your bookings will appear here once pet owners start booking with you</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {bookings.map((b) => {
                  const isPaid = !!b.payment?.paid;

                  return (
                    <div key={b._id} className="rounded-3xl bg-white border border-gray-100 shadow-md hover:shadow-xl transition-all overflow-hidden">

                      {/* ── BOOKING HEADER ── */}
                      <div className="p-5 flex items-start justify-between gap-3" style={{ background: "linear-gradient(135deg, #fff7ed 0%, #fff 60%)" }}>
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-pink-400 flex items-center justify-center text-white font-bold text-lg shadow-md">
                            {(b.ownerId?.name || "P")[0].toUpperCase()}
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{b.ownerId?.name || "Pet Owner"}</h3>
                            <p className="text-sm text-gray-500">
                              {b.service} • {b.walk ? `${b.walk.date} (${b.walk.from}:00–${b.walk.to}:00)` : b.date}
                            </p>
                            {activeWalkId === b._id && (
                              <span className="inline-flex items-center gap-1.5 mt-1 px-3 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>Walk in progress
                              </span>
                            )}
                          </div>
                        </div>

                        {/* STATUS BADGE */}
                        <div className="flex-shrink-0">
                          {{
                            pending:    <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-yellow-100 text-yellow-800 border border-yellow-200">⏳ Pending</span>,
                            confirmed:  <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-green-100 text-green-800 border border-green-200">✅ Confirmed</span>,
                            on_the_way: <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">🚗 On The Way</span>,
                            arrived:    isPaid
                              ? <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">📍 Arrived ✅</span>
                              : <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-orange-100 text-orange-800 border border-orange-200">📍 Arrived — Awaiting Pay</span>,
                            completed:  <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">🎉 Completed</span>,
                            rejected:   <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-red-100 text-red-800 border border-red-200">✕ Rejected</span>,
                          }[b.status]}
                        </div>
                      </div>

                      {/* PAYMENT STRIP — shows from confirmed onwards */}
                      {b.status !== "pending" && b.status !== "rejected" && (
                        <div className={`mx-5 mb-4 px-4 py-3 rounded-xl flex items-center gap-3 ${isPaid ? "bg-green-50 border border-green-200" : "bg-amber-50 border border-amber-300"}`}>
                          <span className="text-xl">{isPaid ? "✅" : "⏳"}</span>
                          <div>
                            <p className={`text-sm font-bold ${isPaid ? "text-green-800" : "text-amber-800"}`}>
                              {isPaid
                                ? `Payment received — ₹${b.payment.amount}`
                                : `Awaiting payment — ₹${b.servicePrice || b.sitterId?.price || "?"}`}
                            </p>
                            {!isPaid && (
                              <p className="text-xs text-amber-700 mt-0.5">
                                Pet owner can pay anytime — service continues regardless
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* PROGRESS TRACKER */}
                      <div className="mx-5 mb-4 p-4 bg-gray-50 rounded-2xl">
                        <div className="relative flex items-center justify-between">
                          <div className="absolute inset-x-4 top-2 h-1 bg-gray-200 rounded-full" />
                          <div className="absolute left-4 top-2 h-1 rounded-full transition-all duration-700"
                            style={{
                              width: { pending:"0%", confirmed:"25%", on_the_way:"50%", arrived:"75%", completed:"calc(100% - 2rem)" }[b.status] || "0%",
                              backgroundColor: b.status === "rejected" ? "#ef4444" : brand,
                            }}
                          />
                          {[
                            { label: "Booked",    active: true },
                            { label: "Confirmed", active: ["confirmed","on_the_way","arrived","completed"].includes(b.status) },
                            { label: "On Way",    active: ["on_the_way","arrived","completed"].includes(b.status) },
                            { label: "Arrived",   active: ["arrived","completed"].includes(b.status) },
                            { label: "Done",      active: b.status === "completed" },
                          ].map(({ label, active }) => (
                            <div key={label} className="relative z-10 flex flex-col items-center gap-2">
                              <div className="w-4 h-4 rounded-full border-4 border-white shadow-md transition-all duration-500"
                                style={{ backgroundColor: active && b.status !== "rejected" ? brand : b.status === "rejected" && label === "Confirmed" ? "#ef4444" : "#e5e7eb" }} />
                              <span className="text-xs font-medium text-gray-600 whitespace-nowrap">{label}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* PET INFO */}
                      {b.pet && (
                        <div className="mx-5 mb-4 p-3 rounded-xl bg-blue-50 border border-blue-100 text-sm">
                          🐾 <span className="font-semibold">{b.pet.name}</span>{" "}
                          <span className="text-gray-500">({b.pet.type}, {b.pet.age} yrs)</span>
                          {b.pet.notes && <p className="text-gray-600 mt-1">📝 {b.pet.notes}</p>}
                        </div>
                      )}

                      {/* BOARDING */}
                      {b.boarding && (
                        <div className="mx-5 mb-4 p-3 rounded-xl bg-purple-50 border border-purple-100 text-sm space-y-1">
                          <p className="font-semibold">🏠 {b.boarding.startDate} → {b.boarding.endDate}</p>
                          {b.boarding.vetNumber && <p>🏥 Vet: {b.boarding.vetNumber}</p>}
                          {b.boarding.medicine && <p>💊 {b.boarding.medicine}</p>}
                          {b.boarding.emergencyNotes && <p className="text-amber-700 bg-amber-50 p-2 rounded-lg">⚠️ {b.boarding.emergencyNotes}</p>}
                        </div>
                      )}

                      {/* ══════════════════════════════════════
                          ACTION BUTTONS — RAPIDO FLOW
                          Each button only shows for its exact status
                      ══════════════════════════════════════ */}
                      <div className="px-5 pb-5 flex flex-wrap gap-3">

                        {/* ① ACCEPT / REJECT — status: pending */}
                        {b.status === "pending" && (
                          <>
                            <button
                              onClick={() => { updateStatus(b._id, "confirmed"); toast.success("Booking accepted! 🎉"); }}
                              className="flex-1 py-3.5 rounded-2xl font-bold text-white text-base shadow-lg hover:scale-105 active:scale-95 transition-all"
                              style={{ background: `linear-gradient(135deg, ${brand}, #ff6b6b)` }}>
                              ✓ Accept Booking
                            </button>
                            <button
                              onClick={() => { updateStatus(b._id, "rejected"); toast.error("Booking rejected"); }}
                              className="flex-1 py-3.5 rounded-2xl font-bold text-white text-base bg-gray-800 hover:bg-gray-700 shadow-lg hover:scale-105 active:scale-95 transition-all">
                              ✕ Reject
                            </button>
                          </>
                        )}

                        {/* ② START TRAVEL — status: confirmed — NO PAYMENT GATE (Rapido style) */}
                        {b.status === "confirmed" && (
                          <button
                            onClick={() => { updateStatus(b._id, "on_the_way"); toast.success("Travelling to pet owner! 🚗"); }}
                            className="flex-1 py-3.5 rounded-2xl font-bold text-white text-base bg-gradient-to-r from-blue-500 to-blue-700 shadow-lg hover:scale-105 active:scale-95 transition-all">
                            🚗 Start Travel
                          </button>
                        )}

                        {/* ③ I'VE REACHED — status: on_the_way */}
                        {b.status === "on_the_way" && (
                          <button
                            onClick={() => { updateStatus(b._id, "arrived"); toast.success("Marked as arrived! 📍"); }}
                            className="flex-1 py-3.5 rounded-2xl font-bold text-white text-base bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg hover:scale-105 active:scale-95 transition-all">
                            📍 I've Reached
                          </button>
                        )}

                        {/* ④ WALK BUTTONS — arrived (payment flexible, service always starts) */}
                        {b.status === "arrived" && b.service === "Walk" && (
                          <>
                            <button
                              onClick={() => startWalk(b._id)}
                              disabled={!!activeWalkId}
                              className={`flex-1 py-3.5 rounded-2xl font-bold text-base shadow-lg transition-all ${
                                activeWalkId ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-gradient-to-r from-green-500 to-green-700 text-white hover:scale-105 active:scale-95"
                              }`}>
                              {activeWalkId === b._id ? "🚶 Walking..." : "🚶 Start Walk"}
                            </button>
                            <button
                              onClick={() => endWalk(b._id)}
                              disabled={activeWalkId !== b._id}
                              className={`flex-1 py-3.5 rounded-2xl font-bold text-base shadow-lg transition-all ${
                                activeWalkId === b._id ? "bg-gradient-to-r from-red-500 to-red-700 text-white hover:scale-105 active:scale-95" : "bg-gray-200 text-gray-500 cursor-not-allowed"
                              }`}>
                              🛑 End Walk
                            </button>
                          </>
                        )}

                        {/* For non-walk services arrived — just show service started */}
                        {b.status === "arrived" && b.service !== "Walk" && (
                          <div className="w-full py-3.5 px-4 rounded-2xl bg-green-50 border-2 border-green-300 text-center">
                            <p className="font-bold text-green-800">✅ Service in Progress</p>
                            <p className="text-xs text-green-600 mt-0.5">{isPaid ? "Payment received" : "Payment pending from owner"}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── REVIEWS ── */}
          <div>
            <div className="mb-6"><h2 className="text-2xl font-bold text-gray-900">Your Reviews</h2><p className="text-sm text-gray-500 mt-1">See what pet owners are saying about you</p></div>
            {reviews.length === 0 ? (
              <div className="p-12 rounded-3xl bg-white border border-gray-100 shadow-lg text-center">
                <p className="text-5xl mb-4">⭐</p>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No reviews yet</h3>
                <p className="text-gray-500">Reviews from pet owners will appear here</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {reviews.map((r) => (
                  <div key={r._id} className="p-6 rounded-2xl bg-white border border-gray-100 shadow-md">
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => <span key={i} className={`text-xl ${i < r.rating ? "text-yellow-400" : "text-gray-300"}`}>★</span>)}
                      <span className="text-sm font-semibold text-gray-600 ml-2">{r.rating}/5</span>
                    </div>
                    <p className="text-gray-700 italic">"{r.comment}"</p>
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