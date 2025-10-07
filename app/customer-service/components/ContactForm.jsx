"use client";

import React from 'react';
import { FiUser, FiMail, FiMessageSquare, FiAlertCircle, FiLoader, FiSend, FiCheckCircle } from 'react-icons/fi';

const ContactForm = ({ formRef, formData, handleInputChange, sendEmail, status, errors }) => {
    return (
        <div className="bg-white/90 rounded-3xl shadow-xl backdrop-blur-xl border border-gray-200 p-6 md:p-8">
            <div className="mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Send us a Message</h2>
                <p className="text-gray-600">Fill out the form below and we'll get back to you soon.</p>
            </div>

            {/* Success Message */}
            {status === 'success' && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl">
                    <div className="flex items-center gap-3">
                        <FiCheckCircle className="w-5 h-5 text-green-600" />
                        <div>
                            <h4 className="font-semibold text-green-800">Message Sent Successfully!</h4>
                            <p className="text-green-700 text-sm">We'll get back to you within 24 hours.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Error Message */}
            {status === 'error' && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
                    <div className="flex items-center gap-3">
                        <FiAlertCircle className="w-5 h-5 text-red-600" />
                        <div>
                            <h4 className="font-semibold text-red-800">Failed to Send Message</h4>
                            <p className="text-red-700 text-sm">Please try again or contact us directly.</p>
                        </div>
                    </div>
                </div>
            )}

            <form ref={formRef} onSubmit={sendEmail} className="space-y-6">
                {/* Name Field */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <FiUser className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            name="user_name"
                            value={formData.user_name}
                            onChange={handleInputChange}
                            className={`w-full pl-12 pr-4 py-4 bg-gray-50 border rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${errors.user_name ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}
                            placeholder="Enter your full name"
                        />
                    </div>
                    {errors.user_name && (
                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                            <FiAlertCircle className="w-4 h-4" />
                            {errors.user_name}
                        </p>
                    )}
                </div>

                {/* Email Field */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <FiMail className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                            type="email"
                            name="user_email"
                            value={formData.user_email}
                            onChange={handleInputChange}
                            className={`w-full pl-12 pr-4 py-4 bg-gray-50 border rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${errors.user_email ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}
                            placeholder="Enter your email address"
                        />
                    </div>
                    {errors.user_email && (
                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                            <FiAlertCircle className="w-4 h-4" />
                            {errors.user_email}
                        </p>
                    )}
                </div>

                {/* Subject Field */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Subject *</label>
                    <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-4 bg-gray-50 border rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${errors.subject ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                        <option value="">Select a subject</option>
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Product Support">Product Support</option>
                        <option value="Order Issue">Order Issue</option>
                        <option value="Technical Support">Technical Support</option>
                        <option value="Billing Question">Billing Question</option>
                        <option value="Partnership">Partnership</option>
                        <option value="Feedback">Feedback</option>
                        <option value="Other">Other</option>
                    </select>
                    {errors.subject && (
                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                            <FiAlertCircle className="w-4 h-4" />
                            {errors.subject}
                        </p>
                    )}
                </div>

                {/* Message Field */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Message *</label>
                    <div className="relative">
                        <div className="absolute top-4 left-4 pointer-events-none">
                            <FiMessageSquare className="w-5 h-5 text-gray-400" />
                        </div>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            rows={6}
                            className={`w-full pl-12 pr-4 py-4 bg-gray-50 border rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none ${errors.message ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}
                            placeholder="Tell us how we can help you..."
                        />
                    </div>
                    {errors.message && (
                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                            <FiAlertCircle className="w-4 h-4" />
                            {errors.message}
                        </p>
                    )}
                    <p className="mt-2 text-sm text-gray-500">{formData.message.length}/500 characters</p>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                >
                    {status === 'loading' ? (
                        <>
                            <FiLoader className="w-5 h-5 animate-spin" />
                            Sending Message...
                        </>
                    ) : (
                        <>
                            <FiSend className="w-5 h-5" />
                            Send Message
                        </>
                    )}
                </button>
            </form>

            {/* Features */}
            <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* caller will render features */}
                </div>
            </div>
        </div>
    );
};

export default ContactForm;
