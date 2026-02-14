import { useEffect, useState } from "react";
import { getReviews, toggleReview } from "../services/adminApi";

// Professional SVG Icons
const Icons = {
  Star: ({ className = "w-5 h-5", filled = false }) => (
    <svg className={className} fill={filled ? "currentColor" : "none"} stroke={filled ? "none" : "currentColor"} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  ),
  ChatBubble: ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
  User: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  Briefcase: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  Eye: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ),
  EyeOff: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  ),
  Search: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  Filter: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
    </svg>
  ),
  Check: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  AlertCircle: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
};

// Star Rating Component
const StarRating = ({ rating }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Icons.Star
          key={star}
          className="w-5 h-5 text-yellow-400"
          filled={star <= rating}
        />
      ))}
      <span className="ml-2 text-sm font-bold text-gray-900">{rating}/5</span>
    </div>
  );
};

// Toggle Switch Component
const ToggleSwitch = ({ isHidden, onClick, loading }) => (
  <button
    onClick={onClick}
    disabled={loading}
    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-4 ${
      isHidden 
        ? 'bg-red-500 focus:ring-red-100' 
        : 'bg-green-500 focus:ring-green-100'
    } ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
  >
    <span
      className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 shadow-lg ${
        isHidden ? 'translate-x-1' : 'translate-x-7'
      }`}
    >
      {loading ? (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-3 h-3 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          {isHidden ? (
            <Icons.EyeOff className="w-3 h-3 text-red-600" />
          ) : (
            <Icons.Eye className="w-3 h-3 text-green-600" />
          )}
        </div>
      )}
    </span>
  </button>
);

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRating, setFilterRating] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [togglingId, setTogglingId] = useState(null);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const res = await getReviews();
      setReviews(res.data);
    } catch (error) {
      console.error("Failed to load reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggle = async (id) => {
    setTogglingId(id);
    try {
      await toggleReview(id);
      loadReviews();
    } catch (error) {
      console.error("Failed to toggle review:", error);
    } finally {
      setTogglingId(null);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  // Filter reviews
  const filteredReviews = reviews.filter((r) => {
    const matchesSearch = 
      r.sitterId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.ownerId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.comment?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRating = filterRating === "all" || 
      (filterRating === "5" && r.rating === 5) ||
      (filterRating === "4" && r.rating === 4) ||
      (filterRating === "3" && r.rating === 3) ||
      (filterRating === "low" && r.rating <= 2);
    
    const matchesStatus = filterStatus === "all" ||
      (filterStatus === "visible" && !r.isHidden) ||
      (filterStatus === "hidden" && r.isHidden);
    
    return matchesSearch && matchesRating && matchesStatus;
  });

  // Calculate stats
  const totalReviews = reviews.length;
  const visibleReviews = reviews.filter(r => !r.isHidden).length;
  const hiddenReviews = reviews.filter(r => r.isHidden).length;
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;
  const fiveStarReviews = reviews.filter(r => r.rating === 5).length;
  const lowRatingReviews = reviews.filter(r => r.rating <= 2).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-yellow-200 border-t-yellow-600 mb-4"></div>
          <p className="text-lg font-semibold text-gray-700">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 pt-20 sm:pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-yellow-600 to-orange-600 shadow-lg">
              <Icons.ChatBubble className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Manage <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-orange-600">Reviews</span>
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                Moderate and manage user reviews
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Icons.ChatBubble className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{totalReviews}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100">
                  <Icons.Eye className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Visible</p>
                  <p className="text-2xl font-bold text-green-600">{visibleReviews}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-100">
                  <Icons.EyeOff className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Hidden</p>
                  <p className="text-2xl font-bold text-red-600">{hiddenReviews}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-100">
                  <Icons.Star className="w-5 h-5 text-yellow-600" filled={true} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Avg Rating</p>
                  <p className="text-2xl font-bold text-yellow-600">{avgRating}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100">
                  <Icons.Check className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">5 Stars</p>
                  <p className="text-2xl font-bold text-green-600">{fiveStarReviews}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-100">
                  <Icons.AlertCircle className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Low Rating</p>
                  <p className="text-2xl font-bold text-orange-600">{lowRatingReviews}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Icons.Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by sitter, owner, or comment..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-100 outline-none transition-all text-gray-900 placeholder-gray-400"
                />
              </div>

              {/* Rating Filter */}
              <div className="flex gap-2">
                {["all", "5", "4", "3", "low"].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setFilterRating(rating)}
                    className={`px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                      filterRating === rating
                        ? "bg-yellow-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {rating === "all" ? "All" : rating === "low" ? "≤2★" : `${rating}★`}
                  </button>
                ))}
              </div>

              {/* Status Filter */}
              <div className="flex gap-2">
                {["all", "visible", "hidden"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-4 py-3 rounded-xl font-semibold text-sm transition-all capitalize ${
                      filterStatus === status
                        ? "bg-yellow-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                Showing <span className="font-bold text-gray-900">{filteredReviews.length}</span> of{" "}
                <span className="font-bold text-gray-900">{reviews.length}</span> reviews
              </p>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        {filteredReviews.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
              <Icons.ChatBubble className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Reviews Found</h3>
            <p className="text-gray-600">
              {searchTerm || filterRating !== "all" || filterStatus !== "all"
                ? "Try adjusting your search or filter criteria"
                : "No reviews have been submitted yet"}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredReviews.map((r, index) => (
              <div
                key={r._id}
                className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-xl transition-all duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Left: Review Content */}
                  <div className="flex-1">
                    {/* Header with Rating */}
                    <div className="flex items-start justify-between mb-4">
                      <StarRating rating={r.rating} />
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                          r.isHidden
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {r.isHidden ? (
                          <>
                            <Icons.EyeOff className="w-3 h-3" />
                            Hidden
                          </>
                        ) : (
                          <>
                            <Icons.Eye className="w-3 h-3" />
                            Visible
                          </>
                        )}
                      </span>
                    </div>

                    {/* Comment */}
                    <div className="mb-4 p-4 rounded-xl bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-200">
                      <p className="text-gray-700 leading-relaxed italic">
                        "{r.comment}"
                      </p>
                    </div>

                    {/* User Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Sitter */}
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50 border border-green-100">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center text-white font-bold shadow-md">
                          {r.sitterId?.name?.charAt(0).toUpperCase() || "S"}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <Icons.Briefcase className="w-4 h-4 text-green-600" />
                            <p className="text-xs font-semibold text-green-600 uppercase tracking-wide">Sitter</p>
                          </div>
                          <p className="font-semibold text-gray-900">{r.sitterId?.name || "Unknown"}</p>
                        </div>
                      </div>

                      {/* Owner */}
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 border border-blue-100">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
                          {r.ownerId?.name?.charAt(0).toUpperCase() || "O"}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <Icons.User className="w-4 h-4 text-blue-600" />
                            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Owner</p>
                          </div>
                          <p className="font-semibold text-gray-900">{r.ownerId?.name || "Unknown"}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Action */}
                  <div className="lg:w-56 flex flex-col justify-center">
                    <div className="text-center sm:text-left lg:text-right">
                      <p className="text-xs text-gray-500 mb-3 font-semibold uppercase tracking-wide">
                        Visibility Control
                      </p>
                      <div className="flex items-center justify-center lg:justify-end gap-3">
                        <ToggleSwitch
                          isHidden={r.isHidden}
                          onClick={() => toggle(r._id)}
                          loading={togglingId === r._id}
                        />
                        <span className="text-sm font-medium text-gray-600">
                          {r.isHidden ? "Hidden" : "Visible"}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        {r.isHidden ? "Click to unhide review" : "Click to hide review"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}