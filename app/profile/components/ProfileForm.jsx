"use client";

import React from "react";
import { FiUser, FiMail, FiPhone, FiCalendar } from "react-icons/fi";

const ProfileForm = ({
    user,
    editedUser,
    isEditing,
    onInputChange,
    variant = "mobile" // "mobile" or "desktop"
}) => {
    if (variant === "mobile") {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                        <FiUser className="text-blue-500 w-5 h-5" />
                        <span className="font-semibold text-gray-700">Name:</span>
                    </div>
                    {isEditing ? (
                        <input
                            type="text"
                            value={editedUser.name}
                            onChange={(e) => onInputChange('name', e.target.value)}
                            className="px-3 py-1 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        />
                    ) : (
                        <span className="text-gray-900 font-medium">{user.name}</span>
                    )}
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                        <FiMail className="text-green-500 w-5 h-5" />
                        <span className="font-semibold text-gray-700">Email:</span>
                    </div>
                    <span className="text-gray-900 font-medium">{user.email}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                        <FiPhone className="text-purple-500 w-5 h-5" />
                        <span className="font-semibold text-gray-700">Phone:</span>
                    </div>
                    {isEditing ? (
                        <input
                            type="tel"
                            value={editedUser.phone}
                            onChange={(e) => onInputChange('phone', e.target.value)}
                            className="px-3 py-1 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            placeholder="Enter phone number"
                        />
                    ) : (
                        <span className="text-gray-900 font-medium">{user.phone || "Not provided"}</span>
                    )}
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                        <FiCalendar className="text-pink-500 w-5 h-5" />
                        <span className="font-semibold text-gray-700">Joined:</span>
                    </div>
                    <span className="text-gray-900 font-medium">{user.joinDate}</span>
                </div>
            </div>
        );
    }

    // Desktop variant
    return (
        <div className="space-y-8">
            {/* Personal Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Name Field */}
                <div className="space-y-3">
                    <label className="flex items-center gap-3 text-lg font-semibold text-gray-700">
                        <FiUser className="text-blue-500 w-6 h-6" />
                        Full Name
                    </label>
                    {isEditing ? (
                        <input
                            type="text"
                            value={editedUser.name}
                            onChange={(e) => onInputChange('name', e.target.value)}
                            className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 focus:outline-none transition-all duration-300 text-lg"
                            placeholder="Enter your full name"
                        />
                    ) : (
                        <div className="w-full px-4 py-4 bg-gray-50 rounded-xl text-lg text-gray-900 font-medium">
                            {user.name}
                        </div>
                    )}
                </div>

                {/* Email Field */}
                <div className="space-y-3">
                    <label className="flex items-center gap-3 text-lg font-semibold text-gray-700">
                        <FiMail className="text-green-500 w-6 h-6" />
                        Email Address
                    </label>
                    <div className="w-full px-4 py-4 bg-gray-50 rounded-xl text-lg text-gray-900 font-medium">
                        {user.email}
                    </div>
                    <p className="text-sm text-gray-500">Email cannot be changed</p>
                </div>

                {/* Phone Field */}
                <div className="space-y-3">
                    <label className="flex items-center gap-3 text-lg font-semibold text-gray-700">
                        <FiPhone className="text-purple-500 w-6 h-6" />
                        Phone Number
                    </label>
                    {isEditing ? (
                        <input
                            type="tel"
                            value={editedUser.phone}
                            onChange={(e) => onInputChange('phone', e.target.value)}
                            className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 focus:outline-none transition-all duration-300 text-lg"
                            placeholder="Enter your phone number"
                        />
                    ) : (
                        <div className="w-full px-4 py-4 bg-gray-50 rounded-xl text-lg text-gray-900 font-medium">
                            {user.phone || "Not provided"}
                        </div>
                    )}
                </div>

                {/* Join Date Field */}
                <div className="space-y-3">
                    <label className="flex items-center gap-3 text-lg font-semibold text-gray-700">
                        <FiCalendar className="text-pink-500 w-6 h-6" />
                        Member Since
                    </label>
                    <div className="w-full px-4 py-4 bg-gray-50 rounded-xl text-lg text-gray-900 font-medium">
                        {user.joinDate}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileForm;