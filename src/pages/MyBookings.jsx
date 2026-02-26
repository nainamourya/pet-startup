import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { openRazorpay } from "../utils/razorpayPayment";
import API_BASE_URL from "../config/api";
import { socket } from "../socket";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  /* ─── LOAD BOOKINGS ─── */
  const load = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;
    setLoading(true);
    try {
      const ownerId = user._id || user.id;
      const res = await fetch(`${API_BASE_URL}/api/bookings?ownerId=${ownerId}`);
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : data?.bookings || []);
    } catch (e) {
      console.error(e);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };
  const cancelBooking = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/bookings/${id}/cancel`, {
        method: "PATCH",
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        alert(data.message || "Cancellation failed");
        return;
      }
  
      alert(
        data.refundAmount > 0
          ? `✅ Cancelled! Refund of ₹${data.refundAmount} (${data.refundPercent}%) will arrive in 5–7 business days.`
          : `✅ Booking cancelled. No refund applicable.`
      );
      load(); // reload bookings
    } catch (err) {
      console.error("Cancel error:", err);
      alert("Something went wrong");
    }
  };
  useEffect(() => { load(); }, [location.pathname]);

  /* ─── REAL-TIME: socket listens for sitter status changes ─── */
  useEffect(() => {
    /* The sitter's bookings.js emits "status-updated" to the booking room.
       We listen here so the pet owner's screen updates without refresh.
       NOTE: pet owner must join the booking room too — add this to your
       socket setup or server.js:
         socket.on("join-booking", ({ bookingId }) => socket.join(bookingId));
    */
    bookings.forEach((b) => {
      socket.emit("join-booking", { bookingId: b._id });
    });

    socket.on("status-updated", ({ bookingId, status }) => {
      setBookings((prev) =>
        prev.map((b) => b._id === bookingId ? { ...b, status } : b)
      );
    });

    return () => socket.off("status-updated");
  }, [bookings.length]); // re-run when new bookings load

  /* ─── PAYMENT — instant state update, no reload ─── */
  const handlePayment = async (b, amount) => {
    try {
      setPaymentLoading(b._id);
      if (!amount || amount <= 0) {
        alert("Invalid amount. Please contact the sitter.");
        return;
      }
      await openRazorpay({ amount, bookingId: b._id });
      // ✅ Update local state instantly — no reload
      setBookings((prev) =>
        prev.map((bk) =>
          bk._id === b._id
            ? { ...bk, payment: { paid: true, amount, paidAt: new Date().toISOString() } }
            : bk
        )
      );
    } catch (err) {
      alert("Payment failed: " + err.message);
    } finally {
      setPaymentLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-500 mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-20 sm:pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">

        {/* PAGE TITLE */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            My <span className="text-blue-600">Bookings</span>
          </h1>
          <p className="text-gray-500 mt-2 text-sm">Updates automatically — no refresh needed</p>
        </div>

        {/* EMPTY STATE */}
        {bookings.length === 0 && (
          <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
            <p className="text-6xl mb-4">🐾</p>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Bookings Yet</h3>
            <p className="text-gray-500 mb-6">Book a trusted sitter for your pet today!</p>
            <Link to="/sitters">
              <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 hover:scale-105 transition-all shadow-md">
                Find Pet Sitters →
              </button>
            </Link>
          </div>
        )}

        {/* ══════════════════════════════════════
            BOOKING CARDS
        ══════════════════════════════════════ */}
        <div className="space-y-5">
          {bookings.map((b) => {
            const isPaid = !!b.payment?.paid;
            const amount = b.servicePrice || (b.sitterId?.price ? parseInt(String(b.sitterId.price).replace(/[^\d]/g, "")) : 0);

            return (
              <div key={b._id} className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">

                {/* CARD HEADER */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-lg ring-2 ring-white/40">
                      {(b.sitterId?.name || "S")[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white font-bold">{b.sitterId?.name || "Sitter"}</p>
                      <p className="text-blue-100 text-xs">
                        {b.service} • {b.walk ? `${b.walk.date} ${b.walk.from}:00–${b.walk.to}:00` : b.date || "—"}
                      </p>
                    </div>
                  </div>
                  {/* STATUS PILL */}
                  {{
                    pending:    <span className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800 border border-yellow-200">⏳ Pending</span>,
                    confirmed:  <span className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-200">✅ Confirmed</span>,
                    on_the_way: <span className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200 animate-pulse">🚗 On The Way</span>,
                    arrived:    <span className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold bg-orange-100 text-orange-800 border border-orange-200 animate-pulse">📍 Arrived!</span>,
                    completed:  <span className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">🎉 Completed</span>,
                    rejected:   <span className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">✕ Rejected</span>,
                  }[b.status]}
                </div>
                {b.status !== "completed" && b.status !== "cancelled" && (
  <button
    onClick={() => cancelBooking(
      b._id,
      b.payment?.amount || b.servicePrice,
      b.status,
      b.service,
      b.walk?.date || b.boarding?.startDate || b.date
    )}
    className="w-full mt-2 px-4 py-2 bg-red-50 border border-red-300 text-red-700 font-semibold rounded-xl hover:bg-red-100 transition-all"
  >
    Cancel Booking
  </button>
)}
                <div className="p-5 space-y-4">

                  {/* SERVICE + PRICE */}
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">
                        {b.service === "Walk" ? "🚶" : b.service === "Boarding" ? "🏠" : "🐾"}
                      </span>
                      <p className="font-bold text-gray-900">{b.service}</p>
                    </div>
                    {amount > 0 && (
                      <p className="text-2xl font-bold text-blue-600">₹{amount}</p>
                    )}
                  </div>

                  {/* ══════════════════════════════════════
                      📞 SITTER PHONE
                      Backend sends phone ONLY for:
                      confirmed, on_the_way, arrived
                      Hidden for: pending, rejected, completed
                  ══════════════════════════════════════ */}
                  {["confirmed", "on_the_way", "arrived"].includes(b.status) && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-2xl">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">📞 Sitter Contact</p>
                      {b?.phone ? (
                        <a
                          href={`tel:${b.phone}`}
                          className="flex items-center justify-between w-full px-4 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 hover:scale-105 active:scale-95 transition-all shadow-md"
                        >
                          <span>📞 Call Sitter</span>
                          <span className="text-lg font-bold tracking-widest">{b.phone}</span>
                        </a>
                      ) : (
                        <p className="text-sm text-amber-600 font-medium">
                          ⚠️ Sitter hasn't added their phone number yet
                        </p>
                      )}
                    </div>
                  )}

                  {/* STATUS MESSAGES */}
                  {b.status === "pending" && (
                    <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-2xl">
                      <span className="text-3xl">⏳</span>
                      <div>
                        <p className="font-bold text-yellow-800">Waiting for sitter to confirm...</p>
                        <p className="text-xs text-yellow-600 mt-0.5">This updates automatically — no refresh needed</p>
                      </div>
                    </div>
                  )}

                  {b.status === "on_the_way" && (
                    <div className="flex items-center gap-3 p-4 bg-blue-50 border-2 border-blue-200 rounded-2xl">
                      <span className="text-3xl animate-bounce">🚗</span>
                      <p className="font-bold text-blue-800">Sitter is on the way to you!</p>
                    </div>
                  )}

                  {b.status === "arrived" && (
                    <div className="flex items-center gap-3 p-4 bg-orange-50 border-2 border-orange-300 rounded-2xl">
                      <span className="text-3xl animate-bounce">📍</span>
                      <p className="font-bold text-orange-800">Your sitter has arrived!</p>
                    </div>
                  )}

                  {b.status === "rejected" && (
                    <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl">
                      <span className="text-3xl">❌</span>
                      <p className="font-bold text-red-800">Booking rejected. Please try another sitter.</p>
                    </div>
                  )}

                  {b.status === "completed" && (
                    <div className="flex items-center gap-3 p-4 bg-indigo-50 border border-indigo-200 rounded-2xl">
                      <span className="text-3xl">🎉</span>
                      <p className="font-bold text-indigo-800">Service Completed! Hope your pet had a great time.</p>
                    </div>
                  )}

                  {/* ══════════════════════════════════════
                      🐾 TRACK WALK LIVE
                      ✅ NO PAYMENT GATE — shows as soon as
                      sitter starts walk, regardless of payment
                  ══════════════════════════════════════ */}
                  {b.service === "Walk" && ["arrived"].includes(b.status) && (
                    <Link to={`/track-walk/${b._id}`}>
                      <button className="w-full py-3 rounded-2xl font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-105 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2">
                        📍 Track Walk Live
                      </button>
                    </Link>
                  )}

                  {/* ══════════════════════════════════════
                      💳 PAYMENT SECTION
                      ✅ Flexible — pet owner can pay:
                      - After confirmed (optional, early)
                      - After sitter arrives
                      - After service is COMPLETED
                      Nothing is blocked by payment status
                  ══════════════════════════════════════ */}
                  {!isPaid && ["confirmed", "on_the_way", "arrived", "completed"].includes(b.status) && (
                    <div className={`p-4 rounded-2xl space-y-3 border-2 ${
                      b.status === "completed"
                        ? "bg-indigo-50 border-indigo-300"
                        : b.status === "arrived"
                        ? "bg-orange-50 border-orange-400"
                        : "bg-blue-50 border-blue-200"
                    }`}>
                      <div className="flex items-center gap-2">
                        {b.status === "confirmed"  && <p className="font-semibold text-green-800 text-sm">✅ Confirmed — pay when you're ready</p>}
                        {b.status === "on_the_way" && <p className="font-semibold text-blue-800 text-sm">🚗 Sitter coming — pay anytime</p>}
                        {b.status === "arrived"    && <p className="font-bold text-orange-800">📍 Sitter arrived — pay to begin service</p>}
                        {b.status === "completed"  && <p className="font-bold text-indigo-800">🎉 Service done! Please pay the sitter</p>}
                      </div>

                      <div className="flex items-center justify-between px-1">
                        <span className="text-sm font-semibold text-gray-600">Amount:</span>
                        <span className={`text-2xl font-bold ${
                          b.status === "completed" ? "text-indigo-600"
                          : b.status === "arrived" ? "text-orange-600"
                          : "text-blue-600"
                        }`}>₹{amount}</span>
                      </div>

                      <button
                        onClick={() => handlePayment(b, amount)}
                        disabled={paymentLoading === b._id}
                        className={`w-full py-4 rounded-2xl font-bold text-white text-lg transition-all shadow-lg hover:scale-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 ${
                          b.status === "completed"
                            ? "bg-gradient-to-r from-indigo-500 to-purple-600"
                            : b.status === "arrived"
                            ? "bg-gradient-to-r from-orange-500 to-red-500"
                            : "bg-gradient-to-r from-blue-500 to-indigo-600"
                        }`}
                      >
                        {paymentLoading === b._id ? (
                          <>
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Processing...
                          </>
                        ) : (
                          <>💳 Pay Now — ₹{amount}</>
                        )}
                      </button>
                      <p className="text-xs text-center text-gray-400">
                        Pay before, during, or after service — your choice
                      </p>
                    </div>
                  )}

                  {/* PAYMENT DONE STRIP */}
                  {isPaid && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl">
                      <span className="text-green-600">✅</span>
                      <p className="text-sm font-bold text-green-800">
                        Payment Complete — ₹{b.payment.amount}
                      </p>
                    </div>
                  )}

                  {/* PET INFO */}
                  {b.pet && (
                    <div className="p-4 bg-purple-50 border border-purple-100 rounded-2xl text-sm">
                      <p className="font-bold text-gray-900 mb-2">🐾 Pet Details</p>
                      <div className="grid grid-cols-2 gap-2 text-gray-700">
                        <span>Name: <strong>{b.pet.name}</strong></span>
                        <span>Type: <strong>{b.pet.type}</strong></span>
                        <span>Age: <strong>{b.pet.age}</strong></span>
                      </div>
                      {b.pet.notes && (
                        <p className="text-gray-600 mt-2 text-xs">📝 {b.pet.notes}</p>
                      )}
                    </div>
                  )}

                  {/* BOARDING DETAILS */}
                  {b.boarding && (
                    <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl text-sm space-y-1">
                      <p className="font-bold text-gray-900 mb-2">🏠 Boarding Details</p>
                      <p>📅 {b.boarding.startDate} → {b.boarding.endDate}</p>
                      {b.boarding.vetNumber && (
                        <p>🏥 Vet: <a href={`tel:${b.boarding.vetNumber}`} className="text-blue-600 font-semibold">{b.boarding.vetNumber}</a></p>
                      )}
                      {b.boarding.medicine && <p>💊 {b.boarding.medicine}</p>}
                      {b.boarding.emergencyNotes && (
                        <div className="mt-2 p-2 bg-white border-l-4 border-orange-400 rounded">
                          <p className="text-xs font-bold text-gray-500">⚠️ Emergency Notes</p>
                          <p className="text-xs text-gray-700 mt-0.5">{b.boarding.emergencyNotes}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* LEAVE REVIEW */}
                  {!b.reviewed && b.status === "completed" && (
                    <button
                      onClick={() => navigate(`/review/${b._id}`, {
                        state: { sitterId: b.sitterId._id, sitterName: b.sitterId.name }
                      })}
                      className="w-full py-3 rounded-2xl font-bold text-blue-600 border-2 border-blue-600 hover:bg-blue-50 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                      ⭐ Leave a Review
                    </button>
                  )}

                </div>
              </div>
            );
          })}
        </div>

        {/* HOW IT WORKS FOOTER */}
        <div className="mt-10 bg-white rounded-3xl shadow-sm border border-gray-100 p-6 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-4">🐾 How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            {[
              { icon: "✅", title: "Book a Sitter",     desc: "Choose your sitter and book instantly" },
              { icon: "🚗", title: "Sitter Travels",    desc: "Sitter comes to you — track them live" },
              { icon: "💳", title: "Flexible Payment",  desc: "Pay before, during, or after service" },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="p-3 bg-gray-50 rounded-2xl">
                <p className="text-2xl mb-1">{icon}</p>
                <p className="font-bold text-gray-900">{title}</p>
                <p className="text-gray-500 text-xs mt-1">{desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}