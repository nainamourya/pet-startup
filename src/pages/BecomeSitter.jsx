import { useState } from "react";
import { motion } from "framer-motion";
import API_BASE_URL from "../config/api";
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
  CreditCard,
  Home,
  CheckCircle2,
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
    address: "",
    aadhaarNumber: "", // ✅ added
    panNumber: "", // ✅ added
    homePhoto: "", // ✅ added
  });

  const [success, setSuccess] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [homePhotoPreview, setHomePhotoPreview] = useState(null);

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

    const res = await fetch(`${API_BASE_URL}/api/sitters`, {
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
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl shadow-lg border p-12"
        >
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Application Submitted! 🎉</h1>
          <p className="mt-4 text-gray-600">
            You're now part of PetSitter. You can open your Dashboard.
          </p>
          <button
            onClick={() => window.location.href = "/dashboard"}
            className="mt-8 px-8 py-3 rounded-full bg-gradient-to-r from-[#0047FF] to-[#0098D7] text-white font-medium hover:opacity-95 transition"
          >
            Go to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  const handlePhotoUpload = (file, type = "profile") => {
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
      if (type === "profile") {
        setForm((prev) => ({ ...prev, photo: reader.result }));
        setPhotoPreview(reader.result);
      } else if (type === "home") {
        setForm((prev) => ({ ...prev, homePhoto: reader.result }));
        setHomePhotoPreview(reader.result);
      }
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
            `${API_BASE_URL}/api/location/reverse-geocode?lat=${latitude}&lon=${longitude}`
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

  const formatAadhaar = (value) => {
    const numbers = value.replace(/\D/g, "");
    const truncated = numbers.slice(0, 12);
    return truncated.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const formatPAN = (value) => {
    return value.toUpperCase().slice(0, 10);
  };

  return (
    <section className="relative pt-28 pb-24 px-6 bg-[#F8FAFC] overflow-hidden">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-start">
        {/* Ambient icon */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
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
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-gray-900 flex items-center justify-center gap-2">
              Become a PetSitter
            </h1>
            <p className="mt-3 text-sm text-gray-600">
              Create a verified profile pet owners can trust.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information Section */}
            <SectionHeader title="Personal Information" />

            {/* Name */}
            <Field label="Full Name" icon={<User size={16} />} required>
              <input
                required
                minLength={2}
                placeholder="Your full name"
                className="input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </Field>

            {/* City */}
            <Field label="City" icon={<MapPin size={16} />} required>
              <input
                required
                placeholder="City you operate in"
                className="input"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
            </Field>

            {/* Address */}
            <Field label="Full Address" icon={<MapPin size={16} />} required>
              <div className="flex gap-2">
                <input
                  required
                  value={form.address}
                  placeholder="Complete address with landmark"
                  className="input flex-1"
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                />
                <button
                  type="button"
                  onClick={fetchCurrentLocation}
                  className="px-4 rounded-lg border text-sm hover:bg-gray-100 transition whitespace-nowrap"
                >
                  Use Location
                </button>
              </div>
            </Field>

            {/* Verification Documents Section */}
            <SectionHeader title="Verification Documents" />

            {/* Aadhaar Number */}
            <Field
              label="Aadhaar Number"
              icon={<CreditCard size={16} />}
              required
              info="12-digit government ID for verification"
            >
              <input
                required
                type="text"
                placeholder="1234 5678 9012"
                className="input"
                value={form.aadhaarNumber}
                onChange={(e) =>
                  setForm({ ...form, aadhaarNumber: formatAadhaar(e.target.value) })
                }
                maxLength={14}
              />
            </Field>

            {/* PAN Number */}
            <Field
              label="PAN Number"
              icon={<CreditCard size={16} />}
              required
              info="Required for tax compliance and payouts"
            >
              <input
                required
                type="text"
                placeholder="ABCDE1234F"
                className="input uppercase"
                value={form.panNumber}
                onChange={(e) =>
                  setForm({ ...form, panNumber: formatPAN(e.target.value) })
                }
                maxLength={10}
              />
            </Field>

            {/* Photos Section */}
            <SectionHeader title="Photos" />

            {/* Profile Photo */}
            <Field label="Profile Photo" icon={<Camera size={16} />} required>
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  handlePhotoUpload(e.dataTransfer.files[0], "profile");
                }}
                className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:border-blue-400 transition"
              >
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  id="profile-photo"
                  onChange={(e) => handlePhotoUpload(e.target.files[0], "profile")}
                />
                <label htmlFor="profile-photo" className="cursor-pointer">
                  {photoPreview ? (
                    <div className="space-y-3">
                      <img
                        src={photoPreview}
                        alt="Profile preview"
                        className="mx-auto h-32 w-32 rounded-full object-cover border-4 border-blue-100"
                      />
                      <p className="text-xs text-gray-500">Click to change photo</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Camera size={32} className="mx-auto text-gray-400" />
                      <p className="text-sm text-gray-600 font-medium">Upload your photo</p>
                      <p className="text-xs text-gray-500">
                        Drag & drop or click to browse
                      </p>
                    </div>
                  )}
                </label>
              </div>
            </Field>

            {/* Home Photo */}
            <Field
              label="Home/Space Photo"
              icon={<Home size={16} />}
              required
              info="Show where you'll care for pets"
            >
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  handlePhotoUpload(e.dataTransfer.files[0], "home");
                }}
                className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:border-blue-400 transition"
              >
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  id="home-photo"
                  onChange={(e) => handlePhotoUpload(e.target.files[0], "home")}
                />
                <label htmlFor="home-photo" className="cursor-pointer">
                  {homePhotoPreview ? (
                    <div className="space-y-3">
                      <img
                        src={homePhotoPreview}
                        alt="Home preview"
                        className="mx-auto h-32 w-48 rounded-lg object-cover border-2 border-blue-100"
                      />
                      <p className="text-xs text-gray-500">Click to change photo</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Home size={32} className="mx-auto text-gray-400" />
                      <p className="text-sm text-gray-600 font-medium">
                        Upload home/space photo
                      </p>
                      <p className="text-xs text-gray-500">
                        Drag & drop or click to browse
                      </p>
                    </div>
                  )}
                </label>
              </div>
            </Field>

            {/* Professional Details Section */}
            <SectionHeader title="Professional Details" />

            {/* Experience */}
            <Field label="Experience" icon={<Briefcase size={16} />} required>
              <div className="flex gap-3">
                <select
                  required
                  className="input"
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      experience: `${e.target.value} years`,
                    }))
                  }
                >
                  <option value="">Years</option>
                  {[...Array(21)].map((_, i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
                <select
                  required
                  className="input"
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      experience: `${p.experience.split(" ")[0]} years ${
                        e.target.value
                      } months`,
                    }))
                  }
                >
                  <option value="">Months</option>
                  {[0, 3, 6, 9].map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            </Field>

            {/* Services */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <Sparkles size={16} /> Services Offered
              </label>
              <div className="mt-3 flex gap-3 flex-wrap">
                {["Walk", "Day Care", "Boarding"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleService(s)}
                    className={`px-5 py-2.5 rounded-full text-sm font-medium border-2 transition ${
                      form.services.includes(s)
                        ? "bg-gradient-to-r from-[#0047FF] to-[#0098D7] text-white border-transparent shadow-md"
                        : "bg-white hover:bg-gray-50 border-gray-200"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <Field label="Price per Day" icon={<IndianRupee size={16} />} required>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  ₹
                </span>
                <input
                  type="number"
                  min={100}
                  required
                  placeholder="500"
                  className="input pl-8"
                  onChange={(e) =>
                    setForm({ ...form, price: `₹${e.target.value} / day` })
                  }
                />
              </div>
            </Field>

            {/* Bio */}
            <Field label="About You" icon={<FileText size={16} />} required>
              <textarea
                required
                minLength={50}
                placeholder="Tell pet owners why they can trust you with their beloved pets. Mention your experience, love for animals, and commitment to their care..."
                className="input min-h-[120px] resize-none"
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
              />
              <p className="mt-1 text-xs text-gray-500">
                Minimum 50 characters ({form.bio.length}/50)
              </p>
            </Field>

            {/* Submit */}
            <button
              type="submit"
              className="w-full mt-8 py-4 rounded-full bg-gradient-to-r from-[#0047FF] to-[#0098D7] text-white font-semibold hover:opacity-95 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
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
          className="space-y-6 sticky top-28"
        >
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Why Verification Matters
            </h2>
            <p className="text-sm text-gray-600">
              We verify all sitters to ensure the safety and trust of our community.
              Your documents are encrypted and securely stored.
            </p>
          </div>

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

/* ---------- Helpers ---------- */

function SectionHeader({ title }) {
  return (
    <div className="pt-6 pb-2 border-b border-gray-200">
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
    </div>
  );
}

function Field({ label, icon, children, required, info }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
        {icon} {label} {required && <span className="text-red-500">*</span>}
      </label>
      {info && <p className="text-xs text-gray-500 mb-2">{info}</p>}
      {children}
    </div>
  );
}

function Policy({ icon, title, text }) {
  return (
    <div className="bg-white rounded-2xl border shadow-sm p-6 flex gap-4 hover:shadow-md transition">
      <div className="text-blue-600 shrink-0">{icon}</div>
      <div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="mt-2 text-sm text-gray-600 leading-relaxed">{text}</p>
      </div>
    </div>
  );
}