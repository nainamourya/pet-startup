import { useEffect, useState } from "react";
import adminApi from "../services/adminApi";
import AdminNavbar from "../components/AdminNavbar";

export default function AdminWithdrawals() {
  const [withdrawals, setWithdrawals] = useState([]);

  const loadWithdrawals = async () => {
    const res = await adminApi.get("/withdrawals");
    setWithdrawals(res.data);
  };

  const payWithdrawal = async (id) => {
    await adminApi.patch(`/withdrawals/${id}/pay`);
    loadWithdrawals();
  };

  useEffect(() => {
    loadWithdrawals();
  }, []);

  return (
    <>
    
   
    <div style={{ padding: 20 }}>
      <h2>Withdrawals</h2>

      {withdrawals.map(w => (
        <div key={w._id} style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}>
          <p>Sitter: {w.sitterId?.name || w.sitterId}</p>
          <p>Amount: ₹{w.amount}</p>
          <p>Status: {w.status}</p>

          {w.status !== "paid" && (
            <button onClick={() => payWithdrawal(w._id)}>
              Mark as Paid
            </button>
          )}
        </div>
      ))}
    </div>
    </>
  );
}
