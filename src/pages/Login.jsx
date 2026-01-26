import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/");
    } catch (err) {
      setError("Something went wrong");
    }
  };

  return (
    <div className="pt-24 px-6 max-w-md mx-auto">
      <h1 className="text-3xl font-bold">Login</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input
          placeholder="Email"
          type="email"
          className="w-full border p-3 rounded-lg"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          placeholder="Password"
          type="password"
          className="w-full border p-3 rounded-lg"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button className="w-full bg-black text-white py-3 rounded-full">
          Login
        </button>
      </form>
    </div>
  );
}
