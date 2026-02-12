import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import API_BASE_URL from "../config/api";

// Professional SVG Icons Component
const Icons = {
  Star: ({ className = "w-5 h-5", filled = false }) => (
    <svg className={className} fill={filled ? "currentColor" : "none"} stroke={filled ? "none" : "currentColor"} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  ),
  Heart: ({ className = "w-5 h-5" }) => (
    <svg className={`${className} animate-pulse`} fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  ),
  User: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  Check: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  Send: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  ),
  Message: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
    </svg>
  ),
  Sparkles: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
  ArrowLeft: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  )
};

// Animated Star Rating Component
const StarRating = ({ rating, setRating }) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex items-center gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setRating(star)}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          className="transform transition-all duration-200 hover:scale-125 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full p-1"
        >
          <Icons.Star
            className={`w-8 h-8 sm:w-10 sm:h-10 transition-all duration-200 ${
              star <= (hoverRating || rating)
                ? "text-yellow-400 scale-110"
                : "text-gray-300"
            }`}
            filled={star <= (hoverRating || rating)}
          />
        </button>
      ))}
      <span className="ml-3 text-2xl font-bold text-gray-900">
        {hoverRating || rating}
      </span>
    </div>
  );
};

// Rating Description Component
const RatingDescription = ({ rating }) => {
  const descriptions = {
    5: { text: "Excellent", emoji: "🌟", color: "text-green-600", bgColor: "bg-green-50", borderColor: "border-green-200" },
    4: { text: "Good", emoji: "😊", color: "text-blue-600", bgColor: "bg-blue-50", borderColor: "border-blue-200" },
    3: { text: "Average", emoji: "😐", color: "text-yellow-600", bgColor: "bg-yellow-50", borderColor: "border-yellow-200" },
    2: { text: "Below Average", emoji: "😟", color: "text-orange-600", bgColor: "bg-orange-50", borderColor: "border-orange-200" },
    1: { text: "Poor", emoji: "😞", color: "text-red-600", bgColor: "bg-red-50", borderColor: "border-red-200" },
  };

  const { text, emoji, color, bgColor, borderColor } = descriptions[rating] || descriptions[5];

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${bgColor} ${borderColor} transition-all duration-300`}>
      <span className="text-2xl">{emoji}</span>
      <span className={`font-semibold ${color}`}>{text}</span>
    </div>
  );
};

export default function LeaveReview() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { sitterId, sitterName } = location.state || {};

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    setLoading(true);

    await fetch(`${API_BASE_URL}/api/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bookingId,
        sitterId,
        ownerId: user.id,
        rating,
        comment,
      }),
    });

    alert(
      `Thank you, ${user.name}! 🌟\n\nYour review for ${sitterName} has been submitted successfully.`
    );

    navigate("/my-bookings");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-20 sm:pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/my-bookings")}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6 group"
        >
          <Icons.ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Bookings</span>
        </button>

        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-lg mb-4 animate-bounce">
            <Icons.Star className="w-8 h-8 sm:w-10 sm:h-10 text-white" filled={true} />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
            Leave a <span className="text-blue-600">Review</span>
          </h1>
          {sitterName && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-200">
              <Icons.User className="w-5 h-5 text-blue-600" />
              <p className="text-base sm:text-lg text-gray-700">
                Reviewing <span className="font-bold text-gray-900">{sitterName}</span>
              </p>
            </div>
          )}
          <p className="mt-4 text-gray-600 max-w-xl mx-auto">
            Your feedback helps other pet owners find the best care for their furry friends
          </p>
        </div>

        {/* Main Review Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Decorative Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icons.Sparkles className="w-6 h-6 text-white" />
                <h2 className="text-xl sm:text-2xl font-bold text-white">Share Your Experience</h2>
              </div>
              <Icons.Heart className="w-8 h-8 text-white opacity-75" />
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6 sm:p-8 space-y-8">
            {/* Rating Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Icons.Star className="w-6 h-6 text-yellow-600" filled={true} />
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-900 uppercase tracking-wide block">
                    Rate Your Experience
                  </label>
                  <p className="text-xs text-gray-500">Click on the stars to rate</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 sm:p-8 border border-gray-100">
                <div className="flex flex-col items-center gap-4">
                  <StarRating rating={rating} setRating={setRating} />
                  <RatingDescription rating={rating} />
                </div>
              </div>

              {/* Quick Rating Guide */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs text-gray-600">
                <div className="text-center p-2 bg-red-50 rounded-lg">
                  <p className="font-semibold">1⭐ Poor</p>
                </div>
                <div className="text-center p-2 bg-orange-50 rounded-lg">
                  <p className="font-semibold">2⭐ Below Avg</p>
                </div>
                <div className="text-center p-2 bg-yellow-50 rounded-lg">
                  <p className="font-semibold">3⭐ Average</p>
                </div>
                <div className="text-center p-2 bg-blue-50 rounded-lg">
                  <p className="font-semibold">4⭐ Good</p>
                </div>
                <div className="text-center p-2 bg-green-50 rounded-lg col-span-2 sm:col-span-1">
                  <p className="font-semibold">5⭐ Excellent</p>
                </div>
              </div>
            </div>

            {/* Comment Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Icons.Message className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-900 uppercase tracking-wide block">
                    Write Your Review
                  </label>
                  <p className="text-xs text-gray-500">Share details about your experience</p>
                </div>
              </div>

              <div className="relative">
                <textarea
                  className="w-full border-2 border-gray-200 rounded-xl p-4 sm:p-5 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none resize-none text-gray-900 placeholder-gray-400"
                  rows="6"
                  placeholder="What did you love about the service? How was your pet treated? Would you recommend this sitter to others?"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <div className="absolute bottom-4 right-4 text-xs text-gray-400">
                  {comment.length} characters
                </div>
              </div>

              {/* Helpful Tips */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Icons.Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-semibold text-blue-900 mb-2">💡 Helpful Tips</h3>
                    <ul className="text-xs text-blue-800 space-y-1">
                      <li>• Mention specific aspects (communication, care quality, punctuality)</li>
                      <li>• Share how your pet responded to the sitter</li>
                      <li>• Be honest and constructive in your feedback</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                onClick={handleSubmit}
                disabled={loading || !comment.trim()}
                className="w-full inline-flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group"
              >
                {loading ? (
                  <>
                    <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting Your Review...</span>
                  </>
                ) : (
                  <>
                    <Icons.Send className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    <span>Submit Review</span>
                    <Icons.Check className="w-6 h-6" />
                  </>
                )}
              </button>

              {!comment.trim() && (
                <p className="mt-3 text-center text-sm text-gray-500">
                  Please write a comment to submit your review
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Why Reviews Matter Section */}
        <div className="mt-12 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Why Your <span className="text-blue-600">Review Matters</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 rounded-full mb-3">
                <Icons.Heart className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Help Pet Owners</h3>
              <p className="text-sm text-gray-600">Your feedback guides others in choosing the best care for their pets</p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 rounded-full mb-3">
                <Icons.User className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Support Sitters</h3>
              <p className="text-sm text-gray-600">Positive reviews help great sitters grow their business</p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-purple-100 rounded-full mb-3">
                <Icons.Sparkles className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Improve Quality</h3>
              <p className="text-sm text-gray-600">Constructive feedback helps maintain high service standards</p>
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