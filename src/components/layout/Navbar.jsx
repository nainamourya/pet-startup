import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) {
      setUser(JSON.parse(u));
    } else {
      setUser(null);
    }
  }, [location.pathname]);

  return (
    <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-semibold">
          PetSitter
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm">
          <Link to="/find" className="text-gray-600 hover:text-black">
            Find a Sitter
          </Link>
          <Link to="/become" className="text-gray-600 hover:text-black">
            Become a Sitter
          </Link>

          {user ? (
            <>
              {user.role === "owner" && (
                <Link to="/my-bookings" className="text-gray-600 hover:text-black">
                  My Bookings
                </Link>
              )}

              {user.role === "sitter" && (
                <Link to="/dashboard" className="text-gray-600 hover:text-black">
                  Dashboard
                </Link>
              )}

              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.href = "/";
                }}
                className="text-red-500"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 hover:text-black">
                Login
              </Link>
              <Link to="/signup" className="text-gray-600 hover:text-black">
                Signup
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}