"use client";

import React from "react";
import {
    FiTruck,
    FiClock,
    FiMapPin,
    FiPackage,
    FiGlobe,
    FiDollarSign,
    FiCalendar,
    FiCheck,
    FiAlertCircle
} from "react-icons/fi";
import ContactBanner from "../../components/ContactBanner";

export default function Shipping() {
    const shippingOptions = [
        {
            icon: FiTruck,
            title: "Standard Shipping",
            duration: "5-7 Business Days",
            cost: "Free on orders $50+",
            description: "Reliable delivery with tracking included",
            features: ["Free on orders over $50", "Tracking number provided", "Signature not required"],
            color: "from-blue-500 to-indigo-600"
        },
        {
            icon: FiClock,
            title: "Express Shipping",
            duration: "2-3 Business Days",
            cost: "$9.99",
            description: "Faster delivery for urgent orders",
            features: ["Priority processing", "Expedited handling", "Email notifications"],
            color: "from-orange-500 to-red-600"
        },
        {
            icon: FiPackage,
            title: "Overnight Shipping",
            duration: "Next Business Day",
            cost: "$19.99",
            description: "Get your order the next business day",
            features: ["Next day delivery", "Morning delivery option", "Signature required"],
            color: "from-purple-500 to-pink-600"
        }
    ];

    const internationalZones = [
        {
            zone: "Zone 1 (Canada)",
            countries: ["Canada"],
            duration: "7-10 Business Days",
            cost: "Starting at $15.99"
        },
        {
            zone: "Zone 2 (Europe)",
            countries: ["UK", "Germany", "France", "Italy", "Spain", "Netherlands"],
            duration: "10-14 Business Days",
            cost: "Starting at $24.99"
        },
        {
            zone: "Zone 3 (Asia Pacific)",
            countries: ["Australia", "Japan", "South Korea", "Singapore"],
            duration: "12-18 Business Days",
            cost: "Starting at $29.99"
        },
        {
            zone: "Zone 4 (Rest of World)",
            countries: ["Other countries"],
            duration: "14-21 Business Days",
            cost: "Starting at $34.99"
        }
    ];

    const trackingSteps = [
        {
            icon: FiCheck,
            title: "Order Confirmed",
            description: "Your order has been received and is being processed"
        },
        {
            icon: FiPackage,
            title: "Processing",
            description: "Items are being picked and packed in our warehouse"
        },
        {
            icon: FiTruck,
            title: "Shipped",
            description: "Your order is on its way with tracking information"
        },
        {
            icon: FiMapPin,
            title: "Delivered",
            description: "Package has been delivered to your address"
        }
    ];

    const faqs = [
        {
            question: "How much does shipping cost?",
            answer: "Standard shipping is free on orders over $50. Express shipping is $9.99, and Overnight is $19.99. International shipping rates vary by destination."
        },
        {
            question: "Do you ship internationally?",
            answer: "Yes, we ship to over 100 countries worldwide. International shipping times vary from 7-21 business days depending on the destination."
        },
        {
            question: "When will my order ship?",
            answer: "Orders placed before 2 PM EST on business days typically ship the same day. Orders placed after 2 PM or on weekends ship the next business day."
        },
        {
            question: "How can I track my order?",
            answer: "Once your order ships, you'll receive a tracking number via email. You can also track your order by logging into your account and visiting the 'My Orders' section."
        },
        {
            question: "What if my package is damaged or lost?",
            answer: "If your package arrives damaged or goes missing, please contact us immediately. We'll work with the carrier to resolve the issue and ensure you receive your order."
        },
        {
            question: "Can I change my shipping address?",
            answer: "You can change your shipping address within 1 hour of placing your order. After that, please contact customer service immediately for assistance."
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 mt-16 md:mt-0">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 md:py-8">
                {/* Header */}
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-2xl border border-white/20 mb-4 md:mb-8">
                    <div className="text-center">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6">
                            <FiTruck className="w-8 h-8 md:w-10 md:h-10 text-white" />
                        </div>
                        <h1 className="text-2xl md:text-4xl font-black text-gray-900 mb-2">Shipping Information</h1>
                        <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
                            Fast, reliable shipping options to get your orders delivered safely and on time.
                        </p>
                    </div>
                </div>

                {/* Shipping Options */}
                <div className="mb-8 md:mb-12">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 md:mb-8 text-center">
                        Domestic Shipping Options
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                        {shippingOptions.map((option, index) => {
                            const Icon = option.icon;
                            return (
                                <div key={index} className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 md:p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
                                    <div className="text-center">
                                        <div className={`w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r ${option.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                                            <Icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
                                        </div>
                                        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{option.title}</h3>
                                        <div className="mb-3">
                                            <p className="text-2xl font-bold text-indigo-600">{option.duration}</p>
                                            <p className="text-sm text-gray-600">{option.cost}</p>
                                        </div>
                                        <p className="text-gray-600 text-sm mb-4">{option.description}</p>
                                        <div className="space-y-2">
                                            {option.features.map((feature, featureIndex) => (
                                                <div key={featureIndex} className="flex items-center space-x-2 text-sm">
                                                    <FiCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
                                                    <span className="text-gray-700">{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* International Shipping */}
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-xl border border-white/20 mb-8">
                    <div className="flex items-center justify-center space-x-3 mb-6">
                        <FiGlobe className="w-6 h-6 md:w-8 md:h-8 text-indigo-600" />
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900">International Shipping</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        {internationalZones.map((zone, index) => (
                            <div key={index} className="p-4 md:p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{zone.zone}</h3>
                                <p className="text-sm text-gray-600 mb-3">{zone.countries.join(", ")}</p>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{zone.duration}</p>
                                        <p className="text-sm text-gray-600">{zone.cost}</p>
                                    </div>
                                    <FiMapPin className="w-5 h-5 text-indigo-600" />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                        <div className="flex items-start space-x-2">
                            <FiAlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-sm font-medium text-yellow-800">International Shipping Notice</p>
                                <p className="text-sm text-yellow-700 mt-1">
                                    International orders may be subject to customs duties and taxes. Delivery times may vary due to customs processing.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Order Tracking */}
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-xl border border-white/20 mb-8">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 text-center">
                        Track Your Order
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
                        {trackingSteps.map((step, index) => {
                            const Icon = step.icon;
                            return (
                                <div key={index} className="text-center relative">
                                    {index < trackingSteps.length - 1 && (
                                        <div className="hidden md:block absolute top-6 left-1/2 w-full h-0.5 bg-gradient-to-r from-indigo-300 to-purple-300 transform translate-x-1/2"></div>
                                    )}
                                    <div className="relative z-10 w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4">
                                        <Icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
                                    </div>
                                    <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                                    <p className="text-gray-600 text-sm">{step.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Shipping Policy */}
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-xl border border-white/20 mb-8">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 text-center">
                        Shipping Policy
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                                <FiCalendar className="w-5 h-5 text-indigo-600" />
                                <span>Processing Time</span>
                            </h3>
                            <ul className="space-y-2 text-sm text-gray-700">
                                <li className="flex items-start space-x-2">
                                    <FiCheck className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span>Orders placed before 2 PM EST ship same day</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <FiCheck className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span>Orders placed after 2 PM ship next business day</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <FiCheck className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span>Weekend orders ship on Monday</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <FiCheck className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span>Custom items may take 3-5 business days</span>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                                <FiDollarSign className="w-5 h-5 text-indigo-600" />
                                <span>Shipping Costs</span>
                            </h3>
                            <ul className="space-y-2 text-sm text-gray-700">
                                <li className="flex items-start space-x-2">
                                    <FiCheck className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span>Free standard shipping on orders $50+</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <FiCheck className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span>Calculated at checkout for international orders</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <FiCheck className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span>No hidden fees or surprise charges</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <FiCheck className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span>Shipping insurance included on all orders</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-xl border border-white/20">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 text-center">
                        Shipping FAQ
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

                {/* Contact Banner */}
                <div className="mt-8">
                    <ContactBanner
                        message="Questions about shipping?"
                        showHours={true}
                        className="shadow-xl"
                    />
                </div>
            </div>
        </div>
    );
}