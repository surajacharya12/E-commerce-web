"use client";

import React, { useRef, useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { contactInfo as siteContact } from '@/lib/info';
import {
    FiMail,
    FiUser,
    FiMessageSquare,
    FiSend,
    FiPhone,
    FiMapPin,
    FiClock,
    FiCheckCircle,
    FiAlertCircle,
    FiLoader,
    FiShield,
    FiHeart,
    FiStar
} from 'react-icons/fi';

export const ContactUs = () => {
    const form = useRef();
    const [formData, setFormData] = useState({
        user_name: '',
        user_email: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        if (!formData.user_name.trim()) {
            newErrors.user_name = 'Name is required';
        }

        if (!formData.user_email.trim()) {
            newErrors.user_email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.user_email)) {
            newErrors.user_email = 'Please enter a valid email';
        }

        if (!formData.subject.trim()) {
            newErrors.subject = 'Subject is required';
        }

        if (!formData.message.trim()) {
            newErrors.message = 'Message is required';
        } else if (formData.message.trim().length < 10) {
            newErrors.message = 'Message must be at least 10 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const sendEmail = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setStatus('loading');

        try {
            await emailjs.sendForm(
                'YOUR_SERVICE_ID',
                'YOUR_TEMPLATE_ID',
                form.current,
                {
                    publicKey: 'YOUR_PUBLIC_KEY',
                }
            );

            setStatus('success');
            setFormData({
                user_name: '',
                user_email: '',
                subject: '',
                message: ''
            });

            // Reset success status after 5 seconds
            setTimeout(() => setStatus('idle'), 5000);

        } catch (error) {
            console.error('Email send failed:', error);
            setStatus('error');

            // Reset error status after 5 seconds
            setTimeout(() => setStatus('idle'), 5000);
        }
    };

    const contactInfo = [
        {
            icon: <FiMail className="w-5 h-5" />,
            title: "Email Us",
            value: siteContact.email.display || siteContact.email.link,
            description: "Get in touch via email",
            color: "text-blue-600",
            bgColor: "bg-blue-50"
        },
        {
            icon: <FiPhone className="w-5 h-5" />,
            title: "Call Us",
            value: siteContact.phone.display || siteContact.phone.link,
            description: "Mon-Fri, 9AM-6PM EST",
            color: "text-green-600",
            bgColor: "bg-green-50"
        },
        {
            icon: <FiMapPin className="w-5 h-5" />,
            title: "Visit Us",
            value: siteContact.address?.full || '123 Commerce St',
            description: "New York, NY 10001",
            color: "text-purple-600",
            bgColor: "bg-purple-50"
        }
    ];

    const features = [
        {
            icon: <FiShield className="w-5 h-5" />,
            title: "Secure & Private",
            description: "Your information is protected"
        },
        {
            icon: <FiClock className="w-5 h-5" />,
            title: "Quick Response",
            description: "We respond within 24 hours"
        },
        {
            icon: <FiHeart className="w-5 h-5" />,
            title: "Dedicated Support",
            description: "Our team is here to help"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Mobile Header */}
            <div className="md:hidden text-center py-8 px-4">
                <h2 className="text-lg font-bold mb-3 flex items-center gap-2 justify-center">
                    <FiMail className="w-5 h-5" />
                    7. Contact Us
                </h2>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4">
                    <FiMail className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-3">Get in Touch</h1>
                <p className="text-gray-600 text-sm leading-relaxed max-w-sm mx-auto">
                    Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                </p>
            </div>

            {/* Desktop Header */}
            <div className="hidden md:block bg-white/80 backdrop-blur-lg border-b border-gray-200 px-8 py-12">
                <div className="max-w-6xl mx-auto text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-6">
                        <FiMail className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-5xl font-bold text-gray-900 mb-4">Get in Touch</h1>
                    <p className="text-gray-600 text-xl max-w-2xl mx-auto leading-relaxed">
                        Have questions about our products, need support, or want to share feedback?
                        We're here to help and would love to hear from you.
                    </p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12">
                {/* Contact Info Cards - Mobile */}
                <div className="md:hidden grid gap-4 mb-8">
                    {contactInfo.map((info, index) => (
                        <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4">
                            <div className={`inline-flex items-center justify-center w-10 h-10 ${info.bgColor} rounded-xl mb-3`}>
                                <div className={info.color}>
                                    {info.icon}
                                </div>
                            </div>
                            <h3 className="font-bold text-gray-900 mb-1">{info.title}</h3>
                            <p className="text-gray-900 font-medium">{info.value}</p>
                            <p className="text-gray-600 text-sm">{info.description}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Contact Form */}
                    <div className="order-2 lg:order-1">
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

                            <form ref={form} onSubmit={sendEmail} className="space-y-6">
                                {/* Name Field */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Full Name *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <FiUser className="w-5 h-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            name="user_name"
                                            value={formData.user_name}
                                            onChange={handleInputChange}
                                            className={`w-full pl-12 pr-4 py-4 bg-gray-50 border rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${errors.user_name ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                                                }`}
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
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Email Address *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <FiMail className="w-5 h-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="email"
                                            name="user_email"
                                            value={formData.user_email}
                                            onChange={handleInputChange}
                                            className={`w-full pl-12 pr-4 py-4 bg-gray-50 border rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${errors.user_email ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                                                }`}
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
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Subject *
                                    </label>
                                    <select
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-4 bg-gray-50 border rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${errors.subject ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                                            }`}
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
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Message *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute top-4 left-4 pointer-events-none">
                                            <FiMessageSquare className="w-5 h-5 text-gray-400" />
                                        </div>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            rows={6}
                                            className={`w-full pl-12 pr-4 py-4 bg-gray-50 border rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none ${errors.message ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            placeholder="Tell us how we can help you..."
                                        />
                                    </div>
                                    {errors.message && (
                                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                            <FiAlertCircle className="w-4 h-4" />
                                            {errors.message}
                                        </p>
                                    )}
                                    <p className="mt-2 text-sm text-gray-500">
                                        {formData.message.length}/500 characters
                                    </p>
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
                                    {features.map((feature, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <div className="text-blue-600">
                                                {feature.icon}
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900 text-sm">{feature.title}</h4>
                                                <p className="text-gray-600 text-xs">{feature.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Information - Desktop */}
                    <div className="order-1 lg:order-2">
                        <div className="space-y-6">
                            {/* Contact Info Cards */}
                            <div className="hidden md:block space-y-4">
                                {contactInfo.map((info, index) => (
                                    <div key={index} className="bg-white/90 rounded-3xl shadow-xl backdrop-blur-xl border border-gray-200 p-6">
                                        <div className={`inline-flex items-center justify-center w-12 h-12 ${info.bgColor} rounded-2xl mb-4`}>
                                            <div className={info.color}>
                                                {info.icon}
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{info.title}</h3>
                                        <p className="text-gray-900 font-semibold text-lg mb-1">{info.value}</p>
                                        <p className="text-gray-600">{info.description}</p>
                                    </div>
                                ))}
                            </div>

                            {/* FAQ Section */}
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl shadow-xl p-6 md:p-8 text-white">
                                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                    <FiStar className="w-6 h-6" />
                                    Quick Help
                                </h3>
                                <div className="space-y-4">
                                    <div className="bg-white/20 rounded-2xl p-4">
                                        <h4 className="font-semibold mb-2">Order Status</h4>
                                        <p className="text-blue-100 text-sm">
                                            Check your order status in your account dashboard or email us your order number.
                                        </p>
                                    </div>
                                    <div className="bg-white/20 rounded-2xl p-4">
                                        <h4 className="font-semibold mb-2">Returns & Refunds</h4>
                                        <p className="text-blue-100 text-sm">
                                            We offer 30-day returns on most items. Visit our returns page for details.
                                        </p>
                                    </div>
                                    <div className="bg-white/20 rounded-2xl p-4">
                                        <h4 className="font-semibold mb-2">Technical Issues</h4>
                                        <p className="text-blue-100 text-sm">
                                            Having trouble with our website? Try clearing your browser cache first.
                                        </p>
                                    </div>
                                    <div className="bg-white/20 rounded-xl p-6">
                                        <h4 className="font-semibold mb-3">Response Time</h4>
                                        <p className="text-blue-100">
                                            We typically respond within 24-48 hours
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};