"use client";

import React from "react";
import { FiCamera, FiX } from "react-icons/fi";

const ProfilePhoto = ({
    user,
    onPhotoUpload,
    onPhotoDelete,
    size = "large" // "small" for mobile, "large" for desktop
}) => {
    const sizeClasses = {
        small: "w-32 h-32 text-4xl",
        large: "w-40 h-40 text-6xl border-8"
    };

    const buttonSizeClasses = {
        small: "p-2 w-4 h-4",
        large: "p-3 w-6 h-6"
    };

    return (
        <div className="flex flex-col items-center">
            <div className="relative mb-6">
                {user.profilePhoto ? (
                    <img
                        src={user.profilePhoto}
                        alt="Profile"
                        className={`${sizeClasses[size]} rounded-full object-cover border-4 border-white shadow-lg ${size === 'large' ? 'shadow-2xl' : ''}`}
                    />
                ) : (
                    <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-lg ${size === 'large' ? 'shadow-2xl border-8 border-white' : ''}`}>
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                )}

                {/* Upload Photo Button */}
                <label className={`absolute bottom-2 right-2 bg-blue-500 text-white ${buttonSizeClasses[size].split(' ')[0]} rounded-full cursor-pointer hover:bg-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl ${size === 'large' ? 'transform hover:scale-110' : ''}`}>
                    <FiCamera className={buttonSizeClasses[size].split(' ').slice(1).join(' ')} />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={onPhotoUpload}
                        className="hidden"
                    />
                </label>

                {/* Delete Photo Button */}
                {user.profilePhoto && (
                    <button
                        onClick={onPhotoDelete}
                        className={`absolute bottom-2 left-2 bg-red-500 text-white ${buttonSizeClasses[size].split(' ')[0]} rounded-full cursor-pointer hover:bg-red-600 transition-all duration-300 shadow-lg hover:shadow-xl ${size === 'large' ? 'transform hover:scale-110' : ''}`}
                        title="Delete photo"
                    >
                        <FiX className={buttonSizeClasses[size].split(' ').slice(1).join(' ')} />
                    </button>
                )}
            </div>

            <p className="text-sm text-gray-500 text-center px-4">
                Click camera to upload new photo • Max 5MB
            </p>
        </div>
    );
};

export default ProfilePhoto;