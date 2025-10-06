"use client";

import React, { useState } from "react";
import { FiBell, FiCheck, FiX, FiEye, FiClock } from "react-icons/fi";

export default function DemoNotifications() {
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [readNotifications, setReadNotifications] = useState(new Set());

    // Demo notification data
    const demoNotifications = [
        {
            _id: "1",
            title: "Welcome to Our Store!",
            description: "Thank you for joining our e-commerce platform. Explore thousands of products and enjoy exclusive deals. We're excited to have you as part of our community!",
            imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&h=300&fit=crop",
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        },
        {
            _id: "2",
            title: "Flash Sale Alert! 🔥",
            description: "Don't miss out! Up to 70% off on electronics, fashion, and home goods. Limited time offer ending soon. Shop now and save big on your favorite items!",
            imageUrl: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=500&h=300&fit=crop",
            createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
        },
        {
            _id: "3",
            title: "Order Shipped Successfully",
            description: "Great news! Your order #12345 has been shipped and is on its way to you. Track your package using the tracking number provided in your email. Expected delivery: 2-3 business days.",
            imageUrl: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=500&h=300&fit=crop",
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        },
        {
            _id: "4",
            title: "New Product Categories Added",
            description: "We've expanded our catalog! Check out our new categories including Smart Home devices, Fitness Equipment, and Organic Beauty products. Discover something new today!",
            imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&h=300&fit=crop",
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        },
        {
            _id: "5",
            title: "Account Security Update",
            description: "We've updated our security measures to better protect your account. Please review your account settings and enable two-factor authentication for enhanced security.",
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        },
        {
            _id: "6",
            title: "Customer Review Request",
            description: "How was your recent purchase? We'd love to hear your feedback! Leave a review and help other customers make informed decisions. Your opinion matters to us!",
            imageUrl: "https://images.unsplash.com/photo-1556155092-490a1ba16284?w=500&h=300&fit=crop",
            createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
        }
    ];

    const markAsRead = (notificationId) => {
        setReadNotifications(prev => new Set([...prev, notificationId]));
    };

    const markAllAsRead = () => {
        const allIds = demoNotifications.map(notification => notification._id);
        setReadNotifications(new Set(allIds));
    };

    const openNotificationDetail = (notification) => {
        markAsRead(notification._id);
        setSelectedNotification(notification);
    };

    const closeNotificationDetail = () => {
        setSelectedNotification(null);
    };

    // Notification Detail Modal Component
    const NotificationDetailModal = ({ notification, onClose }) => {
        if (!notification) return null;

        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                <FiBell className="w-5 h-5 text-indigo-600" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">Notification Details</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <FiX className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                        {notification.imageUrl && (
                            <div className="mb-6">
                                <img
                                    src={notification.imageUrl}
                                    alt={notification.title}
                                    className="w-full h-64 object-cover rounded-2xl"
                                />
                            </div>
                        )}

                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold text-gray-900">{notification.title}</h3>

                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <div className="flex items-center space-x-1">
                                    <FiClock className="w-4 h-4" />
                                    <span>
                                        {new Date(notification.createdAt).toLocaleDateString("en-US", {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <FiEye className="w-4 h-4" />
                                    <span>Read</span>
                                </div>
                            </div>

                            <div className="prose prose-gray max-w-none">
                                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                    {notification.description}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-gray-100 bg-gray-50">
                        <button
                            onClick={onClose}
                            className="w-full px-4 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const unreadCount = demoNotifications.filter(notification => !readNotifications.has(notification._id)).length;

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 mt-16 md:mt-0">
                <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 md:py-8">
                    {/* Header */}
                    <div className="bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-2xl border border-white/20 mb-4 md:mb-8">
                        <div className="flex flex-col gap-4">
                            {/* Mobile Header */}
                            <div className="flex items-center justify-between md:hidden">
                                <div className="flex items-center space-x-3">
                                    <div className="relative">
                                        <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                                            <FiBell className="w-6 h-6 text-white" />
                                        </div>
                                        {unreadCount > 0 && (
                                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                                                <span className="text-xs font-bold text-white">{unreadCount}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h1 className="text-xl font-black text-gray-900">
                                            Demo Notifications
                                        </h1>
                                        <p className="text-sm text-gray-600">
                                            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={markAllAsRead}
                                    className="flex items-center space-x-1 px-3 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-xl text-sm hover:shadow-lg transition-all duration-300"
                                >
                                    <FiCheck className="w-3 h-3" />
                                    <span>Mark all</span>
                                </button>
                            </div>

                            {/* Desktop Header */}
                            <div className="hidden md:flex md:items-center md:justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="relative">
                                        <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
                                            <FiBell className="w-8 h-8 text-white" />
                                        </div>
                                        {unreadCount > 0 && (
                                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                                                <span className="text-xs font-bold text-white">{unreadCount}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h1 className="text-3xl font-black text-gray-900">
                                            Notification Center Demo
                                        </h1>
                                        <p className="text-gray-600 mt-1">
                                            {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={markAllAsRead}
                                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                                >
                                    <FiCheck className="w-4 h-4" />
                                    <span>Mark all as read</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Demo Notice */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl md:rounded-2xl p-3 md:p-4 mb-4 md:mb-8">
                        <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 md:w-5 md:h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                                <span className="text-xs font-bold text-yellow-800">!</span>
                            </div>
                            <p className="text-sm md:text-base text-yellow-800 font-medium">
                                This is a demo page showcasing the notification functionality with sample data.
                            </p>
                        </div>
                    </div>

                    {/* Notifications Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                        {demoNotifications.map((notification) => {
                            const isRead = readNotifications.has(notification._id);
                            return (
                                <div
                                    key={notification._id}
                                    onClick={() => openNotificationDetail(notification)}
                                    className={`relative bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-3xl overflow-hidden shadow-xl border transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-2xl ${isRead
                                        ? 'border-gray-200 opacity-75'
                                        : 'border-indigo-200 shadow-indigo-100/50'
                                        }`}
                                >
                                    {/* Unread indicator */}
                                    {!isRead && (
                                        <div className="absolute top-3 right-3 md:top-4 md:right-4 w-3 h-3 bg-red-500 rounded-full animate-pulse z-10"></div>
                                    )}

                                    {/* Image */}
                                    {notification.imageUrl && (
                                        <div className="relative h-32 md:h-48 overflow-hidden">
                                            <img
                                                src={notification.imageUrl}
                                                alt={notification.title || 'Notification image'}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                        </div>
                                    )}

                                    {/* Content */}
                                    <div className="p-4 md:p-6">
                                        <div className="flex items-start justify-between mb-3">
                                            <h3 className="text-lg font-bold text-gray-900 line-clamp-2 flex-1">
                                                {notification.title}
                                            </h3>
                                            {isRead && (
                                                <div className="ml-2 p-1 bg-green-100 rounded-full">
                                                    <FiCheck className="w-3 h-3 text-green-600" />
                                                </div>
                                            )}
                                        </div>

                                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                            {notification.description}
                                        </p>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-1 text-xs text-gray-500">
                                                <FiClock className="w-3 h-3" />
                                                <span>
                                                    {new Date(notification.createdAt).toLocaleDateString("en-US", {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </span>
                                            </div>

                                            <div className="flex items-center space-x-1 text-xs text-indigo-600 font-medium">
                                                <FiEye className="w-3 h-3" />
                                                <span>View Details</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Notification Detail Modal */}
            <NotificationDetailModal
                notification={selectedNotification}
                onClose={closeNotificationDetail}
            />
        </>
    );
}