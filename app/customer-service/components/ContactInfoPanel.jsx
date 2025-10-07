"use client";

import React from 'react';
import WhatsAppButton from '../../../components/ContactInfo';

const ContactInfoPanel = ({ contactInfoCards, WhatsAppButtonComponent }) => {
    return (
        <div className="space-y-6">
            <div className="space-y-4">
                {contactInfoCards.map((info, index) => (
                    <div key={index} className="bg-white/90 rounded-3xl shadow-xl backdrop-blur-xl border border-gray-200 p-6">
                        <div className={`inline-flex items-center justify-center w-12 h-12 ${info.bgColor} rounded-2xl mb-4`}>
                            <div className={info.color}>{info.icon}</div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{info.title}</h3>
                        {info.link ? (
                            <a href={info.link} className="text-gray-900 font-semibold text-lg mb-1 hover:text-blue-600 transition-colors block">{info.value}</a>
                        ) : (
                            <p className="text-gray-900 font-semibold text-lg mb-1">{info.value}</p>
                        )}
                        <p className="text-gray-600">{info.description}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white/90 rounded-3xl shadow-xl backdrop-blur-xl border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Contact</h3>
                {WhatsAppButtonComponent}
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl shadow-xl p-6 md:p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Quick Help</h3>
                {/* FAQ content caller-managed */}
            </div>
        </div>
    );
};

export default ContactInfoPanel;
