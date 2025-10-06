"use client";

import React from "react";
import {
    FiCreditCard,
    FiShield,
    FiLock,
    FiCheck,
    FiAlertCircle,
    FiDollarSign,
    FiCalendar,
    FiRefreshCw
} from "react-icons/fi";

export default function Payment() {
    const paymentMethods = [
        {
            icon: FiCreditCard,
            title: "Credit & Debit Cards",
            description: "Visa, MasterCard, American Express, Discover",
            features: ["Instant processing", "Secure encryption", "Fraud protection"],
            color: "from-blue-500 to-indigo-600"
        },
        {
            icon: "PayPal",
            title: "PayPal",
            description: "Pay with your PayPal account or PayPal Credit",
            features: ["Buyer protection", "No card details shared", "Quick checkout"],
            color: "from-yellow-500 to-orange-600"
        },
        {
            icon: "Apple",
            title: "Apple Pay",
            description: "Pay securely with Touch ID or Face ID",
            features: ["Biometric authentication", "No card numbers stored", "One-touch payment"],
            color: "from-gray-700 to-black"
        },
        {
            icon: "Google",
            title: "Google Pay",
            description: "Fast and secure payments with Google",
            features: ["Contactless payment", "Multiple cards supported", "Enhanced security"],
            color: "from-green-500 to-emerald-600"
        }
    ];

    const securityFeatures = [
        {
            icon: FiShield,
            title: "SSL Encryption",
            description: "All payment data is encrypted using industry-standard SSL technology"
        },
        {
            icon: FiLock,
            title: "PCI Compliance",
            description: "We meet the highest standards for payment card industry security"
        },
        {
            icon: FiCheck,
            title: "Fraud Protection",
            description: "Advanced fraud detection systems monitor all transactions"
        }
    ];

    const faqs = [
        {
            question: "When will I be charged for my order?",
            answer: "Your payment method will be charged immediately when you place your order. For pre-orders, you'll be charged when the item ships."
        },
        {
            question: "Is my payment information secure?",
            answer: "Yes, we use industry-standard SSL encryption and comply with PCI DSS standards. We never store your complete credit card information on our servers."
        },
        {
            question: "Can I pay in installments?",
            answer: "Yes, we offer installment payment options through our partners for orders over $100. You can select this option during checkout."
        },
        {
            question: "What currencies do you accept?",
            answer: "We accept payments in USD, EUR, GBP, CAD, and AUD. Prices will be displayed in your local currency based on your location."
        },
        {
            question: "Can I save my payment information?",
            answer: "Yes, you can securely save your payment methods to your account for faster checkout. This information is encrypted and stored securely."
        },
        {
            question: "What if my payment fails?",
            answer: "If your payment fails, please check your card details and try again. If the issue persists, contact your bank or try a different payment method."
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 mt-16 md:mt-0">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 md:py-8">
                {/* Header */}
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-2xl border border-white/20 mb-4 md:mb-8">
                    <div className="text-center">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6">
                            <FiCreditCard className="w-8 h-8 md:w-10 md:h-10 text-white" />
                        </div>
                        <h1 className="text-2xl md:text-4xl font-black text-gray-900 mb-2">Payment Information</h1>
                        <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
                            We offer multiple secure payment options to make your shopping experience convenient and safe.
                        </p>
                    </div>
                </div>

                {/* Payment Methods */}
                <div className="mb-8 md:mb-12">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 md:mb-8 text-center">
                        Accepted Payment Methods
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        {paymentMethods.map((method, index) => (
                            <div key={index} className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 md:p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
                                <div className="flex items-start space-x-4">
                                    <div className={`w-12 h-12 md:w-14 md:h-14 bg-gradient-to-r ${method.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                                        {method.icon === "PayPal" ? (
                                            <span className="text-white font-bold text-sm">PP</span>
                                        ) : method.icon === "Apple" ? (
                                            <span className="text-white font-bold text-lg">🍎</span>
                                        ) : method.icon === "Google" ? (
                                            <span className="text-white font-bold text-sm">G</span>
                                        ) : (
                                            <FiCreditCard className="w-6 h-6 md:w-7 md:h-7 text-white" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1">{method.title}</h3>
                                        <p className="text-gray-600 text-sm md:text-base mb-3">{method.description}</p>
                                        <div className="space-y-1">
                                            {method.features.map((feature, featureIndex) => (
                                                <div key={featureIndex} className="flex items-center space-x-2">
                                                    <FiCheck className="w-4 h-4 text-green-500" />
                                                    <span className="text-sm text-gray-700">{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Security Features */}
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-xl border border-white/20 mb-8">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 text-center">
                        Your Security is Our Priority
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                        {securityFeatures.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div key={index} className="text-center p-4 md:p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                                    <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4">
                                        <Icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                                    <p className="text-gray-600 text-sm">{feature.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Payment Process */}
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-xl border border-white/20 mb-8">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 text-center">
                        How Payment Works
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
                        <div className="text-center">
                            <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4">
                                <FiDollarSign className="w-6 h-6 md:w-8 md:h-8 text-white" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">1. Choose Payment</h3>
                            <p className="text-gray-600 text-sm">Select your preferred payment method at checkout</p>
                        </div>

                        <div className="text-center">
                            <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4">
                                <FiLock className="w-6 h-6 md:w-8 md:h-8 text-white" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">2. Secure Processing</h3>
                            <p className="text-gray-600 text-sm">Your payment is processed securely through encrypted channels</p>
                        </div>

                        <div className="text-center">
                            <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4">
                                <FiCheck className="w-6 h-6 md:w-8 md:h-8 text-white" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">3. Confirmation</h3>
                            <p className="text-gray-600 text-sm">Receive instant confirmation of your successful payment</p>
                        </div>

                        <div className="text-center">
                            <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4">
                                <FiCalendar className="w-6 h-6 md:w-8 md:h-8 text-white" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">4. Order Processing</h3>
                            <p className="text-gray-600 text-sm">Your order is prepared and shipped to you</p>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-xl border border-white/20">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 text-center">
                        Payment FAQ
                    </h2>

                    <div className="space-y-4 md:space-y-6">
                        {faqs.map((faq, index) => (
                            <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                                <h3 className="font-semibold text-gray-900 mb-2 flex items-start space-x-2">
                                    <FiAlertCircle className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                                    <span>{faq.question}</span>
                                </h3>
                                <p className="text-gray-600 text-sm ml-7">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact Support */}
                <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-4 md:p-6 border border-indigo-100">
                    <div className="text-center">
                        <FiRefreshCw className="w-8 h-8 md:w-10 md:h-10 text-indigo-600 mx-auto mb-3 md:mb-4" />
                        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                            Need Help with Payment?
                        </h3>
                        <p className="text-gray-600 text-sm md:text-base mb-4 md:mb-6">
                            If you're experiencing payment issues or have questions about billing, our support team is here to help.
                        </p>
                        <button className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                            Contact Payment Support
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}