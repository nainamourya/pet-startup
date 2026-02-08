import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, MapPin, Calendar, PawPrint, Star } from "lucide-react";

export default function FindSitter() {
  const navigate = useNavigate();
  const location = useLocation();

  const [petType, setPetType] = useState("Dog");
  const [service, setService] = useState("Walk");
  const [city, setCity] = useState("");
  const [date, setDate] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [ratings, setRatings] = useState({});

  // ---------- EXISTING LOGIC (UNCHANGED) ----------
  const fetchSitters = async (cityParam, dateParam) => {
    const res = await fetch(
      `http://localhost:5000/api/sitters?city=${encodeURIComponent(
        cityParam.trim()
      )}`
    );

    const allSitters = await res.json();

    const available = allSitters.filter((s) => {
      if (!Array.isArray(s.availableDates) || s.availableDates.length === 0) {
        return true;
      }
      return s.availableDates.includes(dateParam);
    });

    const map = {};
    await Promise.all(
      available.map(async (s) => {
        try {
          const r = await fetch(
            `http://localhost:5000/api/reviews?sitterId=${s._id}`
          );
          const reviews = await r.json();

          if (Array.isArray(reviews) && reviews.length) {
            const avg =
              reviews.reduce((a, c) => a + c.rating, 0) / reviews.length;

            map[s._id] = { avg: avg.toFixed(1), count: reviews.length };
          } else {
            map[s._id] = { avg: null, count: 0 };
          }
        } catch {
          map[s._id] = { avg: null, count: 0 };
        }
      })
    );

    return { available, ratingsMap: map };
  };

  useEffect(() => {
    if (results.length > 0) return;

    if (location.state?.results) {
      setResults(location.state.results);
      setCity(location.state.city || "");
      setDate(location.state.date || "");
      return;
    }
  }, [location.state, results.length]);

  const handleSearch = async () => {
    if (!date) {
      setError("Please select a date for your booking.");
      return;
    }

    setError("");
    setLoading(true);
    setRatings({});

    try {
      const { available, ratingsMap } = await fetchSitters(city, date);
      setResults(available);
      setRatings(ratingsMap);

      sessionStorage.setItem(
        "findSitterState",
        JSON.stringify({ city, date, results: available })
      );
    } catch {
      setError("Failed to fetch sitters. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="pt-28 pb-24 px-6 bg-[#F8FAFC] relative overflow-hidden">
      
      {/* Ambient SVG */}
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "sine.inOut" }}
        className="absolute top-32 right-24 opacity-10 hidden md:block"
      >
        <PawPrint size={96} />
      </motion.div>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-4xl font-semibold text-gray-900">
            Find the Perfect Sitter
          </h1>
          <p className="mt-3 text-gray-600">
            Trusted sitters, calm care, zero stress.
          </p>
        </motion.div>

        {/* Search Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="mt-12 bg-white rounded-3xl border shadow-sm p-8 grid gap-6 md:grid-cols-2"
        >
          <Field icon={<PawPrint size={16} />} label="Pet Type">
            <select className="input" value={petType} onChange={(e) => setPetType(e.target.value)}>
              <option>Dog</option>
              <option>Cat</option>
              <option>Other</option>
            </select>
          </Field>

          <Field icon={<Search size={16} />} label="Service">
            <select className="input" value={service} onChange={(e) => setService(e.target.value)}>
              <option>Walk</option>
              <option>Day Care</option>
              <option>Boarding</option>
            </select>
          </Field>

          <Field icon={<MapPin size={16} />} label="City">
            <input className="input" placeholder="Enter city" value={city} onChange={(e) => setCity(e.target.value)} />
          </Field>

          <Field icon={<Calendar size={16} />} label="Date">
            <input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              className="input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </Field>

          {error && (
            <p className="text-sm text-red-500 md:col-span-2">{error}</p>
          )}

          <button
            onClick={handleSearch}
            className="md:col-span-2 mt-4 py-3 rounded-full bg-gradient-to-r from-[#0047FF] to-[#0098D7] text-white font-medium hover:opacity-95 transition"
          >
            {loading ? "Searching..." : "Find Sitters"}
          </button>
        </motion.div>

        {/* Results */}
        {results.length > 0 && (
          <div className="mt-16 space-y-6">
            {results.map((sitter) => (
              <motion.div
                key={sitter._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border p-6 flex justify-between items-center hover:shadow-md transition"
              >
                <div>
                  <h3
                    className="text-lg font-semibold text-blue-600 cursor-pointer hover:underline"
                    onClick={() =>
                      navigate(`/sitter/${sitter._id}`, {
                        state: { city, date, results },
                      })
                    }
                  >
                    {sitter.name}
                  </h3>

                  <p className="text-sm text-gray-600 mt-1">
                    {sitter.city} • {sitter.experience}
                  </p>

                  {ratings[sitter._id]?.count > 0 && (
                    <p className="mt-1 text-sm text-gray-600 flex items-center gap-1">
                      <Star size={14} /> {ratings[sitter._id].avg} ({ratings[sitter._id].count})
                    </p>
                  )}
                </div>

                <div className="text-right">
                  <p className="font-medium">{sitter.price}</p>
                  <button
                    onClick={() =>
                      navigate(`/book/${sitter._id}`, {
                        state: { sitter, date, service },
                      })
                    }
                    className="mt-3 px-4 py-2 rounded-full bg-gray-900 text-white text-sm"
                  >
                    Book
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------- UI Helper ---------- */
function Field({ label, icon, children }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
        {icon} {label}
      </label>
      {children}
    </div>
  );
}
