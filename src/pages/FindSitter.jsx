import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

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

  // Restore previous search when coming back
  useEffect(() => {
    const saved = sessionStorage.getItem("findSitterState");
    if (saved) {
      const { city, date, results } = JSON.parse(saved);
      setCity(city || "");
      setDate(date || "");
      setResults(results || []);
    }
  }, []);

  const handleSearch = async () => {
    if (!date) {
      setError("Please select a date for your booking.");
      return;
    }

    setError("");
    setLoading(true);
    setRatings({});

    try {
      const res = await fetch(
        `http://localhost:5000/api/sitters?city=${encodeURIComponent(
          city.trim()
        )}`
      );
      const sitters = await res.json();

      setResults(sitters);

      // Save state so it survives back-navigation
      sessionStorage.setItem(
        "findSitterState",
        JSON.stringify({ city, date, results: sitters })
      );

      // Fetch reviews for each sitter
      const map = {};
      await Promise.all(
        sitters.map(async (s) => {
          const r = await fetch(
            `http://localhost:5000/api/reviews?sitterId=${s._id}`
          );
          const reviews = await r.json();

          if (reviews.length) {
            const avg =
              reviews.reduce((a, c) => a + c.rating, 0) / reviews.length;
            map[s._id] = {
              avg: avg.toFixed(1),
              count: reviews.length,
            };
          } else {
            map[s._id] = { avg: null, count: 0 };
          }
        })
      );

      setRatings(map);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch sitters. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 px-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold">Find the Perfect Sitter</h1>
      <p className="mt-2 text-gray-600">
        Tell us a little about your pet and what you need.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium">Pet Type</label>
          <select
            className="mt-1 w-full rounded-lg border p-3"
            value={petType}
            onChange={(e) => setPetType(e.target.value)}
          >
            <option>Dog</option>
            <option>Cat</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Service</label>
          <select
            className="mt-1 w-full rounded-lg border p-3"
            value={service}
            onChange={(e) => setService(e.target.value)}
          >
            <option>Walk</option>
            <option>Day Care</option>
            <option>Boarding</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">City</label>
          <input
            className="mt-1 w-full rounded-lg border p-3"
            placeholder="Enter your city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Date</label>
          <input
            type="date"
            min={new Date().toISOString().split("T")[0]}
            className="mt-1 w-full rounded-lg border p-3"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>

      {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}

      <button
        onClick={handleSearch}
        className="mt-8 w-full md:w-auto px-8 py-3 rounded-full bg-black text-white hover:bg-gray-800 transition"
      >
        {loading ? "Searching..." : "Find Sitters"}
      </button>

      {results.length > 0 && (
        <div className="mt-12 grid gap-6">
          <h2 className="text-2xl font-semibold">Available Sitters</h2>

          {results.map((sitter) => (
            <div
              key={sitter._id}
              className="p-5 rounded-xl border flex items-center justify-between hover:shadow-md transition"
            >
              <div>
                <h3
                  className="font-semibold text-lg cursor-pointer text-blue-600 hover:underline"
                  onClick={() =>
                    navigate(`/sitter/${sitter._id}`, {
                      state: { city, date, results },
                    })
                  }
                >
                  {sitter.name}
                </h3>

                <p className="text-sm text-gray-600">
                  {sitter.city} • {sitter.experience} experience
                </p>

                {ratings[sitter._id] ? (
                  ratings[sitter._id].count > 0 ? (
                    <p className="text-sm text-gray-600 mt-1">
                      ⭐ {ratings[sitter._id].avg} (
                      {ratings[sitter._id].count} reviews)
                    </p>
                  ) : (
                    <p className="text-sm text-gray-400 mt-1">
                      No reviews yet
                    </p>
                  )
                ) : (
                  <p className="text-sm text-gray-400 mt-1">
                    Loading reviews...
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
                  className="mt-2 px-4 py-2 rounded-full bg-gray-900 text-white text-sm"
                >
                  Book
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
