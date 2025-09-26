"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./useAuth";
import API_URL from "../api/api";

export const useFavorites = () => {
  const { isLoggedIn, userData } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (isLoggedIn && userData?._id) {
        try {
          const response = await axios.get(`${API_URL}/favorites/user/${userData._id}`);
          if (response.data.success) setFavorites(response.data.data);
        } catch (error) {
          console.error(error);
        } finally { setLoading(false); }
      } else { setFavorites([]); setLoading(false); }
    };
    fetchFavorites();
  }, [isLoggedIn, userData]);

  const toggleFavorite = async (productId) => {
    if (!isLoggedIn || !userData?._id) return;

    const existing = favorites.find(fav => fav.productId._id === productId);
    try {
      if (existing) {
        await axios.delete(`${API_URL}/favorites/${existing._id}`);
        setFavorites(prev => prev.filter(fav => fav.productId._id !== productId));
      } else {
        const response = await axios.post(`${API_URL}/favorites`, { userId: userData._id, productId });
        if (response.data.success) setFavorites(prev => [...prev, response.data.data]);
      }
    } catch (error) { console.error(error); }
  };

  const isFavorite = (productId) => favorites.some(fav => fav.productId._id === productId);

  return { favorites, loading, toggleFavorite, isFavorite };
};
