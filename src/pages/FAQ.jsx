import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    HelpCircle,
    ChevronDown,
    Search,
    CreditCard,
    Shield,
    Users
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function FAQ() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [openIndex, setOpenIndex] = useState(null);

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const categories = [
        {
            name: "General",
            icon: HelpCircle,
            questions: [
                {
                    q: "What is PetSitter?",
                    a: "PetSitter is a platform connecting pet owners with trusted pet sitters for services like dog walking, pet sitting, and boarding."
                },
                {
                    q: "Is it free to sign up?",
                    a: "Yes! Signing up as a pet owner or a sitter is completely free. We only charge a service fee when a booking is confirmed."
                }
            ]
        },
        {
            name: "Bookings",
            icon: Users,
            questions: [
                {
                    q: "How do I book a sitter?",
                    a: "Simply search for a sitter in your area, view their profile, and click 'Book Now'. You can choose dates and services before sending a request."
                },
                {
                    q: "Can I meet the sitter beforehand?",
                    a: "Absolutely! We recommend a 'Meet & Greet' before confirming any booking to ensure you and your pet are comfortable with the sitter."
                }
            ]
        },
        {
            name: "Safety",
            icon: Shield,
            questions: [
                {
                    q: "Are sitters verified?",
                    a: "Yes, all sitters undergo a verification process including ID checks and background screenings to ensure safety and trust."
                },
                {
                    q: "Is my pet insured?",
                    a: "Every booking made through PetSitter includes our premium insurance coverage for veterinary care and liability."
                }
            ]
        },
        {
            name: "Payments",
            icon: CreditCard,
            questions: [
                {
                    q: "When do I pay?",
                    a: "Payment is required to confirm the booking. Funds are held securely in escrow and released to the sitter only after the service is successfully completed."
                },
                {
                    q: "What payment methods are accepted?",
                    a: "We accept all major credit/debit cards, UPI, and net banking."
                }
            ]
        }
    ];

    // Flatten questions for search but keep structure for display if no search
    const allQuestions = categories.flatMap(cat => cat.questions.map(q => ({ ...q, category: cat.name })));

    const filteredQuestions = searchQuery
        ? allQuestions.filter(item =>
            item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.a.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : null; // Null means show categorical view

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
                    className="text-center mb-10"
                >
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                        <HelpCircle className="w-8 h-8 text-blue-600" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                        Find answers to common questions about our services and policies.
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-lg mx-auto relative">
                        <input
                            type="text"
                            placeholder="Search for answers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none bg-white text-gray-900"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                </motion.div>

                {/* FAQ Content */}
                <div className="space-y-8">
                    {searchQuery ? (
                        // Search Results View
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-4"
                        >
                            {filteredQuestions.length > 0 ? (
                                filteredQuestions.map((item, index) => (
                                    <AccordionItem
                                        key={index}
                                        question={item.q}
                                        answer={item.a}
                                        category={item.category}
                                        isOpen={openIndex === index}
                                        onClick={() => toggleAccordion(index)}
                                    />
                                ))
                            ) : (
                                <div className="text-center py-10 text-gray-500">
                                    No results found for "{searchQuery}"
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        // Categorized View
                        categories.map((category, catIndex) => (
                            <motion.div
                                key={catIndex}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * catIndex }}
                            >
                                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <category.icon className="w-5 h-5 text-blue-600" />
                                    {category.name}
                                </h2>
                                <div className="space-y-4">
                                    {category.questions.map((q, qIndex) => {
                                        // Generate a unique index for accordion logic across categories
                                        const uniqueIndex = `${catIndex}-${qIndex}`;
                                        return (
                                            <AccordionItem
                                                key={qIndex}
                                                question={q.q}
                                                answer={q.a}
                                                isOpen={openIndex === uniqueIndex}
                                                onClick={() => toggleAccordion(uniqueIndex)}
                                            />
                                        );
                                    })}
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>

                {/* Contact CTA */}
                <div className="mt-16 text-center bg-blue-50 rounded-2xl p-8 border border-blue-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Still can't find what you're looking for?</h3>
                    <p className="text-gray-600 mb-6">Our support team is always ready to help you.</p>
                    <button
                        onClick={() => navigate('/contact')}
                        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                    >
                        Contact Support
                    </button>
                </div>

            </div>
        </div>
    );
}

function AccordionItem({ question, answer, isOpen, onClick, category }) {
    return (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-blue-200 transition-colors">
            <button
                onClick={onClick}
                className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-gray-50 transition-colors"
            >
                <div>
                    {category && <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1 block">{category}</span>}
                    <span className="font-semibold text-gray-900">{question}</span>
                </div>
                <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="p-5 pt-0 text-gray-600 border-t border-gray-100">
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
