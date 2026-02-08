import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  MapPin,
  Briefcase,
  IndianRupee,
  FileText,
  Camera,
  Sparkles,
  ShieldCheck,
  Wallet,
  Scale,
  AlertCircle,
} from "lucide-react";
export default function BecomeSitter() {
  const [form, setForm] = useState({
    name: "",
    city: "",
    experience: "",
    services: [],
    price: "",
    bio: "",
    photo: "",
    address: "", // ✅ added
  });

  const [success, setSuccess] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
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

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Please login first.");
      return;
    }

    const res = await fetch("http://localhost:5000/api/sitters", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        ...form,
      }),
    });

    const data = await res.json();

    // Update localStorage with sitterProfile
    localStorage.setItem(
      "user",
      JSON.stringify({
        ...user,
        role: "sitter",
        sitterProfile: String(data.sitter._id),
      })
    );

    setSuccess(true);
  };

  if (success) {
    return (
      <div className="pt-24 px-6 max-w-xl mx-auto text-center">
        <h1 className="text-3xl font-bold">Application Submitted 🎉</h1>
        <p className="mt-3 text-gray-600">
          You’re now part of PetSitter. You can open your Dashboard.
        </p>
      </div>
    );
  }
  const handlePhotoUpload = (file) => {
    if (!file) return;
  
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file.");
      return;
    }
  
    if (file.size > 2 * 1024 * 1024) {
      alert("Image size should be less than 2MB.");
      return;
    }
  
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, photo: reader.result }));
      setPhotoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const fetchCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your device.");
      return;
    }
  
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
  
        try {
          const res = await fetch(
            `http://localhost:5000/api/location/reverse-geocode?lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
  
          setForm((prev) => ({
            ...prev,
            address: data.display_name || "",
          }));
        } catch (err) {
          alert("Unable to fetch address. Please enter manually.");
        }
      },
      () => {
        alert("Location permission denied. Please enter address manually.");
      }
    );
  };

  return (
    <section className="relative pt-28 pb-24 px-6 bg-[#F8FAFC] overflow-hidden">

      
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-start">
      {/* Ambient icon */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "sine.inOut" }}
        className="absolute top-24 right-24 opacity-20 hidden md:block"
      >
        <Sparkles size={48} className="text-blue-400" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-xl mx-auto bg-white rounded-3xl shadow-sm border p-8 sm:p-10"
      >
        {/* Header */}
        <h1 className="text-3xl font-semibold text-gray-900 flex items-center gap-2">
          Become a PetSitter
        </h1>
        <p className="mt-3 text-sm text-gray-600">
          Create a profile pet owners can trust.
        </p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-6">

          {/* Name */}
          <Field label="Full Name" icon={<User size={16} />}>
            <input required minLength={2} placeholder="Your name"
              className="input"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Field>

          {/* City */}
          <Field label="City" icon={<MapPin size={16} />}>
            <input required placeholder="City you operate in"
              className="input"
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
          </Field>

          {/* Address */}
          <Field label="Address" icon={<MapPin size={16} />}>
            <div className="flex gap-2">
              <input required value={form.address}
                placeholder="Full address"
                className="input flex-1"
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
              <button type="button" onClick={fetchCurrentLocation}
                className="px-4 rounded-lg border text-sm hover:bg-gray-100">
                Use Current Location
              </button>
            
            </div>
          </Field>

          {/* Experience */}
          <Field label="Experience" icon={<Briefcase size={16} />}>
            <div className="flex gap-3">
              <select required className="input"
                onChange={(e) =>
                  setForm((p) => ({ ...p, experience: `${e.target.value} years` }))
                }>
                <option value="">Years</option>
                {[...Array(21)].map((_, i) => <option key={i}>{i}</option>)}
              </select>
              <select required className="input"
                onChange={(e) =>
                  setForm((p) => ({ ...p, experience: `${p.experience} ${e.target.value} months` }))
                }>
                <option value="">Months</option>
                {[0, 3, 6, 9].map((m) => <option key={m}>{m}</option>)}
              </select>
            </div>
          </Field>

          {/* Price */}
          <Field label="Price per Day" icon={<IndianRupee size={16} />}>
            <input type="number" min={100} required
              placeholder="e.g. 500"
              className="input"
              onChange={(e) => setForm({ ...form, price: `₹${e.target.value} / day` })}
            />
          </Field>

          {/* Bio */}
          <Field label="About You" icon={<FileText size={16} />}>
            <textarea required minLength={50}
              placeholder="Tell owners why they can trust you"
              className="input min-h-[120px]"
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
            />
          </Field>

          {/* Photo */}
          <Field label="Profile Photo" icon={<Camera size={16} />}>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handlePhotoUpload(e.dataTransfer.files[0])}
              className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:border-blue-400"
            >
              <input type="file" accept="image/*" hidden id="photo"
                onChange={(e) => handlePhotoUpload(e.target.files[0])}
              />
              <label htmlFor="photo" className="cursor-pointer">
                {photoPreview ? (
                  <img src={photoPreview} className="mx-auto h-28 w-28 rounded-full object-cover" />
                ) : (
                  <p className="text-sm text-gray-500">Upload photo (optional)</p>
                )}
              </label>
            </div>
          </Field>

          {/* Services */}
          <div>
            <label className="text-sm font-medium text-gray-700">Services</label>
            <div className="mt-3 flex gap-3 flex-wrap">
              {["Walk", "Day Care", "Boarding"].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleService(s)}
                  className={`px-4 py-2 rounded-full text-sm border transition ${
                    form.services.includes(s)
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-white hover:bg-gray-100"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full mt-6 py-3 rounded-full bg-gradient-to-r from-[#0047FF] to-[#0098D7] text-white font-medium hover:opacity-95 transition"
          >
            Submit Application
          </button>

        </form>
      </motion.div>
      {/* ================= RULES & POLICIES ================= */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-10"
        >
          <Policy
            icon={<ShieldCheck />}
            title="Eligibility & Verification"
            text="Sitters must provide accurate information. PetSitter may verify profiles, reviews, and activity to ensure platform safety."
          />
          <Policy
            icon={<Wallet />}
            title="Payments & Withdrawals"
            text="Earnings are released after successful service completion. Withdrawals are subject to platform review and processing timelines."
          />
          <Policy
            icon={<Scale />}
            title="Refunds & Cancellations"
            text="Refunds are handled based on booking status, sitter responsibility, and service completion guidelines."
          />
          <Policy
            icon={<FileText />}
            title="Conduct & Responsibility"
            text="Sitters are expected to act professionally, communicate clearly, and prioritize pet safety at all times."
          />
          <Policy
            icon={<AlertCircle />}
            title="Platform Protection"
            text="Any misuse, misrepresentation, or unsafe behavior may result in suspension or removal from PetSitter."
          />
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- Helper ---------- */

function Field({ label, icon, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
        {icon} {label}
      </label>
      {children}
    </div>
  );
}

function Policy({ icon, title, text }) {
  return (
    <div className="bg-white rounded-2xl border shadow-sm p-6 flex gap-4">
      <div className="text-blue-600 shrink-0">
        {icon}
      </div>

      <div>
        <h3 className="font-semibold text-gray-900">
          {title}
        </h3>
        <p className="mt-2 text-sm text-gray-600 leading-relaxed">
          {text}
        </p>
      </div>
    </div>
  );
}

