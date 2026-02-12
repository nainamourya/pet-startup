import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { openRazorpay } from "../utils/razorpayPayment";
import { Link } from "react-router-dom";
import API_BASE_URL from "../config/api";

// Professional SVG Icons Component with Animations
const Icons = {
  Calendar: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  Pet: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Location: ({ className = "w-5 h-5" }) => (
    <svg className={`${className} animate-bounce`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Money: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Star: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ),
  Check: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  Clock: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Heart: ({ className = "w-5 h-5" }) => (
    <svg className={`${className} animate-pulse`} fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  ),
  Shield: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  User: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  Medical: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </svg>
  ),
  Home: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  Alert: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  Walk: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  Info: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
};

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-24 px-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col items-center justify-center py-20">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <Icons.Pet className="w-8 h-8 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="mt-6 text-lg font-medium text-gray-700 animate-pulse">Loading your bookings...</p>
        <p className="mt-2 text-sm text-gray-500">Please wait while we fetch your pet care appointments</p>
      </div>
    </div>
  </div>
);

// Empty State Component
const EmptyState = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12 text-center">
    <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
      <Icons.Calendar className="w-10 h-10 text-blue-600" />
    </div>
    <h3 className="text-2xl font-bold text-gray-900 mb-3">No Bookings Yet</h3>
    <p className="text-gray-600 mb-6 max-w-md mx-auto">
      Start your pet care journey today! Book trusted sitters for walks, boarding, or daycare services.
    </p>
    <Link to="/sitters">
      <button className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg">
        <Icons.Heart className="w-5 h-5" />
        Find Pet Sitters
      </button>
    </Link>
  </div>
);

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusAlert, setStatusAlert] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const load = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    setLoading(true);

    const ownerId = user._id || user.id;
    const res = await fetch(
      `${API_BASE_URL}/api/bookings?ownerId=${ownerId}`
    );
    try {
      const data = await res.json();

      // Normalize response: some APIs may return { bookings: [...] } or an object on error
      const normalized = Array.isArray(data)
        ? data
        : Array.isArray(data?.bookings)
        ? data.bookings
        : Array.isArray(data?.data)
        ? data.data
        : [];

      setBookings(normalized);

      // 🔔 Owner soft notification
      const lastSeen = localStorage.getItem("ownerLastSeenAt");
      const lastSeenTime = lastSeen ? new Date(lastSeen) : new Date(0);

      const changed = normalized.find(
        (b) => b.status !== "pending" && new Date(b.updatedAt) > lastSeenTime
      );

      if (changed) {
        setStatusAlert(
          `Your booking with ${changed.sitterId?.name || "a sitter"} was ${changed.status}`
        );
      }

      localStorage.setItem("ownerLastSeenAt", new Date().toISOString());
    } catch (err) {
      console.error("Failed to load bookings:", err);
      setStatusAlert("Failed to load bookings. Please try again later.");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [location.pathname]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-20 sm:pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      {/* SEO-Friendly Header Section */}
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Icons.Calendar className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
              My <span className="text-blue-600">Bookings</span>
            </h1>
          </div>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Manage your pet care appointments, track services, and stay connected with trusted sitters
          </p>
        </div>

        {/* Status Alert */}
        {statusAlert && (
          <div className="mb-6 sm:mb-8 max-w-4xl mx-auto animate-fadeIn">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-xl p-4 sm:p-5 shadow-md">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <Icons.Check className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm sm:text-base font-semibold text-green-900 mb-1">Booking Update</h3>
                  <p className="text-sm text-green-800">{statusAlert}</p>
                </div>
                <button
                  onClick={() => setStatusAlert(null)}
                  className="flex-shrink-0 text-green-600 hover:text-green-800 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bookings Grid */}
        {bookings.length === 0 ? (
          <div className="max-w-3xl mx-auto">
            <EmptyState />
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Icons.Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Bookings</p>
                    <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Icons.Check className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Confirmed</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {bookings.filter(b => b.status === "confirmed").length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Icons.Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {bookings.filter(b => b.status === "pending").length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bookings List */}
            <div className="grid gap-4 sm:gap-6">
              {bookings.map((b, index) => (
                <div
                  key={b._id}
                  className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Header Section */}
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center ring-2 ring-white ring-opacity-50">
                          <Icons.User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                            {b.sitterId?.name || "Sitter"}
                          </h3>
                          <p className="text-sm text-blue-100 flex items-center gap-1">
                            <Icons.Shield className="w-4 h-4" />
                            Verified Professional
                          </p>
                        </div>
                      </div>
                      
                      {/* Status Badge */}
                      <span
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold shadow-md ${
                          b.status === "pending"
                            ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                            : b.status === "confirmed"
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : "bg-red-100 text-red-800 border border-red-200"
                        }`}
                      >
                        {b.status === "pending" && <Icons.Clock className="w-4 h-4" />}
                        {b.status === "confirmed" && <Icons.Check className="w-4 h-4" />}
                        {b.status === "rejected" && <Icons.Alert className="w-4 h-4" />}
                        <span className="capitalize">{b.status}</span>
                      </span>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-4 sm:p-6 space-y-4">
                    {/* Service Type */}
                    <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                        {b.service === "Walk" ? (
                          <Icons.Walk className="w-5 h-5 text-blue-600" />
                        ) : b.service === "Boarding" ? (
                          <Icons.Home className="w-5 h-5 text-blue-600" />
                        ) : (
                          <Icons.Heart className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Service Type</p>
                        <p className="text-base sm:text-lg font-semibold text-gray-900">{b.service}</p>
                      </div>
                    </div>

                    {/* Track Walk Button */}
                    {b.service === "Walk" && b.status === "confirmed" && b.payment?.paid && (
                      <div className="animate-fadeIn">
                        <Link to={`/track-walk/${b._id}`}>
                          <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg">
                            <Icons.Location className="w-5 h-5" />
                            Track Walk Live
                          </button>
                        </Link>
                      </div>
                    )}

                    {/* Payment Section */}
                    <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 space-y-3">
                      {b.payment?.paid ? (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <Icons.Check className="w-5 h-5 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-600">Payment Status</p>
                            <p className="text-base font-bold text-green-600">Payment Completed ✓</p>
                          </div>
                        </div>
                      ) : (b.status === "confirmed" || b.status === "completed") ? (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Icons.Money className="w-5 h-5 text-gray-600" />
                              <span className="text-sm font-medium text-gray-700">Amount to Pay:</span>
                            </div>
                            <span className="text-xl sm:text-2xl font-bold text-blue-600">
                              ₹{b.servicePrice || (b.sitterId?.price ? parseInt(b.sitterId.price) : "N/A")}
                            </span>
                          </div>
                          <button
                            onClick={async () => {
                              try {
                                setPaymentLoading(b._id);
                                const sitterPrice = b.sitterId?.price ? parseInt(b.sitterId.price.replace(/[^\d]/g, "")) : 0;
                                const amount = Number(b.servicePrice || sitterPrice || 0);
                                if (amount <= 0) {
                                  alert("Invalid amount. Sitter price not set. Please contact the sitter.");
                                  return;
                                }
                                console.log("Starting payment for booking:", b._id, "Amount:", amount);
                                await openRazorpay({
                                  amount,
                                  bookingId: b._id,
                                });
                                await load(); // Reload bookings after payment
                              } catch (error) {
                                console.error("Payment error:", error);
                                alert("Payment error: " + error.message);
                              } finally {
                                setPaymentLoading(null);
                              }
                            }}
                            disabled={paymentLoading === b._id}
                            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                          >
                            {paymentLoading === b._id ? (
                              <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Processing Payment...
                              </>
                            ) : (
                              <>
                                <Icons.Money className="w-5 h-5" />
                                Pay Now - Secure Payment
                              </>
                            )}
                          </button>
                        </div>
                      ) : null}
                    </div>

                    {/* Pet Details */}
                    {b.pet && (
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 space-y-3">
                        <div className="flex items-center gap-2 mb-3">
                          <Icons.Pet className="w-5 h-5 text-purple-600" />
                          <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Pet Information</h4>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center gap-2">
                            <Icons.Heart className="w-4 h-4 text-pink-500" />
                            <span className="text-gray-600">Name:</span>
                            <span className="font-semibold text-gray-900">{b.pet.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Icons.Info className="w-4 h-4 text-purple-500" />
                            <span className="text-gray-600">Type:</span>
                            <span className="font-semibold text-gray-900">{b.pet.type}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Icons.Clock className="w-4 h-4 text-blue-500" />
                            <span className="text-gray-600">Age:</span>
                            <span className="font-semibold text-gray-900">{b.pet.age}</span>
                          </div>
                        </div>
                        {b.pet.notes && (
                          <div className="mt-3 p-3 bg-white bg-opacity-70 rounded-lg">
                            <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                              <Icons.Info className="w-3 h-3" />
                              Special Notes:
                            </p>
                            <p className="text-sm text-gray-700">{b.pet.notes}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Boarding Details */}
                    {b.boarding && (
                      <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 space-y-3">
                        <div className="flex items-center gap-2 mb-3">
                          <Icons.Home className="w-5 h-5 text-orange-600" />
                          <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Boarding Details</h4>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Icons.Calendar className="w-4 h-4 text-orange-500" />
                            <span className="text-gray-600">Duration:</span>
                            <span className="font-semibold text-gray-900">
                              {b.boarding.startDate} → {b.boarding.endDate}
                            </span>
                          </div>
                          {b.boarding.vetNumber && (
                            <div className="flex items-center gap-2">
                              <Icons.Medical className="w-4 h-4 text-red-500" />
                              <span className="text-gray-600">Vet Contact:</span>
                              <a href={`tel:${b.boarding.vetNumber}`} className="font-semibold text-blue-600 hover:underline">
                                {b.boarding.vetNumber}
                              </a>
                            </div>
                          )}
                          {b.boarding.medicine && (
                            <div className="flex items-start gap-2">
                              <Icons.Medical className="w-4 h-4 text-green-500 mt-0.5" />
                              <div>
                                <span className="text-gray-600">Medicine:</span>
                                <p className="font-semibold text-gray-900">{b.boarding.medicine}</p>
                              </div>
                            </div>
                          )}
                          {b.boarding.emergencyNotes && (
                            <div className="mt-3 p-3 bg-white bg-opacity-70 rounded-lg border-l-4 border-orange-400">
                              <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                                <Icons.Alert className="w-3 h-3" />
                                Emergency Notes:
                              </p>
                              <p className="text-sm text-gray-700 font-medium">{b.boarding.emergencyNotes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Review Section */}
                    {!b.reviewed && b.status === "confirmed" && (
                      <div className="pt-4 border-t border-gray-100">
                        <button
                          onClick={() =>
                            navigate(`/review/${b._id}`, {
                              state: {
                                sitterId: b.sitterId._id,
                                sitterName: b.sitterId.name,
                              },
                            })
                          }
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-blue-600 text-blue-600 font-medium rounded-xl hover:bg-blue-50 transition-all duration-200 hover:scale-105"
                        >
                          <Icons.Star className="w-5 h-5" />
                          Leave a Review
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SEO-Friendly Footer Section */}
        <div className="mt-12 sm:mt-16 max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                Why Choose Our <span className="text-blue-600">Pet Care Platform</span>?
              </h2>
              <p className="text-gray-600">
                India's most trusted platform for pet sitting, walking, and boarding services
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 rounded-full mb-3">
                  <Icons.Shield className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Verified Sitters</h3>
                <p className="text-sm text-gray-600">All sitters are background-checked and verified professionals</p>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 rounded-full mb-3">
                  <Icons.Location className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Real-Time Tracking</h3>
                <p className="text-sm text-gray-600">Track your pet's walk or care session live on the map</p>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-purple-100 rounded-full mb-3">
                  <Icons.Money className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Secure Payments</h3>
                <p className="text-sm text-gray-600">Safe and encrypted payment processing for peace of mind</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}