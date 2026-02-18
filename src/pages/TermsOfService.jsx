import { motion } from "framer-motion";
import {
    ArrowLeft,
    FileText,
    CheckCircle,
    AlertTriangle,
    Shield,
    Users,
    Gavel,
    Clock
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TermsOfService() {
    const navigate = useNavigate();

    const sections = [
        {
            title: "Acceptance of Terms",
            icon: FileText,
            color: "blue",
            content: "By accessing and using PetSitter, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use our services."
        },
        {
            title: "User Responsibilities",
            icon: Users,
            color: "indigo",
            content: "Users are responsible for maintaining the confidentiality of their account information and for all activities that occur under their account. You agree to provide accurate and complete information."
        },
        {
            title: "Service Rules",
            icon: CheckCircle,
            color: "green",
            content: "You agree not to modify, distribute, or create derivative works based on our service. You will not use the platform for any illegal or unauthorized purpose."
        },
        {
            title: "Limitation of Liability",
            icon: AlertTriangle,
            color: "orange",
            content: "PetSitter shall not be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits or data."
        },
        {
            title: "Termination",
            icon: Gavel,
            color: "red",
            content: "We terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms."
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-20 sm:pt-24 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">

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
                        <FileText className="w-8 h-8 text-blue-600" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                        Terms of Service
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Please read these terms carefully before using our platform.
                    </p>
                    <div className="mt-6 inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-200">
                        <Shield className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-semibold text-blue-900">Legally Binding Agreement</span>
                    </div>
                </motion.div>

                {/* Last Updated */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-8 flex items-center gap-3 w-fit mx-auto"
                >
                    <Clock className="w-5 h-5 text-gray-600 flex-shrink-0" />
                    <div>
                        <p className="text-sm font-semibold text-gray-900">Last Updated</p>
                        <p className="text-sm text-gray-600">February 18, 2026</p>
                    </div>
                </motion.div>

                {/* Terms Sections */}
                <div className="space-y-6">
                    {sections.map((section, index) => {
                        const Icon = section.icon;
                        const colorClasses = {
                            blue: "bg-blue-100 text-blue-600",
                            indigo: "bg-indigo-100 text-indigo-600",
                            green: "bg-green-100 text-green-600",
                            orange: "bg-orange-100 text-orange-600",
                            red: "bg-red-100 text-red-600"
                        };

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * index }}
                                className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 hover:shadow-lg transition-shadow"
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[section.color]}`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900 mb-2">{section.title}</h2>
                                        <p className="text-gray-600 leading-relaxed">
                                            {section.content}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Footer Note */}
                <div className="mt-12 text-center text-sm text-gray-500">
                    <p>
                        For any questions regarding these terms, please contact us at{" "}
                        <a href="mailto:legal@petsitter.com" className="text-blue-600 hover:underline">legal@petsitter.com</a>
                    </p>
                </div>

            </div>
        </div>
    );
}
