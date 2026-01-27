import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar.jsx";
import Home from "./pages/Home.jsx";
import FindSitter from "./pages/FindSitter.jsx";
import BecomeSitter from "./pages/BecomeSitter.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import BookSitter from "./pages/BookSitter.jsx";
import MyBookings from "./pages/MyBookings.jsx";
import SitterDashboard from "./pages/SitterDashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import FindSitterProfile from "./pages/FindSitterProfile.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sitter/:id" element={<FindSitterProfile />} />
        <Route path="/find" element={<FindSitter />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/become"
          element={
            <ProtectedRoute>
              <BecomeSitter />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute role="owner">
              <MyBookings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="sitter">
              <SitterDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/book/:id"
          element={
            <ProtectedRoute>
              <BookSitter />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
