"use client";

import React, { useState } from "react";
import {
    FiHelpCircle,
    FiShoppingCart,
    FiCreditCard,
    FiTruck,
    FiRotateCcw,
    FiChevronDown,
    FiChevronUp,
    FiPhone,
    FiMail,
    FiMessageCircle,
    FiClock
} from "react-icons/fi";
import HelpCenterNav from "../components/HelpCenterNav";
import ContactBanner from "../../components/ContactBanner";
import { contactInfo } from '@/lib/info';

export default function HelpCenter() {
    const [activeSection, setActiveSection] = useState("customer-service");
    const [expandedFaq, setExpandedFaq] = useState(null);

    const sections = [
        { id: "customer-service", title: "Customer Service", icon: FiHelpCircle },
        { id: "how-to-buy", title: "How To Buy", icon: FiShoppingCart },
        { id: "payment", title: "Payment", icon: FiCreditCard },
        { id: "shipping", title: "Shipping", icon: FiTruck },
        { id: "return-refund", title: "Return & Refund", icon: FiRotateCcw },
    ];

    const customerServiceFaqs = [
        {
            question: "How can I contact customer support?",
            answer: "You can reach us through multiple channels: Live chat (available 24/7), email at support@yourstore.com, or phone at +1-800-123-4567. Our support team is here to help you with any questions or concerns."
        },
        {
            question: "What are your customer service hours?",
            answer: "Our customer service team is available 24/7 through live chat and email. Phone support is available Monday-Friday 9AM-6PM EST, and Saturday-Sunday 10AM-4PM EST."
        },
        {
            question: "How do I track my order?",
            answer: "Once your order ships, you'll receive a tracking number via email. You can also track your order by logging into your account and visiting the 'My Orders' section."
        },
        {
            question: "Can I modify or cancel my order?",
            answer: "You can modify or cancel your order within 1 hour of placing it. After that, please contact customer service immediately and we'll do our best to help before the item ships."
        }
    ];

    const howToBuyFaqs = [
        {
            question: "How do I create an account?",
            answer: "Click 'Sign Up' in the top right corner, fill in your details, and verify your email address. You can also shop as a guest without creating an account."
        },
        {
            question: "How do I add items to my cart?",
            answer: "Browse products, select your preferred size/color/variant, choose quantity, and click 'Add to Cart'. Items will be saved in your cart for 24 hours."
        },
        {
            question: "How do I apply a discount code?",
            answer: "During checkout, look for the 'Promo Code' or 'Discount Code' field. Enter your code and click 'Apply' to see the discount reflected in your total."
        },
        {
            question: "What if an item is out of stock?",
            answer: "You can sign up for restock notifications on the product page. We'll email you as soon as the item becomes available again."
        }
    ];

    const paymentFaqs = [
        {
            question: "What payment methods do you accept?",
            answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, and bank transfers. All payments are processed securely."
        },
        {
            question: "Is my payment information secure?",
            answer: "Yes, we use industry-standard SSL encryption and comply with PCI DSS standards. We never store your complete credit card information on our servers."
        },
        {
            question: "When will I be charged?",
            answer: "Your payment method will be charged immediately when you place your order. For pre-orders, you'll be charged when the item ships."
        },
        {
            question: "Can I pay in installments?",
            answer: "Yes, we offer installment payment options through our partners for orders over $100. You can select this option during checkout."
        }
    ];

    const shippingFaqs = [
        {
            question: "What are your shipping options?",
            answer: "We offer Standard (5-7 business days), Express (2-3 business days), and Overnight shipping. International shipping is available to most countries."
        },
        {
            question: "How much does shipping cost?",
            answer: "Standard shipping is free on orders over $50. Express shipping is $9.99, and Overnight is $19.99. International shipping rates vary by destination."
        },
        {
            question: "Do you ship internationally?",
            answer: "Yes, we ship to over 100 countries worldwide. International shipping times vary from 7-21 business days depending on the destination."
        },
        {
            question: "What if my package is damaged or lost?",
            answer: "If your package arrives damaged or goes missing, please contact us immediately. We'll work with the carrier to resolve the issue and ensure you receive your order."
        }
    ];

    const returnRefundFaqs = [
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
        }
    ];

    const getFaqsForSection = (sectionId) => {
        switch (sectionId) {
            case "customer-service": return customerServiceFaqs;
            case "how-to-buy": return howToBuyFaqs;
            case "payment": return paymentFaqs;
            case "shipping": return shippingFaqs;
            case "return-refund": return returnRefundFaqs;
            default: return [];
        }
    };

    const toggleFaq = (index) => {
        setExpandedFaq(expandedFaq === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 mt-16 md:mt-0">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 md:py-8">
                {/* Header */}
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-2xl border border-white/20 mb-4 md:mb-8">
                    <div className="text-center">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6">
                            <FiHelpCircle className="w-8 h-8 md:w-10 md:h-10 text-white" />
                        </div>
                        <h1 className="text-2xl md:text-4xl font-black text-gray-900 mb-2">Help Center</h1>
                        <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
                            Find answers to your questions and get the support you need. We're here to help make your shopping experience smooth and enjoyable.
                        </p>
                    </div>
                </div>

                {/* Help Center Navigation */}
                <HelpCenterNav />

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-8">
                    {/* Sidebar Navigation */}
                    <div className="lg:col-span-1">
                        <div className="bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-xl border border-white/20 sticky top-4">
                            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Categories</h2>
                            <nav className="space-y-2">
                                {sections.map((section) => {
                                    const Icon = section.icon;
                                    return (
                                        <button
                                            key={section.id}
                                            onClick={() => setActiveSection(section.id)}
                                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-left ${activeSection === section.id
                                                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                                                : 'text-gray-700 hover:bg-gray-100'
                                                }`}
                                        >
                                            <Icon className="w-5 h-5" />
                                            <span className="font-medium text-sm md:text-base">{section.title}</span>
                                        </button>
                                    );
                                })}
                            </nav>

                            {/* Contact Info */}
                            <div className="mt-6 md:mt-8 pt-6 border-t border-gray-200">
                                <h3 className="font-bold text-gray-900 mb-4">Need More Help?</h3>
                                <div className="space-y-3">
                                    <a href={contactInfo.phone.link} className="flex items-center space-x-2 text-sm text-gray-600 hover:text-indigo-600 transition-colors">
                                        <FiPhone className="w-4 h-4" />
                                        <span>{contactInfo.phone.display}</span>
                                    </a>
                                    <a href={contactInfo.email.link} className="flex items-center space-x-2 text-sm text-gray-600 hover:text-indigo-600 transition-colors">
                                        <FiMail className="w-4 h-4" />
                                        <span>{contactInfo.email.display}</span>
                                    </a>
                                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                                        <FiClock className="w-4 h-4" />
                                        <span>{contactInfo.businessHours.weekdays}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <div className="bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-xl border border-white/20">
                            <div className="flex items-center space-x-3 mb-6 md:mb-8">
                                {(() => {
                                    const section = sections.find(s => s.id === activeSection);
                                    const Icon = section?.icon || FiHelpCircle;
                                    return (
                                        <>
                                            <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                                                <Icon className="w-5 h-5 md:w-6 md:h-6 text-indigo-600" />
                                            </div>
                                            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                                                {section?.title || "Help Center"}
                                            </h2>
                                        </>
                                    );
                                })()}
                            </div>

                            {/* FAQ Section */}
                            <div className="space-y-4">
                                {getFaqsForSection(activeSection).map((faq, index) => (
                                    <div
                                        key={index}
                                        className="border border-gray-200 rounded-xl overflow-hidden"
                                    >
                                        <button
                                            onClick={() => toggleFaq(index)}
                                            className="w-full flex items-center justify-between p-4 md:p-6 text-left hover:bg-gray-50 transition-colors"
                                        >
                                            <h3 className="font-semibold text-gray-900 text-sm md:text-base pr-4">
                                                {faq.question}
                                            </h3>
                                            {expandedFaq === index ? (
                                                <FiChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                                            ) : (
                                                <FiChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                                            )}
                                        </button>
                                        {expandedFaq === index && (
                                            <div className="px-4 md:px-6 pb-4 md:pb-6">
                                                <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                                                    {faq.answer}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Contact CTA */}
                            <div className="mt-8 md:mt-12 p-4 md:p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
                                <div className="text-center">
                                    <FiMessageCircle className="w-8 h-8 md:w-10 md:h-10 text-indigo-600 mx-auto mb-3 md:mb-4" />
                                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                                        Still need help?
                                    </h3>
                                    <p className="text-gray-600 text-sm md:text-base mb-4 md:mb-6">
                                        Can't find what you're looking for? Our support team is ready to assist you.
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                        <a
                                            href={contactInfo.phone.whatsapp + "?text=" + encodeURIComponent("Hi! I need help from the help center.")}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 text-center"
                                        >
                                            Start WhatsApp Chat
                                        </a>
                                        <a
                                            href={contactInfo.email.link}
                                            className="px-6 py-3 border border-indigo-300 text-indigo-600 font-medium rounded-xl hover:bg-indigo-50 transition-colors text-center"
                                        >
                                            Send Email
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}