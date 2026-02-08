import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Users, ShieldCheck, Star, PawPrint } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  {
    icon: Users,
    value: 1200,
    suffix: "+",
    label: "Happy Pet Parents",
  },
  {
    icon: PawPrint,
    value: 800,
    suffix: "+",
    label: "Verified Sitters",
  },
  {
    icon: Star,
    value: 4.9,
    suffix: "/5",
    label: "Average Rating",
    decimals: 1,
  },
  {
    icon: ShieldCheck,
    value: 100,
    suffix: "%",
    label: "Secure & Trusted",
  },
];

export default function CredibilityStats() {
  const ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".stat-item").forEach((el, i) => {
        const number = el.querySelector(".stat-number");

        const endValue = Number(number.dataset.value);
        const decimals = Number(number.dataset.decimals || 0);

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
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      className="relative bg-[#F8FAFC] px-6 py-24 overflow-hidden"
    >
      {/* Soft background glow */}
      <div className="absolute inset-x-0 top-1/2 h-[300px] bg-gradient-to-r from-blue-50 via-transparent to-blue-50 opacity-60 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#0F172A]">
            Trusted by Pet Parents
          </h2>
          <p className="mt-4 text-lg text-[#475569] leading-relaxed">
            Real people. Real care. Real peace of mind.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          {STATS.map((stat, index) => (
            <div
              key={index}
              className="stat-item text-center flex flex-col items-center"
            >
              <FloatingIcon Icon={stat.icon} />

              <div className="mt-4 text-4xl font-semibold text-[#0F172A]">
                <span
                  className="stat-number"
                  data-value={stat.value}
                  data-decimals={stat.decimals || 0}
                >
                  0
                </span>
                <span>{stat.suffix}</span>
              </div>

              <p className="mt-2 text-[#475569]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

/* ---------- Floating Icon ---------- */

function FloatingIcon({ Icon }) {
  return (
    <div className="text-blue-600/80 animate-float">
      <Icon size={36} />
    </div>
  );
}
