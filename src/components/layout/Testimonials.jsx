import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Star } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const TESTIMONIALS = [
  {
    name: "Ananya Sharma",
    role: "Pet Parent · Mumbai",
    text: "I was always anxious leaving my dog with someone new. PetSitter completely changed that. The sitter updates, reviews, and care were beyond expectations.",
  },
  {
    name: "Rahul Mehta",
    role: "Pet Parent · Bengaluru",
    text: "For the first time, I felt calm while traveling. Knowing my pet was in safe hands made all the difference.",
  },
  {
    name: "Sneha Kapoor",
    role: "Verified Sitter",
    text: "PetSitter respects sitters as much as pet parents. The platform feels thoughtful, transparent, and genuinely built for care.",
  },
];

export default function Testimonials() {
  const ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".testimonial-card").forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            delay: i * 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
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
      className="relative bg-white px-6 py-24 overflow-hidden"
    >
      {/* Soft background texture */}
      <div className="absolute inset-x-0 top-1/3 h-[280px] bg-gradient-to-r from-blue-50 via-transparent to-blue-50 opacity-50 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#0F172A]">
            What Our Community Says
          </h2>
          <p className="mt-4 text-lg text-[#475569] leading-relaxed">
            Honest experiences from pet parents and sitters who trust PetSitter.
          </p>
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-12">
          {TESTIMONIALS.map((t, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="testimonial-card bg-white rounded-2xl border p-8 shadow-sm flex flex-col"
            >
              {/* Stars */}
              <div className="flex gap-1 text-yellow-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-[#475569] leading-relaxed flex-1">
                “{t.text}”
              </p>

              {/* Author */}
              <div className="mt-6 pt-6 border-t">
                <p className="font-medium text-[#0F172A]">
                  {t.name}
                </p>
                <p className="text-sm text-[#64748B]">
                  {t.role}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
