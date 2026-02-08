import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PawPrint, Heart } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const TIMELINE = [
  {
    year: "2023",
    title: "The Idea Was Born",
    text: "PetSitter began with a simple frustration — finding reliable, trustworthy pet care shouldn’t feel uncertain or risky.",
  },
  {
    year: "2024",
    title: "Building With Purpose",
    text: "We designed PetSitter around trust, verification, and thoughtful UX — not speed or shortcuts.",
  },
  {
    year: "2025",
    title: "Growing the Community",
    text: "Pet parents and sitters joined a platform built on transparency, reviews, and genuine care.",
  },
  {
    year: "Today",
    title: "Care Without Compromise",
    text: "PetSitter continues to evolve with one goal: making pet care human, calm, and dependable.",
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
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="relative bg-white px-6 py-24 overflow-hidden">
      
      {/* Ambient SVGs */}
      <FloatingIcon Icon={PawPrint} className="top-20 left-12 text-blue-200" />
      <FloatingIcon Icon={Heart} className="bottom-24 right-16 text-sky-200" />

      {/* Soft background glow */}
      <div className="absolute inset-x-0 top-1/3 h-[300px] bg-gradient-to-r from-blue-50 via-transparent to-blue-50 opacity-60 pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#0F172A]">
            Our Story
          </h2>
          <p className="mt-4 text-lg text-[#475569] leading-relaxed">
            How PetSitter grew from an idea into a trusted care platform.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-3 sm:left-1/2 sm:-translate-x-1/2 top-0 bottom-0 w-px bg-gray-200" />

          <div className="space-y-20">
            {TIMELINE.map((item, index) => (
              <div
                key={index}
                className={`timeline-item relative flex ${
                  index % 2 === 0
                    ? "sm:justify-start"
                    : "sm:justify-end"
                }`}
              >
                <div className="flex items-start gap-6 sm:w-1/2 px-2 sm:px-6">

                  {/* Dot */}
                  <div className="relative mt-1">
                    <span className="timeline-dot block w-3 h-3 rounded-full bg-blue-600 ring-4 ring-blue-100" />
                  </div>

                  {/* Content */}
                  <div className="max-w-md bg-white">
                    <span className="block text-sm font-medium text-blue-600 tracking-wide">
                      {item.year}
                    </span>

                    <h3 className="mt-2 text-xl font-semibold text-[#0F172A]">
                      {item.title}
                    </h3>

                    <p className="mt-4 text-[#475569] leading-relaxed">
                      {item.text}
                    </p>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

/* ---------- Floating SVG ---------- */

function FloatingIcon({ Icon, className }) {
  return (
    <div
      className={`absolute opacity-20 animate-float ${className}`}
    >
      <Icon size={56} />
    </div>
  );
}
