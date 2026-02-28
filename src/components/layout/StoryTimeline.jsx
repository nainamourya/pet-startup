import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PawPrint, Heart, Lightbulb, Users, TrendingUp, Award, Sparkles, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

const TIMELINE = [
  {
    year: "2023",
    title: "The Idea Was Born",
    text: "petroo began with a simple frustration — finding reliable, trustworthy pet care shouldn't feel uncertain or risky.",
    icon: Lightbulb,
    color: "from-yellow-500 to-orange-500",
    bgColor: "from-yellow-50 to-orange-50",
  },
  {
    year: "2024",
    title: "Building With Purpose",
    text: "We designed petroo around trust, verification, and thoughtful UX — not speed or shortcuts.",
    icon: Users,
    color: "from-blue-500 to-indigo-500",
    bgColor: "from-blue-50 to-indigo-50",
  },
  {
    year: "2025",
    title: "Growing the Community",
    text: "Pet parents and sitters joined a platform built on transparency, reviews, and genuine care.",
    icon: TrendingUp,
    color: "from-green-500 to-emerald-500",
    bgColor: "from-green-50 to-emerald-50",
  },
  {
    year: "Today",
    title: "Care Without Compromise",
    text: "petroo continues to evolve with one goal: making pet care human, calm, and dependable.",
    icon: Award,
    color: "from-purple-500 to-pink-500",
    bgColor: "from-purple-50 to-pink-50",
  },
];

export default function StoryTimeline() {
  const ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".timeline-item").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
            },
          }
        );
      });

      // Dot breathing animation
      gsap.utils.toArray(".timeline-dot").forEach((dot) => {
        gsap.to(dot, {
          scale: 1.15,
          duration: 2.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });

      // Progress line animation
      gsap.fromTo(
        ".timeline-progress",
        { height: "0%" },
        {
          height: "100%",
          scrollTrigger: {
            trigger: ref.current,
            start: "top center",
            end: "bottom center",
            scrub: 1,
          },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 sm:px-6 py-24 overflow-hidden">
      
      {/* Ambient SVGs */}
      <FloatingIcon Icon={PawPrint} className="top-20 left-12 text-blue-200" delay={0} />
      <FloatingIcon Icon={Heart} className="bottom-24 right-16 text-pink-200" delay={2} />
      <FloatingIcon Icon={Sparkles} className="top-40 right-32 text-purple-200" delay={4} />
      <FloatingIcon Icon={CheckCircle} className="bottom-48 left-24 text-green-200" delay={6} />

      {/* Soft background glow */}
      <div className="absolute inset-x-0 top-1/3 h-[400px] bg-gradient-to-r from-blue-100 via-purple-50 to-pink-100 opacity-40 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4" />
            Our Journey
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Story</span>
          </h2>
          
          <p className="text-xl text-gray-600 leading-relaxed">
            How petroo grew from an idea into India's most trusted pet care platform.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 sm:left-1/2 sm:-translate-x-1/2 top-0 bottom-0 w-1 bg-gray-200 rounded-full overflow-hidden">
            {/* Animated progress line */}
            <div className="timeline-progress absolute top-0 left-0 right-0 bg-gradient-to-b from-blue-600 via-purple-600 to-pink-600" />
          </div>

          <div className="space-y-16 sm:space-y-24">
            {TIMELINE.map((item, index) => {
              const Icon = item.icon;
              const isLeft = index % 2 === 0;
              
              return (
                <div
                  key={index}
                  className={`timeline-item relative ${
                    isLeft
                      ? "sm:pr-1/2"
                      : "sm:pl-1/2"
                  }`}
                >
                  <div className={`flex items-start gap-6 ${
                    isLeft ? "" : "sm:justify-end"
                  }`}>

                    {/* Mobile/Tablet: Show dot on left */}
                    <div className="sm:hidden relative flex-shrink-0">
                      <span className="timeline-dot block w-6 h-6 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 ring-4 ring-blue-100 shadow-lg" />
                    </div>

                    {/* Content Card */}
                    <div className={`flex-1 sm:max-w-md ${
                      isLeft ? "sm:ml-auto sm:mr-12" : "sm:mr-auto sm:ml-12"
                    }`}>
                      <div className={`relative bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group`}>
                        {/* Gradient border decoration */}
                        <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                        
                        {/* Icon */}
                        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className="w-8 h-8" />
                        </div>

                        {/* Year Badge */}
                        <div className="flex items-center gap-3 mb-4">
                          <span className={`inline-block px-4 py-1.5 text-sm font-bold bg-gradient-to-r ${item.color} text-white rounded-full shadow-md`}>
                            {item.year}
                          </span>
                          <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent" />
                        </div>

                        {/* Title */}
                        <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-indigo-600 transition-all duration-300">
                          {item.title}
                        </h3>

                        {/* Text */}
                        <p className="text-gray-600 leading-relaxed">
                          {item.text}
                        </p>

                        {/* Decorative corner element */}
                        <div className={`absolute -bottom-2 -right-2 w-20 h-20 bg-gradient-to-br ${item.bgColor} rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-500`} />
                      </div>
                    </div>

                    {/* Desktop: Centered dot */}
                    <div className="hidden sm:block absolute left-1/2 -translate-x-1/2 top-8">
                      <span className={`timeline-dot block w-8 h-8 rounded-full bg-gradient-to-br ${item.color} ring-4 ring-white shadow-xl`} />
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-24 text-center">
          <div className="inline-block p-8 sm:p-12 bg-white rounded-3xl shadow-xl border border-gray-100">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
              <Heart className="w-10 h-10 text-white" />
            </div>
            
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Be Part of Our Story
            </h3>
            
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of pet parents and sitters who trust petroo for safe, reliable pet care.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => window.location.href = "/find"} className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl">
                Find a Sitter
              </button>
              <button onClick={() => window.location.href = "/become"} className="px-8 py-4 rounded-xl bg-white border-2 border-gray-200 text-gray-700 font-bold hover:border-blue-600 hover:text-blue-600 transition-all duration-200 hover:scale-105">
                Become a Sitter
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

/* ---------- Floating SVG ---------- */

function FloatingIcon({ Icon, className, delay }) {
  return (
    <div
      className={`absolute opacity-15 hidden lg:block ${className}`}
      style={{
        animation: `float 16s ease-in-out infinite`,
        animationDelay: `${delay}s`,
      }}
    >
      <Icon size={64} />
    </div>
  );
}

/* Add this to your global CSS or Tailwind config */
/* 
@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  25% {
    transform: translateY(-20px) rotate(2deg);
  }
  50% {
    transform: translateY(-10px) rotate(-2deg);
  }
  75% {
    transform: translateY(-30px) rotate(1deg);
  }
}
*/