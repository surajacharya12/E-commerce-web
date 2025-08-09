"use client";

import React from "react";
import { FiAlertTriangle, FiX } from "react-icons/fi";

const ConfirmDialog = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirm Action",
    message = "Are you sure you want to proceed?",
    confirmText = "Confirm",
    cancelText = "Cancel",
    type = "danger" // "danger" or "warning"
}) => {
    if (!isOpen) return null;

    const typeStyles = {
        danger: {
            bg: "bg-red-50",
            border: "border-red-200",
            icon: "text-red-600",
            confirmBtn: "bg-red-600 hover:bg-red-700",
            title: "text-red-800"
        },
        warning: {
            bg: "bg-yellow-50",
            border: "border-yellow-200",
            icon: "text-yellow-600",
            confirmBtn: "bg-yellow-600 hover:bg-yellow-700",
            title: "text-yellow-800"
        }
    };

    const styles = typeStyles[type];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Dialog */}
            <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
                {/* Header */}
                <div className={`${styles.bg} ${styles.border} border-b px-6 py-4 rounded-t-2xl`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`${styles.icon}`}>
                                <FiAlertTriangle className="w-6 h-6" />
                            </div>
                            <h3 className={`text-lg font-bold ${styles.title}`}>
                                {title}
                            </h3>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-white/50"
                        >
                            <FiX className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="px-6 py-6">
                    <p className="text-gray-700 leading-relaxed mb-6">
                        {message}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={onConfirm}
                            className={`flex-1 ${styles.confirmBtn} text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg transform hover:scale-105`}
                        >
                            {confirmText}
                        </button>
                        <button
                            onClick={onClose}
                            className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-xl font-semibold hover:bg-gray-600 transition-all duration-300 hover:shadow-lg transform hover:scale-105"
                        >
                            {cancelText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;