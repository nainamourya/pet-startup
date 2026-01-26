import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function BookSitter() {
  const location = useLocation();
  const navigate = useNavigate();
  const { sitter, date, service } = location.state || {};
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("Please login to book a sitter.");
      return;
    }

    const sitterId = sitter._id || sitter.id; // support both DB + mock

    await fetch("http://localhost:5000/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sitterId,
        ownerId: user.id,
        service,
        date,
      }),
    });

    navigate("/my-bookings");
  };

  if (!sitter) {
    return (
      <div className="pt-24 px-6">
        <p className="text-gray-600">No sitter selected.</p>
      </div>
    );
  }

  return (
    <div className="pt-24 px-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold">Confirm Booking</h1>

      <div className="mt-6 p-6 rounded-xl border">
        <h2 className="text-xl font-semibold">{sitter.name}</h2>
        <p className="text-gray-600">{sitter.city}</p>
        <p className="mt-2">
          Service: <b>{service}</b>
        </p>
        <p>
          Date: <b>{date}</b>
        </p>
        <p className="mt-2">
          Price: <b>{sitter.price}</b>
        </p>
      </div>

      <button
        onClick={handleConfirm}
        className="mt-6 w-full px-6 py-3 rounded-full bg-black text-white hover:bg-gray-800 transition"
      >
        Confirm Booking
      </button>
    </div>
  );
}
