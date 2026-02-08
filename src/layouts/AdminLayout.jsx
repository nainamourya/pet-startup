import { Outlet, useLocation } from "react-router-dom";
import AdminNavbar from "../admin/components/AdminNavbar.jsx";

export default function AdminLayout() {
  const location = useLocation();
  const isAdminLogin = location.pathname === "/admin/login";

  return (
    <>
      {!isAdminLogin && <AdminNavbar />}
      <Outlet />
    </>
  );
}
