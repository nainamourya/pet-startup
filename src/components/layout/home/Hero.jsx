import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
// import { Link } from "react-router-dom";
// import FindSitter from './../../../pages/FindSitter';

// Animated SVG Icons
const FloatingIcons = {
  Heart: ({ className = "" }) => (
    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 21s-6.5-4.35-9.33-7.18C.4 11.56.4 7.9 2.67 5.64A5.33 5.33 0 0112 7.2a5.33 5.33 0 019.33-1.56c2.27 2.26 2.27 5.92 0 8.18C18.5 16.65 12 21 12 21z"
        fill="#0098D7"
      />
    </svg>
  ),
  Paw: ({ className = "" }) => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className={className}>
      <ellipse cx="8.5" cy="8.5" rx="2" ry="3" fill="#0047FF" opacity="0.8" />
      <ellipse cx="15.5" cy="8.5" rx="2" ry="3" fill="#0047FF" opacity="0.8" />
      <ellipse cx="11" cy="5" rx="2" ry="2.5" fill="#0047FF" opacity="0.8" />
      <ellipse cx="12" cy="16" rx="3.5" ry="4" fill="#0047FF" opacity="0.9" />
      <ellipse cx="6" cy="13" rx="2" ry="2.5" fill="#0047FF" opacity="0.8" />
      <ellipse cx="18" cy="13" rx="2" ry="2.5" fill="#0047FF" opacity="0.8" />
    </svg>
  ),
  Star: ({ className = "" }) => (
    <svg width="38" height="38" viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        fill="#FFD700"
      />
    </svg>
  ),
  Shield: ({ className = "" }) => (
    <svg width="42" height="42" viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z"
        fill="#10B981"
        opacity="0.85"
      />
      <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Location: ({ className = "" }) => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
        fill="#EF4444"
        opacity="0.85"
      />
      <circle cx="12" cy="9" r="2.5" fill="white" />
    </svg>
  ),
  Calendar: ({ className = "" }) => (
    <svg width="38" height="38" viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="3" y="4" width="18" height="18" rx="2" fill="#8B5CF6" opacity="0.85" />
      <path d="M8 2v4M16 2v4M3 10h18" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <circle cx="9" cy="14" r="1" fill="white" />
      <circle cx="15" cy="14" r="1" fill="white" />
      <circle cx="9" cy="18" r="1" fill="white" />
    </svg>
  ),
  Award: ({ className = "" }) => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="9" r="7" fill="#F59E0B" opacity="0.85" />
      <path d="M12 16l-3 6 3-2 3 2-3-6z" fill="#F59E0B" opacity="0.9" />
      <path d="M12 6l1.5 3 3 .5-2.2 2 .5 3-2.8-1.5L9.2 14.5l.5-3-2.2-2 3-.5L12 6z" fill="white" />
    </svg>
  ),
  Clock: ({ className = "" }) => (
    <svg width="38" height="38" viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="9" fill="#06B6D4" opacity="0.85" />
      <path d="M12 7v5l3 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
};

export default function Hero() {
  const textRef = useRef(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Background images array
  // const backgroundImages = [
  //   "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=1920&q=80", // Happy dog
  //   "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1920&q=80", // Cat playing
  //   "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=1920&q=80", // Dog and owner
  //   "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1920&q=80", // Golden retriever
  // ];

  // Rotate background images
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length);
  //   }, 4000); 

  //   return () => clearInterval(interval);
  // }, []);

  // Typewriter effect
  useEffect(() => {
    const words = [
      "Care, Not Compromise.",
      "Trust You Can Feel.",
      "Love They Deserve.",
    ];

    const el = textRef.current;
    if (!el) return;

    // Measure longest word (fixed width = no layout shift)
    const temp = document.createElement("span");
    temp.style.position = "absolute";
    temp.style.visibility = "hidden";
    temp.style.whiteSpace = "nowrap";
    temp.style.font = window.getComputedStyle(el).font;
    temp.textContent = words.reduce((a, b) =>
      a.length > b.length ? a : b
    );
    document.body.appendChild(temp);
    const maxWidth = temp.offsetWidth;
    document.body.removeChild(temp);

    gsap.set(el, { width: 0 });

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.6 });

    words.forEach((word) => {
      tl.set(el, { width: 0 })
        .set(el, { textContent: word })
        .to(el, {
          width: maxWidth,
          duration: 1.4,
          ease: "power2.out",
        })
        .to({}, { duration: 1.6 }) // readable pause
        .to(el, {
          width: 0,
          duration: 1,
          ease: "power1.inOut",
        });
    });

    return () => tl.kill();
  }, []);

  return (
    <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-16 sm:pb-24 overflow-hidden">
      
      {/* Rotating Background Images with Fade Effect */}
      {/* <div className="absolute inset-0">
        {backgroundImages.map((image, index) => (
          <motion.div
            key={index}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${image}')` }}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{
              opacity: index === currentImageIndex ? 1 : 0,
              scale: index === currentImageIndex ? 1 : 1.1,
            }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        ))}
      </div> */}

      {/* Soft Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-blue-50/90 to-indigo-50/85 backdrop-blur-sm" />

      {/* Floating Icons - Responsive positioning */}
      
      {/* Heart - Top Right */}
      <motion.div
        animate={{ y: [0, -8, 0], rotate: [0, 3, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-24 right-8 sm:right-16 lg:right-24 opacity-40 hover:opacity-70 transition-opacity"
      >
        <FloatingIcons.Heart />
      </motion.div>

      {/* Paw - Top Left */}
      <motion.div
        animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute top-32 left-8 sm:left-16 lg:left-24 opacity-35 hover:opacity-70 transition-opacity hidden sm:block"
      >
        <FloatingIcons.Paw />
      </motion.div>

      {/* Star - Right Side */}
      <motion.div
        animate={{ y: [0, -12, 0], rotate: [0, 360, 360], scale: [1, 1.1, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/3 right-12 sm:right-20 lg:right-32 opacity-30 hover:opacity-70 transition-opacity"
      >
        <FloatingIcons.Star />
      </motion.div>

      {/* Shield - Left Side */}
      <motion.div
        animate={{ y: [0, 8, 0], x: [0, 4, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-1/2 left-8 sm:left-16 lg:left-28 opacity-35 hover:opacity-70 transition-opacity hidden md:block"
      >
        <FloatingIcons.Shield />
      </motion.div>

      {/* Location - Bottom Right */}
      <motion.div
        animate={{ y: [0, -6, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        className="absolute bottom-32 right-16 sm:right-24 lg:right-36 opacity-30 hover:opacity-70 transition-opacity hidden lg:block"
      >
        <FloatingIcons.Location />
      </motion.div>

      {/* Calendar - Bottom Left */}
      <motion.div
        animate={{ y: [0, 10, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        className="absolute bottom-40 left-12 sm:left-20 lg:left-32 opacity-35 hover:opacity-70 transition-opacity hidden md:block"
      >
        <FloatingIcons.Calendar />
      </motion.div>

      {/* Award - Top Center Right */}
      <motion.div
        animate={{ y: [0, -10, 0], rotate: [0, -3, 0] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-28 right-1/4 opacity-25 hover:opacity-70 transition-opacity hidden xl:block"
      >
        <FloatingIcons.Award />
      </motion.div>

      {/* Clock - Bottom Center Left */}
      <motion.div
        animate={{ y: [0, 8, 0], x: [0, -5, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        className="absolute bottom-36 left-1/4 opacity-30 hover:opacity-70 transition-opacity hidden xl:block"
      >
        <FloatingIcons.Clock />
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl text-center px-4">
        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-blue-100 mb-6"
        >
          <FloatingIcons.Shield className="!w-5 !h-5" />
          <span className="text-sm font-semibold text-gray-700">
            🏆 India's #1 Trusted Pet Care Platform
          </span>
        </motion.div>

        {/* Main Heading with Typewriter */}
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-[#0F172A]"
        >
          <span className="block">Your Pet Deserves</span>
          <span className="block mt-2 sm:mt-3">
            <span
              ref={textRef}
              className="inline-block overflow-hidden whitespace-nowrap border-r-2 sm:border-r-4 border-[#0098D7]/60 bg-gradient-to-r from-[#0047FF] to-[#0098D7] bg-clip-text text-transparent pr-1"
              style={{ width: 0 }}
            />
          </span>
        </motion.h1>

        {/* Value Proposition */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-6 sm:mt-8 text-base sm:text-lg lg:text-xl text-[#475569] max-w-2xl mx-auto leading-relaxed"
        >
          Find <strong className="text-gray-700">verified, background-checked</strong> pet sitters for walks, daycare, and home boarding. 
          <span className="block mt-2">
            <strong className="text-blue-600">Real-time tracking</strong> • <strong className="text-green-600">Secure payments</strong> • <strong className="text-purple-600">24/7 support</strong>
          </span>
        </motion.p>

        {/* ROI-Focused Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-8 flex flex-wrap justify-center gap-4 sm:gap-8 text-sm sm:text-base"
        >
          <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
            <span className="text-2xl">🐕</span>
            <div className="text-left">
              <p className="font-bold text-gray-900">10,000+</p>
              <p className="text-xs text-gray-600">Happy Pets</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
            <span className="text-2xl">⭐</span>
            <div className="text-left">
              <p className="font-bold text-gray-900">4.9/5</p>
              <p className="text-xs text-gray-600">Average Rating</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
            <span className="text-2xl">✅</span>
            <div className="text-left">
              <p className="font-bold text-gray-900">100%</p>
              <p className="text-xs text-gray-600">Verified Sitters</p>
            </div>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-10 sm:mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
        {/* <Link to="/find"> */}
        
        <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#0047FF] to-[#0098D7] text-white font-semibold text-base sm:text-lg hover:shadow-2xl hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 group">
            <span>Find a Sitter</span>
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        {/* </Link> */}

         {/* <Link to="/become"> */}
         <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/90 backdrop-blur-sm border-2 border-gray-200 text-[#0F172A] font-semibold text-base sm:text-lg hover:bg-gray-50 hover:border-gray-300 hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 group shadow-md">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>Become a Sitter</span>
          </button>
         
         {/* </Link> */}
        </motion.div>

        {/* Social Proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-10 sm:mt-12"
        >
          <p className="text-xs sm:text-sm text-gray-500 mb-3">Trusted by pet parents across India</p>
          <div className="flex justify-center items-center gap-2 flex-wrap">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                >
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <span className="text-sm text-gray-600 font-medium ml-2">
              +5,000 pet owners this month
            </span>
          </div>
        </motion.div>

        {/* SEO Keywords (Hidden but crawlable) */}
        <div className="sr-only">
          <h2>Professional Pet Care Services in India</h2>
          <p>
            Book trusted pet sitters, dog walkers, cat sitters, pet boarding services, 
            pet daycare, home pet care, professional pet sitting, verified pet caregivers, 
            affordable pet care, pet sitting near me, dog walking services, pet boarding facilities
          </p>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden sm:block"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
        >
          <span className="text-xs font-medium">Scroll to explore</span>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}