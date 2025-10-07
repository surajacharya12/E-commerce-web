"use client";

import React from 'react';

const ContactMethods = ({ methods }) => {
    return (
        <div className="mb-8 md:mb-12">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 md:mb-8 text-center">Get In Touch</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
                {methods.map((method, index) => {
                    const Icon = method.icon;
                    return (
                        <div key={index} className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 md:p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
                            <div className="flex items-start space-x-4">
                                <div className={`w-12 h-12 md:w-14 md:h-14 bg-gradient-to-r ${method.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                                    <Icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1">{method.title}</h3>
                                    <p className="text-gray-600 text-sm md:text-base mb-2">{method.description}</p>
                                    <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3 md:mb-4">
                                        <span>{method.availability}</span>
                                    </div>
                                    <button className={`px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r ${method.color} text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 text-sm md:text-base`}>
                                        {method.action}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ContactMethods;
