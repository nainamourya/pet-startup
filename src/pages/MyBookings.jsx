import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { openRazorpay } from "../utils/razorpayPayment";
import { Link } from "react-router-dom";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusAlert, setStatusAlert] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  // const profile = location.state?.profile || {};
  const load = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    setLoading(true);

    const res = await fetch(
      `http://localhost:5000/api/bookings?ownerId=${user.id}`
    );
    const data = await res.json();
    setBookings(data);

    // 🔔 Owner soft notification
    const lastSeen = localStorage.getItem("ownerLastSeenAt");
    const lastSeenTime = lastSeen ? new Date(lastSeen) : new Date(0);

    const changed = data.find(
      (b) => b.status !== "pending" && new Date(b.updatedAt) > lastSeenTime
    );

    if (changed) {
      setStatusAlert(
        `Your booking with ${changed.sitterId?.name || "a sitter"} was ${changed.status}`
      );
    }

    localStorage.setItem("ownerLastSeenAt", new Date().toISOString());
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

      {statusAlert && (
        <div className="mt-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-800 text-sm">
          {statusAlert}
        </div>
      )}

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
                {b.service}
              </p>
              
      {/* 📍 TRACK WALK BUTTON */}
      {b.service === "Walk" &&
        b.status === "confirmed" &&
        b.payment?.paid && (
          <div className="mt-3">
            <Link to={`/track-walk/${b._id}`}>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm hover:scale-105 transition">
                📍 Track Walk
              </button>
            </Link>
          </div>
        )}

     
              {/* STATUS */}
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
              {/* 💳 PAY NOW BUTTON */}
{/* 💰 PAYMENT STATUS */}
{b.payment?.paid && (
  <span className="ml-2 inline-block px-2 py-1 text-xs rounded bg-green-100 text-green-800">
    Paid
  </span>
)}

{/* 💳 PAY NOW BUTTON */}
{b.status === "confirmed" && b.payment?.paid !== true && (
  <div className="mt-3">
    <p className="text-sm text-gray-700 mb-2">
      <span className="font-medium">Amount to Pay:</span> ₹{b.servicePrice || (b.sitterId?.price ? parseInt(b.sitterId.price) : "N/A")}
    </p>
    <button
      onClick={async () => {
        try {
          setPaymentLoading(b._id);
          const sitterPrice = b.sitterId?.price ? parseInt(b.sitterId.price.replace(/[^\d]/g, "")) : 0;
          const amount = Number(b.servicePrice || sitterPrice || 0);
          if (amount <= 0) {
            alert("Invalid amount. Sitter price not set. Please contact the sitter.");
            return;
          }
          console.log("Starting payment for booking:", b._id, "Amount:", amount);
          await openRazorpay({
            amount,
            bookingId: b._id,
          });
        } catch (error) {
          console.error("Payment error:", error);
          alert("Payment error: " + error.message);
        } finally {
          setPaymentLoading(null);
        }
      }}
      disabled={paymentLoading === b._id}
      className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {paymentLoading === b._id ? "Processing..." : "Pay Now"}
    </button>
  </div>
)}

{b.payment?.paid && (
  <span className="inline-block mt-3 px-3 py-1 text-xs rounded bg-green-100 text-green-800">
    Paid
  </span>
)}

    {/* PET DETAILS */}
              {b.pet && (
                <div className="mt-2 text-sm text-gray-700">
                  <p>
                    <span className="font-medium">Pet Name:</span>{" "}
                    {b.pet.name}
                  </p>
                  <p>
                    <span className="font-medium">Type:</span>{" "}
                    {b.pet.type} •{" "}
                    <span className="font-medium">Age:</span>{" "}
                    {b.pet.age}
                  </p>
                  {b.pet.notes && (
                    <p className="text-xs text-gray-500 mt-1">
                      Notes: {b.pet.notes}
                    </p>
                  )}
                </div>
              )}

              {/* 🏠 BOARDING DETAILS */}
              {b.boarding && (
                <div className="mt-3 text-sm text-gray-700 space-y-1">
                  <p>
                    <span className="font-medium">Boarding:</span>{" "}
                    {b.boarding.startDate} → {b.boarding.endDate}
                  </p>

                  {b.boarding.vetNumber && (
                    <p>
                      <span className="font-medium">Vet Contact:</span>{" "}
                      {b.boarding.vetNumber}
                    </p>
                  )}

                  {b.boarding.medicine && (
                    <p>
                      <span className="font-medium">Medicine:</span>{" "}
                      {b.boarding.medicine}
                    </p>
                  )}

                  {b.boarding.emergencyNotes && (
                    <p className="text-xs text-gray-500">
                      <span className="font-medium">Emergency Notes:</span>{" "}
                      {b.boarding.emergencyNotes}
                    </p>
                  )}
                </div>
              )}

              {/* REVIEW */}
              {!b.reviewed && (
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