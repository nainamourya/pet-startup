import { motion } from "framer-motion";
import {
    ArrowLeft,
    Shield,
    Lock,
    User,
    Database,
    Eye,
    Mail,
    Phone,
    Calendar,
    Server,
    Globe
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PrivacyPolicy() {
    const navigate = useNavigate();

    const dataCollection = [
        {
            icon: User,
            color: "blue",
            title: "Personal Information",
            items: [
                "Name, email address, and phone number",
                "Profile information (pet details, photos)",
                "Identity verification documents (for sitters)",
                "Payment information (processed securely)"
            ]
        },
        {
            icon: Database,
            color: "indigo",
            title: "Usage Data",
            items: [
                "Device information and IP address",
                "Browser type and operating system",
                "Pages visited and time spent",
                "Interaction with features"
            ]
        },
        {
            icon: Globe,
            color: "purple",
            title: "Location Data",
            items: [
                "Approximate location for search",
                "Precise location for tracking walks",
                "Address details for booking services",
                "Time zone settings"
            ]
        }
    ];

    const dataUsage = [
        {
            title: "Service Delivery",
            description: "To process bookings, facilitate communication, and provide customer support.",
            icon: Server
        },
        {
            title: "Safety & Security",
            description: "To verify identities, detect fraud, and ensure the safety of pets and users.",
            icon: Shield
        },
        {
            title: "Improvement",
            description: "To analyze usage patterns and improve our platform features and performance.",
            icon: Eye
        }
    ];

    const securityMeasures = [
        {
            title: "How We Protect Your Data",
            points: [
                "End-to-end encryption for sensitive data",
                "Regular security audits and updates",
                "Secure payment processing via Stripe/Razorpay",
                "Strict access controls for employee access",
                "Data retention policies compliant with law"
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-20 sm:pt-24 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">

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
                        <Lock className="w-8 h-8 text-blue-600" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                        Privacy Policy
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        We are committed to protecting your personal information and your right to privacy.
                    </p>
                    <div className="mt-6 inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-200">
                        <Shield className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-semibold text-blue-900">GDPR & CCPA Compliant</span>
                    </div>
                </motion.div>

                {/* Last Updated */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-8 flex items-center gap-3"
                >
                    <Calendar className="w-5 h-5 text-gray-600 flex-shrink-0" />
                    <div>
                        <p className="text-sm font-semibold text-gray-900">Last Updated</p>
                        <p className="text-sm text-gray-600">February 18, 2026</p>
                    </div>
                </motion.div>

                {/* Data Collection Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-12"
                >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Information We Collect</h2>
                    <div className="grid gap-6 md:grid-cols-3">
                        {dataCollection.map((section, index) => {
                            const Icon = section.icon;
                            const colorClasses = {
                                blue: "bg-blue-100 text-blue-600 border-blue-200",
                                indigo: "bg-indigo-100 text-indigo-600 border-indigo-200",
                                purple: "bg-purple-100 text-purple-600 border-purple-200"
                            };

                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 * index }}
                                    className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                                >
                                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 ${colorClasses[section.color]}`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-3">{section.title}</h3>
                                    <ul className="space-y-2">
                                        {section.items.map((item, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5 flex-shrink-0"></span>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Data Usage */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 mb-12"
                >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">How We Use Your Information</h2>
                    <div className="grid gap-4 sm:grid-cols-3">
                        {dataUsage.map((usage, index) => {
                            const Icon = usage.icon;
                            return (
                                <div
                                    key={index}
                                    className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200"
                                >
                                    <Icon className="w-5 h-5 text-blue-600 mb-2" />
                                    <p className="font-semibold text-gray-900 text-sm mb-1">{usage.title}</p>
                                    <p className="text-sm text-gray-600">{usage.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Security Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 mb-12"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <Lock className="w-6 h-6 text-blue-600" />
                        <h2 className="text-2xl font-bold text-gray-900">Data Security</h2>
                    </div>

                    {securityMeasures.map((measure, index) => (
                        <div key={index} className="space-y-4">
                            <p className="text-gray-600">
                                We implement appropriate technical and organizational security measures to protect the security of any personal information we process.
                            </p>
                            <ul className="grid sm:grid-cols-2 gap-3">
                                {measure.points.map((point, idx) => (
                                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                        <Shield className="w-4 h-4 text-green-600 flex-shrink-0" />
                                        {point}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </motion.div>

                {/* Contact Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 sm:p-8 text-white text-center"
                >
                    <h2 className="text-2xl font-bold mb-3">Privacy Concerns?</h2>
                    <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                        If you have any questions or concerns about our privacy policy, please contact our Data Protection Officer.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="mailto:privacy@petsitter.com"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
                        >
                            <Mail className="w-5 h-5" />
                            Email DPO
                        </a>
                    </div>
                    <p className="text-sm text-blue-200 mt-4">
                        We aim to respond to all privacy inquiries within 48 hours.
                    </p>
                </motion.div>

                {/* Footer Links */}
                <div className="mt-8 text-center text-sm text-gray-600">
                    <p>
                        <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a>
                        {" "}•{" "}
                        <a href="/refund" className="text-blue-600 hover:underline">Refund Policy</a>
                    </p>
                </div>

            </div>
        </div>
    );
}
