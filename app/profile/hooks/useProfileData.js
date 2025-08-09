"use client";

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export const useProfileData = (isLoggedIn, userEmail, loading) => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    profilePhoto: "",
    joinDate: "",
    bio: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      // Don't check auth state while still loading
      if (loading) {
        return;
      }
      
      if (!isLoggedIn || !userEmail) {
        toast.error("Please login to view your profile");
        return;
      }

      try {
        const response = await fetch(`http://localhost:3001/users/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            const currentUser = data.data.find(user => user.email === userEmail);

            if (currentUser) {
              const userData = {
                id: currentUser._id,
                name: currentUser.name || "User",
                email: currentUser.email || userEmail,
                phone: currentUser.phone || "",
                profilePhoto: currentUser.photo || "",
                joinDate: currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
                bio: localStorage.getItem("userBio") || "Welcome to my profile!"
              };
              setUser(userData);
              setEditedUser(userData);
              localStorage.setItem("userId", currentUser._id);
            } else {
              throw new Error("User not found");
            }
          } else {
            throw new Error("Failed to fetch user data");
          }
        } else {
          throw new Error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        const fallbackUser = {
          name: localStorage.getItem("userName") || "User",
          email: userEmail || localStorage.getItem("userEmail") || "",
          phone: localStorage.getItem("userPhone") || "",
          profilePhoto: localStorage.getItem("userProfilePhoto") || "",
          joinDate: localStorage.getItem("userJoinDate") || new Date().toLocaleDateString(),
          bio: localStorage.getItem("userBio") || "Welcome to my profile!"
        };
        setUser(fallbackUser);
        setEditedUser(fallbackUser);
        toast.warning("Using cached profile data. Please check your connection.");
      }
    };

    fetchUserData();
  }, [isLoggedIn, userEmail, loading]);

  return {
    user,
    setUser,
    isEditing,
    setIsEditing,
    editedUser,
    setEditedUser
  };
};