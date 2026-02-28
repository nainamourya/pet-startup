import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Users, ShieldCheck, Star, PawPrint, TrendingUp, Heart, Award, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  {
    icon: Users,
    value: 1200,
    suffix: "+",
    label: "Happy Pet Parents",
    color: "from-blue-500 to-indigo-500",
    bgColor: "from-blue-50 to-indigo-50",
    iconBg: "bg-blue-100",
    textColor: "text-blue-600",
  },
  {
    icon: PawPrint,
    value: 800,
    suffix: "+",
    label: "Verified Sitters",
    color: "from-green-500 to-emerald-500",
    bgColor: "from-green-50 to-emerald-50",
    iconBg: "bg-green-100",
    textColor: "text-green-600",
  },
  {
    icon: Star,
    value: 4.9,
    suffix: "/5",
    label: "Average Rating",
    decimals: 1,
    color: "from-yellow-500 to-orange-500",
    bgColor: "from-yellow-50 to-orange-50",
    iconBg: "bg-yellow-100",
    textColor: "text-yellow-600",
  },
  {
    icon: ShieldCheck,
    value: 100,
    suffix: "%",
    label: "Secure & Trusted",
    color: "from-purple-500 to-pink-500",
    bgColor: "from-purple-50 to-pink-50",
    iconBg: "bg-purple-100",
    textColor: "text-purple-600",
  },
];

export default function CredibilityStats() {
  const ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Counter animations
      gsap.utils.toArray(".stat-item").forEach((el, i) => {
        const number = el.querySelector(".stat-number");
        const progressBar = el.querySelector(".progress-bar");

        const endValue = Number(number.dataset.value);
        const decimals = Number(number.dataset.decimals || 0);

        // Number counter animation
        gsap.fromTo(
          number,
          { innerText: 0 },
          {
            innerText: endValue,
            duration: 2,
            ease: "power3.out",
            snap: { innerText: decimals ? 0.1 : 1 },
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
            },
            onUpdate() {
              number.innerText = Number(number.innerText).toFixed(decimals);
            },
          }
        );

        // Progress bar animation
        if (progressBar) {
          gsap.fromTo(
            progressBar,
            { width: "0%" },
            {
              width: "100%",
              duration: 2,
              ease: "power3.out",
              scrollTrigger: {
                trigger: el,
                start: "top 85%",
              },
            }
          );
        }
      });

      // Card entrance animations
      gsap.utils.toArray(".stat-card").forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 40, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            delay: i * 0.1,
            ease: "back.out(1.2)",
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
            },
          }
        );
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 sm:px-6 py-24 overflow-hidden"
    >
      {/* Ambient background icons */}
      <AmbientIcon Icon={Heart} className="top-20 left-16 text-pink-200" delay={0} />
      <AmbientIcon Icon={Award} className="bottom-24 right-20 text-yellow-200" delay={2} />
      <AmbientIcon Icon={TrendingUp} className="top-40 right-32 text-green-200" delay={4} />
      <AmbientIcon Icon={Sparkles} className="bottom-48 left-24 text-purple-200" delay={6} />

      {/* Soft background glow */}
      <div className="absolute inset-x-0 top-1/2 h-[400px] bg-gradient-to-r from-blue-100 via-purple-50 to-pink-100 opacity-40 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-6">
            <TrendingUp className="w-4 h-4" />
            Platform Stats
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Trusted by <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Pet Parents</span>
          </h2>
          
          <p className="text-xl text-gray-600 leading-relaxed">
            Real people. Real care. Real peace of mind. Join thousands who trust petroo.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {STATS.map((stat, index) => {
            const Icon = stat.icon;
            
            return (
              <div
                key={index}
                className="stat-item stat-card"
              >
                <div className="relative group h-full">
                  {/* Card */}
                  <div className="relative bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 h-full overflow-hidden">
                    
                    {/* Gradient overlay on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    
                    {/* Content */}
                    <div className="relative z-10">
                      {/* Icon */}
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.color} text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-8 h-8" />
                      </div>

                      {/* Number */}
                      <div className="mb-4">
                        <div className={`text-5xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300 inline-block`}>
                          <span
                            className="stat-number"
                            data-value={stat.value}
                            data-decimals={stat.decimals || 0}
                          >
                            0
                          </span>
                          <span>{stat.suffix}</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
                        <div className={`progress-bar h-full bg-gradient-to-r ${stat.color} rounded-full`} style={{ width: "0%" }} />
                      </div>

                      {/* Label */}
                      <p className="text-gray-600 font-semibold">
                        {stat.label}
                      </p>
                    </div>

                    {/* Decorative corner glow */}
                    <div className={`absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br ${stat.bgColor} rounded-full blur-3xl opacity-0 group-hover:opacity-70 transition-opacity duration-500`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust Badge */}
        <div className="mt-20 max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-gray-100 text-center">
            <div className="flex justify-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              India's Most Trusted Pet Care Platform
            </h3>
            
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Every number represents a happy pet, a trusted relationship, and a worry-free experience.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/find" className="inline-block">
            <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl">
                Find Your Sitter
              </button>
            </Link>
             <Link to="/about" className="inline-block">
             <button className="px-8 py-4 rounded-xl bg-white border-2 border-gray-200 text-gray-700 font-bold hover:border-blue-600 hover:text-blue-600 transition-all duration-200 hover:scale-105">
                Learn More
              </button>
             </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

/* ---------- Ambient Icon ---------- */

function AmbientIcon({ Icon, className, delay }) {
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