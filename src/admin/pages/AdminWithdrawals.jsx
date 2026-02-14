import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import API_BASE_URL from "../../config/api";

// Professional SVG Icons
const Icons = {
  Money: ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Refresh: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  ),
  Check: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  X: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  Clock: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  User: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  Calendar: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  CreditCard: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  ),
  AlertCircle: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  TrendUp: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  Receipt: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" />
    </svg>
  )
};

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
        return { bg: "#fff7e6", text: "#b45309", icon: Icons.Clock };
      case "approved":
        return { bg: "#e0f2fe", text: "#0369a1", icon: Icons.Check };
      case "processing":
        return { bg: "#f3e8ff", text: "#7c3aed", icon: Icons.TrendUp };
      case "completed":
        return { bg: "#dcfce7", text: "#15803d", icon: Icons.Check };
      case "rejected":
        return { bg: "#fee2e2", text: "#dc2626", icon: Icons.X };
      case "cancelled":
        return { bg: "#f3f4f6", text: "#6b7280", icon: Icons.X };
      default:
        return { bg: "#f3f4f6", text: "#6b7280", icon: Icons.AlertCircle };
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 pt-20 sm:pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-600 to-pink-600 shadow-lg">
              <Icons.Money className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Withdrawal <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-pink-600">Management</span>
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                Manage sitter withdrawal requests
              </p>
            </div>
          </div>
          
          <button
            onClick={fetchWithdrawals}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white border-2 border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all duration-200 font-semibold text-gray-700 hover:text-orange-600 shadow-sm hover:shadow-md"
          >
            <Icons.Refresh className="w-5 h-5" />
            Refresh
          </button>
        </div>

        {/* Statistics */}
        {stats.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => {
              const statusColor = getStatusColor(stat._id);
              const StatusIcon = statusColor.icon;
              return (
                <div
                  key={stat._id}
                  className="group relative overflow-hidden rounded-2xl border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  style={{ backgroundColor: statusColor.bg, animationDelay: `${index * 100}ms` }}
                >
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2 rounded-lg bg-white bg-opacity-50">
                        <StatusIcon className="w-5 h-5" style={{ color: statusColor.text }} />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wide" style={{ color: statusColor.text }}>
                        {stat._id}
                      </span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 mb-1">{stat.count}</p>
                    <p className="text-sm font-semibold" style={{ color: statusColor.text }}>
                      ₹{stat.totalAmount?.toLocaleString()}
                    </p>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-50" style={{ color: statusColor.text }}></div>
                </div>
              );
            })}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Icons.AlertCircle className="w-5 h-5 text-gray-600" />
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Filter by Status</h3>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {["all", "pending", "approved", "processing", "completed", "rejected", "cancelled"].map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                    filter === status
                      ? "bg-gradient-to-r from-orange-600 to-pink-600 text-white shadow-lg scale-105"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              )
            )}
          </div>
        </div>

        {/* Withdrawals List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-48 bg-white rounded-2xl border border-gray-100"></div>
              </div>
            ))}
          </div>
        ) : withdrawals.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
              <Icons.Money className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No withdrawals found</h3>
            <p className="text-gray-600">
              {filter !== "all" 
                ? `No ${filter} withdrawals at the moment`
                : "No withdrawal requests have been made yet"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {withdrawals.map((w, index) => {
              const statusColor = getStatusColor(w.status);
              const StatusIcon = statusColor.icon;
              return (
                <div
                  key={w._id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Status Bar */}
                  <div className="h-2" style={{ backgroundColor: statusColor.text }}></div>

                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Left: Details */}
                      <div className="flex-1">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-600 to-pink-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                              ₹
                            </div>
                            <div>
                              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                ₹{w.amount?.toLocaleString()}
                              </h3>
                              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                <Icons.User className="w-4 h-4" />
                                <span className="font-medium">{w.sitterId?.name}</span>
                                <span>•</span>
                                <span>{w.sitterId?.email}</span>
                              </div>
                            </div>
                          </div>
                          <span
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold capitalize shadow-sm"
                            style={{
                              backgroundColor: statusColor.bg,
                              color: statusColor.text,
                            }}
                          >
                            <StatusIcon className="w-4 h-4" />
                            {w.status}
                          </span>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          {/* Requested Date */}
                          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
                            <div className="flex items-center gap-2 mb-2">
                              <Icons.Calendar className="w-4 h-4 text-blue-600" />
                              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Requested</p>
                            </div>
                            <p className="font-semibold text-gray-900">{formatDate(w.createdAt)}</p>
                          </div>

                          {/* Completed Date */}
                          {w.completedAt && (
                            <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
                              <div className="flex items-center gap-2 mb-2">
                                <Icons.Check className="w-4 h-4 text-green-600" />
                                <p className="text-xs font-semibold text-green-600 uppercase tracking-wide">Completed</p>
                              </div>
                              <p className="font-semibold text-green-700">{formatDate(w.completedAt)}</p>
                            </div>
                          )}
                        </div>

                        {/* Payment Method */}
                        <div className="p-5 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 mb-4">
                          <div className="flex items-center gap-2 mb-4">
                            <Icons.CreditCard className="w-5 h-5 text-purple-600" />
                            <p className="text-sm font-bold text-purple-600 uppercase tracking-wide">Payment Method</p>
                          </div>

                          <div className="bg-white rounded-lg p-4 shadow-sm">
                            <p className="font-bold capitalize mb-3 text-gray-900 flex items-center gap-2">
                              {w.paymentMethod?.type}
                              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                                {w.paymentMethod?.type}
                              </span>
                            </p>

                            {w.paymentMethod?.type === "bank" && (
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Account Holder:</span>
                                  <span className="font-semibold text-gray-900">{w.paymentMethod.bankDetails?.accountHolderName}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Account Number:</span>
                                  <span className="font-mono font-semibold text-gray-900">{w.paymentMethod.bankDetails?.accountNumber}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">IFSC:</span>
                                  <span className="font-mono font-semibold text-gray-900">{w.paymentMethod.bankDetails?.ifsc}</span>
                                </div>
                                {w.paymentMethod.bankDetails?.bankName && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Bank:</span>
                                    <span className="font-semibold text-gray-900">{w.paymentMethod.bankDetails?.bankName}</span>
                                  </div>
                                )}
                              </div>
                            )}

                            {w.paymentMethod?.type === "upi" && (
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">UPI ID:</span>
                                <span className="font-mono font-semibold text-gray-900">{w.paymentMethod.upiId}</span>
                              </div>
                            )}

                            {w.paymentMethod?.type === "paypal" && (
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">PayPal Email:</span>
                                <span className="font-semibold text-gray-900">{w.paymentMethod.paypalEmail}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Transaction ID */}
                        {w.transactionId && (
                          <div className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200">
                            <div className="flex items-center gap-2 mb-2">
                              <Icons.Receipt className="w-4 h-4 text-gray-600" />
                              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Transaction ID</p>
                            </div>
                            <p className="font-mono text-sm font-semibold text-gray-900">{w.transactionId}</p>
                          </div>
                        )}

                        {/* Rejection Reason */}
                        {w.rejectionReason && (
                          <div className="mt-4 p-4 rounded-xl bg-red-50 border-l-4 border-red-500 flex items-start gap-3">
                            <Icons.AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="font-semibold text-red-900 text-sm">Rejection Reason</p>
                              <p className="text-red-700 text-sm mt-1">{w.rejectionReason}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right: Actions */}
                      <div className="lg:w-56">
                        {w.status === "pending" && (
                          <div className="space-y-3">
                            <button
                              onClick={() => updateStatus(w._id, "approved")}
                              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                            >
                              <Icons.Check className="w-5 h-5" />
                              Approve
                            </button>
                            <button
                              onClick={() => setSelectedWithdrawal(w)}
                              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 text-white font-bold hover:from-red-700 hover:to-pink-700 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                            >
                              <Icons.X className="w-5 h-5" />
                              Reject
                            </button>
                          </div>
                        )}

                        {w.status === "approved" && (
                          <button
                            onClick={() => setSelectedWithdrawal(w)}
                            className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                          >
                            <Icons.TrendUp className="w-5 h-5" />
                            Mark Processing
                          </button>
                        )}

                        {w.status === "processing" && (
                          <button
                            onClick={() => setSelectedWithdrawal(w)}
                            className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                          >
                            <Icons.Check className="w-5 h-5" />
                            Complete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Action Modal */}
        {selectedWithdrawal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl animate-slideUp">
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Update Withdrawal</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      ID: #{selectedWithdrawal._id.slice(-8)}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedWithdrawal(null);
                      setActionNotes("");
                      setTransactionId("");
                    }}
                    className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <Icons.X className="w-6 h-6 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                {/* Transaction ID Input */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide flex items-center gap-2">
                    <Icons.Receipt className="w-4 h-4 text-gray-600" />
                    Transaction ID (Optional)
                  </label>
                  <input
                    type="text"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="Enter transaction ID"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none transition-all font-mono"
                  />
                </div>

                {/* Notes Textarea */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide flex items-center gap-2">
                    <Icons.AlertCircle className="w-4 h-4 text-gray-600" />
                    Notes
                  </label>
                  <textarea
                    value={actionNotes}
                    onChange={(e) => setActionNotes(e.target.value)}
                    placeholder="Add notes (optional)"
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none transition-all resize-none"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-3xl">
                <div className="flex gap-3">
                  {selectedWithdrawal.status === "pending" && (
                    <>
                      <button
                        onClick={() => updateStatus(selectedWithdrawal._id, "approved")}
                        className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg"
                      >
                        <Icons.Check className="w-5 h-5" />
                        Approve
                      </button>
                      <button
                        onClick={() => updateStatus(selectedWithdrawal._id, "rejected")}
                        className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 text-white font-bold hover:from-red-700 hover:to-pink-700 transition-all duration-200 shadow-lg"
                      >
                        <Icons.X className="w-5 h-5" />
                        Reject
                      </button>
                    </>
                  )}

                  {selectedWithdrawal.status === "approved" && (
                    <button
                      onClick={() => updateStatus(selectedWithdrawal._id, "processing")}
                      className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg"
                    >
                      <Icons.TrendUp className="w-5 h-5" />
                      Mark Processing
                    </button>
                  )}

                  {selectedWithdrawal.status === "processing" && (
                    <button
                      onClick={() => updateStatus(selectedWithdrawal._id, "completed")}
                      className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg"
                    >
                      <Icons.Check className="w-5 h-5" />
                      Complete
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setSelectedWithdrawal(null);
                      setActionNotes("");
                      setTransactionId("");
                    }}
                    className="px-5 py-3 rounded-xl bg-gray-200 text-gray-700 font-bold hover:bg-gray-300 transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}