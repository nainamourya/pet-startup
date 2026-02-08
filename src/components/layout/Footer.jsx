import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#0F172A] text-slate-300 px-6 pt-24 pb-10">
      <div className="max-w-7xl mx-auto">

        {/* Top Section */}
        <div className="grid gap-16 md:grid-cols-4">

          {/* Brand */}
          <div>
            <h3 className="text-xl font-semibold text-white">
              PetSitter
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-slate-400 max-w-xs">
              A trusted platform connecting pet parents with reliable sitters —
              built on care, transparency, and peace of mind.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wide">
              Product
            </h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li><Link to="/find" className="hover:text-white transition">Find a Sitter</Link></li>
              <li><Link to="/become" className="hover:text-white transition">Become a Sitter</Link></li>
              <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white tracking-wide">
              Company
            </h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li><Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition">Terms of Service</Link></li>
              <li><Link to="/contact" className="hover:text-white transition">Contact</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wide">
              Get in Touch
            </h4>

            <ul className="mt-4 space-y-4 text-sm">
              <li className="flex items-center gap-3">
                <Mail size={16} />
                support@petsitter.com
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} />
                +91 90000 00000
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="mt-0.5" />
                India
              </li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="my-16 border-t border-white/10" />

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-400"
        >
          <span>© {new Date().getFullYear()} PetSitter. All rights reserved.</span>
          <span>Built with care 🐾</span>
        </motion.div>

      </div>
    </footer>
  );
}
