import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Star, Quote, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const TESTIMONIALS = [
  {
    name: "Ananya Sharma",
    role: "Pet Parent",
    location: "Mumbai",
    text: "I was always anxious leaving my dog with someone new. PetSitter completely changed that. The sitter updates, reviews, and care were beyond expectations.",
    rating: 5,
    image: "AS",
    gradient: "from-blue-500 to-indigo-500",
  },
  {
    name: "Rahul Mehta",
    role: "Pet Parent",
    location: "Bengaluru",
    text: "For the first time, I felt calm while traveling. Knowing my pet was in safe hands made all the difference.",
    rating: 5,
    image: "RM",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    name: "Sneha Kapoor",
    role: "Verified Sitter",
    location: "Delhi",
    text: "PetSitter respects sitters as much as pet parents. The platform feels thoughtful, transparent, and genuinely built for care.",
    rating: 5,
    image: "SK",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    name: "Arjun Patel",
    role: "Pet Parent",
    location: "Pune",
    text: "The real-time updates and GPS tracking gave me complete peace of mind. I could see exactly where my dog was during walks!",
    rating: 5,
    image: "AP",
    gradient: "from-orange-500 to-red-500",
  },
  {
    name: "Priya Singh",
    role: "Verified Sitter",
    location: "Hyderabad",
    text: "Being part of the PetSitter community has been amazing. The verification process made me feel valued and the support is incredible.",
    rating: 5,
    image: "PS",
    gradient: "from-pink-500 to-rose-500",
  },
];

export default function Testimonials() {
  const ref = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [direction, setDirection] = useState(0);

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isPlaying]);

  const paginate = (newDirection) => {
    setDirection(newDirection);
    setCurrentIndex((prev) => {
      if (newDirection === 1) {
        return (prev + 1) % TESTIMONIALS.length;
      } else {
        return prev === 0 ? TESTIMONIALS.length - 1 : prev - 1;
      }
    });
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".testimonials-header",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".testimonials-header",
            start: "top 85%",
          },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 sm:px-6 py-24 overflow-hidden"
    >
      {/* Ambient background elements */}
      <div className="absolute inset-x-0 top-1/3 h-[400px] bg-gradient-to-r from-blue-100 via-purple-50 to-pink-100 opacity-30 blur-3xl pointer-events-none" />

      {/* Floating quote decorations */}
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-12 text-blue-200 opacity-20 hidden lg:block"
      >
        <Quote size={80} />
      </motion.div>
      <motion.div
        animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 right-16 text-purple-200 opacity-20 hidden lg:block"
      >
        <Quote size={80} />
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* Header */}
        <div className="testimonials-header text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-6">
            <Star className="w-4 h-4 fill-current" />
            Testimonials
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Community</span> Says
          </h2>
          
          <p className="text-xl text-gray-600 leading-relaxed">
            Honest experiences from pet parents and sitters who trust PetSitter.
          </p>
        </div>

        {/* Slider Container */}
        <div className="relative max-w-5xl mx-auto">
          
          {/* Slider */}
          <div className="relative h-[500px] sm:h-[450px] flex items-center justify-center overflow-hidden">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.3 },
                  scale: { duration: 0.3 },
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = swipePower(offset.x, velocity.x);

                  if (swipe < -swipeConfidenceThreshold) {
                    paginate(1);
                  } else if (swipe > swipeConfidenceThreshold) {
                    paginate(-1);
                  }
                }}
                className="absolute w-full"
              >
                <TestimonialCard testimonial={TESTIMONIALS[currentIndex]} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={() => paginate(-1)}
              className="w-12 h-12 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center hover:border-blue-600 hover:text-blue-600 transition-all duration-200 hover:scale-110 shadow-lg"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Dots Indicator */}
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > currentIndex ? 1 : -1);
                    setCurrentIndex(index);
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "w-8 bg-gradient-to-r from-blue-600 to-indigo-600"
                      : "w-2 bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            {/* Play/Pause Button */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-12 h-12 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center hover:border-blue-600 hover:text-blue-600 transition-all duration-200 hover:scale-110 shadow-lg"
              aria-label={isPlaying ? "Pause autoplay" : "Resume autoplay"}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>

            <button
              onClick={() => paginate(1)}
              className="w-12 h-12 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center hover:border-blue-600 hover:text-blue-600 transition-all duration-200 hover:scale-110 shadow-lg"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Counter */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-500 font-medium">
              {currentIndex + 1} / {TESTIMONIALS.length}
            </p>
          </div>
        </div>

        {/* Trust Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <StatBadge number="500+" label="5-Star Reviews" />
          <StatBadge number="4.9/5" label="Average Rating" />
          <StatBadge number="98%" label="Satisfaction" />
          <StatBadge number="1000+" label="Happy Clients" />
        </div>

      </div>
    </section>
  );
}

/* ---------- Testimonial Card Component ---------- */

function TestimonialCard({ testimonial }) {
  return (
    <div className="max-w-3xl mx-auto px-4">
      <div className="relative bg-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-gray-100">
        {/* Quote Icon */}
        <div className={`absolute -top-6 -left-6 w-16 h-16 rounded-2xl bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center shadow-xl`}>
          <Quote className="w-8 h-8 text-white" />
        </div>

        {/* Stars */}
        <div className="flex gap-1 text-yellow-400 mb-6">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star key={i} size={20} fill="currentColor" />
          ))}
        </div>

        {/* Quote Text */}
        <blockquote className="text-xl sm:text-2xl text-gray-700 leading-relaxed mb-8 font-medium">
          "{testimonial.text}"
        </blockquote>

        {/* Author Info */}
        <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
          {/* Avatar */}
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center text-white font-bold text-xl shadow-lg flex-shrink-0`}>
            {testimonial.image}
          </div>

          {/* Details */}
          <div>
            <p className="text-lg font-bold text-gray-900">
              {testimonial.name}
            </p>
            <p className="text-sm text-gray-600">
              {testimonial.role} · {testimonial.location}
            </p>
          </div>
        </div>

        {/* Decorative corner glow */}
        <div className={`absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br ${testimonial.gradient} rounded-full blur-3xl opacity-20`} />
      </div>
    </div>
  );
}

/* ---------- Stat Badge Component ---------- */

function StatBadge({ number, label }) {
  return (
    <div className="bg-white rounded-2xl p-6 text-center shadow-md border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">
        {number}
      </div>
      <div className="text-sm text-gray-600 font-semibold">{label}</div>
    </div>
  );
}