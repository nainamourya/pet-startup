import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function BookSitter() {
  const location = useLocation();
  const navigate = useNavigate();
  const { sitter, date, service } = location.state || {};

  const [petName, setPetName] = useState("");
  const [petType, setPetType] = useState("Dog");
  const [petAge, setPetAge] = useState("");
  const [petNotes, setPetNotes] = useState("");

  const handleConfirm = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Please login to book a sitter.");
      return;
    }
  
    const sitterId = sitter._id || sitter.id;
  
    const res = await fetch("http://localhost:5000/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sitterId,
        ownerId: user.id,
        service,
        date,
        pet: {
          name: petName,
          type: petType,
          age: petAge,
          notes: petNotes,
        },
      }),
    });
  
    const data = await res.json();
  
    if (!res.ok) {
      alert(data.message || "Booking failed");
      return;
    }
  
    navigate("/my-bookings");
  };
  

  if (!sitter) {
    return <div className="pt-24 px-6">No sitter selected.</div>;
  }

  return (
    <div className="pt-24 px-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold">Confirm Booking</h1>

      <div className="mt-6 p-6 rounded-xl border space-y-3">
        <h2 className="text-xl font-semibold">{sitter.name}</h2>
        <p>{service} • {date}</p>

        <input
  placeholder="Pet name"
  className="w-full border p-3 rounded-lg"
  value={petName}
  onChange={(e) => setPetName(e.target.value)}
/>

<select
  className="w-full border p-3 rounded-lg"
  value={petType}
  onChange={(e) => setPetType(e.target.value)}
>
  <option>Dog</option>
  <option>Cat</option>
  <option>Bird</option>
</select>

<input
  placeholder="Pet age"
  className="w-full border p-3 rounded-lg"
  value={petAge}
  onChange={(e) => setPetAge(e.target.value)}
/>

<textarea
  placeholder="Notes (optional)"
  className="w-full border p-3 rounded-lg"
  value={petNotes}
  onChange={(e) => setPetNotes(e.target.value)}
/>
      </div>

      <button
        onClick={handleConfirm}
        className="mt-6 w-full px-6 py-3 rounded-full bg-black text-white"
      >
        Confirm Booking
      </button>
    </div>
  );
}
