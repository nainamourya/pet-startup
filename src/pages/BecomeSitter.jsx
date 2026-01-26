import { useState } from "react";

export default function BecomeSitter() {
  const [form, setForm] = useState({
    name: "",
    city: "",
    experience: "",
    services: [],
    price: "",
  });

  const [success, setSuccess] = useState(false);

  const toggleService = (service) => {
    setForm((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch("http://localhost:5000/api/sitters", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setSuccess(true);
  };

  if (success) {
    return (
      <div className="pt-24 px-6 max-w-xl mx-auto text-center">
        <h1 className="text-3xl font-bold">Application Submitted 🎉</h1>
        <p className="mt-3 text-gray-600">
          You’re now part of PetSitter. You’ll appear in search results.
        </p>
      </div>
    );
  }

  return (
    <div className="pt-24 px-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold">Become a PetSitter</h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <input
          placeholder="Your name"
          className="w-full border p-3 rounded-lg"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="City"
          className="w-full border p-3 rounded-lg"
          onChange={(e) => setForm({ ...form, city: e.target.value })}
        />

        <input
          placeholder="Experience (e.g. 2 years)"
          className="w-full border p-3 rounded-lg"
          onChange={(e) => setForm({ ...form, experience: e.target.value })}
        />

        <input
          placeholder="Price (e.g. ₹500 / day)"
          className="w-full border p-3 rounded-lg"
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />

        <div className="flex gap-3">
          {["Walk", "Day Care", "Boarding"].map((s) => (
            <button
              type="button"
              key={s}
              onClick={() => toggleService(s)}
              className={`px-4 py-2 rounded-full border ${
                form.services.includes(s)
                  ? "bg-black text-white"
                  : "bg-white"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <button className="w-full mt-4 bg-black text-white py-3 rounded-full">
          Submit Application
        </button>
      </form>
    </div>
  );
}
