// src/context/AuthContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. Create the Context
const AuthContext = createContext(null);

// Custom hook to use the context
export const useAuth = () => useContext(AuthContext);

// 2. The Provider Component
export const AuthProvider = ({ children }) => {
  // Check localStorage on initial load to persist login across page refreshes
  const [user, setUser] = useState(null); 

  useEffect(() => {
    // Check if a token exists in storage when the app loads
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      // Re-hydrate the state if a token is found
      setUser(JSON.parse(storedUser)); 
    }
  }, []);

  // 3. Login and Logout Handlers
  const login = (userData, token) => {
    // Store user data and token securely (e.g., in localStorage for simplicity)
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
  };
  
  const isLoggedIn = !!user;

  // 4. Expose the state and functions
  const value = {
    user,
    isLoggedIn,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};