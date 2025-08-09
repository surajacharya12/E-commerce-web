"use client";

import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication state from localStorage
    const checkAuthState = () => {
      try {
        const loginState = localStorage.getItem("isLoggedIn");
        const email = localStorage.getItem("userEmail");
        const token = localStorage.getItem("authToken");
        const storedUserData = localStorage.getItem("userData");
        
        setIsLoggedIn(loginState === "true" || !!token);
        setUserEmail(email || '');
        
        if (storedUserData) {
          setUserData(JSON.parse(storedUserData));
        }
      } catch (error) {
        console.error("Error checking auth state:", error);
        setIsLoggedIn(false);
        setUserEmail('');
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthState();

    // Listen for storage changes (useful for multiple tabs)
    const handleStorageChange = (e) => {
      if (e.key === "isLoggedIn" || e.key === "userEmail" || e.key === "authToken" || e.key === "userData") {
        checkAuthState();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = (email, token = null, user = null) => {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userEmail", email);
    
    if (token) {
      localStorage.setItem("authToken", token);
    }
    
    if (user) {
      localStorage.setItem("userData", JSON.stringify(user));
      setUserData(user);
    }
    
    setIsLoggedIn(true);
    setUserEmail(email);
  };

  const logout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    setIsLoggedIn(false);
    setUserEmail('');
    setUserData(null);
  };

  const getAuthToken = () => {
    return localStorage.getItem("authToken");
  };

  return {
    isLoggedIn,
    userEmail,
    userData,
    loading,
    login,
    logout,
    getAuthToken
  };
};