import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar.jsx";

export default function UserLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
