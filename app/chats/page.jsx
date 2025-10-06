"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiMessageCircle, FiClock, FiUser, FiPackage, FiArrowLeft, FiSearch } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import API_URL from '../api/api';
import Image from 'next/image';

const CustomerChats = () => {
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { isLoggedIn, userData } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/signin');
            return;
        }
        fetchChats();
    }, [isLoggedIn, userData]);

    const fetchChats = async () => {
        if (!userData?.id) return;

        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/chats/customer/${userData.id}`);
            const result = await response.json();

            if (result.success) {
                setChats(result.data);
            }
        } catch (error) {
            console.error('Error fetching chats:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInHours = (now - date) / (1000 * 60 * 60);

        if (diffInHours < 1) {
            return 'Just now';
        } else if (diffInHours < 24) {
            return `${Math.floor(diffInHours)}h ago`;
        } else {
            const diffInDays = Math.floor(diffInHours / 24);
            return `${diffInDays}d ago`;
        }
    };

    const getLastMessage = (messages) => {
        if (!messages || messages.length === 0) return 'No messages yet';
        const lastMessage = messages[messages.length - 1];
        return lastMessage.message.length > 50
            ? lastMessage.message.substring(0, 50) + '...'
            : lastMessage.message;
    };

    const filteredChats = chats.filter(chat =>
        chat.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getLastMessage(chat.messages).toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center mt-20">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-xl font-semibold text-slate-600">Loading your chats...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 mt-20">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-xl border-b border-white/20 sticky top-20 z-40">
                <div className="max-w-4xl mx-auto px-4 md:px-6 py-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => router.back()}
                                className="p-2 hover:bg-indigo-100 rounded-xl transition-colors"
                            >
                                <FiArrowLeft className="w-5 h-5 text-slate-600" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-800">My Chats</h1>
                                <p className="text-slate-600">Product inquiries and support</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                                <FiMessageCircle className="w-5 h-5 text-white" />
                            </div>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search chats..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-white/60 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>
                </div>
            </div>

            {/* Chat List */}
            <div className="max-w-4xl mx-auto px-4 md:px-6 py-6">
                {filteredChats.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FiMessageCircle className="w-12 h-12 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-800 mb-2">
                            {searchTerm ? 'No chats found' : 'No chats yet'}
                        </h3>
                        <p className="text-slate-600 mb-6">
                            {searchTerm
                                ? 'Try adjusting your search terms'
                                : 'Start chatting with us about products you\'re interested in'
                            }
                        </p>
                        {!searchTerm && (
                            <button
                                onClick={() => router.push('/browse')}
                                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
                            >
                                Browse Products
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredChats.map((chat) => (
                            <div
                                key={chat._id}
                                onClick={() => router.push(`/chats/${chat._id}`)}
                                className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 cursor-pointer group"
                            >
                                <div className="flex items-start space-x-4">
                                    {/* Product Image */}
                                    <div className="w-16 h-16 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0">
                                        {chat.productId?.images?.[0]?.url ? (
                                            <Image
                                                src={chat.productId.images[0].url}
                                                alt={chat.productName}
                                                width={64}
                                                height={64}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <FiPackage className="w-6 h-6 text-slate-400" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Chat Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className="font-semibold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
                                                {chat.productName}
                                            </h3>
                                            <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                                                {chat.unreadCount?.customer > 0 && (
                                                    <div className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                                        {chat.unreadCount.customer > 9 ? '9+' : chat.unreadCount.customer}
                                                    </div>
                                                )}
                                                <span className="text-sm text-slate-500 flex items-center">
                                                    <FiClock className="w-3 h-3 mr-1" />
                                                    {formatTime(chat.lastActivity)}
                                                </span>
                                            </div>
                                        </div>

                                        <p className="text-slate-600 text-sm mb-2 line-clamp-2">
                                            {getLastMessage(chat.messages)}
                                        </p>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${chat.status === 'active'
                                                    ? 'bg-green-100 text-green-800'
                                                    : chat.status === 'resolved'
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {chat.status.charAt(0).toUpperCase() + chat.status.slice(1)}
                                                </span>
                                                <span className="text-xs text-slate-500">
                                                    {chat.messages?.length || 0} messages
                                                </span>
                                            </div>

                                            {chat.productId?.price && (
                                                <div className="text-sm font-semibold text-indigo-600">
                                                    Rs. {(chat.productId.offerPrice || chat.productId.price).toFixed(2)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerChats;