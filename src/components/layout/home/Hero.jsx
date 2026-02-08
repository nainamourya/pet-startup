import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";

export default function Hero() {
  const textRef = useRef(null);

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
    <section className="relative min-h-[85vh] flex items-center justify-center px-6 pt-24 pb-24 overflow-hidden">
      
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{ backgroundImage: "url('/hero-pet.jpg')" }}
      />

      {/* Soft Overlay */}
      <div className="absolute inset-0 bg-[#F8FAFC]/90 backdrop-blur-md" />

      {/* Ambient Floating Icon */}
      <motion.div
        animate={{ y: [0, -6, 0], rotate: [0, 2, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "sine.inOut" }}
        className="absolute top-24 right-16 hidden md:block opacity-30"
      >
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 21s-6.5-4.35-9.33-7.18C.4 11.56.4 7.9 2.67 5.64A5.33 5.33 0 0112 7.2a5.33 5.33 0 019.33-1.56c2.27 2.26 2.27 5.92 0 8.18C18.5 16.65 12 21 12 21z"
            fill="#0098D7"
          />
        </svg>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl text-center">
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-4xl sm:text-5xl font-bold leading-tight text-[#0F172A]"
        >
          <span className="block">Your Pet Deserves</span>
          <span className="block mt-2">
            <span
              ref={textRef}
              className="inline-block overflow-hidden whitespace-nowrap border-r border-[#0098D7]/60 bg-gradient-to-r from-[#0047FF] to-[#0098D7] bg-clip-text text-transparent pr-1"
              style={{ width: 0 }}
            />
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-6 text-base sm:text-lg text-[#475569] max-w-xl mx-auto"
        >
          Find trusted pet sitters for walks, day care, and home boarding — all
          in one calm, caring place.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button className="px-6 py-3 rounded-full bg-gradient-to-r from-[#0047FF] to-[#0098D7] text-white font-medium hover:opacity-95 transition">
            Find a Sitter →
          </button>

          <button className="px-6 py-3 rounded-full border border-[#E5E7EB] text-[#0F172A] hover:bg-[#F1F5F9] transition">
            Become a Sitter
          </button>
        </motion.div>
      </div>
    </section>
  );
}
