import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API_BASE_URL from "../config/api";

// Professional SVG Icons Component
const Icons = {
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
  Check: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  X: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  Shield: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  Key: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
    </svg>
  ),
  Alert: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  CheckCircle: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Sparkles: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
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

// Password Requirements Component
const PasswordRequirements = ({ password }) => {
  const requirements = [
    { text: "At least 8 characters", met: password.length >= 8 },
    { text: "Contains uppercase & lowercase", met: /[a-z]/.test(password) && /[A-Z]/.test(password) },
    { text: "Contains numbers", met: /\d/.test(password) },
    { text: "Contains special characters", met: /[^a-zA-Z0-9]/.test(password) },
  ];

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2">
      <div className="flex items-center gap-2 mb-2">
        <Icons.Shield className="w-5 h-5 text-blue-600" />
        <h3 className="text-sm font-bold text-blue-900">Password Requirements</h3>
      </div>
      {requirements.map((req, index) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          {req.met ? (
            <Icons.Check className="w-4 h-4 text-green-600 flex-shrink-0" />
          ) : (
            <Icons.X className="w-4 h-4 text-gray-400 flex-shrink-0" />
          )}
          <span className={req.met ? "text-green-700" : "text-gray-600"}>{req.text}</span>
        </div>
      ))}
    </div>
  );
};

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // Client-side validation
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      setIsSuccess(false);
      return;
    }

    if (password.length < 8) {
      setMessage("Password must be at least 8 characters long");
      setIsSuccess(false);
      return;
    }

    setIsLoading(true);

    const res = await fetch(
      `${API_BASE_URL}/api/auth/reset-password/${token}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.message);
      setIsSuccess(false);
      setIsLoading(false);
      return;
    }

    setMessage("Password updated successfully!");
    setIsSuccess(true);
    setIsLoading(false);
    setTimeout(() => navigate("/login"), 2000);
  };

  const passwordsMatch = password && confirmPassword && password === confirmPassword;
  const passwordsDontMatch = password && confirmPassword && password !== confirmPassword;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-20 sm:pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg mb-4">
            <Icons.Key className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Reset <span className="text-blue-600">Password</span>
          </h1>
          <p className="text-gray-600">Create a new secure password for your account</p>
        </div>

        {/* Main Reset Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Decorative Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
            <div className="flex items-center gap-3">
              <Icons.Shield className="w-6 h-6 text-white" />
              <h2 className="text-xl font-bold text-white">Secure Password Reset</h2>
            </div>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            {/* New Password Input */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-900 uppercase tracking-wide">
                <Icons.Lock className="w-4 h-4 text-blue-600" />
                New Password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Icons.Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  required
                  className="w-full border-2 border-gray-200 rounded-xl p-4 pl-12 pr-12 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none text-gray-900 placeholder-gray-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              <PasswordStrength password={password} />
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-900 uppercase tracking-wide">
                <Icons.Lock className="w-4 h-4 text-blue-600" />
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Icons.Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  required
                  className={`w-full border-2 rounded-xl p-4 pl-12 pr-12 focus:ring-4 transition-all outline-none text-gray-900 placeholder-gray-400 ${
                    passwordsMatch
                      ? "border-green-500 focus:border-green-500 focus:ring-green-100"
                      : passwordsDontMatch
                      ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                      : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                  }`}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg p-1"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
                    <Icons.EyeOff className="w-5 h-5" />
                  ) : (
                    <Icons.Eye className="w-5 h-5" />
                  )}
                </button>
                {passwordsMatch && (
                  <div className="absolute right-12 top-1/2 -translate-y-1/2">
                    <Icons.Check className="w-5 h-5 text-green-600" />
                  </div>
                )}
              </div>
              {passwordsDontMatch && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <Icons.X className="w-3 h-3" />
                  Passwords do not match
                </p>
              )}
              {passwordsMatch && (
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <Icons.Check className="w-3 h-3" />
                  Passwords match
                </p>
              )}
            </div>

            {/* Password Requirements */}
            <PasswordRequirements password={password} />

            {/* Message Display */}
            {message && (
              <div
                className={`border-l-4 rounded-lg p-4 animate-fadeIn ${
                  isSuccess
                    ? "bg-green-50 border-green-500"
                    : "bg-red-50 border-red-500"
                }`}
              >
                <div className="flex items-start gap-3">
                  {isSuccess ? (
                    <Icons.CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <Icons.Alert className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <h3
                      className={`text-sm font-semibold ${
                        isSuccess ? "text-green-900" : "text-red-900"
                      }`}
                    >
                      {isSuccess ? "Success!" : "Error"}
                    </h3>
                    <p
                      className={`text-sm mt-1 ${
                        isSuccess ? "text-green-800" : "text-red-800"
                      }`}
                    >
                      {message}
                    </p>
                    {isSuccess && (
                      <p className="text-xs text-green-700 mt-2">
                        Redirecting to login page...
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || isSuccess}
              className="w-full inline-flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group"
            >
              {isLoading ? (
                <>
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Resetting Password...</span>
                </>
              ) : isSuccess ? (
                <>
                  <Icons.CheckCircle className="w-6 h-6" />
                  <span>Password Reset!</span>
                </>
              ) : (
                <>
                  <Icons.Key className="w-6 h-6" />
                  <span>Reset Password</span>
                  <Icons.Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Security Tips Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Icons.Shield className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-bold text-gray-900">Password Security Tips</h3>
          </div>
          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex items-start gap-2">
              <Icons.Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              <p>Use a unique password for each account</p>
            </div>
            <div className="flex items-start gap-2">
              <Icons.Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              <p>Include a mix of letters, numbers, and symbols</p>
            </div>
            <div className="flex items-start gap-2">
              <Icons.Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              <p>Avoid using personal information</p>
            </div>
            <div className="flex items-start gap-2">
              <Icons.Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              <p>Consider using a password manager</p>
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