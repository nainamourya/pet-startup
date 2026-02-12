import { useState } from "react";
import API_BASE_URL from "../config/api";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [step, setStep] = useState("email"); // "email" | "reset"
  const [token, setToken] = useState(null);

  const navigate = useNavigate(); // ✅ THIS WAS MISSING

  // STEP 1: Send reset request
  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.message);
      return;
    }

    setToken(data.token);
    setStep("reset");
    setMessage("Enter your new password below.");
  };

  // STEP 2: Reset password
  const handleResetSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`${API_BASE_URL}/api/auth/reset-password/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: newPassword }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.message);
      return;
    }

    setMessage("Password successfully reset. Redirecting...");

    localStorage.removeItem("token"); // logout user

    setTimeout(() => {
      navigate("/login");
    }, 1500);
  };

  return (
    <div className="pt-24 px-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold">Forgot Password</h1>

      {step === "email" && (
        <form onSubmit={handleEmailSubmit} className="mt-6 space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            required
            className="w-full border p-3 rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button className="w-full bg-black text-white py-3 rounded-full">
            Send Reset Link
          </button>
        </form>
      )}

      {step === "reset" && (
        <form onSubmit={handleResetSubmit} className="mt-6 space-y-4">
          <input
            type="password"
            placeholder="Enter new password"
            required
            className="w-full border p-3 rounded-lg"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <button className="w-full bg-black text-white py-3 rounded-full">
            Reset Password
          </button>
        </form>
      )}

      {message && <p className="mt-4 text-sm">{message}</p>}
    </div>
  );
}
