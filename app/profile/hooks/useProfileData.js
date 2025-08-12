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
        // Add timeout to prevent hanging
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
        
        const response = await fetch("http://localhost:3001/users/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);

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
        
        // Check if it's a network error
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          console.warn("Backend server appears to be offline. Using fallback data.");
        }
        
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
        
        // Only show warning if we have some cached data, otherwise show error
        if (fallbackUser.name !== "User" || fallbackUser.email) {
          toast.warning("Using cached profile data. Backend server may be offline.");
        } else {
          toast.error("Unable to load profile data. Please ensure the backend server is running.");
        }
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