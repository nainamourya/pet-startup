import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import API_BASE_URL from "../config/api";

export default function WithdrawalSection({ profile }) {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawalHistory, setWithdrawalHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const availableBalance = balance ? Math.max(0, balance.availableBalance) : 0;
  // Withdrawal form state
  const [withdrawalForm, setWithdrawalForm] = useState({
    amount: "",
    paymentMethod: {
      type: "bank", // bank, upi, paypal
      bankDetails: {
        accountHolderName: "",
        accountNumber: "",
        ifsc: "",
        bankName: "",
      },
      upiId: "",
      paypalEmail: "",
    },
  });

  const brand = "#ff9b7a";

  // Fetch balance
  useEffect(() => {
    if (!profile?._id) return;

    const fetchBalance = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/withdrawals/balance/${profile._id}`
        );
        const data = await res.json();
        if (data.success) {
          setBalance(data);
        }
      } catch (err) {
        console.error("Balance fetch error:", err);
      }
    };

    fetchBalance();
  }, [profile]);

  // Fetch withdrawal history
  const fetchHistory = async () => {
    if (!profile?._id) return;

    setHistoryLoading(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/withdrawals/history/${profile._id}`
      );
      const data = await res.json();
      if (data.success) {
        setWithdrawalHistory(data.withdrawals);
      }
    } catch (err) {
      console.error("History fetch error:", err);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [profile]);

  // Pre-fill bank details if available
  useEffect(() => {
    if (profile?.bankDetails) {
      setWithdrawalForm((prev) => ({
        ...prev,
        paymentMethod: {
          ...prev.paymentMethod,
          bankDetails: {
            accountHolderName: profile.bankDetails.accountHolderName || "",
            accountNumber: profile.bankDetails.accountNumber || "",
            ifsc: profile.bankDetails.ifsc || "",
            bankName: profile.bankDetails.bankName || "",
          },
        },
      }));
    }
  }, [profile]);

  // Handle withdrawal request
  const handleWithdrawalRequest = async () => {
    if (!withdrawalForm.amount || withdrawalForm.amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (!profile?._id) {
      toast.error("Profile not loaded");
      return;
    }

    // Validate payment method details
    const { type, bankDetails, upiId, paypalEmail } = withdrawalForm.paymentMethod;

    if (type === "bank") {
      if (!bankDetails.accountHolderName || !bankDetails.accountNumber || !bankDetails.ifsc) {
        toast.error("Please fill all bank details");
        return;
      }
    } else if (type === "upi") {
      if (!upiId) {
        toast.error("Please enter UPI ID");
        return;
      }
    } else if (type === "paypal") {
      if (!paypalEmail) {
        toast.error("Please enter PayPal email");
        return;
      }
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/withdrawals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sitterId: profile._id,
          amount: Number(withdrawalForm.amount),
          paymentMethod: withdrawalForm.paymentMethod,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Withdrawal request failed");
        return;
      }

      toast.success("Withdrawal request submitted successfully! 🎉");
      setShowWithdrawModal(false);
      
      // Reset form
      setWithdrawalForm({
        amount: "",
        paymentMethod: {
          ...withdrawalForm.paymentMethod,
        },
      });

      // Refresh balance and history
      const balanceRes = await fetch(
        `${API_BASE_URL}/api/withdrawals/balance/${profile._id}`
      );
      const balanceData = await balanceRes.json();
      if (balanceData.success) {
        setBalance(balanceData);
      }

      fetchHistory();
    } catch (err) {
      console.error("Withdrawal error:", err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Cancel withdrawal
  const handleCancelWithdrawal = async (withdrawalId) => {
    if (!confirm("Are you sure you want to cancel this withdrawal?")) return;

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/withdrawals/${withdrawalId}/cancel`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sitterId: profile._id,
            reason: "Cancelled by user",
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to cancel");
        return;
      }

      toast.success("Withdrawal cancelled");
      fetchHistory();
      
      // Refresh balance
      const balanceRes = await fetch(
        `${API_BASE_URL}/api/withdrawals/balance/${profile._id}`
      );
      const balanceData = await balanceRes.json();
      if (balanceData.success) {
        setBalance(balanceData);
      }
    } catch (err) {
      console.error("Cancel error:", err);
      toast.error("Failed to cancel withdrawal");
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

  if (!balance) {
    return (
      <div className="mt-10 p-6 rounded-2xl border bg-white">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Balance Card */}
      {/* Balance Card */}
<div className="mt-10 p-6 rounded-2xl border bg-gradient-to-br from-white to-gray-50 shadow-sm">
  <div className="flex justify-between items-start">
    <div>
      <p className="text-sm text-gray-500 mb-1">Available Balance</p>
      <p className="text-4xl font-bold text-gray-900">
        ₹{balance.availableBalance?.toLocaleString()}
      </p>

      <div className="mt-4 flex gap-4 text-sm">
        <div>
          <p className="text-gray-500">Total Earnings</p>
          <p className="font-semibold">₹{balance.totalEarnings?.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-gray-500">Withdrawn</p>
          <p className="font-semibold">₹{balance.withdrawnAmount?.toLocaleString()}</p>
        </div>
      </div>

      {balance.pendingWithdrawals > 0 && (
        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-50 text-yellow-700 text-xs">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          {balance.pendingWithdrawals} pending withdrawal{balance.pendingWithdrawals > 1 ? "s" : ""}
        </div>
      )}
    </div>

    {/* ✅ FIXED BUTTON */}
    <button
      onClick={() => setShowWithdrawModal(true)}
      disabled={balance.availableBalance < balance.limits.minWithdrawal}
      className="px-6 py-3 rounded-xl font-semibold text-white transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:grayscale"
      style={{ 
        backgroundColor: balance.availableBalance < balance.limits.minWithdrawal 
          ? '#9ca3af' // Gray when disabled
          : brand 
      }}
    >
      Withdraw Money
    </button>
  </div>

  {balance.availableBalance < balance.limits.minWithdrawal && (
    <div className="mt-4 p-3 rounded-lg bg-blue-50 text-blue-700 text-sm">
      ℹ️ Minimum withdrawal amount is ₹{balance.limits.minWithdrawal}
    </div>
  )}
</div>

      {/* Withdrawal History */}
      <div className="mt-8 p-6 rounded-2xl border bg-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Withdrawal History</h3>
          <button
            onClick={fetchHistory}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            🔄 Refresh
          </button>
        </div>

        {historyLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-gray-100 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : withdrawalHistory.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>No withdrawals yet</p>
            <p className="text-sm mt-1">Your withdrawal history will appear here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {withdrawalHistory.map((w) => {
              const statusColor = getStatusColor(w.status);
              return (
                <div
                  key={w._id}
                  className="p-4 rounded-xl border hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <p className="text-2xl font-bold">₹{w.amount?.toLocaleString()}</p>
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

                      <p className="text-sm text-gray-500 mt-2">
                        Requested: {formatDate(w.createdAt)}
                      </p>

                      {w.completedAt && (
                        <p className="text-sm text-green-600 mt-1">
                          ✅ Completed: {formatDate(w.completedAt)}
                        </p>
                      )}

                      {w.rejectionReason && (
                        <p className="text-sm text-red-600 mt-1">
                          ❌ Reason: {w.rejectionReason}
                        </p>
                      )}

                      {w.transactionId && (
                        <p className="text-xs text-gray-400 mt-1 font-mono">
                          TXN: {w.transactionId}
                        </p>
                      )}
                    </div>

                    {w.status === "pending" && (
                      <button
                        onClick={() => handleCancelWithdrawal(w._id)}
                        className="text-sm text-red-600 hover:text-red-700 font-medium"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Withdrawal Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Withdraw Money</h2>
                <button
  onClick={() => setShowWithdrawModal(true)}
  disabled={balance.availableBalance < balance.limits.minWithdrawal}
  className="px-6 py-3 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale hover:scale-105 disabled:hover:scale-100"
  style={{ 
    backgroundColor: balance.availableBalance < balance.limits.minWithdrawal 
      ? '#d1d5db' // gray color when disabled
      : brand,
    color: 'white'
  }}
>
  Withdraw Money
</button>
              </div>

              {/* Amount Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  value={withdrawalForm.amount}
                  onChange={(e) =>
                    setWithdrawalForm({ ...withdrawalForm, amount: e.target.value })
                  }
                  placeholder="Enter amount"
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-200 focus:border-orange-300 outline-none text-lg"
                  min={balance.limits.minWithdrawal}
                  max={Math.min(balance.limits.maxWithdrawal, balance.availableBalance)}
                />
                <p className="text-xs text-gray-500 mt-2">
                  Min: ₹{balance.limits.minWithdrawal} • Max: ₹{balance.limits.maxWithdrawal} per transaction
                </p>
              </div>

              {/* Payment Method */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Payment Method
                </label>

                <div className="flex gap-2 mb-4">
                  {["bank", "upi", "paypal"].map((method) => (
                    <button
                      key={method}
                      onClick={() =>
                        setWithdrawalForm({
                          ...withdrawalForm,
                          paymentMethod: {
                            ...withdrawalForm.paymentMethod,
                            type: method,
                          },
                        })
                      }
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                        withdrawalForm.paymentMethod.type === method
                          ? "text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                      style={{
                        backgroundColor:
                          withdrawalForm.paymentMethod.type === method ? brand : undefined,
                      }}
                    >
                      {method.toUpperCase()}
                    </button>
                  ))}
                </div>

                {/* Bank Details */}
                {withdrawalForm.paymentMethod.type === "bank" && (
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Account Holder Name"
                      value={withdrawalForm.paymentMethod.bankDetails.accountHolderName}
                      onChange={(e) =>
                        setWithdrawalForm({
                          ...withdrawalForm,
                          paymentMethod: {
                            ...withdrawalForm.paymentMethod,
                            bankDetails: {
                              ...withdrawalForm.paymentMethod.bankDetails,
                              accountHolderName: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-200 outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Account Number"
                      value={withdrawalForm.paymentMethod.bankDetails.accountNumber}
                      onChange={(e) =>
                        setWithdrawalForm({
                          ...withdrawalForm,
                          paymentMethod: {
                            ...withdrawalForm.paymentMethod,
                            bankDetails: {
                              ...withdrawalForm.paymentMethod.bankDetails,
                              accountNumber: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-200 outline-none"
                    />
                    <input
                      type="text"
                      placeholder="IFSC Code"
                      value={withdrawalForm.paymentMethod.bankDetails.ifsc}
                      onChange={(e) =>
                        setWithdrawalForm({
                          ...withdrawalForm,
                          paymentMethod: {
                            ...withdrawalForm.paymentMethod,
                            bankDetails: {
                              ...withdrawalForm.paymentMethod.bankDetails,
                              ifsc: e.target.value.toUpperCase(),
                            },
                          },
                        })
                      }
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-200 outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Bank Name (Optional)"
                      value={withdrawalForm.paymentMethod.bankDetails.bankName}
                      onChange={(e) =>
                        setWithdrawalForm({
                          ...withdrawalForm,
                          paymentMethod: {
                            ...withdrawalForm.paymentMethod,
                            bankDetails: {
                              ...withdrawalForm.paymentMethod.bankDetails,
                              bankName: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-200 outline-none"
                    />
                  </div>
                )}

                {/* UPI */}
                {withdrawalForm.paymentMethod.type === "upi" && (
                  <input
                    type="text"
                    placeholder="UPI ID (e.g., name@paytm)"
                    value={withdrawalForm.paymentMethod.upiId}
                    onChange={(e) =>
                      setWithdrawalForm({
                        ...withdrawalForm,
                        paymentMethod: {
                          ...withdrawalForm.paymentMethod,
                          upiId: e.target.value,
                        },
                      })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-200 outline-none"
                  />
                )}

                {/* PayPal */}
                {withdrawalForm.paymentMethod.type === "paypal" && (
                  <input
                    type="email"
                    placeholder="PayPal Email"
                    value={withdrawalForm.paymentMethod.paypalEmail}
                    onChange={(e) =>
                      setWithdrawalForm({
                        ...withdrawalForm,
                        paymentMethod: {
                          ...withdrawalForm.paymentMethod,
                          paypalEmail: e.target.value,
                        },
                      })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-200 outline-none"
                  />
                )}
              </div>

              {/* Important Notes */}
              <div className="mb-6 p-4 rounded-lg bg-blue-50 text-sm text-blue-700">
                <p className="font-semibold mb-2">Important:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Processing time: 1-3 business days</li>
                  <li>• Cooldown period: {balance.limits.cooldownHours} hours between withdrawals</li>
                  <li>• Daily limit: ₹{balance.limits.dailyLimit?.toLocaleString()}</li>
                  <li>• Earnings are held for {3} days after service completion</li>
                </ul>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleWithdrawalRequest}
                disabled={loading}
                className="w-full py-3 rounded-xl font-semibold text-white transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                style={{ backgroundColor: brand }}
              >
                {loading ? "Processing..." : "Request Withdrawal"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}