"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FiSend, FiArrowLeft, FiUser, FiPackage, FiCheck, FiCheckCheck, FiClock } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import API_URL from '../../api/api';
import Image from 'next/image';

const ChatDetail = () => {
    const params = useParams();
    const router = useRouter();
    const { isLoggedIn, userData } = useAuth();
    const [chat, setChat] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chat?.messages]);

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/signin');
            return;
        }
        if (params.id) {
            fetchChat();
        }
    }, [isLoggedIn, params.id]);

    const fetchChat = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/chats/${params.id}?userId=${userData?.id}&userType=customer`);
            const result = await response.json();

            if (result.success) {
                setChat(result.data);
            } else {
                router.push('/chats');
            }
        } catch (error) {
            console.error('Error fetching chat:', error);
            router.push('/chats');
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async () => {
        if (!newMessage.trim() || sending) return;

        const messageText = newMessage.trim();
        setNewMessage('');
        setSending(true);

        try {
            const response = await fetch(`${API_URL}/chats/${params.id}/message`, {
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
                setChat(result.data);
            } else {
                console.error('Failed to send message:', result.message);
                setNewMessage(messageText); // Restore message on error
                alert('Failed to send message. Please try again.');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            setNewMessage(messageText); // Restore message on error
            alert('Network error. Please check your connection and try again.');
        } finally {
            setSending(false);
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
            return date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center mt-20">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-xl font-semibold text-slate-600">Loading chat...</p>
                </div>
            </div>
        );
    }

    if (!chat) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center mt-20">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Chat not found</h2>
                    <button
                        onClick={() => router.push('/chats')}
                        className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
                    >
                        Back to Chats
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 mt-20 flex flex-col">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-xl border-b border-white/20 sticky top-20 z-40">
                <div className="max-w-4xl mx-auto px-4 md:px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => router.push('/chats')}
                                className="p-2 hover:bg-indigo-100 rounded-xl transition-colors"
                            >
                                <FiArrowLeft className="w-5 h-5 text-slate-600" />
                            </button>

                            {/* Product Info */}
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-slate-100 rounded-xl overflow-hidden">
                                    {chat.productId?.images?.[0]?.url ? (
                                        <Image
                                            src={chat.productId.images[0].url}
                                            alt={chat.productName}
                                            width={48}
                                            height={48}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <FiPackage className="w-6 h-6 text-slate-400" />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h1 className="font-semibold text-slate-800">{chat.productName}</h1>
                                    <div className="flex items-center space-x-2">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${chat.status === 'active'
                                            ? 'bg-green-100 text-green-800'
                                            : chat.status === 'resolved'
                                                ? 'bg-blue-100 text-blue-800'
                                                : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {chat.status.charAt(0).toUpperCase() + chat.status.slice(1)}
                                        </span>
                                        {chat.productId?.price && (
                                            <span className="text-sm font-semibold text-indigo-600">
                                                Rs. {(chat.productId.offerPrice || chat.productId.price).toFixed(2)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => router.push(`/product/${chat.productId._id}`)}
                            className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
                        >
                            View Product
                        </button>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-hidden">
                <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 h-full flex flex-col">
                    <div className="flex-1 overflow-y-auto space-y-4 mb-6">
                        {chat.messages && chat.messages.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FiUser className="w-8 h-8 text-slate-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-800 mb-2">Start the conversation</h3>
                                <p className="text-slate-600">Ask us anything about this product!</p>
                            </div>
                        ) : (
                            chat.messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`flex ${message.sender === 'customer' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`flex items-start space-x-3 max-w-[80%] ${message.sender === 'customer' ? 'flex-row-reverse space-x-reverse' : ''
                                        }`}>
                                        {/* Avatar */}
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.sender === 'customer'
                                            ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                                            : 'bg-slate-200 text-slate-600'
                                            }`}>
                                            <FiUser className="w-4 h-4" />
                                        </div>

                                        {/* Message */}
                                        <div className={`p-4 rounded-2xl ${message.sender === 'customer'
                                            ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                                            : 'bg-white/80 backdrop-blur-xl border border-white/20 text-slate-800'
                                            }`}>
                                            <p className="text-sm leading-relaxed">{message.message}</p>
                                            <div className={`flex items-center justify-end mt-2 space-x-1 ${message.sender === 'customer' ? 'text-white/70' : 'text-slate-500'
                                                }`}>
                                                <FiClock className="w-3 h-3" />
                                                <span className="text-xs">{formatTime(message.timestamp)}</span>
                                                {message.sender === 'customer' && (
                                                    <div className="text-xs ml-1">
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
                                </div>
                            ))
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-xl">
                        <div className="flex items-end space-x-3">
                            <div className="flex-1">
                                <textarea
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Type your message..."
                                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                                    rows="1"
                                    style={{ minHeight: '44px', maxHeight: '120px' }}
                                    disabled={sending}
                                />
                            </div>
                            <button
                                onClick={sendMessage}
                                disabled={!newMessage.trim() || sending}
                                className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                            >
                                {sending ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <FiSend className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatDetail;