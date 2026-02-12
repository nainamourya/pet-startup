import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, MapPin, Calendar, PawPrint, Star } from "lucide-react";
import API_BASE_URL from "../config/api";

// Additional Professional SVG Icons
const Icons = {
  Shield: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  Heart: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  ),
  Sparkles: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
  Users: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  ArrowRight: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  ),
  Check: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  AlertCircle: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Award: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  )
};

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
      `${API_BASE_URL}/api/sitters?city=${encodeURIComponent(
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
            `${API_BASE_URL}/api/reviews?sitterId=${s._id}`
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
    <section className="min-h-screen pt-20 sm:pt-28 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
      
      {/* Floating Background Icons */}
      <motion.div
        animate={{ y: [0, -12, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-32 right-16 opacity-10 hidden lg:block"
      >
        <PawPrint size={120} className="text-blue-600" />
      </motion.div>

      <motion.div
        animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-32 left-16 opacity-10 hidden lg:block"
      >
        <Icons.Heart className="w-32 h-32 text-purple-600" />
      </motion.div>

      <motion.div
        animate={{ scale: [1, 1.1, 1], rotate: [0, 360, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 right-32 opacity-10 hidden xl:block"
      >
        <Star size={80} className="text-yellow-500" />
      </motion.div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md border border-blue-100 mb-6"
          >
            <Icons.Shield className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-semibold text-gray-700">
              100% Verified Sitters
            </span>
          </motion.div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Find the Perfect <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Sitter</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Trusted sitters, calm care, zero stress. Book verified pet care professionals in your area.
          </p>

          {/* Quick Stats */}
          <div className="mt-8 flex flex-wrap justify-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
              <Icons.Users className="w-5 h-5 text-blue-600" />
              <div className="text-left">
                <p className="text-xs text-gray-500">Active Sitters</p>
                <p className="text-sm font-bold text-gray-900">2,500+</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
              <Star className="w-5 h-5 text-yellow-500" fill="currentColor" />
              <div className="text-left">
                <p className="text-xs text-gray-500">Avg Rating</p>
                <p className="text-sm font-bold text-gray-900">4.9/5</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
              <Icons.Check className="w-5 h-5 text-green-600" />
              <div className="text-left">
                <p className="text-xs text-gray-500">Happy Pets</p>
                <p className="text-sm font-bold text-gray-900">10,000+</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 sm:p-8 lg:p-10 mb-12"
        >
          {/* Card Header */}
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Search className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Search for Sitters</h2>
              <p className="text-sm text-gray-600">Find the perfect match for your pet</p>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field icon={<PawPrint size={18} className="text-purple-600" />} label="Pet Type">
              <select 
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-gray-900 font-medium bg-white"
                value={petType} 
                onChange={(e) => setPetType(e.target.value)}
              >
                <option>Dog</option>
                <option>Cat</option>
                <option>Other</option>
              </select>
            </Field>

            <Field icon={<Search size={18} className="text-green-600" />} label="Service">
              <select 
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-gray-900 font-medium bg-white"
                value={service} 
                onChange={(e) => setService(e.target.value)}
              >
                <option>Walk</option>
                <option>Day Care</option>
                <option>Boarding</option>
              </select>
            </Field>

            <Field icon={<MapPin size={18} className="text-red-600" />} label="City">
              <input 
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-gray-900 placeholder-gray-400"
                placeholder="e.g., Mumbai, Delhi, Bangalore" 
                value={city} 
                onChange={(e) => setCity(e.target.value)} 
              />
            </Field>

            <Field icon={<Calendar size={18} className="text-blue-600" />} label="Date">
              <input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-gray-900"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </Field>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 bg-red-50 border-l-4 border-red-500 rounded-lg p-4 flex items-start gap-3"
            >
              <Icons.AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-900">Error</p>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </motion.div>
          )}

          <button
            onClick={handleSearch}
            disabled={loading}
            className="w-full mt-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 group"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Searching...</span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span>Find Sitters</span>
                <Icons.ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </motion.div>

        {/* Results Section */}
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Available Sitters</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Found {results.length} {results.length === 1 ? 'sitter' : 'sitters'} in {city || 'your area'}
                </p>
              </div>
              <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
                {results.length} Results
              </div>
            </div>

            {/* Results Grid */}
            <div className="space-y-4">
              {results.map((sitter, index) => (
                <motion.div
                  key={sitter._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    {/* Sitter Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        {/* Avatar */}
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-lg">
                          {sitter.name.charAt(0).toUpperCase()}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3
                              className="text-lg sm:text-xl font-bold text-blue-600 cursor-pointer hover:text-blue-700 transition-colors group-hover:underline"
                              onClick={() =>
                                navigate(`/sitter/${sitter._id}`, {
                                  state: { city, date, results },
                                })
                              }
                            >
                              {sitter.name}
                            </h3>
                            {sitter.verified && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                                <Icons.Shield className="w-3 h-3" />
                                Verified
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3 mt-2 text-sm text-gray-600 flex-wrap">
                            <div className="flex items-center gap-1">
                              <MapPin size={14} />
                              <span>{sitter.city}</span>
                            </div>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Icons.Award className="w-4 h-4" />
                              <span>{sitter.experience}</span>
                            </div>
                          </div>

                          {ratings[sitter._id]?.count > 0 && (
                            <div className="mt-2 flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    size={16}
                                    className={star <= Math.round(parseFloat(ratings[sitter._id].avg)) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                                  />
                                ))}
                              </div>
                              <span className="text-sm font-semibold text-gray-900">
                                {ratings[sitter._id].avg}
                              </span>
                              <span className="text-sm text-gray-500">
                                ({ratings[sitter._id].count} {ratings[sitter._id].count === 1 ? 'review' : 'reviews'})
                              </span>
                            </div>
                          )}

                          {ratings[sitter._id]?.count === 0 && (
                            <p className="mt-2 text-sm text-gray-500 flex items-center gap-1">
                              <Star size={14} />
                              No reviews yet
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Price and Action */}
                    <div className="flex sm:flex-col items-center sm:items-end gap-4 sm:gap-3 w-full sm:w-auto">
                      <div className="flex-1 sm:flex-none text-left sm:text-right">
                        <p className="text-xs text-gray-500 mb-1">Starting at</p>
                        <p className="text-2xl font-bold text-gray-900">{sitter.price}</p>
                        <p className="text-xs text-gray-500 mt-1">per service</p>
                      </div>
                      
                      <button
                        onClick={() =>
                          navigate(`/book/${sitter._id}`, {
                            state: { sitter, date, service },
                          })
                        }
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-gray-900 to-gray-800 text-white font-semibold hover:from-gray-800 hover:to-gray-700 transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg flex items-center gap-2 whitespace-nowrap"
                      >
                        <span>Book Now</span>
                        <Icons.ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && results.length === 0 && date && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl border border-gray-200 p-12 text-center"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Sitters Found</h3>
            <p className="text-gray-600 mb-6">
              We couldn't find any sitters matching your criteria. Try adjusting your search.
            </p>
            <button
              onClick={() => {
                setCity("");
                setDate("");
                setResults([]);
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all"
            >
              <Search className="w-5 h-5" />
              New Search
            </button>
          </motion.div>
        )}

        {/* How It Works Section */}
        {results.length === 0 && !date && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-16"
          >
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center hover:shadow-lg transition-shadow">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <Search className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">1. Search</h3>
                <p className="text-sm text-gray-600">Enter your location and preferred date to find available sitters</p>
              </div>
              
              <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center hover:shadow-lg transition-shadow">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <Icons.Check className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">2. Choose</h3>
                <p className="text-sm text-gray-600">Browse verified profiles and read reviews from other pet owners</p>
              </div>
              
              <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center hover:shadow-lg transition-shadow">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                  <Icons.Heart className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">3. Book</h3>
                <p className="text-sm text-gray-600">Secure your booking with our trusted payment system</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

/* ---------- Enhanced UI Helper ---------- */
function Field({ label, icon, children }) {
  return (
    <div>
      <label className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2 uppercase tracking-wide">
        {icon} {label}
      </label>
      {children}
    </div>
  );
}