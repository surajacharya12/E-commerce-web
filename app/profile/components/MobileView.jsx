"use client";

import React from "react";
import ProfilePhoto from "./ProfilePhoto";
import ProfileForm from "./ProfileForm";
import ActionButtons from "./ActionButtons";

const MobileView = ({
    user,
    editedUser,
    isEditing,
    actions
}) => {
    return (
        <div className="md:hidden min-h-screen flex flex-col items-center justify-center py-10 px-4 mt-0">
            <div className="w-full max-w-md bg-white/90 rounded-2xl shadow-2xl p-8 backdrop-blur-xl border border-gray-200">
                <div className="flex flex-col items-center mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{user.name}</h2>
                    <p className="text-gray-500 text-lg">{user.email}</p>
                </div>

                <div className="space-y-6">
                    <ProfilePhoto
                        user={user}
                        onPhotoUpload={actions.handlePhotoUpload}
                        onPhotoDelete={actions.handleDeletePhoto}
                        size="small"
                    />

                    <ProfileForm
                        user={user}
                        editedUser={editedUser}
                        isEditing={isEditing}
                        onInputChange={actions.handleInputChange}
                        variant="mobile"
                    />

                    <ActionButtons
                        isEditing={isEditing}
                        onEdit={actions.handleEdit}
                        onSave={actions.handleSave}
                        onCancel={actions.handleCancel}
                        onDelete={actions.handleDeleteProfile}
                        variant="mobile"
                    />
                </div>
            </div>
        </div>
    );
};

export default MobileView;