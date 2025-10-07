"use client";

import React from 'react';
import { FiHelpCircle } from 'react-icons/fi';

const CustomerHeader = ({ title = 'Customer Service', subtitle }) => {
    return (
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-2xl border border-white/20 mb-4 md:mb-8">
            <div className="text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6">
                    <FiHelpCircle className="w-8 h-8 md:w-10 md:h-10 text-white" />
                </div>
                <h1 className="text-2xl md:text-4xl font-black text-gray-900 mb-2">{title}</h1>
                {subtitle && <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">{subtitle}</p>}
            </div>
        </div>
    );
};

export default CustomerHeader;
