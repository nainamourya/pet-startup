import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import API_BASE_URL from "../config/api";

export default function BankDetailsSection({ profile, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAccountNumber, setShowAccountNumber] = useState(false);
  
  const [bankForm, setBankForm] = useState({
    accountHolderName: "",
    accountNumber: "",
    confirmAccountNumber: "",
    ifscCode: "",
    bankName: "",
    branchName: "",
    accountType: "savings",
  });

  const [errors, setErrors] = useState({});

  // Initialize form with existing data
  useEffect(() => {
    if (profile?.bankDetails && !isEditing) {
      setBankForm({
        accountHolderName: profile.bankDetails.accountHolderName || "",
        accountNumber: profile.bankDetails.accountNumber || "",
        confirmAccountNumber: profile.bankDetails.accountNumber || "",
        ifscCode: profile.bankDetails.ifscCode || "",
        bankName: profile.bankDetails.bankName || "",
        branchName: profile.bankDetails.branchName || "",
        accountType: profile.bankDetails.accountType || "savings",
      });
    }
  }, [profile, isEditing]);

  // Validation functions
  const validateIFSC = (ifsc) => {
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    return ifscRegex.test(ifsc);
  };

  const validateAccountNumber = (number) => {
    return /^\d{9,18}$/.test(number);
  };

  const validateForm = () => {
    const newErrors = {};

    // Account Holder Name
    if (!bankForm.accountHolderName.trim()) {
      newErrors.accountHolderName = "Account holder name is required";
    } else if (bankForm.accountHolderName.length < 3) {
      newErrors.accountHolderName = "Name must be at least 3 characters";
    }

    // Account Number
    if (!bankForm.accountNumber) {
      newErrors.accountNumber = "Account number is required";
    } else if (!validateAccountNumber(bankForm.accountNumber)) {
      newErrors.accountNumber = "Invalid account number (9-18 digits)";
    }

    // Confirm Account Number
    if (bankForm.accountNumber !== bankForm.confirmAccountNumber) {
      newErrors.confirmAccountNumber = "Account numbers do not match";
    }

    // IFSC Code
    if (!bankForm.ifscCode) {
      newErrors.ifscCode = "IFSC code is required";
    } else if (!validateIFSC(bankForm.ifscCode.toUpperCase())) {
      newErrors.ifscCode = "Invalid IFSC code format (e.g., SBIN0001234)";
    }

    // Bank Name
    if (!bankForm.bankName.trim()) {
      newErrors.bankName = "Bank name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error("Please fix the errors before saving");
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE_URL}/api/sitters/bank-details`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          accountHolderName: bankForm.accountHolderName.trim(),
          accountNumber: bankForm.accountNumber,
          ifscCode: bankForm.ifscCode.toUpperCase(),
          bankName: bankForm.bankName.trim(),
          branchName: bankForm.branchName.trim(),
          accountType: bankForm.accountType,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to save bank details");
      }

      toast.success("Bank details saved successfully! 🎉");
      setIsEditing(false);
      
      // Update parent component
      if (onUpdate) {
        onUpdate(data.bankDetails);
      }
    } catch (err) {
      console.error("Error saving bank details:", err);
      toast.error(err.message || "Failed to save bank details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setErrors({});
    // Reset to original values
    if (profile?.bankDetails) {
      setBankForm({
        accountHolderName: profile.bankDetails.accountHolderName || "",
        accountNumber: profile.bankDetails.accountNumber || "",
        confirmAccountNumber: profile.bankDetails.accountNumber || "",
        ifscCode: profile.bankDetails.ifscCode || "",
        bankName: profile.bankDetails.bankName || "",
        branchName: profile.bankDetails.branchName || "",
        accountType: profile.bankDetails.accountType || "savings",
      });
    }
  };

  const brand = "#ff9b7a";

  // Check if bank details exist
  const hasBankDetails = profile?.bankDetails?.accountHolderName;

  return (
    <div className="mt-10 p-6 rounded-2xl border bg-white shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "#fff5f2" }}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke={brand}
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold">Bank Account Details</h2>
            <p className="text-xs text-gray-500">
              {hasBankDetails
                ? "Manage your payout account"
                : "Add your bank account to receive payments"}
            </p>
          </div>
        </div>

        {hasBankDetails && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm font-medium hover:opacity-80 transition"
            style={{ color: brand }}
          >
            Edit Details
          </button>
        )}
      </div>

      {/* Verification Status */}
      {hasBankDetails && !isEditing && (
        <div
          className="mb-6 p-3 rounded-lg flex items-center gap-2"
          style={{
            backgroundColor: profile.bankDetails.verified
              ? "#f0fdf4"
              : "#fff7ed",
          }}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke={profile.bankDetails.verified ? "#15803d" : "#ea580c"}
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            {profile.bankDetails.verified ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            )}
          </svg>
          <span
            className="text-sm font-medium"
            style={{
              color: profile.bankDetails.verified ? "#15803d" : "#ea580c",
            }}
          >
            {profile.bankDetails.verified
              ? "Bank account verified ✓"
              : "Pending verification - Earnings will be processed after verification"}
          </span>
        </div>
      )}

      {/* Display Mode */}
      {hasBankDetails && !isEditing ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Account Holder Name */}
            <div className="p-4 rounded-xl border bg-gray-50">
              <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">
                Account Holder Name
              </p>
              <p className="font-semibold text-gray-900">
                {profile.bankDetails.accountHolderName}
              </p>
            </div>

            {/* Bank Name */}
            <div className="p-4 rounded-xl border bg-gray-50">
              <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">
                Bank Name
              </p>
              <p className="font-semibold text-gray-900">
                {profile.bankDetails.bankName}
              </p>
            </div>

            {/* Account Number */}
            <div className="p-4 rounded-xl border bg-gray-50">
              <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">
                Account Number
              </p>
              <div className="flex items-center justify-between">
                <p className="font-semibold text-gray-900 font-mono">
                  {showAccountNumber
                    ? profile.bankDetails.accountNumber
                    : `****${profile.bankDetails.accountNumber?.slice(-4)}`}
                </p>
                <button
                  onClick={() => setShowAccountNumber(!showAccountNumber)}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  {showAccountNumber ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* IFSC Code */}
            <div className="p-4 rounded-xl border bg-gray-50">
              <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">
                IFSC Code
              </p>
              <p className="font-semibold text-gray-900 font-mono">
                {profile.bankDetails.ifscCode}
              </p>
            </div>

            {/* Account Type */}
            <div className="p-4 rounded-xl border bg-gray-50">
              <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">
                Account Type
              </p>
              <p className="font-semibold text-gray-900 capitalize">
                {profile.bankDetails.accountType || "Savings"}
              </p>
            </div>

            {/* Branch Name */}
            {profile.bankDetails.branchName && (
              <div className="p-4 rounded-xl border bg-gray-50">
                <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">
                  Branch Name
                </p>
                <p className="font-semibold text-gray-900">
                  {profile.bankDetails.branchName}
                </p>
              </div>
            )}
          </div>

          {/* Security Note */}
          <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-100">
            <div className="flex gap-2">
              <svg
                className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <div>
                <p className="text-sm font-medium text-blue-900">
                  Your bank details are secure
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  We use bank-level encryption to protect your information.
                  Your details will only be used for processing payouts.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Edit/Add Mode */
        <div className="space-y-4">
          {/* Account Holder Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account Holder Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={bankForm.accountHolderName}
              onChange={(e) => {
                setBankForm({ ...bankForm, accountHolderName: e.target.value });
                setErrors({ ...errors, accountHolderName: "" });
              }}
              placeholder="Enter name as per bank account"
              className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 ${
                errors.accountHolderName
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:ring-orange-200"
              }`}
            />
            {errors.accountHolderName && (
              <p className="text-xs text-red-500 mt-1">
                {errors.accountHolderName}
              </p>
            )}
          </div>

          {/* Account Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={bankForm.accountNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                setBankForm({ ...bankForm, accountNumber: value });
                setErrors({ ...errors, accountNumber: "" });
              }}
              placeholder="Enter account number"
              className={`w-full border p-3 rounded-lg font-mono focus:outline-none focus:ring-2 ${
                errors.accountNumber
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:ring-orange-200"
              }`}
            />
            {errors.accountNumber && (
              <p className="text-xs text-red-500 mt-1">{errors.accountNumber}</p>
            )}
          </div>

          {/* Confirm Account Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Account Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={bankForm.confirmAccountNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                setBankForm({ ...bankForm, confirmAccountNumber: value });
                setErrors({ ...errors, confirmAccountNumber: "" });
              }}
              placeholder="Re-enter account number"
              className={`w-full border p-3 rounded-lg font-mono focus:outline-none focus:ring-2 ${
                errors.confirmAccountNumber
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:ring-orange-200"
              }`}
            />
            {errors.confirmAccountNumber && (
              <p className="text-xs text-red-500 mt-1">
                {errors.confirmAccountNumber}
              </p>
            )}
          </div>

          {/* IFSC Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              IFSC Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={bankForm.ifscCode}
              onChange={(e) => {
                setBankForm({
                  ...bankForm,
                  ifscCode: e.target.value.toUpperCase(),
                });
                setErrors({ ...errors, ifscCode: "" });
              }}
              placeholder="e.g., SBIN0001234"
              maxLength={11}
              className={`w-full border p-3 rounded-lg font-mono uppercase focus:outline-none focus:ring-2 ${
                errors.ifscCode
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:ring-orange-200"
              }`}
            />
            {errors.ifscCode && (
              <p className="text-xs text-red-500 mt-1">{errors.ifscCode}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              11-character code found on your cheque or passbook
            </p>
          </div>

          {/* Bank Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bank Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={bankForm.bankName}
              onChange={(e) => {
                setBankForm({ ...bankForm, bankName: e.target.value });
                setErrors({ ...errors, bankName: "" });
              }}
              placeholder="e.g., State Bank of India"
              className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 ${
                errors.bankName
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:ring-orange-200"
              }`}
            />
            {errors.bankName && (
              <p className="text-xs text-red-500 mt-1">{errors.bankName}</p>
            )}
          </div>

          {/* Branch Name (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Branch Name <span className="text-gray-400">(Optional)</span>
            </label>
            <input
              type="text"
              value={bankForm.branchName}
              onChange={(e) =>
                setBankForm({ ...bankForm, branchName: e.target.value })
              }
              placeholder="e.g., Mumbai Main Branch"
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200"
            />
          </div>

          {/* Account Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account Type <span className="text-red-500">*</span>
            </label>
            <select
              value={bankForm.accountType}
              onChange={(e) =>
                setBankForm({ ...bankForm, accountType: e.target.value })
              }
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200"
            >
              <option value="savings">Savings Account</option>
              <option value="current">Current Account</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="px-6 py-3 rounded-lg text-white font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: brand }}
            >
              {isLoading ? "Saving..." : hasBankDetails ? "Update Details" : "Save Details"}
            </button>

            {hasBankDetails && (
              <button
                onClick={handleCancel}
                disabled={isLoading}
                className="px-6 py-3 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition disabled:opacity-50"
              >
                Cancel
              </button>
            )}
          </div>

          {/* Help Text */}
          <div className="mt-4 p-3 rounded-lg bg-gray-50 border border-gray-200">
            <p className="text-xs text-gray-600">
              <strong>Note:</strong> Please ensure all details match your bank
              records exactly. Incorrect information may delay your payouts.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
