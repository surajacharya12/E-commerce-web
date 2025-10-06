"use client";

import React, { useState } from "react";
import {
    FiRotateCcw,
    FiCheck,
    FiX,
    FiPackage,
    FiClock,
    FiDollarSign,
    FiArrowRight,
    FiAlertCircle,
    FiShield,
    FiRefreshCw
} from "react-icons/fi";
import HelpCenterNav from "../components/HelpCenterNav";

export default function ReturnRefund() {
    const [activeTab, setActiveTab] = useState("returns");

    const returnSteps = [
        {
            icon: FiPackage,
            title: "Initiate Return",
            description: "Log into your account and select the items you want to return",
            details: "Go to 'My Orders' and click 'Return Items' next to your order"
        },
        {
            icon: FiCheck,
            title: "Print Label",
            description: "Download and print the prepaid return shipping label",
            details: "We'll email you a prepaid return label within 24 hours"
        },
        {
            icon: FiRotateCcw,
            title: "Pack & Ship",
            description: "Pack items securely and attach the return label",
            details: "Use original packaging when possible and include all accessories"
        },
        {
            icon: FiDollarSign,
            title: "Get Refund",
            description: "Receive your refund once we process the returned items",
            details: "Refunds are processed within 3-5 business days of receipt"
        }
    ];

    const returnableItems = [
        { item: "Clothing & Accessories", returnable: true, note: "Must have tags attached" },
        { item: "Shoes", returnable: true, note: "Must be unworn with original box" },
        { item: "Electronics", returnable: true, note: "Must be in original packaging" },
        { item: "Books & Media", returnable: true, note: "Must be in sellable condition" },
        { item: "Underwear & Swimwear", returnable: false, note: "For hygiene reasons" },
        { item: "Personalized Items", returnable: false, note: "Custom made products" },
        { item: "Gift Cards", returnable: false, note: "Digital products" },
        { item: "Final Sale Items", returnable: false, note: "Marked as final sale" }
    ];

    const refundMethods = [
        {
            method: "Original Payment Method",
            timeframe: "5-10 business days",
            description: "Refund to your original credit card or payment method",
            icon: FiDollarSign
        },
        {
            method: "Store Credit",
            timeframe: "Instant",
            description: "Get immediate store credit for future purchases",
            icon: FiCheck
        },
        {
            method: "Exchange",
            timeframe: "3-5 business days",
            description: "Exchange for different size, color, or similar item",
            icon: FiRefreshCw
        }
    ];

    const faqs = [
        {
            question: "What is your return policy?",
            answer: "We offer a 30-day return policy for most items. Items must be unused, in original packaging, and with tags attached. Some items like underwear and personalized products are not returnable."
        },
        {
            question: "How do I initiate a return?",
            answer: "Log into your account, go to 'My Orders', find your order, and click 'Return Items'. Follow the prompts to print a prepaid return label."
        },
        {
            question: "When will I receive my refund?",
            answer: "Refunds are processed within 3-5 business days after we receive your returned item. The refund will appear on your original payment method within 5-10 business days."
        },
        {
            question: "Can I exchange an item instead of returning it?",
            answer: "Yes, you can exchange items for a different size or color. Select 'Exchange' instead of 'Return' when initiating the process. Exchanges are subject to availability."
        },
        {
            question: "Who pays for return shipping?",
            answer: "We provide prepaid return labels for all eligible returns within the US. For international returns, customers are responsible for return shipping costs."
        },
        {
            question: "What if I received a damaged or wrong item?",
            answer: "If you received a damaged or incorrect item, please contact us immediately. We'll provide a prepaid return label and expedite your replacement or refund."
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 mt-16 md:mt-0">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 md:py-8">
                {/* Header */}
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-2xl border border-white/20 mb-4 md:mb-8">
                    <div className="text-center">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6">
                            <FiRotateCcw className="w-8 h-8 md:w-10 md:h-10 text-white" />
                        </div>
                        <h1 className="text-2xl md:text-4xl font-black text-gray-900 mb-2">Returns & Refunds</h1>
                        <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
                            Easy returns and hassle-free refunds. We want you to be completely satisfied with your purchase.
                        </p>
                    </div>
                </div>

                {/* Help Center Navigation */}
                <HelpCenterNav />

                {/* Tab Navigation */}
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-2 shadow-xl border border-white/20 mb-8 max-w-md mx-auto">
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setActiveTab("returns")}
                            className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${activeTab === "returns"
                                ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg"
                                : "text-gray-600 hover:bg-gray-100"
                                }`}
                        >
                            Returns
                        </button>
                        <button
                            onClick={() => setActiveTab("refunds")}
                            className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${activeTab === "refunds"
                                ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg"
                                : "text-gray-600 hover:bg-gray-100"
                                }`}
                        >
                            Refunds
                        </button>
                    </div>
                </div>

                {activeTab === "returns" && (
                    <>
                        {/* Return Process */}
                        <div className="mb-8 md:mb-12">
                            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 md:mb-8 text-center">
                                How to Return Items
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
                                {returnSteps.map((step, index) => {
                                    const Icon = step.icon;
                                    return (
                                        <div key={index} className="relative">
                                            {/* Connector Arrow */}
                                            {index < returnSteps.length - 1 && (
                                                <div className="hidden md:block absolute top-8 right-0 transform translate-x-1/2">
                                                    <FiArrowRight className="w-6 h-6 text-indigo-400" />
                                                </div>
                                            )}

                                            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 md:p-6 shadow-xl border border-white/20 text-center hover:shadow-2xl transition-all duration-300">
                                                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                                    <Icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
                                                </div>
                                                <div className="absolute -top-2 -right-2 w-6 h-6 md:w-8 md:h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                                                    <span className="text-xs md:text-sm font-bold text-gray-900">{index + 1}</span>
                                                </div>
                                                <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                                                <p className="text-gray-600 text-sm mb-3">{step.description}</p>
                                                <p className="text-xs text-gray-500">{step.details}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Return Policy */}
                        <div className="bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-xl border border-white/20 mb-8">
                            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 text-center">
                                Return Policy
                            </h2>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                                        <FiClock className="w-5 h-5 text-indigo-600" />
                                        <span>Return Window</span>
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-xl border border-green-200">
                                            <FiCheck className="w-5 h-5 text-green-600" />
                                            <span className="text-sm text-green-800">30 days from delivery date</span>
                                        </div>
                                        <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-xl border border-blue-200">
                                            <FiShield className="w-5 h-5 text-blue-600" />
                                            <span className="text-sm text-blue-800">Items must be unused and in original condition</span>
                                        </div>
                                        <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-xl border border-purple-200">
                                            <FiPackage className="w-5 h-5 text-purple-600" />
                                            <span className="text-sm text-purple-800">Original packaging and tags required</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Returnable Items</h3>
                                    <div className="space-y-2">
                                        {returnableItems.map((item, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                                <div className="flex items-center space-x-3">
                                                    {item.returnable ? (
                                                        <FiCheck className="w-4 h-4 text-green-500" />
                                                    ) : (
                                                        <FiX className="w-4 h-4 text-red-500" />
                                                    )}
                                                    <span className="text-sm font-medium text-gray-900">{item.item}</span>
                                                </div>
                                                <span className="text-xs text-gray-500">{item.note}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {activeTab === "refunds" && (
                    <>
                        {/* Refund Methods */}
                        <div className="mb-8 md:mb-12">
                            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 md:mb-8 text-center">
                                Refund Options
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                                {refundMethods.map((method, index) => {
                                    const Icon = method.icon;
                                    return (
                                        <div key={index} className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 md:p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
                                            <div className="text-center">
                                                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                                    <Icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
                                                </div>
                                                <h3 className="text-lg font-bold text-gray-900 mb-2">{method.method}</h3>
                                                <div className="mb-3">
                                                    <p className="text-lg font-semibold text-indigo-600">{method.timeframe}</p>
                                                </div>
                                                <p className="text-gray-600 text-sm">{method.description}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Refund Process */}
                        <div className="bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-xl border border-white/20 mb-8">
                            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 text-center">
                                Refund Timeline
                            </h2>

                            <div className="space-y-4 md:space-y-6">
                                <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-white font-bold text-sm">1</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 mb-1">Return Received</h3>
                                        <p className="text-sm text-gray-600">We receive and inspect your returned items</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-white font-bold text-sm">2</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 mb-1">Processing (3-5 business days)</h3>
                                        <p className="text-sm text-gray-600">We process your return and approve the refund</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-xl border border-green-200">
                                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-white font-bold text-sm">3</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 mb-1">Refund Issued (5-10 business days)</h3>
                                        <p className="text-sm text-gray-600">Refund appears on your original payment method</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* FAQ Section */}
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-xl border border-white/20 mb-8">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 text-center">
                        Frequently Asked Questions
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
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-4 md:p-6 border border-indigo-100">
                    <div className="text-center">
                        <FiRotateCcw className="w-8 h-8 md:w-10 md:h-10 text-indigo-600 mx-auto mb-3 md:mb-4" />
                        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                            Need Help with Returns?
                        </h3>
                        <p className="text-gray-600 text-sm md:text-base mb-4 md:mb-6">
                            Our customer service team is here to help with any return or refund questions.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                                Start Return Process
                            </button>
                            <button className="px-6 py-3 border border-indigo-300 text-indigo-600 font-medium rounded-xl hover:bg-indigo-50 transition-colors">
                                Contact Support
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}