"use client";

import React, { useState, useEffect } from "react";
import { FiBell, FiCheck, FiX, FiEye, FiClock, FiArrowLeft } from "react-icons/fi";
import API_URL from "../api/api";

export default function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [readNotifications, setReadNotifications] = useState(new Set());

    const getNotifications = async () => {
        try {
            const response = await fetch(`${API_URL}/notification`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            if (data.success && Array.isArray(data.data)) {
                setNotifications(data.data);
            } else {
                console.warn("API response was successful but data format was unexpected.");
                setNotifications([]);
            }
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = (notificationId) => {
        setReadNotifications(prev => new Set([...prev, notificationId]));
    };

    const markAllAsRead = () => {
        const allIds = notifications.map(notification => notification._id);
        setReadNotifications(new Set(allIds));
    };

    const openNotificationDetail = (notification) => {
        markAsRead(notification._id);
        setSelectedNotification(notification);
    };

    const closeNotificationDetail = () => {
        setSelectedNotification(null);
    };

    useEffect(() => {
        getNotifications();
    }, []);

    // Notification Detail Modal Component
    const NotificationDetailModal = ({ notification, onClose }) => {
        if (!notification) return null;

        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 md:p-4">
                <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl max-w-2xl w-full max-h-[95vh] md:max-h-[90vh] overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-100">
                        <div className="flex items-center space-x-2 md:space-x-3">
                            <div className="w-8 h-8 md:w-10 md:h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                <FiBell className="w-4 h-4 md:w-5 md:h-5 text-indigo-600" />
                            </div>
                            <h2 className="text-lg md:text-xl font-bold text-gray-900">Notification Details</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <FiX className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-4 md:p-6 overflow-y-auto max-h-[calc(95vh-140px)] md:max-h-[calc(90vh-140px)]">
                        {notification.imageUrl && (
                            <div className="mb-4 md:mb-6">
                                <img
                                    src={notification.imageUrl}
                                    alt={notification.title}
                                    className="w-full h-48 md:h-64 object-cover rounded-xl md:rounded-2xl"
                                />
                            </div>
                        )}

                        <div className="space-y-3 md:space-y-4">
                            <h3 className="text-xl md:text-2xl font-bold text-gray-900">{notification.title}</h3>

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
                    <div className="p-4 md:p-6 border-t border-gray-100 bg-gray-50">
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

    const renderLoading = () => (
        <div className="flex justify-center items-center h-48 md:h-64">
            <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-b-2 border-indigo-500 mr-3 md:mr-4"></div>
            <p className="text-lg md:text-xl text-indigo-600 font-medium">Loading notifications...</p>
        </div>
    );

    const renderNoNotifications = () => (
        <div className="text-center py-12 md:py-16 bg-white/60 backdrop-blur-sm rounded-2xl md:rounded-3xl border border-white/20">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <FiBell className="w-8 h-8 md:w-10 md:h-10 text-gray-400" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">No notifications yet</h3>
            <p className="text-gray-600 max-w-md mx-auto px-4">
                We'll notify you when there are updates, reminders, or important information to share.
            </p>
        </div>
    );

    const unreadCount = notifications.filter(notification => !readNotifications.has(notification._id)).length;

    return (
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
                                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                                            <span className="text-xs font-bold text-white">{unreadCount}</span>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h1 className="text-xl font-black text-gray-900">
                                        Notifications
                                    </h1>
                                    <p className="text-sm text-gray-600">
                                        {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
                                    </p>
                                </div>
                            </div>

                            {notifications.length > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="flex items-center space-x-1 px-3 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-xl text-sm hover:shadow-lg transition-all duration-300"
                                >
                                    <FiCheck className="w-3 h-3" />
                                    <span>Mark all</span>
                                </button>
                            )}
                        </div>

                        {/* Desktop Header */}
                        <div className="hidden md:flex md:items-center md:justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="relative">
                                    <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
                                        <FiBell className="w-8 h-8 text-white" />
                                    </div>
                                    {unreadCount > 0 && (
                                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                                            <span className="text-xs font-bold text-white">{unreadCount}</span>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h1 className="text-3xl font-black text-gray-900">
                                        Notification Center
                                    </h1>
                                    <p className="text-gray-600 mt-1">
                                        {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
                                    </p>
                                </div>
                            </div>

                            {notifications.length > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                                >
                                    <FiCheck className="w-4 h-4" />
                                    <span>Mark all as read</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    {loading
                        ? renderLoading()
                        : notifications.length === 0
                            ? renderNoNotifications()
                            : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                                    {notifications.map((notification) => {
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
                                                    <div className="absolute top-4 right-4 w-3 h-3 bg-red-500 rounded-full animate-pulse z-10"></div>
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
                            )}
                </div>
            </div>

            {/* Notification Detail Modal */}
            <NotificationDetailModal
                notification={selectedNotification}
                onClose={closeNotificationDetail}
            />
        </div>
    );
}