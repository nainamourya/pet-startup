import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import API_BASE_URL from "../config/api";
const dogBreeds = [
  "Labrador Retriever",
  "Golden Retriever",
  "German Shepherd",
  "Pug",
  "Beagle",
  "Shih Tzu",
  "Rottweiler",
  "Doberman",
  "Indie",
  "Other"
];

const catBreeds = [
  "Persian",
  "Siamese",
  "Maine Coon",
  "British Shorthair",
  "Ragdoll",
  "Bengal",
  "Indian Billi",
  "Other"
];
// Professional SVG Icons
const Icons = {
  Calendar: ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  Clock: ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Pet: ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Home: ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  Medical: ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  Phone: ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  ),
  AlertCircle: ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Check: ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  User: ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  Location: ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  ArrowRight: ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  )
};

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
  const [loading, setLoading] = useState(false);

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
  const [petBreed, setPetBreed] = useState("");
  const [customBreed, setCustomBreed] = useState("");

  // Other services
  const [date, setDate] = useState("");

  const isWalking = service?.toLowerCase().includes("walk");
  const isBoarding = service?.toLowerCase().includes("board");
  const isDayCare = service?.toLowerCase().includes("day");

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

    setLoading(true);

    const res = await fetch(`${API_BASE_URL}/api/bookings`, {
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
          breed: petBreed === "Other" ? customBreed : petBreed,
          age: petAge,
          notes: petNotes,
        },
      }),
    });

    setLoading(false);

    if (!res.ok) {
      const d = await res.json();
      setError(d.message || "Booking failed");
      return;
    }

    navigate("/my-bookings");
  };
  const getServicePrice = () => {
    if (!sitter?.price) return 0;

    switch (service) {
      case "Boarding":
        return sitter.price.boarding;
      case "Walk":
        return sitter.price.walking60;
      case "Day Care":
        return sitter.price.dayCare;
      case "Hourly Sitting":
        return sitter.price.hourly;
      default:
        return sitter.price.dayCare;
    }
  };
  if (!sitter) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-24 px-4 flex items-center justify-center">
        <div className="text-center p-12 bg-white rounded-3xl shadow-xl border border-gray-100">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
            <Icons.AlertCircle className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Sitter Selected</h2>
          <p className="text-gray-600 mb-6">Please select a sitter from the search page</p>
          <button
            onClick={() => navigate("/find")}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
          >
            Find a Sitter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-20 sm:pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg">
              <Icons.Calendar className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Confirm <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Booking</span>
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                Complete your booking details
              </p>
            </div>
          </div>
        </div>

        {/* Sitter Info Card */}
        <div className="mb-8 p-6 sm:p-8 rounded-3xl bg-white border border-gray-100 shadow-lg">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg flex-shrink-0">
              {sitter.name?.charAt(0).toUpperCase()}
            </div>

            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{sitter.name}</h2>

              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Icons.Location className="w-5 h-5 text-blue-600" />
                  <span className="text-sm">{sitter.city}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
                  <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">Service</p>
                  <p className="text-lg font-bold text-gray-900">{service}</p>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
                  <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">Price</p>
                  <p className="text-lg font-bold text-gray-900">
                    ₹{
                      service === "Boarding"
                        ? sitter.price?.boarding
                        : service === "Walk"
                          ? sitter.price?.walking60
                          : service === "Day Care"
                            ? sitter.price?.dayCare
                            : service === "Hourly Sitting"
                              ? sitter.price?.hourly
                              : sitter.price?.dayCare
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-lg overflow-hidden">
          {/* Pet Information Section */}
          <div className="p-6 sm:p-8 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-blue-100">
                <Icons.Pet className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Pet Information</h3>
                <p className="text-sm text-gray-500">Tell us about your furry friend</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                  Pet Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Max, Bella, Luna"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-gray-900 placeholder-gray-400"
                  value={petName}
                  onChange={(e) => {
                    setPetName(e.target.value);
                    setError("");
                  }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                    Pet Type *
                  </label>
                  <select
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-gray-900 bg-white"
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
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                    Age *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 2 years, 8 months"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-gray-900 placeholder-gray-400"
                    value={petAge}
                    onChange={(e) => {
                      setPetAge(e.target.value);
                      setError("");
                    }}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                  Breed *
                </label>

                <select
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-gray-900 bg-white"
                  value={petBreed}
                  onChange={(e) => {
                    setPetBreed(e.target.value);
                    setCustomBreed("");
                    setError("");
                  }}
                >
                  <option value="">Select breed</option>

                  {(petType === "Dog" ? dogBreeds : catBreeds).map((breed) => (
                    <option key={breed} value={breed}>
                      {breed}
                    </option>
                  ))}
                </select>

                {petBreed === "Other" && (
                  <input
                    type="text"
                    placeholder="Enter breed"
                    className="mt-3 w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-gray-900"
                    value={customBreed}
                    onChange={(e) => {
                      setCustomBreed(e.target.value);
                      setError("");
                    }}
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                  Special Notes (Optional)
                </label>
                <textarea
                  placeholder="Any special requirements, allergies, or behavioral notes..."
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-gray-900 placeholder-gray-400 resize-none"
                  value={petNotes}
                  onChange={(e) => {
                    setPetNotes(e.target.value);
                    setError("");
                  }}
                />
              </div>
            </div>
          </div>

          {/* Service Details Section */}
          <div className="p-6 sm:p-8 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-purple-100">
                <Icons.Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Schedule Details</h3>
                <p className="text-sm text-gray-500">When do you need the service?</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* WALK */}
              {isWalking && (
                <>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide flex items-center gap-2">
                      <Icons.Calendar className="w-4 h-4 text-blue-600" />
                      Walk Date *
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-gray-900"
                      value={walkDate}
                      onChange={(e) => {
                        setWalkDate(e.target.value);
                        setError("");
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide flex items-center gap-2">
                        <Icons.Clock className="w-4 h-4 text-blue-600" />
                        From *
                      </label>
                      <select
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-gray-900 bg-white"
                        value={fromHour}
                        onChange={(e) => {
                          setFromHour(e.target.value);
                          setError("");
                        }}
                      >
                        <option value="">Select time</option>
                        {[...Array(15)].map((_, i) => {
                          const h = i + 6;
                          return (
                            <option key={h} value={h}>
                              {h}:00
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide flex items-center gap-2">
                        <Icons.Clock className="w-4 h-4 text-blue-600" />
                        To *
                      </label>
                      <select
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-gray-900 bg-white"
                        value={toHour}
                        onChange={(e) => {
                          setToHour(e.target.value);
                          setError("");
                        }}
                      >
                        <option value="">Select time</option>
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
                  </div>
                </>
              )}

              {/* BOARDING */}
              {isBoarding && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide flex items-center gap-2">
                        <Icons.Home className="w-4 h-4 text-purple-600" />
                        Start Date *
                      </label>
                      <input
                        type="date"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all text-gray-900"
                        value={boardStart}
                        onChange={(e) => {
                          setBoardStart(e.target.value);
                          setError("");
                        }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide flex items-center gap-2">
                        <Icons.Home className="w-4 h-4 text-purple-600" />
                        End Date *
                      </label>
                      <input
                        type="date"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all text-gray-900"
                        value={boardEnd}
                        onChange={(e) => {
                          setBoardEnd(e.target.value);
                          setError("");
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide flex items-center gap-2">
                      <Icons.Phone className="w-4 h-4 text-red-600" />
                      Vet Phone Number *
                    </label>
                    <input
                      type="tel"
                      placeholder="Enter veterinarian's contact number"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-100 outline-none transition-all text-gray-900 placeholder-gray-400"
                      value={vetNumber}
                      onChange={(e) => {
                        setVetNumber(e.target.value);
                        setError("");
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide flex items-center gap-2">
                      <Icons.Medical className="w-4 h-4 text-green-600" />
                      Medicine Details (Optional)
                    </label>
                    <textarea
                      placeholder="List any medications, dosage, and schedule..."
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all text-gray-900 placeholder-gray-400 resize-none"
                      value={medicine}
                      onChange={(e) => {
                        setMedicine(e.target.value);
                        setError("");
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide flex items-center gap-2">
                      <Icons.AlertCircle className="w-4 h-4 text-orange-600" />
                      Emergency Instructions (Optional)
                    </label>
                    <textarea
                      placeholder="Emergency contact, special instructions, etc..."
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none transition-all text-gray-900 placeholder-gray-400 resize-none"
                      value={emergencyNotes}
                      onChange={(e) => {
                        setEmergencyNotes(e.target.value);
                        setError("");
                      }}
                    />
                  </div>
                </>
              )}

              {/* OTHER SERVICES */}
              {!isWalking && !isBoarding && (
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide flex items-center gap-2">
                    <Icons.Calendar className="w-4 h-4 text-blue-600" />
                    Service Date *
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-gray-900"
                    value={date}
                    onChange={(e) => {
                      setDate(e.target.value);
                      setError("");
                    }}
                  />
                </div>
              )}
            </div>
          </div>


          {/* Service Timing Policy - ENHANCED UI */}
          {(isDayCare || isBoarding) && (
            <div className="p-6 sm:p-8 border-b border-gray-100 bg-gradient-to-br from-indigo-50/40 via-purple-50/40 to-blue-50/40">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg">
                  <Icons.Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Service Timing Policy
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Standard operating hours & charges
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Day Care Card */}
                {isDayCare && (
                  <div className="bg-white rounded-2xl p-5 border-2 border-blue-200 shadow-md hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                          <Icons.Calendar className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-lg">Day Care</p>
                          <p className="text-xs text-gray-500">12 hours supervised care</p>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg">
                        10:00 AM – 10:00 PM
                      </div>
                    </div>
                  </div>
                )}

                {/* Boarding Card */}
                {isBoarding && (
                  <div className="bg-white rounded-2xl p-5 border-2 border-purple-200 shadow-md hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                          <Icons.Home className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-lg">Boarding</p>
                          <p className="text-xs text-gray-500">24-hour overnight stay</p>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg">
                        10 AM – Next Day 10 AM
                      </div>
                    </div>
                  </div>
                )}

                {/* Additional Charges Card */}
                <div className="bg-white rounded-2xl p-5 border-2 border-gray-200 shadow-md">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-base">
                    <Icons.AlertCircle className="w-5 h-5 text-orange-600" />
                    Additional Charges
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 text-sm mb-1">Extra Hours</p>
                        <p className="text-gray-700 text-sm"><span className="font-bold text-orange-600">₹100</span> per hour beyond standard timing</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-200">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 text-sm mb-1">Extended Stay Policy</p>
                        <p className="text-gray-700 text-sm">If service extends <span className="font-bold text-red-600">beyond 4 extra hours</span>, full day charge will apply</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info Note */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4 flex gap-3">
                  <Icons.AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-900">
                    <span className="font-bold">Note:</span> All timings are strict. Late pick-ups or early drop-offs will incur additional charges as per the policy above.
                  </p>
                </div>
              </div>
            </div>
          )}


          {/* Error Alert */}
          {error && (
            <div className="p-6 sm:p-8 border-b border-gray-100">
              <div className="p-4 rounded-xl bg-red-50 border-l-4 border-red-500 flex items-start gap-3">
                <Icons.AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-900 text-sm">Error</p>
                  <p className="text-red-700 text-sm mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="p-6 sm:p-8 bg-gray-50">
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <>
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </>

              ) : (
                <>
                  <Icons.Check className="w-6 h-6" />
                  <span>Confirm Booking</span>
                  <Icons.ArrowRight className="w-6 h-6" />
                </>
              )}
            </button>

            <p className="text-center text-sm text-gray-500 mt-4">
              You'll be able to pay after the sitter confirms your booking
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}