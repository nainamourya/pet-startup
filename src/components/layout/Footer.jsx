import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Heart, ArrowRight, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-slate-300 overflow-hidden">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/5 to-purple-900/5 pointer-events-none" />
      
      {/* Animated background elements */}
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.03, 0.05, 0.03]
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.03, 0.05, 0.03]
        }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-8">

        {/* Top Section */}
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12 mb-16">

          {/* Brand & Description - Takes 4 columns */}
          <div className="lg:col-span-4">
            <Link to="/" className="inline-block group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  PetSitter
                </h3>
              </div>
            </Link>
            
            <p className="text-slate-400 leading-relaxed mb-6 max-w-sm">
              A trusted platform connecting pet parents with reliable sitters —
              built on care, transparency, and peace of mind.
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              <SocialLink href="https://facebook.com" icon={<Facebook className="w-5 h-5" />} label="Facebook" />
              <SocialLink href="https://twitter.com" icon={<Twitter className="w-5 h-5" />} label="Twitter" />
              <SocialLink href="https://www.instagram.com/petroo_petcare" icon={<Instagram className="w-5 h-5" />} label="Instagram" />
              <SocialLink href="https://linkedin.com" icon={<Linkedin className="w-5 h-5" />} label="LinkedIn" />
            </div>
          </div>

          {/* Product Links - Takes 2 columns */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-bold text-white tracking-wide uppercase mb-6">
              Product
            </h4>
            <ul className="space-y-3">
              <FooterLink to="/find" text="Find a Sitter" />
              <FooterLink to="/become" text="Become a Sitter" />
              <FooterLink to="/about" text="About Us" />
              <FooterLink to="/how-it-works" text="How It Works" />
            </ul>
          </div>

          {/* Company Links - Takes 2 columns */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-bold text-white tracking-wide uppercase mb-6">
              Company
            </h4>
            <ul className="space-y-3">
              <FooterLink to="/privacy" text="Privacy Policy" />
              <FooterLink to="/terms" text="Terms of Service" />
              <FooterLink to="/contact" text="Contact" />
              <FooterLink to="/faq" text="FAQ" />
            </ul>
          </div>

          {/* Newsletter - Takes 4 columns */}
          <div className="lg:col-span-4">
            <h4 className="text-sm font-bold text-white tracking-wide uppercase mb-6">
              Stay Updated
            </h4>
            <p className="text-slate-400 text-sm mb-4">
              Subscribe to our newsletter for pet care tips and updates.
            </p>
            
            <form onSubmit={handleSubscribe} className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center gap-2 text-sm font-semibold shadow-lg hover:scale-105"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            {subscribed && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 text-green-400 text-sm flex items-center gap-2"
              >
                <Heart className="w-4 h-4" />
                Thanks for subscribing!
              </motion.div>
            )}
          </div>

        </div>

        {/* Contact Info Section */}
        <div className="mb-12 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
          <h4 className="text-sm font-bold text-white tracking-wide uppercase mb-4">
            Get in Touch
          </h4>
          <div className="grid sm:grid-cols-3 gap-4">
  <ContactItem
    icon={<Mail className="w-5 h-5 text-blue-400" />}
    text="nainam6025@gmail.com"
    href="mailto:nainam6025@gmail.com"
  />

  <ContactItem
    icon={<Phone className="w-5 h-5 text-green-400" />}
    text="+91 7977342732"
    href="tel:+917977342732"
  />

  <ContactItem
    icon={<MapPin className="w-5 h-5 text-purple-400" />}
    text="Mumbai, India"
    href="https://www.google.com/maps/search/?api=1&query=Mumbai,India"
  />
</div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 mb-8" />

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm"
        >
          <div className="flex items-center gap-2 text-slate-400">
            <span>© {new Date().getFullYear()} PetSitter.</span>
            <span className="hidden sm:inline">•</span>
            <span>All rights reserved.</span>
          </div>

          <div className="flex items-center gap-2 text-slate-400">
            <span>Built with care</span>
            <Heart className="w-4 h-4 text-red-400 fill-current animate-pulse" />
            <span className="hidden sm:inline">for pets & their parents</span>
          </div>
        </motion.div>

        {/* Trust Badges */}
        <div className="mt-8 pt-8 border-t border-white/10">
          <div className="flex flex-wrap justify-center gap-6 text-xs text-slate-500">
            <TrustBadge text="🔒 Secure Platform" />
            <TrustBadge text="✓ Verified Sitters" />
            <TrustBadge text="⭐ 4.9/5 Rating" />
            <TrustBadge text="💯 100% Trusted" />
          </div>
        </div>

      </div>
    </footer>
  );
}

/* ---------- Components ---------- */

function FooterLink({ to, text }) {
  return (
    <li>
      <Link 
        to={to} 
        className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors duration-200"
      >
        <ArrowRight className="w-4 h-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
        <span>{text}</span>
      </Link>
    </li>
  );
}

function SocialLink({ href, icon, label }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      whileHover={{ scale: 1.1, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-200"
    >
      {icon}
    </motion.a>
  );
}

function ContactItem({ icon, text, href }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200 cursor-pointer"
    >
      {icon}
      <span className="text-gray-800 font-medium">{text}</span>
    </a>
  );
}
function TrustBadge({ text }) {
  return (
    <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 font-semibold">
      {text}
    </span>
  );
}