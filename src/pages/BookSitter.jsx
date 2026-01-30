import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function BookSitter() {
  const location = useLocation();
  const navigate = useNavigate();
  const { sitter, service } = location.state || {};

  // Common pet fields
  const [petName, setPetName] = useState("");
  const [petType, setPetType] = useState("Dog");
  const [petAge, setPetAge] = useState("");
  const [petNotes, setPetNotes] = useState("");
  const [error, setError] = useState("");

  // Walk
  const [walkDate, setWalkDate] = useState("");
  const [fromHour, setFromHour] = useState("");
  const [toHour, setToHour] = useState("");

  // Boarding
  const [boardStart, setBoardStart] = useState("");
  const [boardEnd, setBoardEnd] = useState("");
  const [medicine, setMedicine] = useState("");
  const [vetNumber, setVetNumber] = useState("");
  const [emergencyNotes, setEmergencyNotes] = useState("");

  // Other services
  const [date, setDate] = useState("");

  const isWalking = service?.toLowerCase().includes("walk");
  const isBoarding = service?.toLowerCase().includes("board");

  const handleConfirm = async () => {
    if (!sitter?._id) {
      setError("No sitter selected.");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Please login to book a sitter.");
      return;
    }

    // WALK VALIDATION
    if (isWalking) {
      if (!walkDate || !fromHour || !toHour) {
        setError("Please select date and time.");
        return;
      }
      if (Number(toHour) <= Number(fromHour)) {
        setError("End time must be after start time.");
        return;
      }
    }

    // BOARDING VALIDATION
    if (isBoarding) {
      if (!boardStart || !boardEnd) {
        setError("Please select boarding start and end dates.");
        return;
      }
      if (new Date(boardEnd) <= new Date(boardStart)) {
        setError("End date must be after start date.");
        return;
      }
      if (!vetNumber) {
        setError("Vet phone number is required for boarding.");
        return;
      }
    }

    // NORMAL DATE VALIDATION
    if (!isWalking && !isBoarding && !date) {
      setError("Please select a date.");
      return;
    }

    const res = await fetch("http://localhost:5000/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sitterId: sitter._id,
        ownerId: user.id,
        service,

        walk: isWalking
          ? { date: walkDate, from: fromHour, to: toHour }
          : undefined,

        boarding: isBoarding
          ? {
              startDate: boardStart,
              endDate: boardEnd,
              medicine,
              vetNumber,
              emergencyNotes,
            }
          : undefined,

        date: !isWalking && !isBoarding ? date : undefined,

        pet: {
          name: petName,
          type: petType,
          age: petAge,
          notes: petNotes,
        },
      }),
    });

    if (!res.ok) {
      const d = await res.json();
      setError(d.message || "Booking failed");
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

      <div className="mt-6 p-6 rounded-xl border">
        <h2 className="text-xl font-semibold">{sitter.name}</h2>
        <p className="text-gray-600">{sitter.city}</p>
        <p className="mt-2">
          Service: <b>{service}</b>
        </p>
        <p className="mt-2">
          Price: <b>{sitter.price}</b>
        </p>
      </div>

      <div className="mt-6 space-y-3">
        <input
          placeholder="Pet name"
          className="w-full border p-3 rounded-lg"
          value={petName}
          onChange={(e) => {
            setPetName(e.target.value);
            setError("");
          }}
        />

        <select
          className="w-full border p-3 rounded-lg"
          value={petType}
          onChange={(e) => {
            setPetType(e.target.value);
            setError("");
          }}
        >
          <option>Dog</option>
          <option>Cat</option>
          <option>Other</option>
        </select>

        <input
          placeholder="Pet age (years / months)"
          className="w-full border p-3 rounded-lg"
          value={petAge}
          onChange={(e) => {
            setPetAge(e.target.value);
            setError("");
          }}
        />

        <textarea
          placeholder="Notes about your pet"
          className="w-full border p-3 rounded-lg"
          value={petNotes}
          onChange={(e) => {
            setPetNotes(e.target.value);
            setError("");
          }}
        />

        {/* WALK */}
        {isWalking && (
          <>
            <input
              type="date"
              className="w-full border p-3 rounded-lg"
              value={walkDate}
              onChange={(e) => {
                setWalkDate(e.target.value);
                setError("");
              }}
            />

            <div className="flex gap-3">
              <select
                className="w-full border p-3 rounded-lg"
                value={fromHour}
                onChange={(e) => {
                  setFromHour(e.target.value);
                  setError("");
                }}
              >
                <option value="">From</option>
                {[...Array(15)].map((_, i) => {
                  const h = i + 6;
                  return (
                    <option key={h} value={h}>
                      {h}:00
                    </option>
                  );
                })}
              </select>

              <select
                className="w-full border p-3 rounded-lg"
                value={toHour}
                onChange={(e) => {
                  setToHour(e.target.value);
                  setError("");
                }}
              >
                <option value="">To</option>
                {[...Array(15)].map((_, i) => {
                  const h = i + 7;
                  return (
                    <option key={h} value={h}>
                      {h}:00
                    </option>
                  );
                })}
              </select>
            </div>
          </>
        )}

        {/* BOARDING */}
        {isBoarding && (
          <>
            <input
              type="date"
              className="w-full border p-3 rounded-lg"
              value={boardStart}
              onChange={(e) => {
                setBoardStart(e.target.value);
                setError("");
              }}
            />
            <input
              type="date"
              className="w-full border p-3 rounded-lg"
              value={boardEnd}
              onChange={(e) => {
                setBoardEnd(e.target.value);
                setError("");
              }}
            />

            <input
              placeholder="Vet phone number (required)"
              className="w-full border p-3 rounded-lg"
              value={vetNumber}
              onChange={(e) => {
                setVetNumber(e.target.value);
                setError("");
              }}
            />

            <textarea
              placeholder="Medicine details (if any)"
              className="w-full border p-3 rounded-lg"
              value={medicine}
              onChange={(e) => {
                setMedicine(e.target.value);
                setError("");
              }}
            />

            <textarea
              placeholder="Emergency instructions"
              className="w-full border p-3 rounded-lg"
              value={emergencyNotes}
              onChange={(e) => {
                setEmergencyNotes(e.target.value);
                setError("");
              }}
            />
          </>
        )}

        {!isWalking && !isBoarding && (
          <input
            type="date"
            className="w-full border p-3 rounded-lg"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setError("");
            }}
          />
        )}

        {error && <p className="text-sm text-red-500">{error}</p>}
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
