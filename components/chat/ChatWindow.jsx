"use client";

import React from 'react';
import { FiUser, FiX, FiSend, FiMessageCircle, FiCheck, FiCheckDouble } from 'react-icons/fi';
import ChatSafeIcon from './ChatSafeIcon';

const ChatWindow = ({ productName, messages, loading, unreadCount, onClose, newMessage, setNewMessage, onSend, handleKeyPress, messagesEndRef, formatTime }) => {
    return (
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 w-96 h-[520px] flex flex-col transform transition-all duration-300">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                        <ChatSafeIcon Icon={FiUser} className="w-5 h-5">
                            <path d="M20 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M4 21v-2a4 4 0 0 1 3-3.87" />
                            <circle cx="12" cy="7" r="4" />
                        </ChatSafeIcon>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-slate-900">Product Support</h3>
                        <p className="text-xs text-slate-500 truncate max-w-[180px]">{productName}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    {unreadCount > 0 && (
                        <div className="bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-semibold">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </div>
                    )}
                    <button onClick={onClose} className="p-2 rounded-md hover:bg-gray-100" aria-label="Close chat">
                        <ChatSafeIcon Icon={FiX} className="w-4 h-4 text-slate-600">
                            <path d="M18 6 L6 18 M6 6 L18 18" />
                        </ChatSafeIcon>
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
                {loading && messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="text-center text-slate-500 mt-8">
                        <ChatSafeIcon Icon={FiMessageCircle} className="w-14 h-14 mx-auto mb-3 opacity-60 text-indigo-500">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </ChatSafeIcon>
                        <p className="text-sm font-medium">Start a conversation</p>
                        <p className="text-xs mt-1 text-slate-400">Ask us anything about this product</p>
                    </div>
                ) : (
                    messages.map((message, index) => (
                        <div key={index} className={`flex ${message.sender === 'customer' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] p-3 rounded-2xl ${message.sender === 'customer' ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white' : 'bg-slate-100 text-slate-800'}`}>
                                <p className="text-sm">{message.message}</p>
                                <div className={`flex items-center justify-end mt-1 space-x-2 ${message.sender === 'customer' ? 'text-white/70' : 'text-slate-500'}`}>
                                    <span className="text-xs text-[10px]">{formatTime(message.timestamp)}</span>
                                    {message.sender === 'customer' && (
                                        <div className="text-xs">
                                            {message.isRead ? (
                                                <ChatSafeIcon Icon={FiCheckDouble} className="w-3 h-3">
                                                    <path d="M20 6 L9 17l-5-5" />
                                                </ChatSafeIcon>
                                            ) : (
                                                <ChatSafeIcon Icon={FiCheck} className="w-3 h-3">
                                                    <path d="M20 6 L9 17l-5-5" />
                                                </ChatSafeIcon>
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

            <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
                <div className="flex items-center space-x-3">
                    <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={handleKeyPress} placeholder="Type your message..." className="flex-1 px-4 py-2 rounded-lg bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200 text-sm" />
                    <button onClick={onSend} disabled={!newMessage.trim() || loading} className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed" aria-label="Send message">
                        <ChatSafeIcon Icon={FiSend} className="w-4 h-4 text-white">
                            <path d="M22 2L11 13" />
                            <path d="M22 2l-7 20  -4-9-9-4 20-7z" />
                        </ChatSafeIcon>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatWindow;
