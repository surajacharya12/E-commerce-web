"use client";

import React, { useState, useEffect, useRef } from 'react';
import { FiMessageCircle, FiSend, FiX, FiUser, FiClock, FiCheck, FiCheckCheck } from 'react-icons/fi';
import { useAuth } from '../app/hooks/useAuth';
import API_URL from '../app/api/api';
import { toast } from 'react-toastify';

const ProductChat = ({ productId, productName }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [chatId, setChatId] = useState(null);
    const [unreadCount, setUnreadCount] = useState(0);
    const messagesEndRef = useRef(null);
    const { isLoggedIn, userData } = useAuth();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Initialize or get existing chat
    useEffect(() => {
        if (isLoggedIn && userData && productId && isOpen) {
            initializeChat();
        }
    }, [isLoggedIn, userData, productId, isOpen]);

    const initializeChat = async () => {
        if (!userData?.id || !userData?.name || !userData?.email) return;

        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/chats/start`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productId,
                    customerId: userData.id,
                    customerName: userData.name,
                    customerEmail: userData.email
                }),
            });

            const result = await response.json();
            if (result.success) {
                setChatId(result.data._id);
                setMessages(result.data.messages || []);
                setUnreadCount(result.data.unreadCount?.customer || 0);
            }
        } catch (error) {
            console.error('Error initializing chat:', error);
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async () => {
        if (!newMessage.trim() || !chatId || loading) return;

        const messageText = newMessage.trim();
        setNewMessage('');

        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/chats/${chatId}/message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: messageText,
                    sender: 'customer',
                    userId: userData.id
                }),
            });

            const result = await response.json();
            if (result.success) {
                setMessages(result.data.messages || []);
            } else {
                console.error('Failed to send message:', result.message);
                setNewMessage(messageText); // Restore message on error
                toast.error('Failed to send message. Please try again.');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            setNewMessage(messageText); // Restore message on error
            toast.error('Network error. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInHours = (now - date) / (1000 * 60 * 60);

        if (diffInHours < 24) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else {
            return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        }
    };

    if (!isLoggedIn) {
        return (
            <div className="fixed bottom-6 right-6 z-50">
                <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-white/20 max-w-sm">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                            <FiMessageCircle className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="font-semibold text-slate-800">Have questions?</p>
                            <p className="text-sm text-slate-600">Please log in to chat with us</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Chat Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="relative bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110"
                >
                    <FiMessageCircle className="w-6 h-6" />
                    {unreadCount > 0 && (
                        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold animate-pulse">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </div>
                    )}
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 w-80 h-96 flex flex-col animate-slide-up">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                <FiUser className="w-4 h-4" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Product Support</h3>
                                <p className="text-xs opacity-90 truncate max-w-32">{productName}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1 hover:bg-white/20 rounded-full transition-colors"
                        >
                            <FiX className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {loading && messages.length === 0 ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="text-center text-slate-500 mt-8">
                                <FiMessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p className="text-sm">Start a conversation!</p>
                                <p className="text-xs mt-1">Ask us anything about this product</p>
                            </div>
                        ) : (
                            messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`flex ${message.sender === 'customer' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] p-3 rounded-2xl ${message.sender === 'customer'
                                            ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                                            : 'bg-slate-100 text-slate-800'
                                            }`}
                                    >
                                        <p className="text-sm">{message.message}</p>
                                        <div className={`flex items-center justify-end mt-1 space-x-1 ${message.sender === 'customer' ? 'text-white/70' : 'text-slate-500'
                                            }`}>
                                            <span className="text-xs">{formatTime(message.timestamp)}</span>
                                            {message.sender === 'customer' && (
                                                <div className="text-xs">
                                                    {message.isRead ? (
                                                        <FiCheckCheck className="w-3 h-3" />
                                                    ) : (
                                                        <FiCheck className="w-3 h-3" />
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-slate-200">
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type your message..."
                                className="flex-1 px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                                disabled={loading}
                            />
                            <button
                                onClick={sendMessage}
                                disabled={!newMessage.trim() || loading}
                                className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <FiSend className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductChat;