import { motion } from "framer-motion";
import {
    ArrowLeft,
    Mail,
    Phone,
    MapPin,
    Send,
    MessageSquare,
    Clock
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Contact() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate form submission
        console.log("Form submitted:", formData);
        toast.success("Message sent successfully! We'll get back to you soon.");
        setFormData({ name: "", email: "", subject: "", message: "" });
    };

    const contactInfo = [
        {
            icon: Mail,
            title: "Email Us",
            detail: "nainam6025@gmail.com",
            subDetail: "Response within 24 hours",
            color: "blue",
            link: "mailto:nainam6025@gmail.com"
        },
        {
            icon: Phone,
            title: "Call Us",
            detail: "+91 7977342732",
            subDetail: "Mon-Fri from 9am to 6pm",
            color: "green",
            link: "tel:+917977342732"
        },
        {
            icon: MapPin,
            title: "Visit Us",
            detail: "Mumbai, India",
            subDetail: "Headquarters",
            color: "purple",
            link: "https://maps.google.com"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-20 sm:pt-24 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">

                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6 group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Back</span>
                </button>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                        <MessageSquare className="w-8 h-8 text-blue-600" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                        Get in Touch
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Have a question or feedback? We'd love to hear from you. Our team is here to help.
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-8">

                    {/* Contact Info Cards */}
                    <motion.div
                        className="lg:col-span-1 space-y-6"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        {contactInfo.map((item, index) => {
                            const Icon = item.icon;
                            const colorClasses = {
                                blue: "bg-blue-100 text-blue-600",
                                green: "bg-green-100 text-green-600",
                                purple: "bg-purple-100 text-purple-600"
                            };

                            return (
                                <a
                                    key={index}
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all hover:scale-[1.02]"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[item.color]}`}>
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900">{item.title}</h3>
                                            <p className="text-blue-600 font-medium">{item.detail}</p>
                                            <p className="text-xs text-gray-500 mt-1">{item.subDetail}</p>
                                        </div>
                                    </div>
                                </a>
                            );
                        })}

                        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-xl">
                            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                                <Clock className="w-5 h-5" />
                                Support Hours
                            </h3>
                            <p className="text-indigo-100 text-sm mb-4">
                                Our support team is available 24/7 for emergencies. For general inquiries:
                            </p>
                            <ul className="space-y-2 text-sm">
                                <li className="flex justify-between border-b border-white/20 pb-2">
                                    <span>Mon - Fri</span>
                                    <span className="font-semibold">9:00 AM - 6:00 PM</span>
                                </li>
                                <li className="flex justify-between pt-1">
                                    <span>Sat - Sun</span>
                                    <span className="font-semibold">10:00 AM - 4:00 PM</span>
                                </li>
                            </ul>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        className="lg:col-span-2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                            Your Name
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-gray-50 focus:bg-white"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-gray-50 focus:bg-white"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                                        Subject
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-gray-50 focus:bg-white"
                                        placeholder="How can we help?"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows="5"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-gray-50 focus:bg-white resize-none"
                                        placeholder="Tell us more about your inquiry..."
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-200 transition-all flex items-center justify-center gap-2"
                                >
                                    <Send className="w-5 h-5" />
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    );
}
