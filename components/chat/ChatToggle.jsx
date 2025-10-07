"use client";

import React from 'react';
import { FiMessageCircle } from 'react-icons/fi';
import ChatSafeIcon from './ChatSafeIcon';

const ChatToggle = ({ onOpen, unreadCount }) => {
    return (
        <button
            onClick={onOpen}
            className="mb-3 p-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-transform transform hover:scale-105 flex items-center justify-center"
            aria-label="Open chat"
        >
            <ChatSafeIcon Icon={FiMessageCircle} className="w-6 h-6">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </ChatSafeIcon>
            {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                </span>
            )}
        </button>
    );
};

export default ChatToggle;
