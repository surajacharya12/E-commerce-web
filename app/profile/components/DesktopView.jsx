"use client";

import React from "react";
import { FiCalendar } from "react-icons/fi";
import ProfilePhoto from "./ProfilePhoto";
import ProfileForm from "./ProfileForm";
import ActionButtons from "./ActionButtons";
import DangerZone from "./DangerZone";

const DesktopView = ({
    user,
    editedUser,
    isEditing,
    actions
}) => {
    return (
        <div className="hidden md:block min-h-screen">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200 px-8 py-6">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-bold text-gray-900">My Profile</h1>
                    <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Left Column - Profile Photo & Basic Info */}
                    <div className="lg:col-span-1">
                        <div className="bg-white/90 rounded-3xl shadow-xl p-8 backdrop-blur-xl border border-gray-200 sticky top-8">
                            <div className="flex flex-col items-center mb-8">
                                <ProfilePhoto
                                    user={user}
                                    onPhotoUpload={actions.handlePhotoUpload}
                                    onPhotoDelete={actions.handleDeletePhoto}
                                    size="large"
                                />

                                <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">{user.name}</h2>
                                <p className="text-gray-600 text-lg mb-4 text-center">{user.email}</p>
                            </div>

                            {/* Quick Stats */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <FiCalendar className="text-blue-500 w-6 h-6" />
                                        <span className="font-semibold text-gray-700">Member Since</span>
                                    </div>
                                    <span className="text-gray-900 font-medium">{user.joinDate}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Detailed Information */}
                    <div className="lg:col-span-2">
                        <div className="bg-white/90 rounded-3xl shadow-xl backdrop-blur-xl border border-gray-200">

                            <ActionButtons
                                isEditing={isEditing}
                                onEdit={actions.handleEdit}
                                onSave={actions.handleSave}
                                onCancel={actions.handleCancel}
                                variant="desktop"
                            />

                            {/* Form Content */}
                            <div className="p-8 space-y-8">
                                <ProfileForm
                                    user={user}
                                    editedUser={editedUser}
                                    isEditing={isEditing}
                                    onInputChange={actions.handleInputChange}
                                    variant="desktop"
                                />

                                {/* Danger Zone */}
                                {!isEditing && (
                                    <DangerZone onDelete={actions.handleDeleteProfile} />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DesktopView;