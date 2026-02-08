import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const u = localStorage.getItem("user");
    setUser(u ? JSON.parse(u) : null);
    setOpen(false);
  }, [location.pathname]);

  const linkClass =
    "text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-150";

  return (
    <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur border-b border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link
          to="/"
          className="text-lg font-semibold text-gray-900 tracking-tight"
        >
          PetSitter
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/find" className={linkClass}>
            Find a Sitter
          </Link>
          <Link to="/become" className={linkClass}>
            Become a Sitter
          </Link>

          {user ? (
            <>
              {user.role === "owner" && (
                <Link to="/my-bookings" className={linkClass}>
                  My Bookings
                </Link>
              )}

              {user.role === "sitter" && (
                <Link to="/dashboard" className={linkClass}>
                  Dashboard
                </Link>
              )}

              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.href = "/";
                }}
                className="text-sm font-medium text-red-500 hover:text-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={linkClass}>
                Login
              </Link>
              <Link
                to="/signup"
                className="ml-2 text-sm font-medium px-4 py-2 rounded-full bg-gradient-to-r from-[#0047FF] to-[#0098D7] text-white hover:opacity-90 transition"
              >
                Signup
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-100 transition duration-150 text-black font-bold"
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="md:hidden bg-white border-t border-[#E5E7EB]"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              <Link to="/find" className={linkClass}>
                Find a Sitter
              </Link>
              <Link to="/become" className={linkClass}>
                Become a Sitter
              </Link>

              <div className="h-px bg-gray-200 my-2" />

              {user ? (
                <>
                  {user.role === "owner" && (
                    <Link to="/my-bookings" className={linkClass}>
                      My Bookings
                    </Link>
                  )}
                  {user.role === "sitter" && (
                    <Link to="/dashboard" className={linkClass}>
                      Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      localStorage.clear();
                      window.location.href = "/";
                    }}
                    className="text-left text-sm font-medium text-red-500 hover:text-red-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className={linkClass}>
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="mt-2 text-center text-sm font-medium px-4 py-2 rounded-full bg-gradient-to-r from-[#0047FF] to-[#0098D7] text-white"
                  >
                    Signup
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
