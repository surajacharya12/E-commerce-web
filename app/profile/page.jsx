"use client";

import React from "react";
import { useAuth } from "../hooks/useAuth";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import MobileView from "./components/MobileView";
import DesktopView from "./components/DesktopView";

// Hooks
import { useProfileData } from "./hooks/useProfileData";
import { useProfileActions } from "./hooks/useProfileActions";
import ContactBanner from "../../components/ContactBanner";

const ProfilePage = () => {
  const { isLoggedIn, userEmail, loading } = useAuth();

  // Custom hooks for data and actions
  const { user, setUser, isEditing, setIsEditing, editedUser, setEditedUser } = useProfileData(isLoggedIn, userEmail, loading);
  const actions = useProfileActions(user, setUser, editedUser, setEditedUser, setIsEditing);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 md:mt-8">
      <MobileView
        user={user}
        editedUser={editedUser}
        isEditing={isEditing}
        actions={actions}
      />

      <DesktopView
        user={user}
        editedUser={editedUser}
        isEditing={isEditing}
        actions={actions}
      />

      {/* Contact Banner */}
      <div className="max-w-6xl mx-auto px-4 pb-8">
        <ContactBanner
          variant="minimal"
          message="Need help with your account?"
          className="shadow-lg"
        />
      </div>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default ProfilePage;