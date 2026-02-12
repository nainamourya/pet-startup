import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import API_BASE_URL from "../config/api";

// Professional SVG Icons Component
const Icons = {
  Star: ({ className = "w-5 h-5", filled = false }) => (
    <svg className={className} fill={filled ? "currentColor" : "none"} stroke={filled ? "none" : "currentColor"} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  ),
  Location: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Shield: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  Briefcase: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  Calendar: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  Money: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  User: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  Heart: ({ className = "w-5 h-5" }) => (
    <svg className={`${className} animate-pulse`} fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  ),
  ArrowLeft: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  ),
  Check: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  Award: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  ),
  Clock: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  ChatBubble: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
  Sparkles: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  )
};

// Star Rating Display Component
const StarRating = ({ rating, showNumber = true }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Icons.Star
          key={star}
          className="w-5 h-5 text-yellow-400"
          filled={star <= Math.round(rating)}
        />
      ))}
      {showNumber && (
        <span className="ml-1 text-sm font-semibold text-gray-700">{rating}</span>
      )}
    </div>
  );
};

// Loading Component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-24 px-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col items-center justify-center py-20">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <Icons.User className="w-8 h-8 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="mt-6 text-lg font-medium text-gray-700 animate-pulse">Loading profile...</p>
      </div>
    </div>
  </div>
);

// Not Found Component
const NotFound = ({ onBack }) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-24 px-4 sm:px-6 lg:px-8">
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
          <Icons.User className="w-10 h-10 text-red-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">Sitter Not Found</h3>
        <p className="text-gray-600 mb-6">
          The sitter profile you're looking for doesn't exist or has been removed.
        </p>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
        >
          <Icons.ArrowLeft className="w-5 h-5" />
          Back to Search
        </button>
      </div>
    </div>
  </div>
);

export default function FindSitterProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [sitter, setSitter] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingCount, setBookingCount] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const s = await fetch(`${API_BASE_URL}/api/sitters/${id}`);
        const sitterData = await s.json();

        const r = await fetch(`${API_BASE_URL}/api/reviews?sitterId=${id}`);
        const reviewData = await r.json();

        const b = await fetch(
          `${API_BASE_URL}/api/bookings?sitterId=${id}`
        );
        const bookingData = await b.json();

        setSitter(sitterData);
        setReviews(Array.isArray(reviewData) ? reviewData : []);
        setBookingCount(
          Array.isArray(bookingData)
            ? bookingData.filter((x) => x.status === "confirmed").length
            : 0
        );
      } catch (err) {
        console.error("Failed to load sitter profile:", err);
        setSitter(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const handleBackToSearch = () => {
    navigate("/find", {
      state: location.state || {},
    });
  };

  if (loading) return <LoadingSpinner />;
  if (!sitter) return <NotFound onBack={handleBackToSearch} />;

  const avg =
    reviews.length > 0
      ? (
          reviews.reduce((a, c) => a + c.rating, 0) / reviews.length
        ).toFixed(1)
      : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-20 sm:pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          onClick={handleBackToSearch}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6 group"
        >
          <Icons.ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Search</span>
        </button>

        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-6">
          {/* Cover Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-32 sm:h-40"></div>
          
          {/* Profile Info */}
          <div className="relative px-6 sm:px-8 pb-6">
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end -mt-16 sm:-mt-20">
              {/* Profile Photo */}
              <div className="relative">
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-4 border-white shadow-xl bg-white">
                  <img
                    src={sitter.photo || "https://via.placeholder.com/150"}
                    alt={sitter.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {sitter.verified && (
                  <div className="absolute -bottom-2 -right-2 bg-blue-600 rounded-full p-2 shadow-lg">
                    <Icons.Shield className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>

              {/* Name and Info */}
              <div className="flex-1 pt-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                        {sitter.name}
                      </h1>
                      {sitter.verified && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                          <Icons.Shield className="w-3 h-3" />
                          Verified
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 flex-wrap">
                      <div className="flex items-center gap-1">
                        <Icons.Location className="w-4 h-4" />
                        <span>{sitter.city}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Icons.Briefcase className="w-4 h-4" />
                        <span>{sitter.experience}</span>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="mt-3">
                      {avg ? (
                        <div className="flex items-center gap-2">
                          <StarRating rating={parseFloat(avg)} />
                          <span className="text-sm text-gray-600">
                            ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                          </span>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <Icons.Star className="w-4 h-4" filled={false} />
                          No reviews yet
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Icons.Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{bookingCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Icons.Star className="w-6 h-6 text-yellow-600" filled={true} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900">{avg || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Icons.ChatBubble className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Reviews</p>
                <p className="text-2xl font-bold text-gray-900">{reviews.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Services and Price Card */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 sm:p-8 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Services */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Icons.Heart className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Services Offered</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {(sitter.services || []).map((service, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-2 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium border border-purple-200"
                  >
                    <Icons.Check className="w-4 h-4" />
                    {service}
                  </span>
                ))}
              </div>
            </div>

            {/* Price */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Icons.Money className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Pricing</h3>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                <p className="text-3xl font-bold text-green-700">{sitter.price}</p>
                <p className="text-sm text-green-600 mt-1">Per service</p>
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        {sitter.bio && (
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 sm:p-8 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Icons.User className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">About Me</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">{sitter.bio}</p>
          </div>
        )}

        {/* Reviews Section */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Icons.Star className="w-5 h-5 text-yellow-600" filled={true} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                Reviews ({reviews.length})
              </h2>
            </div>
            
            {avg && (
              <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-lg border border-yellow-200">
                <Icons.Star className="w-5 h-5 text-yellow-500" filled={true} />
                <span className="text-xl font-bold text-yellow-700">{avg}</span>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {reviews.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
                <Icons.ChatBubble className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">No reviews yet</p>
                <p className="text-sm text-gray-500 mt-1">Be the first to review this sitter!</p>
              </div>
            ) : (
              reviews.map((r, index) => (
                <div
                  key={r._id}
                  className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-5 border border-gray-200 hover:shadow-md transition-shadow"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <Icons.User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {r.ownerId?.name || "Pet Owner"}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Icons.Star
                              key={star}
                              className="w-4 h-4 text-yellow-400"
                              filled={star <= r.rating}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-full border border-gray-200">
                      <Icons.Star className="w-4 h-4 text-yellow-500" filled={true} />
                      <span className="text-sm font-bold text-gray-900">{r.rating}</span>
                    </div>
                  </div>
                  
                  {r.comment && (
                    <p className="text-gray-700 leading-relaxed pl-13">{r.comment}</p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Why Choose Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-center text-lg font-bold text-gray-900 mb-4">
            Why Choose {sitter.name}?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {sitter.verified && (
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
                  <Icons.Shield className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-bold text-sm text-gray-900">Verified Profile</h4>
                <p className="text-xs text-gray-600 mt-1">Background checked and verified</p>
              </div>
            )}
            
            {bookingCount > 0 && (
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                  <Icons.Award className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-bold text-sm text-gray-900">Experienced</h4>
                <p className="text-xs text-gray-600 mt-1">{bookingCount} successful bookings</p>
              </div>
            )}
            
            {avg && parseFloat(avg) >= 4 && (
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mb-3">
                  <Icons.Star className="w-6 h-6 text-yellow-600" filled={true} />
                </div>
                <h4 className="font-bold text-sm text-gray-900">Highly Rated</h4>
                <p className="text-xs text-gray-600 mt-1">{avg} star average rating</p>
              </div>
            )}
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
      `}</style>
    </div>
  );
}