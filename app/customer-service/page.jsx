"use client";

import React, { useRef, useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
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
    FiStar,
    FiHelpCircle,
    FiMessageCircle
} from 'react-icons/fi';
import HelpCenterNav from "../components/HelpCenterNav";
import ContactInfo, { PhoneNumber, EmailAddress, WhatsAppButton } from "../../components/ContactInfo";
import CustomerHeader from './components/CustomerHeader';
import ContactMethods from './components/ContactMethods';
import ContactForm from './components/ContactForm';
import ContactInfoPanel from './components/ContactInfoPanel';
import QuickFAQ from './components/QuickFAQ';
import { contactInfo } from '@/lib/info';

export default function CustomerService() {
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

    const contactInfoCards = [
        {
            icon: <FiMail className="w-5 h-5" />,
            title: "Email Us",
            value: contactInfo.email.display,
            description: "Get in touch via email",
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            link: contactInfo.email.link
        },
        {
            icon: <FiPhone className="w-5 h-5" />,
            title: "Call Us",
            value: contactInfo.phone.display,
            description: contactInfo.businessHours.weekdays,
            color: "text-green-600",
            bgColor: "bg-green-50",
            link: contactInfo.phone.link
        },
        {
            icon: <FiMapPin className="w-5 h-5" />,
            title: "Visit Us",
            value: contactInfo.address.street,
            description: `${contactInfo.address.city}, ${contactInfo.address.state} ${contactInfo.address.zip}`,
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

    const contactMethods = [
        {
            icon: FiMessageCircle,
            title: "Live Chat",
            description: "Get instant help from our support team",
            availability: "Available 24/7",
            action: "Start Chat",
            color: "from-green-500 to-emerald-600"
        },
        {
            icon: FiPhone,
            title: "Phone Support",
            description: "Speak directly with our experts",
            availability: "Mon-Fri 9AM-6PM EST",
            action: "Call Now",
            color: "from-blue-500 to-indigo-600"
        },
        {
            icon: FiMail,
            title: "Email Support",
            description: "Send us a detailed message",
            availability: "Response within 24 hours",
            action: "Send Email",
            color: "from-purple-500 to-pink-600"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 mt-16 md:mt-0">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 md:py-8">
                <CustomerHeader subtitle={"We're here to help! Choose your preferred way to get in touch with our support team."} />

                {/* Help Center Navigation */}
                <HelpCenterNav />

                <ContactMethods methods={contactMethods} />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    <div className="order-2 lg:order-1">
                        <ContactForm formRef={form} formData={formData} handleInputChange={handleInputChange} sendEmail={sendEmail} status={status} errors={errors} />
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {features.map((feature, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <div className="text-blue-600">{feature.icon}</div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 text-sm">{feature.title}</h4>
                                            <p className="text-gray-600 text-xs">{feature.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="order-1 lg:order-2">
                        <ContactInfoPanel contactInfoCards={contactInfoCards} WhatsAppButtonComponent={<WhatsAppButton message="Hi! I need help with my order." className="w-full justify-center" />} />
                        <QuickFAQ faqs={[
                            { title: 'Order Status', body: 'Check your order status in your account dashboard or email us your order number.' },
                            { title: 'Returns & Refunds', body: 'We offer 30-day returns on most items. Visit our returns page for details.' },
                            { title: 'Technical Issues', body: 'Having trouble with our website? Try clearing your browser cache first.' },
                            { title: 'Response Time', body: 'We typically respond within 24-48 hours' }
                        ]} />
                    </div>
                </div>
            </div>
        </div>
    );
}