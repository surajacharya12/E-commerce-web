"use client";

import React, { useState, useEffect, useRef } from 'react';
import { FiMessageCircle, FiSend, FiX, FiUser, FiClock, FiCheck, FiCheckCheck } from 'react-icons/fi';
import ChatToggle from './chat/ChatToggle';
import ChatWindow from './chat/ChatWindow';
import { useAuth } from '../app/hooks/useAuth';
import API_URL from '../app/api/api';
import { toast } from 'react-toastify';

const ProductChat = ({ productId, productName, externalOpen = null, onExternalClose = null }) => {
    // Helper to render an icon from react-icons safely.
    // If the imported icon is undefined (e.g. missing export), render a tiny inline SVG fallback so UI doesn't break.
    const SafeIcon = ({ Icon, className = '', children }) => {
        if (Icon) return <Icon className={className} />;
        // Generic fallback SVG uses currentColor so Tailwind color classes still apply.
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
        // If the chat is open (either internally or via external control), initialize
        const currentlyOpen = isOpen || !!externalOpen;
        if (isLoggedIn && userData && productId && currentlyOpen) {
            initializeChat();
        }
    }, [isLoggedIn, userData, productId, isOpen, externalOpen]);

    // Sync external open state (if provided) to local isOpen
    useEffect(() => {
        if (externalOpen === null) return;
        if (externalOpen) {
            setIsOpen(true);
        } else {
            setIsOpen(false);
            if (typeof onExternalClose === 'function') onExternalClose();
        }
    }, [externalOpen]);

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

    // When controlled externally (externalOpen !== null) we respect that control
    // Otherwise we render a floating toggle button so users can open the chat.

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {externalOpen === null && !isOpen && (
                <ChatToggle onOpen={() => setIsOpen(true)} unreadCount={unreadCount} />
            )}

            {(isOpen || externalOpen) && (
                <ChatWindow
                    productName={productName}
                    messages={messages}
                    loading={loading}
                    unreadCount={unreadCount}
                    onClose={() => { setIsOpen(false); if (typeof onExternalClose === 'function') onExternalClose(); }}
                    newMessage={newMessage}
                    setNewMessage={setNewMessage}
                    onSend={sendMessage}
                    handleKeyPress={handleKeyPress}
                    messagesEndRef={messagesEndRef}
                    formatTime={formatTime}
                />
            )}
        </div>
    );
};

export default ProductChat;