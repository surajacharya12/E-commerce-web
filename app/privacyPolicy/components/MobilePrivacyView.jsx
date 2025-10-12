"use client";

import React, { useState, useEffect } from "react";
import { FiShield, FiLock, FiEye, FiUsers, FiSettings, FiMail } from "react-icons/fi";
import { ContactUs } from "./contact";

const MobilePrivacyView = () => {
    const [currentDate, setCurrentDate] = useState('January 2025');

    useEffect(() => {
        // Set the current date only on the client side
        setCurrentDate(new Date().toLocaleDateString());
    }, []);

    const sections = [
        {
            id: 1,
            title: "Information We Collect",
            icon: <FiEye className="w-6 h-6" />,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            items: [
                "Personal information (name, email, address, phone number)",
                "Account credentials",
                "Order and payment details",
                "Browsing and usage data",
                "Device and location information"
            ]
        },
        {
            id: 2,
            title: "How We Use Your Information",
            icon: <FiSettings className="w-6 h-6" />,
            color: "text-green-600",
            bgColor: "bg-green-50",
            items: [
                "To process orders and payments",
                "To provide customer support",
                "To personalize your shopping experience",
                "To send updates, offers, and notifications",
                "To improve our services and security"
            ]
        },
        {
            id: 3,
            title: "Sharing Your Information",
            icon: <FiUsers className="w-6 h-6" />,
            color: "text-purple-600",
            bgColor: "bg-purple-50",
            items: [
                "We do not sell your personal information",
                "We may share data with trusted partners for order fulfillment, payment processing, and analytics",
                "Legal compliance and protection of rights"
            ]
        },
        {
            id: 4,
            title: "Data Security",
            icon: <FiLock className="w-6 h-6" />,
            color: "text-red-600",
            bgColor: "bg-red-50",
            items: [
                "We use industry-standard security measures",
                "Encryption of sensitive data",
                "Regular security audits"
            ]
        },
        {
            id: 5,
            title: "Your Choices & Rights",
            icon: <FiShield className="w-6 h-6" />,
            color: "text-indigo-600",
            bgColor: "bg-indigo-50",
            items: [
                "Access, update, or delete your account information",
                "Opt out of marketing communications",
                "Contact us for privacy-related requests"
            ]
        }
    ];

    return (
        <div className="md:hidden min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-6 px-4">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4">
                    <FiShield className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-3">Privacy Policy</h1>
                <p className="text-gray-600 text-sm leading-relaxed">
                    Your privacy is important to us. Learn how ShopSwift protects your information.
                </p>
            </div>

            {/* Sections */}
            <div className="space-y-6">
                {sections.map((section) => (
                    <div key={section.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                        <div className={`${section.bgColor} p-4 border-b border-gray-100`}>
                            <div className="flex items-center gap-3">
                                <div className={`${section.color}`}>
                                    {section.icon}
                                </div>
                                <h2 className={`text-lg font-bold ${section.color}`}>
                                    {section.id}. {section.title}
                                </h2>
                            </div>
                        </div>
                        <div className="p-4">
                            <ul className="space-y-3">
                                {section.items.map((item, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <div className={`w-2 h-2 rounded-full ${section.color.replace('text-', 'bg-')} mt-2 flex-shrink-0`}></div>
                                        <span className="text-gray-700 text-sm leading-relaxed">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}

                {/* Additional Sections */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                    <h2 className="text-lg font-bold text-orange-600 mb-3 flex items-center gap-2">
                        <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                        6. Changes to This Policy
                    </h2>
                    <p className="text-gray-700 text-sm leading-relaxed">
                        We may update this Privacy Policy from time to time. Changes will be posted on this page.
                    </p>
                </div>

                <ContactUs />

            </div>

            {/* Footer */}
            <div className="text-center mt-8 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                    Last updated: {currentDate}
                </p>
            </div>
        </div>
    );
};

export default MobilePrivacyView;