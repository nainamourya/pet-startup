import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Heart, ShieldCheck, Users } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function AboutUs() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".reveal").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative bg-[#F8FAFC] px-6 py-24 overflow-hidden"
    >
      {/* Ambient background icons */}
      <AmbientIcon Icon={Heart} className="top-20 left-16 text-blue-200" />
      <AmbientIcon Icon={ShieldCheck} className="bottom-28 right-20 text-sky-200" />

      <div className="max-w-6xl mx-auto space-y-24">

        {/* HERO */}
        <div className="reveal text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-semibold text-[#0F172A] leading-tight">
            Built on <span className="text-blue-600">Trust</span>
            <br />
            Driven by <span className="text-blue-600">Care</span>
          </h1>

          <p className="mt-6 text-lg text-[#475569] leading-relaxed">
            PetSitter exists to help pet parents find sitters they can genuinely
            rely on — without stress, uncertainty, or compromise.
          </p>
        </div>

        {/* VALUES */}
        <div className="grid md:grid-cols-3 gap-12">
          <ValueCard
            icon={<Heart />}
            title="Care First"
            text="We prioritize compassion and responsibility in every sitter, ensuring pets are treated like family."
          />
          <ValueCard
            icon={<ShieldCheck />}
            title="Verified & Safe"
            text="Transparent profiles, real reviews, and secure systems help you choose with confidence."
          />
          <ValueCard
            icon={<Users />}
            title="Community Driven"
            text="PetSitter is built around trust, shared values, and long-term relationships."
          />
        </div>

        {/* MISSION */}
        <div className="reveal max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-semibold text-[#0F172A]">
            Our Mission
          </h2>

          <p className="mt-6 text-lg text-[#475569] leading-relaxed">
            To make pet care human, reliable, and stress-free by combining
            thoughtful design with responsible technology.
          </p>
        </div>

        {/* TRUST STRIP */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
          className="rounded-3xl bg-white border px-12 py-16 text-center shadow-sm"
        >
          <p className="text-lg font-medium text-[#0F172A]">
            Trusted by pet parents who believe care should never be compromised.
          </p>
        </motion.div>

      </div>
    </section>
  );
}

/* ---------- COMPONENTS ---------- */

function ValueCard({ icon, title, text }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="reveal bg-white rounded-2xl p-8 border shadow-sm"
    >
      <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
        {icon}
      </div>

      <h3 className="mt-6 text-xl font-semibold text-[#0F172A]">
        {title}
      </h3>

      <p className="mt-4 text-[#475569] leading-relaxed">
        {text}
      </p>
    </motion.div>
  );
}

function AmbientIcon({ Icon, className }) {
  return (
    <motion.div
      animate={{ y: [0, -6, 0], rotate: [0, 3, 0] }}
      transition={{ duration: 14, repeat: Infinity, ease: "sine.inOut" }}
      className={`absolute opacity-20 ${className}`}
    >
      <Icon size={48} />
    </motion.div>
  );
}
