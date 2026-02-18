import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import LeaveReview from "./pages/LeaveReview.jsx";
import OwnerTrackWalk from "./pages/OwnerTrackWalk.jsx";
import { Toaster } from "react-hot-toast";
import AdminLogin from "./admin/pages/AdminLogin.jsx";
import AdminDashboard from "./admin/pages/AdminDashboard.jsx";
import AdminWithdrawals from "./admin/pages/AdminWithdrawals.jsx";
import AdminProtectedRoute from "./components/AdminProtectedRoute.jsx";
import UserLayout from "./layouts/UserLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import AdminUsers from "./admin/pages/AdminUsers.jsx";
import AdminReviews from "./admin/pages/AdminReviews.jsx";
import AdminSitters from "./admin/pages/AdminSitters.jsx";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Refund from "./pages/Refund.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import TermsOfService from "./pages/TermsOfService.jsx";
import Contact from "./pages/Contact.jsx";
import FAQ from "./pages/FAQ.jsx";

export default function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} duration={4000} />

      <BrowserRouter>
        <Routes>

          {/* ================= ADMIN ================= */}
          <Route path="/admin/login" element={<AdminLogin />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route
              path="dashboard"
              element={
                <AdminProtectedRoute>
                  <AdminDashboard />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="withdrawals"
              element={
                <AdminProtectedRoute>
                  <AdminWithdrawals />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <AdminProtectedRoute>
                  <AdminUsers />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/reviews"
              element={
                <AdminProtectedRoute>
                  <AdminReviews />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/sitters"
              element={
                <AdminProtectedRoute>
                  <AdminSitters />
                </AdminProtectedRoute>
              }
            />
          </Route>

          {/* ================= USER ================= */}
          <Route element={<UserLayout />}>

            <Route path="/" element={<Home />} />
            <Route path="/refund" element={<Refund />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />


            <Route path="/sitter/:id" element={<FindSitterProfile />} />
            <Route path="/find" element={<FindSitter />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/review/:bookingId" element={<LeaveReview />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
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
              path="/track-walk/:bookingId"
              element={
                <ProtectedRoute role="owner">
                  <OwnerTrackWalk />
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
          </Route>

        </Routes>
      </BrowserRouter>
    </>
  );
}
