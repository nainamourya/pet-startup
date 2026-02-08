import { Routes, Route, useLocation } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminWithdrawals from "./pages/AdminWithdrawals";
import AdminNavbar from "./components/AdminNavbar";
import AdminProtectedRoute from "../components/AdminProtectedRoute";

export default function AdminRoutes() {
  const location = useLocation();
  const isAdminLogin = location.pathname === "/admin/login";

  return (
    <>
      {!isAdminLogin && <AdminNavbar />}
      <Routes>
        <Route path="login" element={<AdminLogin />} />
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
      </Routes>
    </>
  );
}
