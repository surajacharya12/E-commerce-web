"use client";

import React from 'react';

export const ChatSafeIcon = ({ Icon, className = '', children }) => {
    if (Icon) return <Icon className={className} />;
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            xmlns="http://www.w3.org/2000/svg"
        >
            {children}
        </svg>
    );
};

export default ChatSafeIcon;
