import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import API_BASE_URL from "../../config/api";

export default function AdminWithdrawals() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [actionNotes, setActionNotes] = useState("");
  const [transactionId, setTransactionId] = useState("");

  const brand = "#ff9b7a";

  // Fetch withdrawals
  const fetchWithdrawals = async () => {
    setLoading(true);
    try {
      const statusQuery = filter !== "all" ? `?status=${filter}` : "";
      const res = await fetch(`${API_BASE_URL}/api/withdrawals/admin/all${statusQuery}`);
      const data = await res.json();

      if (data.success) {
        setWithdrawals(data.withdrawals);
        setStats(data.stats);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Failed to fetch withdrawals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, [filter]);

  // Update withdrawal status
  const updateStatus = async (withdrawalId, newStatus) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/withdrawals/admin/${withdrawalId}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: newStatus,
            notes: actionNotes,
            transactionId: transactionId || undefined,
            adminId: "admin-user-id", // TODO: Get from auth context
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to update status");
        return;
      }

      toast.success(`Withdrawal ${newStatus} successfully`);
      setSelectedWithdrawal(null);
      setActionNotes("");
      setTransactionId("");
      fetchWithdrawals();
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Failed to update withdrawal");
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return { bg: "#fff7e6", text: "#b45309" };
      case "approved":
        return { bg: "#e0f2fe", text: "#0369a1" };
      case "processing":
        return { bg: "#f3e8ff", text: "#7c3aed" };
      case "completed":
        return { bg: "#dcfce7", text: "#15803d" };
      case "rejected":
        return { bg: "#fee2e2", text: "#dc2626" };
      case "cancelled":
        return { bg: "#f3f4f6", text: "#6b7280" };
      default:
        return { bg: "#f3f4f6", text: "#6b7280" };
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="pt-24 px-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Withdrawal Management</h1>
          <p className="text-gray-500 mt-1">Manage sitter withdrawal requests</p>
        </div>
        <button
          onClick={fetchWithdrawals}
          className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Statistics */}
      {stats.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => {
            const statusColor = getStatusColor(stat._id);
            return (
              <div
                key={stat._id}
                className="p-4 rounded-xl border"
                style={{ backgroundColor: statusColor.bg }}
              >
                <p
                  className="text-xs uppercase font-semibold mb-1"
                  style={{ color: statusColor.text }}
                >
                  {stat._id}
                </p>
                <p className="text-2xl font-bold">{stat.count}</p>
                <p className="text-sm text-gray-600 mt-1">
                  ₹{stat.totalAmount?.toLocaleString()}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {["all", "pending", "approved", "processing", "completed", "rejected", "cancelled"].map(
          (status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                filter === status
                  ? "text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              style={{
                backgroundColor: filter === status ? brand : undefined,
              }}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          )
        )}
      </div>

      {/* Withdrawals List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-32 bg-gray-100 rounded-xl"></div>
            </div>
          ))}
        </div>
      ) : withdrawals.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-xl">No withdrawals found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {withdrawals.map((w) => {
            const statusColor = getStatusColor(w.status);
            return (
              <div
                key={w._id}
                className="p-6 rounded-xl border bg-white hover:shadow-md transition-all"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Left: Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold">
                          ₹{w.amount?.toLocaleString()}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {w.sitterId?.name} • {w.sitterId?.email}
                        </p>
                      </div>
                      <span
                        className="px-3 py-1 rounded-full text-xs font-semibold capitalize"
                        style={{
                          backgroundColor: statusColor.bg,
                          color: statusColor.text,
                        }}
                      >
                        {w.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Requested</p>
                        <p className="font-medium">{formatDate(w.createdAt)}</p>
                      </div>

                      {w.completedAt && (
                        <div>
                          <p className="text-gray-500">Completed</p>
                          <p className="font-medium text-green-600">
                            {formatDate(w.completedAt)}
                          </p>
                        </div>
                      )}

                      <div className="col-span-2">
                        <p className="text-gray-500 mb-2">Payment Method</p>
                        <div className="p-3 rounded-lg bg-gray-50">
                          <p className="font-semibold capitalize mb-1">
                            {w.paymentMethod?.type}
                          </p>

                          {w.paymentMethod?.type === "bank" && (
                            <div className="text-xs text-gray-600 space-y-1">
                              <p>
                                <b>Acc Holder:</b>{" "}
                                {w.paymentMethod.bankDetails?.accountHolderName}
                              </p>
                              <p>
                                <b>Acc Number:</b>{" "}
                                {w.paymentMethod.bankDetails?.accountNumber}
                              </p>
                              <p>
                                <b>IFSC:</b> {w.paymentMethod.bankDetails?.ifsc}
                              </p>
                              {w.paymentMethod.bankDetails?.bankName && (
                                <p>
                                  <b>Bank:</b>{" "}
                                  {w.paymentMethod.bankDetails?.bankName}
                                </p>
                              )}
                            </div>
                          )}

                          {w.paymentMethod?.type === "upi" && (
                            <p className="text-xs text-gray-600">
                              <b>UPI ID:</b> {w.paymentMethod.upiId}
                            </p>
                          )}

                          {w.paymentMethod?.type === "paypal" && (
                            <p className="text-xs text-gray-600">
                              <b>Email:</b> {w.paymentMethod.paypalEmail}
                            </p>
                          )}
                        </div>
                      </div>

                      {w.transactionId && (
                        <div className="col-span-2">
                          <p className="text-gray-500">Transaction ID</p>
                          <p className="font-mono text-xs">{w.transactionId}</p>
                        </div>
                      )}

                      {w.rejectionReason && (
                        <div className="col-span-2">
                          <p className="text-red-600 text-sm">
                            ❌ {w.rejectionReason}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="md:w-48">
                    {w.status === "pending" && (
                      <div className="space-y-2">
                        <button
                          onClick={() => updateStatus(w._id, "approved")}
                          className="w-full px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
                        >
                          ✅ Approve
                        </button>
                        <button
                          onClick={() => setSelectedWithdrawal(w)}
                          className="w-full px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition"
                        >
                          ❌ Reject
                        </button>
                      </div>
                    )}

                    {w.status === "approved" && (
                      <div className="space-y-2">
                        <button
                          onClick={() => {
                            setSelectedWithdrawal(w);
                            // Open modal to enter transaction ID
                          }}
                          className="w-full px-4 py-2 rounded-lg bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition"
                        >
                          🔄 Mark Processing
                        </button>
                      </div>
                    )}

                    {w.status === "processing" && (
                      <div className="space-y-2">
                        <button
                          onClick={() => {
                            setSelectedWithdrawal(w);
                            // Open modal to confirm completion
                          }}
                          className="w-full px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition"
                        >
                          ✅ Complete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Action Modal */}
      {selectedWithdrawal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">
              Update Withdrawal #{selectedWithdrawal._id.slice(-6)}
            </h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transaction ID (Optional)
              </label>
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="Enter transaction ID"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-200 outline-none"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                placeholder="Add notes (optional)"
                rows={3}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-200 outline-none"
              />
            </div>

            <div className="flex gap-3">
              {selectedWithdrawal.status === "pending" && (
                <>
                  <button
                    onClick={() => updateStatus(selectedWithdrawal._id, "approved")}
                    className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => updateStatus(selectedWithdrawal._id, "rejected")}
                    className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700"
                  >
                    Reject
                  </button>
                </>
              )}

              {selectedWithdrawal.status === "approved" && (
                <button
                  onClick={() => updateStatus(selectedWithdrawal._id, "processing")}
                  className="flex-1 px-4 py-2 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700"
                >
                  Mark Processing
                </button>
              )}

              {selectedWithdrawal.status === "processing" && (
                <button
                  onClick={() => updateStatus(selectedWithdrawal._id, "completed")}
                  className="flex-1 px-4 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700"
                >
                  Complete
                </button>
              )}

              <button
                onClick={() => {
                  setSelectedWithdrawal(null);
                  setActionNotes("");
                  setTransactionId("");
                }}
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}