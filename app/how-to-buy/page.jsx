"use client";

import React from "react";
import {
    FiShoppingCart,
    FiUser,
    FiSearch,
    FiHeart,
    FiCreditCard,
    FiTruck,
    FiCheck,
    FiArrowRight
} from "react-icons/fi";

export default function HowToBuy() {
    const steps = [
        {
            icon: FiUser,
            title: "Create Account",
            description: "Sign up for a free account or continue as a guest",
            details: [
                "Click 'Sign Up' in the top right corner",
                "Fill in your basic information",
                "Verify your email address",
                "Or choose 'Continue as Guest' at checkout"
            ]
        },
        {
            icon: FiSearch,
            title: "Browse Products",
            description: "Find the perfect items using our search and filters",
            details: [
                "Use the search bar to find specific items",
                "Browse by categories and collections",
                "Apply filters for size, color, price, and brand",
                "Read reviews and check product details"
            ]
        },
        {
            icon: FiShoppingCart,
            title: "Add to Cart",
            description: "Select your preferred options and add items to cart",
            details: [
                "Choose size, color, and quantity",
                "Click 'Add to Cart' button",
                "Items stay in cart for 24 hours",
                "Continue shopping or proceed to checkout"
            ]
        },
        {
            icon: FiCreditCard,
            title: "Checkout",
            description: "Review your order and complete the payment",
            details: [
                "Review items in your cart",
                "Enter shipping information",
                "Apply discount codes if available",
                "Choose payment method and complete purchase"
            ]
        },
        {
            icon: FiTruck,
            title: "Track & Receive",
            description: "Monitor your order status and receive your items",
            details: [
                "Receive order confirmation email",
                "Get tracking information when shipped",
                "Monitor delivery progress",
                "Enjoy your new purchase!"
            ]
        }
    ];

    const tips = [
        {
            icon: FiHeart,
            title: "Save Favorites",
            description: "Add items to your wishlist to save them for later purchase"
        },
        {
            icon: FiSearch,
            title: "Use Filters",
            description: "Narrow down results using our advanced filtering options"
        },
        {
            icon: FiCheck,
            title: "Check Reviews",
            description: "Read customer reviews to make informed purchasing decisions"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 mt-16 md:mt-0">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 md:py-8">
                {/* Header */}
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-2xl border border-white/20 mb-4 md:mb-8">
                    <div className="text-center">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6">
                            <FiShoppingCart className="w-8 h-8 md:w-10 md:h-10 text-white" />
                        </div>
                        <h1 className="text-2xl md:text-4xl font-black text-gray-900 mb-2">How To Buy</h1>
                        <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
                            Shopping with us is easy! Follow these simple steps to complete your purchase and get your items delivered.
                        </p>
                    </div>
                </div>

                {/* Steps */}
                <div className="mb-8 md:mb-12">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 md:mb-8 text-center">
                        5 Easy Steps to Complete Your Purchase
                    </h2>

                    <div className="space-y-6 md:space-y-8">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            return (
                                <div key={index} className="relative">
                                    {/* Connector Line */}
                                    {index < steps.length - 1 && (
                                        <div className="hidden md:block absolute left-6 top-20 w-0.5 h-16 bg-gradient-to-b from-indigo-300 to-purple-300"></div>
                                    )}

                                    <div className="bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
                                        <div className="flex flex-col md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-6">
                                            {/* Step Number & Icon */}
                                            <div className="flex items-center space-x-4 md:flex-col md:space-x-0 md:space-y-3 md:items-center">
                                                <div className="relative">
                                                    <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
                                                        <Icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
                                                    </div>
                                                    <div className="absolute -top-2 -right-2 w-6 h-6 md:w-8 md:h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                                                        <span className="text-xs md:text-sm font-bold text-gray-900">{index + 1}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1">
                                                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                                                <p className="text-gray-600 text-sm md:text-base mb-4">{step.description}</p>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                                                    {step.details.map((detail, detailIndex) => (
                                                        <div key={detailIndex} className="flex items-start space-x-2">
                                                            <FiCheck className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                            <span className="text-sm text-gray-700">{detail}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Arrow */}
                                            {index < steps.length - 1 && (
                                                <div className="hidden lg:block">
                                                    <FiArrowRight className="w-6 h-6 text-indigo-400" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Shopping Tips */}
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-xl border border-white/20 mb-8">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 text-center">
                        Shopping Tips
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                        {tips.map((tip, index) => {
                            const Icon = tip.icon;
                            return (
                                <div key={index} className="text-center p-4 md:p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
                                    <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4">
                                        <Icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">{tip.title}</h3>
                                    <p className="text-gray-600 text-sm">{tip.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-xl border border-white/20">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 text-center">
                        Frequently Asked Questions
                    </h2>

                    <div className="space-y-4 md:space-y-6">
                        <div className="border-b border-gray-200 pb-4">
                            <h3 className="font-semibold text-gray-900 mb-2">Do I need to create an account to shop?</h3>
                            <p className="text-gray-600 text-sm">No, you can shop as a guest. However, creating an account allows you to track orders, save favorites, and enjoy faster checkout.</p>
                        </div>

                        <div className="border-b border-gray-200 pb-4">
                            <h3 className="font-semibold text-gray-900 mb-2">How long do items stay in my cart?</h3>
                            <p className="text-gray-600 text-sm">Items remain in your cart for 24 hours. After that, they'll be removed to ensure availability for other customers.</p>
                        </div>

                        <div className="border-b border-gray-200 pb-4">
                            <h3 className="font-semibold text-gray-900 mb-2">Can I modify my order after placing it?</h3>
                            <p className="text-gray-600 text-sm">You can modify or cancel your order within 1 hour of placing it. After that, please contact customer service for assistance.</p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">What if an item is out of stock?</h3>
                            <p className="text-gray-600 text-sm">You can sign up for restock notifications on the product page. We'll email you as soon as the item becomes available again.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}