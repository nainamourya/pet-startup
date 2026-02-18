import { motion } from "framer-motion";
import {
    ArrowLeft,
    AlertCircle,
    CheckCircle,
    XCircle,
    Clock,
    Shield,
    CreditCard,
    Calendar,
    HelpCircle,
    Mail,
    Phone
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Refund() {
    const navigate = useNavigate();

    const refundPolicies = [
        {
            icon: CheckCircle,
            color: "green",
            title: "Full Refund (100%)",
            scenarios: [
                "Cancellation 48+ hours before booking start",
                "Sitter cancels the booking",
                "Service not provided as agreed",
                "Safety or quality concerns verified by our team"
            ]
        },
        {
            icon: AlertCircle,
            color: "yellow",
            title: "Partial Refund (50%)",
            scenarios: [
                "Cancellation 24-48 hours before booking",
                "Early termination of service by pet owner (unused days refunded)",
                "Mutual agreement between owner and sitter"
            ]
        },
        {
            icon: XCircle,
            color: "red",
            title: "No Refund",
            scenarios: [
                "Cancellation less than 24 hours before booking",
                "No-show without prior notice",
                "Service completed as agreed",
                "Owner violates Terms of Service"
            ]
        }
    ];

    const processingTime = [
        {
            method: "UPI / Wallet",
            time: "2-3 business days",
            icon: CreditCard
        },
        {
            method: "Credit / Debit Card",
            time: "5-7 business days",
            icon: CreditCard
        },
        {
            method: "Net Banking",
            time: "5-7 business days",
            icon: CreditCard
        }
    ];

    const faqs = [
        {
            question: "How do I request a refund?",
            answer: "Navigate to 'My Bookings', select the booking you want to cancel, and click 'Request Cancellation'. Our team will review and process your refund based on our policy."
        },
        {
            question: "When will I receive my refund?",
            answer: "Refund processing times vary by payment method (2-7 business days). You'll receive an email confirmation once the refund is initiated."
        },
        {
            question: "What if I have a dispute with my sitter?",
            answer: "Contact our support team immediately at support@petsitter.com. We'll mediate and resolve the issue fairly based on our Terms of Service."
        },
        {
            question: "Can I get a refund for emergency cancellations?",
            answer: "Yes, we understand emergencies happen. Contact us with documentation (medical certificates, etc.) and we'll review your case on a priority basis."
        },
        {
            question: "What about service fees?",
            answer: "Platform service fees (typically 10-15% of booking amount) are non-refundable unless the cancellation is due to sitter unavailability or platform error."
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
                        <CreditCard className="w-8 h-8 text-blue-600" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                        Refund & Cancellation Policy
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        We strive for transparent and fair refund policies. Your satisfaction is our priority.
                    </p>
                    <div className="mt-6 inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-200">
                        <Shield className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-semibold text-blue-900">100% Secure Refunds</span>
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

                {/* Refund Policies Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-12"
                >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Refund Eligibility</h2>
                    <div className="grid gap-6 md:grid-cols-3">
                        {refundPolicies.map((policy, index) => {
                            const Icon = policy.icon;
                            const colorClasses = {
                                green: "bg-green-100 text-green-600 border-green-200",
                                yellow: "bg-yellow-100 text-yellow-600 border-yellow-200",
                                red: "bg-red-100 text-red-600 border-red-200"
                            };

                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 * index }}
                                    className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                                >
                                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 ${colorClasses[policy.color]}`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-3">{policy.title}</h3>
                                    <ul className="space-y-2">
                                        {policy.scenarios.map((scenario, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5 flex-shrink-0"></span>
                                                <span>{scenario}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Processing Time */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 mb-12"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <Clock className="w-6 h-6 text-blue-600" />
                        <h2 className="text-2xl font-bold text-gray-900">Refund Processing Time</h2>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-3">
                        {processingTime.map((item, index) => {
                            const Icon = item.icon;
                            return (
                                <div
                                    key={index}
                                    className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200"
                                >
                                    <Icon className="w-5 h-5 text-blue-600 mb-2" />
                                    <p className="font-semibold text-gray-900 text-sm mb-1">{item.method}</p>
                                    <p className="text-lg font-bold text-blue-600">{item.time}</p>
                                </div>
                            );
                        })}
                    </div>
                    <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
                        <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-yellow-800">
                            <span className="font-semibold">Note:</span> Processing times may vary depending on your bank or payment provider. Weekends and holidays may extend the timeline.
                        </p>
                    </div>
                </motion.div>

                {/* How to Request */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 mb-12"
                >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Request a Refund</h2>
                    <div className="space-y-4">
                        {[
                            {
                                step: "1",
                                title: "Go to My Bookings",
                                description: "Navigate to your dashboard and select 'My Bookings' from the menu"
                            },
                            {
                                step: "2",
                                title: "Select Booking",
                                description: "Click on the booking you want to cancel and click 'Request Cancellation'"
                            },
                            {
                                step: "3",
                                title: "Provide Reason",
                                description: "Select a cancellation reason and provide any additional details"
                            },
                            {
                                step: "4",
                                title: "Await Review",
                                description: "Our team will review your request within 24 hours and process the refund accordingly"
                            },
                            {
                                step: "5",
                                title: "Receive Refund",
                                description: "You'll receive an email confirmation and the refund will be processed to your original payment method"
                            }
                        ].map((item, index) => (
                            <div key={index} className="flex gap-4">
                                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                                    {item.step}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                                    <p className="text-sm text-gray-600">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* FAQs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 mb-12"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <HelpCircle className="w-6 h-6 text-blue-600" />
                        <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
                    </div>
                    <div className="space-y-6">
                        {faqs.map((faq, index) => (
                            <div key={index} className="border-b border-gray-200 last:border-0 pb-6 last:pb-0">
                                <h3 className="font-bold text-gray-900 mb-2 flex items-start gap-2">
                                    <span className="text-blue-600">Q:</span>
                                    <span>{faq.question}</span>
                                </h3>
                                <p className="text-sm text-gray-600 ml-6">
                                    <span className="font-semibold text-gray-900">A:</span> {faq.answer}
                                </p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Contact Support */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 sm:p-8 text-white text-center"
                >
                    <h2 className="text-2xl font-bold mb-3">Still Have Questions?</h2>
                    <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                        Our support team is here to help you with any refund-related queries
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="mailto:support@petsitter.com"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
                        >
                            <Mail className="w-5 h-5" />
                            Email Support
                        </a>
                        <a
                            href="tel:+911234567890"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/20 transition-colors border border-white/20"
                        >
                            <Phone className="w-5 h-5" />
                            Call Us
                        </a>
                    </div>
                    <p className="text-sm text-blue-200 mt-4">
                        Response time: Within 24 hours
                    </p>
                </motion.div>

                {/* Important Notes */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="mt-8 bg-gray-50 border border-gray-200 rounded-xl p-6"
                >
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-gray-600" />
                        Important Notes
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-start gap-2">
                            <span className="text-gray-400">•</span>
                            <span>Refunds are processed only to the original payment method used during booking</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-gray-400">•</span>
                            <span>Emergency cancellations require proper documentation for full refund consideration</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-gray-400">•</span>
                            <span>Disputes must be raised within 48 hours of service completion</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-gray-400">•</span>
                            <span>We reserve the right to modify this policy with 30 days notice to users</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-gray-400">•</span>
                            <span>All refund decisions made by our team are final and binding</span>
                        </li>
                    </ul>
                </motion.div>

                {/* Footer Links */}
                <div className="mt-8 text-center text-sm text-gray-600">
                    <p>
                        By using our platform, you agree to our{" "}
                        <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a>
                        {" "}and{" "}
                        <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>
                    </p>
                </div>

            </div>
        </div>
    );
}