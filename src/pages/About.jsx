import { motion } from "framer-motion";

import { useNavigate } from "react-router-dom";
import {
  Heart,
  Shield,
  Users,
  Award,
  Target,
  Sparkles,
  CheckCircle,
  TrendingUp,
  Clock,
  Star,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
} from "lucide-react";

export default function About() {
  const navigate = useNavigate();

  const stats = [
    { icon: Users, value: "10,000+", label: "Happy Pet Parents", color: "from-blue-500 to-blue-600" },
    { icon: Award, value: "2,500+", label: "Verified Sitters", color: "from-purple-500 to-purple-600" },
    { icon: Star, value: "4.9/5", label: "Average Rating", color: "from-yellow-500 to-yellow-600" },
    { icon: TrendingUp, value: "98%", label: "Satisfaction Rate", color: "from-green-500 to-green-600" },
  ];

  const values = [
    {
      icon: Shield,
      title: "Trust & Safety",
      description: "Every sitter undergoes thorough background verification, identity checks, and training to ensure your pet's safety is never compromised.",
      color: "blue",
    },
    {
      icon: Heart,
      title: "Passionate Care",
      description: "We connect you with sitters who genuinely love animals. Our community is built on compassion, dedication, and unconditional pet love.",
      color: "pink",
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Our dedicated support team is always available to assist you. Whether it's an emergency or a simple question, we're here for you round the clock.",
      color: "indigo",
    },
    {
      icon: Target,
      title: "Tailored Matching",
      description: "Our smart algorithm matches your pet with the perfect sitter based on breed, temperament, special needs, and your specific requirements.",
      color: "green",
    },
  ];

  // const team = [
  //   {
  //     name: "Priya Sharma",
  //     role: "Founder & CEO",
  //     bio: "Former veterinarian with 10+ years of experience. Built PetSitter after seeing the need for trustworthy pet care in urban India.",
  //     image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
  //   },
  //   {
  //     name: "Rajesh Kumar",
  //     role: "Head of Operations",
  //     bio: "Ex-corporate professional turned pet care advocate. Manages our nationwide network of verified sitters.",
  //     image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
  //   },
  //   {
  //     name: "Ananya Reddy",
  //     role: "Customer Success Lead",
  //     bio: "Pet parent of 3 rescue dogs. Ensures every booking is a delightful experience for both pets and owners.",
  //     image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
  //   },
  // ];

  const milestones = [
    { year: "2022", title: "Founded", description: "Started with 50 sitters in Mumbai" },
    { year: "2023", title: "Expansion", description: "Reached 10 major cities across India" },
    { year: "2024", title: "Recognition", description: "Won 'Best Pet Care Platform' award" },
    { year: "2025", title: "Growth", description: "Served 10,000+ happy pet families" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <section className="relative pt-28 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Floating Background Elements */}
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-10 opacity-10"
        >
          <Heart size={100} className="text-pink-500" />
        </motion.div>

        <motion.div
          animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-20 left-10 opacity-10"
        >
          <Sparkles size={80} className="text-blue-500" />
        </motion.div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-6 font-semibold text-sm">
              <Sparkles size={16} />
              <span>India's Most Trusted Pet Care Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Where Every Pet Finds{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Their Perfect Sitter
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              We're revolutionizing pet care in India by connecting loving pet parents with verified, 
              passionate sitters who treat your furry family members as their own.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
            

              <button
                onClick={() => navigate("/find")}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                Find a Sitter
                <ArrowRight size={20} />
              </button>
            
            
            <button
                onClick={() => navigate("/become")}
                className="px-8 py-4 rounded-xl bg-white border-2 border-blue-600 text-blue-600 font-bold text-lg hover:bg-blue-50 transition-all duration-200 hover:scale-105 shadow-lg"
              >
                Become a Sitter
              </button>
          
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${stat.color} mb-4 shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                  <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Our Story: Born from Love for Pets
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
  Petroo was founded in 2025 with a simple mission — to make finding trusted pet sitters in Mumbai safe, transparent, and stress-free. Like many pet parents, our founder experienced the anxiety of leaving a beloved pet in someone else’s care and realized how difficult it was to find verified, reliable sitters.
</p>

<p>
  What began as a focused effort to connect pet parents with responsible caregivers in Mumbai has grown into a trusted pet care platform built on safety, real reviews, and secure bookings. Every sitter on Petroo is carefully reviewed to ensure pets receive genuine attention and compassionate care.
</p>

<p>
  At Petroo, we believe every pet deserves more than basic supervision — they deserve love, patience, and protection. And every sitter deserves fair opportunities and recognition for the care they provide. That’s why we are building a platform rooted in trust, accountability, and community.
</p>
              </div>

              <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
                <p className="text-blue-900 font-semibold italic">
                  "Our mission is simple: Make quality pet care accessible, affordable, and stress-free 
                  for every pet parent in India."
                </p>
                <p className="text-sm text-blue-700 mt-2">— Naina Mourya, Founder & CEO</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800&h=600&fit=crop"
                  alt="Happy pets with sitters"
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent"></div>
              </div>
              
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-6 max-w-xs">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                    <CheckCircle className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">100% Verified</p>
                    <p className="text-sm text-gray-600">All sitters background checked</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These principles guide everything we do, from vetting sitters to supporting pet families
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              const colors = {
                blue: "from-blue-500 to-blue-600",
                pink: "from-pink-500 to-pink-600",
                indigo: "from-indigo-500 to-indigo-600",
                green: "from-green-500 to-green-600",
              };

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-8 rounded-3xl bg-gradient-to-br from-gray-50 to-white border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${colors[value.color]} mb-6 shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Our Journey
            </h2>
            <p className="text-lg text-gray-600">
              From a small Mumbai startup to India's leading pet care platform
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-600 to-indigo-600 hidden md:block"></div>

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className={`flex items-center gap-8 ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                >
                  {/* Content */}
                  <div className={`flex-1 ${index % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                    <div className="inline-block p-6 rounded-2xl bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
                      <span className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm mb-3">
                        {milestone.year}
                      </span>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>

                  {/* Circle */}
                  <div className="relative z-10 flex-shrink-0">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 border-4 border-white shadow-lg"></div>
                  </div>

                  {/* Spacer */}
                  <div className="flex-1 hidden md:block"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      {/* <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Passionate pet lovers dedicated to making pet care better for everyone
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="relative overflow-hidden rounded-3xl bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <div className="relative h-80 overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                    <p className="text-sm font-semibold text-blue-600 mb-3">{member.role}</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{member.bio}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-12 text-center shadow-2xl"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}></div>
            </div>

            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Join Our Growing Community
              </h2>
              <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
                Whether you're a pet parent seeking reliable care or a pet lover wanting to earn, 
                we'd love to have you in our family.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => navigate("/find")}
                  className="px-8 py-4 rounded-xl bg-white text-blue-600 font-bold text-lg hover:bg-gray-100 transition-all duration-200 hover:scale-105 shadow-lg flex items-center gap-2"
                >
                  Find a Sitter
                  <ArrowRight size={20} />
                </button>
                <button
                  onClick={() => navigate("/become")}
                  className="px-8 py-4 rounded-xl bg-blue-700 text-white font-bold text-lg hover:bg-blue-800 transition-all duration-200 hover:scale-105 shadow-lg border-2 border-white/20"
                >
                  Become a Sitter
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Get in Touch</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200">
              <Mail className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <p className="font-semibold text-gray-900 mb-1">Email Us</p>
              <a href="mailto:nainam6025@gmail.com" className="text-blue-600 hover:underline text-sm">
                nainam6025@gmail.com
              </a>
            </div>
            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200">
              <Phone className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <p className="font-semibold text-gray-900 mb-1">Call Us</p>
              <a href="tel:+917977342732" className="text-blue-600 hover:underline text-sm">
                +91 7977342732
              </a>
            </div>
            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200">
              <MapPin className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <p className="font-semibold text-gray-900 mb-1">Visit Us</p>
              <p className="text-gray-600 text-sm">Mumbai, Maharashtra, India</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}