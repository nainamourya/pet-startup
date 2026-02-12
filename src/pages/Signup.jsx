import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API_BASE_URL from "../config/api";

// Professional SVG Icons Component
const Icons = {
  User: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  Email: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  Lock: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  ),
  Eye: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ),
  EyeOff: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  ),
  Pet: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Heart: ({ className = "w-5 h-5" }) => (
    <svg className={`${className} animate-pulse`} fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  ),
  Briefcase: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  Check: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  Alert: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  ArrowRight: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  ),
  Shield: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  Sparkles: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
  X: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
};

// Password Strength Indicator Component
const PasswordStrength = ({ password }) => {
  const getStrength = () => {
    if (!password) return { level: 0, text: "", color: "" };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 1) return { level: 1, text: "Weak", color: "bg-red-500", textColor: "text-red-600" };
    if (strength <= 3) return { level: 2, text: "Fair", color: "bg-yellow-500", textColor: "text-yellow-600" };
    if (strength === 4) return { level: 3, text: "Good", color: "bg-blue-500", textColor: "text-blue-600" };
    return { level: 4, text: "Strong", color: "bg-green-500", textColor: "text-green-600" };
  };

  const strength = getStrength();

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              level <= strength.level ? strength.color : "bg-gray-200"
            }`}
          />
        ))}
      </div>
      <p className={`text-xs font-medium ${strength.textColor}`}>
        Password Strength: {strength.text}
      </p>
    </div>
  );
};

// Role Selection Card Component
const RoleCard = ({ role, selectedRole, onSelect, icon: Icon, title, description, features }) => {
  const isSelected = selectedRole === role;
  
  return (
    <div
      onClick={() => onSelect(role)}
      className={`relative cursor-pointer rounded-xl p-5 border-2 transition-all duration-300 ${
        isSelected
          ? "border-blue-600 bg-blue-50 shadow-lg scale-105"
          : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-md"
      }`}
    >
      {isSelected && (
        <div className="absolute -top-3 -right-3 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
          <Icons.Check className="w-5 h-5 text-white" />
        </div>
      )}
      
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
          isSelected ? "bg-blue-600" : "bg-gray-100"
        }`}>
          <Icon className={`w-6 h-6 ${isSelected ? "text-white" : "text-gray-600"}`} />
        </div>
        <div className="flex-1">
          <h3 className={`font-bold text-base ${isSelected ? "text-blue-900" : "text-gray-900"}`}>
            {title}
          </h3>
          <p className="text-xs text-gray-600 mt-1">{description}</p>
        </div>
      </div>
      
      <ul className="space-y-1.5 text-xs">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2 text-gray-700">
            <Icons.Check className={`w-3 h-3 flex-shrink-0 ${isSelected ? "text-blue-600" : "text-gray-400"}`} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "owner",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Signup failed");
        setIsLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/");
    } catch (err) {
      setError("Something went wrong");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-20 sm:pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg mb-4">
            <Icons.Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Create Your <span className="text-blue-600">Account</span>
          </h1>
          <p className="text-gray-600">Join India's most trusted pet care platform</p>
        </div>

        {/* Main Signup Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Decorative Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
            <div className="flex items-center gap-3">
              <Icons.Shield className="w-6 h-6 text-white" />
              <h2 className="text-xl font-bold text-white">Secure Registration</h2>
            </div>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            {/* Name Input */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-900 uppercase tracking-wide">
                <Icons.User className="w-4 h-4 text-blue-600" />
                Full Name
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Icons.User className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  placeholder="Enter your full name"
                  type="text"
                  required
                  className="w-full border-2 border-gray-200 rounded-xl p-4 pl-12 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none text-gray-900 placeholder-gray-400"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-900 uppercase tracking-wide">
                <Icons.Email className="w-4 h-4 text-blue-600" />
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Icons.Email className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  placeholder="Enter your email"
                  type="email"
                  required
                  className="w-full border-2 border-gray-200 rounded-xl p-4 pl-12 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none text-gray-900 placeholder-gray-400"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-900 uppercase tracking-wide">
                <Icons.Lock className="w-4 h-4 text-blue-600" />
                Password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Icons.Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  placeholder="Create a strong password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full border-2 border-gray-200 rounded-xl p-4 pl-12 pr-12 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none text-gray-900 placeholder-gray-400"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg p-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <Icons.EyeOff className="w-5 h-5" />
                  ) : (
                    <Icons.Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <PasswordStrength password={form.password} />
            </div>

            {/* Role Selection */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-900 uppercase tracking-wide">
                <Icons.Briefcase className="w-4 h-4 text-blue-600" />
                I am a...
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <RoleCard
                  role="owner"
                  selectedRole={form.role}
                  onSelect={(role) => setForm({ ...form, role })}
                  icon={Icons.Pet}
                  title="Pet Owner"
                  description="Find trusted care for your pet"
                  features={[
                    "Book verified sitters",
                    "Real-time tracking",
                    "Secure payments"
                  ]}
                />
                
                <RoleCard
                  role="sitter"
                  selectedRole={form.role}
                  onSelect={(role) => setForm({ ...form, role })}
                  icon={Icons.Briefcase}
                  title="Pet Sitter"
                  description="Earn money caring for pets"
                  features={[
                    "Flexible schedule",
                    "Build reputation",
                    "Grow your business"
                  ]}
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 animate-fadeIn">
                <div className="flex items-start gap-3">
                  <Icons.Alert className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-semibold text-red-900">Signup Failed</h3>
                    <p className="text-sm text-red-800 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group"
            >
              {isLoading ? (
                <>
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <Icons.Sparkles className="w-6 h-6" />
                  <span>Create Account</span>
                  <Icons.ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {/* Terms & Conditions */}
            <p className="text-xs text-center text-gray-600">
              By signing up, you agree to our{" "}
              <a href="/terms" className="text-blue-600 hover:underline font-medium">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="text-blue-600 hover:underline font-medium">
                Privacy Policy
              </a>
            </p>
          </form>

          {/* Login Link Section */}
          <div className="bg-gray-50 px-6 sm:px-8 py-6 border-t border-gray-100">
            <div className="text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-bold text-blue-600 hover:text-blue-700 transition-colors hover:underline"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-center text-lg font-bold text-gray-900 mb-4">
            Why Join Our Platform?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icons.Shield className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-900">Verified Profiles</h4>
                <p className="text-xs text-gray-600 mt-1">All users are background-checked</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icons.Heart className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-900">Trusted Community</h4>
                <p className="text-xs text-gray-600 mt-1">10,000+ happy pet owners</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icons.Lock className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-900">Secure Payments</h4>
                <p className="text-xs text-gray-600 mt-1">Encrypted payment processing</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icons.Check className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-900">24/7 Support</h4>
                <p className="text-xs text-gray-600 mt-1">We're here when you need us</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}