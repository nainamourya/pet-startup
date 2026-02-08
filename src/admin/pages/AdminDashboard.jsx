import { useEffect, useState } from "react";
import adminApi from "../services/adminApi";
import AdminNavbar from "../components/AdminNavbar";
export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    adminApi.get("/dashboard").then(res => setStats(res.data));
  }, []);

  if (!stats) return <p>Loading...</p>;

  return (
    <>
  
    <div style={{ padding: 20 }}>
       
      <h1>Admin Dashboard</h1>
      <p>Total Users: {stats.totalUsers}</p>
      <p>Total Sitters: {stats.totalSitters}</p>
      <p>Total Bookings: {stats.totalBookings}</p>
      <p>Total Withdrawals: {stats.totalWithdrawals}</p>
    </div>
    </>
  );  
}
