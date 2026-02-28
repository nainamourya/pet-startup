import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Heart, ShieldCheck, Users, Award, Target, Zap, Star, TrendingUp, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
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
      className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 sm:px-6 py-24 overflow-hidden"
    >
      {/* Ambient background icons */}
      <AmbientIcon Icon={Heart} className="top-20 left-16 text-blue-200" />
      <AmbientIcon Icon={ShieldCheck} className="bottom-28 right-20 text-sky-200" />
      <AmbientIcon Icon={Star} className="top-40 right-32 text-purple-200" />
      <AmbientIcon Icon={Award} className="bottom-48 left-24 text-pink-200" />

      <div className="max-w-7xl mx-auto space-y-32">

        {/* HERO */}
        <div className="reveal text-center max-w-4xl mx-auto pt-12">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-6"
          >
            <Star className="w-4 h-4" />
            India's Most Trusted Pet Care Platform
          </motion.div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6">
  Find Trusted Pet Sitters & Cat Boarding Services in Mumbai
  <br />
  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
    with Petroo
  </span>
</h1>

          <p className="mt-8 text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
          Petroo exists to help pet parents in Mumbai find trusted, verified pet sitters they can genuinely rely on — without stress, uncertainty, or compromise. Whether you need cat boarding, pet daycare, home pet sitting, or short-term pet care, Petroo connects you with experienced sitters who treat your pets like family. Every tail wag, every purr, and every happy pet is our success story.
          </p>
        </div>

    
        {/* <div className="reveal grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatCard number="10,000+" label="Happy Pets" />
          <StatCard number="5,000+" label="Pet Parents" />
          <StatCard number="500+" label="Verified Sitters" />
          <StatCard number="4.9/5" label="Average Rating" />
        </div> */}

        {/* OUR STORY */}
        <div className="reveal max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Story</span>
            </h2>
            <p className="text-lg text-gray-600">How petroo came to life</p>
          </div>

          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-gray-100">
            <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
              <p>
                <span className="text-2xl font-bold text-blue-600">It started with a simple problem:</span>  Why is finding trusted pet sitters and cat boarding in Mumbai so difficult?
              </p>
              
              <p>
                As pet parents ourselves, we experienced the anxiety of leaving our furry family members with strangers. The endless scrolling through profiles, the uncertainty about credentials, the worry about whether they'd truly care.
              </p>
              
              <p>
                We knew there had to be a better way. A platform where every sitter is verified, every review is genuine, and every pet parent can book with complete confidence.
              </p>
              
              <p className="text-xl font-semibold text-gray-900">
                That's why we built Petroo — to turn anxiety into peace of mind, and strangers into trusted caregivers.
              </p>
            </div>
          </div>
        </div>

        {/* VALUES */}
        <div className="reveal">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Values</span>
            </h2>
            <p className="text-lg text-gray-600">The principles that guide everything we do</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <ValueCard
              icon={<Heart />}
              title="Care First"
              text="We prioritize compassion and responsibility in every sitter, ensuring pets are treated like family. Every interaction is built on genuine love for animals."
              gradient="from-pink-500 to-red-500"
            />
            <ValueCard
              icon={<ShieldCheck />}
              title="Verified & Safe"
              text="Transparent profiles, real reviews, and secure systems help you choose with confidence. Your pet's safety is our top priority, always."
              gradient="from-blue-500 to-indigo-500"
            />
            <ValueCard
              icon={<Users />}
              title="Community Driven"
              text="petroo is built around trust, shared values, and long-term relationships. We're not just a platform — we're a family of pet lovers."
              gradient="from-purple-500 to-pink-500"
            />
          </div>
        </div>

        {/* MISSION & VISION */}
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
           
            className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl p-8 sm:p-12 text-white shadow-2xl"
          >
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mb-6">
              <Target className="w-8 h-8" color="#3b4ef9" />
            </div>
            <h3 className="text-3xl font-bold mb-4">Our Mission</h3>
            <p className="text-lg text-blue-100 leading-relaxed">
              To make pet care human, reliable, and stress-free by combining
              thoughtful design with responsible technology. We're here to ensure
              every pet gets the love and attention they deserve.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-8 sm:p-12 text-white shadow-2xl"
          >
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mb-6">
              <Zap className="w-8 h-8" color="#de0384" />
            </div>
            <h3 className="text-3xl font-bold mb-4">Our Vision</h3>
            <p className="text-lg text-purple-100 leading-relaxed">
              To become India's most trusted pet care ecosystem, where every pet
              parent can find their perfect match, and every sitter can build a
              meaningful career doing what they love.
            </p>
          </motion.div>
        </div>

        {/* WHY CHOOSE US */}
        <div className="reveal">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Petroo?</span>
            </h2>
            <p className="text-lg text-gray-600">What makes us different</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<CheckCircle className="w-6 h-6" />}
              title="100% Verified Sitters"
              description="Every sitter goes through a rigorous verification process including background checks and interviews."
            />
            <FeatureCard
              icon={<Star className="w-6 h-6" />}
              title="Real Reviews"
              description="Authentic reviews from real pet parents help you make informed decisions."
            />
            <FeatureCard
              icon={<ShieldCheck className="w-6 h-6" />}
              title="Secure Platform"
              description="Advanced security measures protect your data and ensure safe transactions."
            />
            <FeatureCard
              icon={<Heart className="w-6 h-6" />}
              title="24/7 Support"
              description="Our dedicated support team is always here to help you and your pets."
            />
            <FeatureCard
              icon={<TrendingUp className="w-6 h-6" />}
              title="Real-Time Updates"
              description="Stay connected with live location tracking and instant photo updates."
            />
            <FeatureCard
              icon={<Award className="w-6 h-6" />}
              title="Quality Guarantee"
              description="We stand behind our service with a satisfaction guarantee."
            />
          </div>
        </div>

        {/* TIMELINE */}
        {/* <div className="reveal">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Journey</span>
            </h2>
            <p className="text-lg text-gray-600">Milestones that shaped PetSitter</p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            <TimelineItem
              year="2024"
              title="The Beginning"
              description="PetSitter was founded with a mission to revolutionize pet care in India."
            />
            <TimelineItem
              year="2025"
              title="Rapid Growth"
              description="Reached 5,000+ happy pet parents and 500+ verified sitters across major cities."
            />
            <TimelineItem
              year="2026"
              title="Innovation"
              description="Launched real-time GPS tracking and instant photo updates for peace of mind."
            />
            <TimelineItem
              year="Future"
              title="Expansion"
              description="Expanding to 50+ cities and introducing AI-powered sitter matching."
              future
            />
          </div>
        </div> */}

        {/* TRUST STRIP */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
          className="rounded-3xl bg-white border border-gray-200 px-8 sm:px-12 py-16 text-center shadow-xl"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full mb-6">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Join Our Growing Community
          </h3>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Trusted by pet parents who believe care should never be compromised.
            Experience the peace of mind that comes with finding the perfect sitter.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/find" className="inline-block">
          <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 hover:scale-105 shadow-lg">
              Find a Sitter
            </button>
          </Link>
            <Link to="/become" className="inline-block">
              <button className="px-8 py-4 rounded-xl bg-white border-2 border-gray-200 text-gray-700 font-bold hover:border-blue-600 hover:text-blue-600 transition-all duration-200 hover:scale-105 shadow-lg">
                Become a Sitter
              </button>
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

/* ---------- COMPONENTS ---------- */

function StatCard({ number, label }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl p-6 text-center shadow-lg border border-gray-100"
    >
      <div className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">
        {number}
      </div>
      <div className="text-gray-600 font-semibold">{label}</div>
    </motion.div>
  );
}

function ValueCard({ icon, title, text, gradient }) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="reveal bg-white rounded-2xl p-8 shadow-xl border border-gray-100 group"
    >
      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-4">
        {title}
      </h3>

      <p className="text-gray-600 leading-relaxed">
        {text}
      </p>
    </motion.div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="p-6 rounded-2xl bg-white border border-gray-100 shadow-md hover:shadow-xl transition-shadow"
    >
      <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 mb-4">
        {icon}
      </div>
      <h4 className="text-lg font-bold text-gray-900 mb-2">{title}</h4>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
}

function TimelineItem({ year, title, description, future }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="flex gap-6 items-start"
    >
      <div className={`flex-shrink-0 w-24 h-24 rounded-2xl ${future ? 'bg-gradient-to-br from-purple-600 to-pink-600' : 'bg-gradient-to-br from-blue-600 to-indigo-600'} flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
        {year}
      </div>
      <div className="flex-1 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h4 className="text-xl font-bold text-gray-900 mb-2">{title}</h4>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

function AmbientIcon({ Icon, className }) {
  return (
    <motion.div
      animate={{ y: [0, -8, 0], rotate: [0, 4, 0] }}
      transition={{ duration: 16, repeat: Infinity, ease: "sine.inOut" }}
      className={`absolute opacity-15 hidden lg:block ${className}`}
    >
      <Icon size={64} />
    </motion.div>
  );
}