"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../api/api";
import { useAuth } from "./useAuth";

export const useFavorites = () => {
  const { isLoggedIn, userData } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch user's favorites
  useEffect(() => {
    const fetchFavorites = async () => {
      const userId = userData?._id || userData?.id;
      if (isLoggedIn && userId) {
        try {
          const res = await axios.get(`${API_URL}/favorites/${userId}`);
          if (res.data.success && Array.isArray(res.data.data)) {
            // Filter out any favorites with null or invalid productId
            const validFavorites = res.data.data.filter(
              (f) => f.productId && f.productId._id
            );
            setFavorites(validFavorites);
          } else {
            setFavorites([]);
          }
        } catch (err) {
          console.error("Fetch favorites error:", err);
          setFavorites([]);
        } finally {
          setLoading(false);
        }
      } else {
        setFavorites([]);
        setLoading(false);
      }
    };
    fetchFavorites();
  }, [isLoggedIn, userData]);

  // ✅ Toggle favorite
  const toggleFavorite = async (productId) => {
    const userId = userData?._id || userData?.id;
    if (!isLoggedIn || !userId) return alert("Please log in first.");

    const isFav = favorites.some((f) => f.productId?._id === productId);
    try {
      if (isFav) {
        await axios.delete(`${API_URL}/favorites/${userId}/${productId}`);
        setFavorites(favorites.filter((f) => f.productId?._id !== productId));
      } else {
        await axios.post(`${API_URL}/favorites`, {
          userId: userId,
          productId,
        });
        const res = await axios.get(`${API_URL}/favorites/${userId}`);
        if (res.data.success) {
          setFavorites(res.data.data || []);
        }
      }
    } catch (err) {
      console.error("Toggle favorite error:", err);
    }
  };

  const isFavorite = (productId) =>
    favorites.some((f) => f.productId?._id === productId);

  return { favorites, toggleFavorite, isFavorite, loading };
};
