"use client";
import { useState, useEffect } from "react";

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthState = () => {
      try {
        const loginState = localStorage.getItem("isLoggedIn");
        const email = localStorage.getItem("userEmail");
        const token = localStorage.getItem("authToken");
        const storedUserData = localStorage.getItem("userData");

        // Debug log for development
        if (process.env.NODE_ENV === "development") {
          console.log("Auth state check:", {
            loginState,
            email,
            token,
            storedUserData,
          });
        }

        setIsLoggedIn(loginState === "true" || !!token);
        setUserEmail(email || "");
        if (storedUserData) {
          try {
            setUserData(JSON.parse(storedUserData));
          } catch (parseError) {
            console.error("Error parsing userData:", parseError);
            setUserData(null);
          }
        } else {
          setUserData(null);
        }
      } catch (error) {
        console.error("Auth state check error:", error);
        setIsLoggedIn(false);
        setUserEmail("");
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthState();
    const handleStorageChange = () => checkAuthState();
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const login = (email, token = null, user = null) => {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userEmail", email);
    if (token) localStorage.setItem("authToken", token);
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
    setUserEmail("");
    setUserData(null);
  };

  const getAuthToken = () => localStorage.getItem("authToken");

  return {
    isLoggedIn,
    userEmail,
    userData,
    loading,
    login,
    logout,
    getAuthToken,
  };
};
