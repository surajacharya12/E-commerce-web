"use client";

import React, { useState, useEffect } from "react";
import { FiBell, FiCheck, FiX, FiEye, FiClock, FiArrowLeft } from "react-icons/fi";
import API_URL from "../api/api";

export default function Reminder() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [readNotifications, setReadNotifications] = useState(new Set());


  const getReminders = async () => {
    try {
      const response = await fetch(`${API_URL}/notification`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      if (data.success && Array.isArray(data.data)) {
        setReminders(data.data);
      } else {
        console.warn("API response was successful but data format was unexpected.");
        setReminders([]);
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
    const allIds = reminders.map(reminder => reminder._id);
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
    getReminders();
  }, []);

  // Notification Detail Modal Component
  const NotificationDetailModal = ({ notification, onClose }) => {
    if (!notification) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 md:p-4">
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl max-w-2xl w-full max-h-[95vh] md:max-h-[90vh] overflow-hidden">
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



  const renderLoading = () => (
    <div className="flex justify-center items-center h-48">

      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500 mr-3"></div>
      <p className="text-lg text-indigo-600 font-medium">Loading your latest notifications...</p>
    </div>
  );

  const renderNoNotifications = () => (
    <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
      <svg
        className="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>
      <h3 className="mt-2 text-xl font-medium text-gray-900">No new notifications</h3>
      <p className="mt-1 text-sm text-gray-500">
        We'll let you know when updates or reminders come in.
      </p>
    </div>
  );

  const unreadCount = reminders.filter(reminder => !readNotifications.has(reminder._id)).length;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 mt-16 md:mt-0">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 md:py-8">
          {/* Header */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-2xl border border-white/20 mb-4 md:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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

              {reminders.length > 0 && (
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

          {loading
            ? renderLoading()
            : reminders.length === 0
              ? renderNoNotifications()
              : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {reminders.map((reminder) => (
                    <div
                      key={reminder._id}
                      className="bg-white shadow-xl rounded-2xl overflow-hidden 
                             hover:shadow-indigo-300/50 hover:scale-[1.02] 
                             transition-all duration-300 ease-in-out border border-gray-100 cursor-pointer"
                    >

                      {reminder.imageUrl && (
                        <div className="relative">
                          <img
                            src={reminder.imageUrl}
                            alt={reminder.title || 'Notification image'}
                            className="w-full h-48 object-cover object-center"
                          />

                          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                        </div>
                      )}


                      <div className="p-5 flex flex-col justify-between h-full">
                        <div>
                          <h2 className="text-xl font-bold text-gray-800 mb-1 leading-snug">
                            {reminder.title}
                          </h2>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                            {reminder.description}
                          </p>
                        </div>


                        <div className="pt-3 border-t border-gray-100 mt-auto">
                          <p className="text-xs font-mono text-indigo-400">

                            {new Date(reminder.createdAt).toLocaleDateString("en-US", {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
