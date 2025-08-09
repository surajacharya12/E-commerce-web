"use client";

import React, { useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import ConfirmDialog from "./ConfirmDialog";

const DangerZone = ({ onDelete }) => {
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

    return (
        <>
            <div className="border-t border-gray-200 pt-8">
                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-red-800 mb-3">Danger Zone</h4>
                    <p className="text-red-600 mb-4">
                        Once you delete your profile, there is no going back. Please be certain.
                    </p>
                    <button
                        onClick={handleDeleteClick}
                        className="bg-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-600 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
                    >
                        <FiTrash2 className="w-5 h-5" />
                        Delete Account
                    </button>
                </div>
            </div>

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
        </>
    );
};

export default DangerZone;