import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar.jsx";
import Home from "./pages/Home.jsx";
import FindSitter from "./pages/FindSitter.jsx";
import BecomeSitter from "./pages/BecomeSitter.jsx";
import Login from "./pages/Login.jsx";
import BookSitter from "./pages/BookSitter.jsx";
import MyBookings from "./pages/MyBookings.jsx";
import Signup from "./pages/Signup.jsx";
import SitterDashboard from "./pages/SitterDashboard";


export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/find" element={<FindSitter />} />
        <Route path="/become" element={<BecomeSitter />} />
        <Route path="/login" element={<Login />} />
        <Route path="/book/:id" element={<BookSitter />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<SitterDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
