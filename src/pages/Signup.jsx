import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "owner",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Signup failed");
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
      <h1 className="text-3xl font-bold">Create Account</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input
          placeholder="Name"
          className="w-full border p-3 rounded-lg"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

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

        <select
          className="w-full border p-3 rounded-lg"
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="owner">Pet Owner</option>
          <option value="sitter">Pet Sitter</option>
        </select>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button className="w-full bg-black text-white py-3 rounded-full">
          Sign Up
        </button>
      </form>
    </div>
  );
}
