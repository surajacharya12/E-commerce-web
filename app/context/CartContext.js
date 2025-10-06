"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../api/api";
import { useAuth } from "../hooks/useAuth";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({
    items: [],
    totalAmount: 0,
    totalItems: 0,
  });
  const [loading, setLoading] = useState(false);
  const { userData, isLoggedIn } = useAuth();

  // Fetch cart data
  const fetchCart = async () => {
    if (!isLoggedIn || !userData?.id) return;

    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/cart/${userData.id}`);
      if (response.data.success) {
        setCart(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  // Add item to cart
  const addToCart = async (productId, quantity = 1) => {
    if (!isLoggedIn || !userData?.id) {
      throw new Error("Please login to add items to cart");
    }

    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/cart/add`, {
        userId: userData.id,
        productId,
        quantity,
      });

      if (response.data.success) {
        setCart(response.data.data);
        return { success: true, message: "Item added to cart successfully" };
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to add item to cart";
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // Update item quantity
  const updateQuantity = async (productId, quantity) => {
    if (!isLoggedIn || !userData?.id) return;

    try {
      setLoading(true);
      const response = await axios.put(`${API_URL}/cart/update`, {
        userId: userData.id,
        productId,
        quantity,
      });

      if (response.data.success) {
        setCart(response.data.data);
      }
    } catch (error) {
      console.error("Error updating cart:", error);
      throw new Error(error.response?.data?.message || "Failed to update cart");
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId) => {
    if (!isLoggedIn || !userData?.id) return;

    try {
      setLoading(true);
      const response = await axios.delete(`${API_URL}/cart/remove`, {
        data: {
          userId: userData.id,
          productId,
        },
      });

      if (response.data.success) {
        setCart(response.data.data);
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
      throw new Error("Failed to remove item from cart");
    } finally {
      setLoading(false);
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    if (!isLoggedIn || !userData?.id) return;

    try {
      setLoading(true);
      const response = await axios.delete(
        `${API_URL}/cart/clear/${userData.id}`
      );
      if (response.data.success) {
        setCart(response.data.data);
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
    } finally {
      setLoading(false);
    }
  };

  // Check if item is in cart
  const isInCart = (productId) => {
    return cart.items.some((item) => item.productId._id === productId);
  };

  // Get item quantity in cart
  const getItemQuantity = (productId) => {
    const item = cart.items.find((item) => item.productId._id === productId);
    return item ? item.quantity : 0;
  };

  // Fetch cart when user logs in
  useEffect(() => {
    if (isLoggedIn && userData?.id) {
      fetchCart();
    } else {
      setCart({ items: [], totalAmount: 0, totalItems: 0 });
    }
  }, [isLoggedIn, userData?.id]);

  const value = {
    cart,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    isInCart,
    getItemQuantity,
    fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
