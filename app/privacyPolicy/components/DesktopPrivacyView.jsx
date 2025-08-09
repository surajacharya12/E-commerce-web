"use client";

import React, { useState, useEffect } from "react";
import { FiShield, FiLock, FiEye, FiUsers, FiSettings, FiMail, FiChevronRight, FiHome } from "react-icons/fi";

const DesktopPrivacyView = () => {
    const [activeSection, setActiveSection] = useState(1);
    const [currentDate, setCurrentDate] = useState('January 2025');

    useEffect(() => {
        // Set the current date only on the client side
        setCurrentDate(new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }));
    }, []);

    const sections = [
        {
            id: 1,
            title: "Information We Collect",
            icon: <FiEye className="w-6 h-6" />,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            borderColor: "border-blue-200",
            content: {
                description: "We collect various types of information to provide you with the best shopping experience possible.",
                items: [
                    {
                        title: "Personal Information",
                        details: "Name, email address, shipping address, phone number, and billing information"
                    },
                    {
                        title: "Account Credentials",
                        details: "Username, password, and security preferences for your account"
                    },
                    {
                        title: "Order & Payment Details",
                        details: "Purchase history, payment methods, transaction records, and order preferences"
                    },
                    {
                        title: "Browsing & Usage Data",
                        details: "Pages visited, time spent, search queries, and interaction patterns"
                    },
                    {
                        title: "Device & Location Information",
                        details: "IP address, browser type, device information, and approximate location"
                    }
                ]
            }
        },
        {
            id: 2,
            title: "How We Use Your Information",
            icon: <FiSettings className="w-6 h-6" />,
            color: "text-green-600",
            bgColor: "bg-green-50",
            borderColor: "border-green-200",
            content: {
                description: "Your information helps us deliver personalized services and improve your shopping experience.",
                items: [
                    {
                        title: "Order Processing",
                        details: "Process your orders, handle payments, and manage shipping and delivery"
                    },
                    {
                        title: "Customer Support",
                        details: "Provide assistance, resolve issues, and respond to your inquiries"
                    },
                    {
                        title: "Personalization",
                        details: "Customize your shopping experience with relevant product recommendations"
                    },
                    {
                        title: "Communications",
                        details: "Send order updates, promotional offers, and important notifications"
                    },
                    {
                        title: "Service Improvement",
                        details: "Analyze usage patterns to enhance our platform and security measures"
                    }
                ]
            }
        },
        {
            id: 3,
            title: "Sharing Your Information",
            icon: <FiUsers className="w-6 h-6" />,
            color: "text-purple-600",
            bgColor: "bg-purple-50",
            borderColor: "border-purple-200",
            content: {
                description: "We respect your privacy and only share information when necessary for our services.",
                items: [
                    {
                        title: "No Personal Data Sales",
                        details: "We never sell your personal information to third parties for marketing purposes"
                    },
                    {
                        title: "Trusted Partners",
                        details: "Share data with payment processors, shipping companies, and analytics providers"
                    },
                    {
                        title: "Legal Compliance",
                        details: "Disclose information when required by law or to protect our rights and users"
                    }
                ]
            }
        },
        {
            id: 4,
            title: "Data Security",
            icon: <FiLock className="w-6 h-6" />,
            color: "text-red-600",
            bgColor: "bg-red-50",
            borderColor: "border-red-200",
            content: {
                description: "We implement robust security measures to protect your personal information.",
                items: [
                    {
                        title: "Industry Standards",
                        details: "Use SSL encryption, secure servers, and industry-standard security protocols"
                    },
                    {
                        title: "Data Encryption",
                        details: "Encrypt sensitive data both in transit and at rest using advanced encryption"
                    },
                    {
                        title: "Regular Audits",
                        details: "Conduct regular security assessments and vulnerability testing"
                    }
                ]
            }
        },
        {
            id: 5,
            title: "Your Rights & Choices",
            icon: <FiShield className="w-6 h-6" />,
            color: "text-indigo-600",
            bgColor: "bg-indigo-50",
            borderColor: "border-indigo-200",
            content: {
                description: "You have control over your personal information and how we use it.",
                items: [
                    {
                        title: "Access & Update",
                        details: "View, modify, or delete your account information at any time"
                    },
                    {
                        title: "Marketing Preferences",
                        details: "Opt out of promotional emails and customize your communication preferences"
                    },
                    {
                        title: "Data Requests",
                        details: "Request a copy of your data or ask us to delete your information"
                    }
                ]
            }
        }
    ];

    const currentSection = sections.find(s => s.id === activeSection);

    return (
        <div className="hidden md:block min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200 px-8 py-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                            <FiShield className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900">Privacy Policy</h1>
                            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                <FiHome className="w-4 h-4" />
                                <span>ShopEase</span>
                                <FiChevronRight className="w-4 h-4" />
                                <span>Privacy Policy</span>
                            </div>
                        </div>
                    </div>
                    <p className="text-gray-600 text-lg max-w-3xl">
                        Your privacy is important to us. This Privacy Policy explains how ShopEase collects, uses, and protects your information when you use our e-commerce platform.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                    {/* Sidebar Navigation */}
                    <div className="lg:col-span-1">
                        <div className="bg-white/90 rounded-3xl shadow-xl backdrop-blur-xl border border-gray-200 sticky top-8">
                            <div className="p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Table of Contents</h3>
                                <nav className="space-y-2">
                                    {sections.map((section) => (
                                        <button
                                            key={section.id}
                                            onClick={() => setActiveSection(section.id)}
                                            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 text-left ${activeSection === section.id
                                                ? `${section.bgColor} ${section.color} shadow-md scale-105`
                                                : 'hover:bg-gray-50 text-gray-700 hover:scale-102'
                                                }`}
                                        >
                                            <div className={activeSection === section.id ? section.color : 'text-gray-400'}>
                                                {section.icon}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-sm">
                                                    {section.id}. {section.title}
                                                </div>
                                            </div>
                                        </button>
                                    ))}

                                    {/* Additional sections */}
                                    <button
                                        onClick={() => setActiveSection(6)}
                                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 text-left ${activeSection === 6
                                            ? 'bg-orange-50 text-orange-600 shadow-md scale-105'
                                            : 'hover:bg-gray-50 text-gray-700 hover:scale-102'
                                            }`}
                                    >
                                        <div className={activeSection === 6 ? 'text-orange-600' : 'text-gray-400'}>
                                            <div className="w-2 h-2 bg-current rounded-full"></div>
                                        </div>
                                        <div className="font-semibold text-sm">6. Policy Changes</div>
                                    </button>

                                    <button
                                        onClick={() => setActiveSection(7)}
                                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 text-left ${activeSection === 7
                                            ? 'bg-blue-50 text-blue-600 shadow-md scale-105'
                                            : 'hover:bg-gray-50 text-gray-700 hover:scale-102'
                                            }`}
                                    >
                                        <FiMail className={`w-5 h-5 ${activeSection === 7 ? 'text-blue-600' : 'text-gray-400'}`} />
                                        <div className="font-semibold text-sm">7. Contact Us</div>
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-3">
                        <div className="bg-white/90 rounded-3xl shadow-xl backdrop-blur-xl border border-gray-200">

                            {/* Content for sections 1-5 */}
                            {currentSection && (
                                <div className="p-8">
                                    <div className={`flex items-center gap-4 mb-6 p-4 ${currentSection.bgColor} rounded-2xl ${currentSection.borderColor} border`}>
                                        <div className={`${currentSection.color}`}>
                                            {currentSection.icon}
                                        </div>
                                        <h2 className={`text-3xl font-bold ${currentSection.color}`}>
                                            {currentSection.id}. {currentSection.title}
                                        </h2>
                                    </div>

                                    <p className="text-gray-700 text-lg mb-8 leading-relaxed">
                                        {currentSection.content.description}
                                    </p>

                                    <div className="grid gap-6">
                                        {currentSection.content.items.map((item, index) => (
                                            <div key={index} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                                    <div className={`w-3 h-3 rounded-full ${currentSection.color.replace('text-', 'bg-')}`}></div>
                                                    {item.title}
                                                </h4>
                                                <p className="text-gray-700 leading-relaxed">
                                                    {item.details}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Policy Changes Section */}
                            {activeSection === 6 && (
                                <div className="p-8">
                                    <div className="flex items-center gap-4 mb-6 p-4 bg-orange-50 rounded-2xl border border-orange-200">
                                        <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
                                        <h2 className="text-3xl font-bold text-orange-600">6. Changes to This Policy</h2>
                                    </div>

                                    <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                                        <p className="text-gray-700 text-lg leading-relaxed mb-6">
                                            We may update this Privacy Policy from time to time to reflect changes in our practices,
                                            technology, legal requirements, or other factors.
                                        </p>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="bg-white rounded-xl p-6 border border-gray-200">
                                                <h4 className="font-semibold text-gray-900 mb-3">How We Notify You</h4>
                                                <ul className="space-y-2 text-gray-700">
                                                    <li>• Email notifications for significant changes</li>
                                                    <li>• Updates posted on this page</li>
                                                    <li>• In-app notifications when applicable</li>
                                                </ul>
                                            </div>

                                            <div className="bg-white rounded-xl p-6 border border-gray-200">
                                                <h4 className="font-semibold text-gray-900 mb-3">Your Options</h4>
                                                <ul className="space-y-2 text-gray-700">
                                                    <li>• Review changes before they take effect</li>
                                                    <li>• Contact us with questions or concerns</li>
                                                    <li>• Discontinue use if you disagree</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Contact Section */}
                            {activeSection === 7 && (
                                <div className="p-8">
                                    <div className="flex items-center gap-4 mb-6 p-4 bg-blue-50 rounded-2xl border border-blue-200">
                                        <FiMail className="w-6 h-6 text-blue-600" />
                                        <h2 className="text-3xl font-bold text-blue-600">7. Contact Us</h2>
                                    </div>

                                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-6">
                                        <h3 className="text-2xl font-bold mb-4">Get in Touch</h3>
                                        <p className="text-blue-100 text-lg mb-6 leading-relaxed">
                                            If you have any questions, concerns, or requests regarding this Privacy Policy or
                                            how we handle your personal information, we're here to help.
                                        </p>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="bg-white/20 rounded-xl p-6">
                                                <h4 className="font-semibold mb-3 flex items-center gap-2">
                                                    <FiMail className="w-5 h-5" />
                                                    Email Support
                                                </h4>
                                                <a
                                                    href="mailto:support@shopease.com"
                                                    className="text-blue-100 hover:text-white transition-colors"
                                                >
                                                    support@shopease.com
                                                </a>
                                            </div>

                                            <div className="bg-white/20 rounded-xl p-6">
                                                <h4 className="font-semibold mb-3">Response Time</h4>
                                                <p className="text-blue-100">
                                                    We typically respond within 24-48 hours
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                        <p className="text-gray-600 text-center">
                                            <strong>Last updated:</strong> {currentDate}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DesktopPrivacyView;