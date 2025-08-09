"use client";

import React, { useState } from "react";
import { FiEdit3, FiSave, FiX, FiTrash2 } from "react-icons/fi";
import ConfirmDialog from "./ConfirmDialog";

const ActionButtons = ({
    isEditing,
    onEdit,
    onSave,
    onCancel,
    onDelete,
    variant = "mobile" // "mobile" or "desktop"
}) => {
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    const handleDeleteClick = () => {
        setShowConfirmDialog(true);
    };

    const handleConfirmDelete = () => {
        setShowConfirmDialog(false);
        onDelete();
    };

    const handleCancelDelete = () => {
        setShowConfirmDialog(false);
    };

    if (variant === "mobile") {
        return (
            <div className="space-y-3 mt-6">
                <div className="flex gap-3">
                    {isEditing ? (
                        <>
                            <button
                                onClick={onSave}
                                className="flex-1 bg-green-500 text-white py-3 px-4 rounded-xl font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                            >
                                <FiSave className="w-4 h-4" />
                                Save Changes
                            </button>
                            <button
                                onClick={onCancel}
                                className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-xl font-semibold hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
                            >
                                <FiX className="w-4 h-4" />
                                Cancel
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={onEdit}
                            className="w-full bg-blue-500 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                        >
                            <FiEdit3 className="w-4 h-4" />
                            Edit Profile
                        </button>
                    )}
                </div>

                {/* Delete Profile Button */}
                {!isEditing && (
                    <button
                        onClick={handleDeleteClick}
                        className="w-full bg-red-500 text-white py-2 px-4 rounded-xl font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                        <FiTrash2 className="w-4 h-4" />
                        Delete Account
                    </button>
                )}

                {/* Confirmation Dialog */}
                <ConfirmDialog
                    isOpen={showConfirmDialog}
                    onClose={handleCancelDelete}
                    onConfirm={handleConfirmDelete}
                    title="Delete Account"
                    message="Are you sure you want to delete your account? This action cannot be undone and you will lose all your data permanently."
                    confirmText="Delete Account"
                    cancelText="Keep Account"
                    type="danger"
                />
            </div>
        );
    }

    // Desktop variant - header buttons
    return (
        <div className="flex items-center justify-between p-8 border-b border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900">Profile Information</h3>
            {!isEditing ? (
                <button
                    onClick={onEdit}
                    className="bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-600 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                    <FiEdit3 className="w-5 h-5" />
                    Edit Profile
                </button>
            ) : (
                <div className="flex gap-3">
                    <button
                        onClick={onSave}
                        className="bg-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-600 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
                    >
                        <FiSave className="w-5 h-5" />
                        Save Changes
                    </button>
                    <button
                        onClick={onCancel}
                        className="bg-gray-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-600 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
                    >
                        <FiX className="w-5 h-5" />
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
};

export default ActionButtons;