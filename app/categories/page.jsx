"use client";
import { useState, useEffect } from "react";
import API_URL from "../api/api";
import HeroSection from "./components/HeroSection";
import AllCategories from "./components/AllCategories";
import TrendingCategories from "./components/TrendingCategories";
import DiscoverProductsCTA from "./components/DiscoverProductsCTA(";

const url = API_URL;

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingSubCategories, setLoadingSubCategories] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${url}/categories`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (data.success) setCategories(data.data);
        else setError(data.message || "Failed to fetch categories.");
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoadingCategories(false);
      }
    };

    const fetchSubCategories = async () => {
      try {
        const response = await fetch(`${url}/subCategories`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (data.success) setSubCategories(data.data.slice(0, 6));
        else setError(data.message || "Failed to fetch subcategories.");
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoadingSubCategories(false);
      }
    };

    fetchCategories();
    fetchSubCategories();
  }, []);

  if (loadingCategories || loadingSubCategories)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500 text-lg">Loading categories and trending items...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500 text-lg">Error: {error}</p>
      </div>
    );

  return (
    <>
      <HeroSection />
      <AllCategories categories={categories} />
      <TrendingCategories subCategories={subCategories} />
      <DiscoverProductsCTA />
    </>
  );
};

export default CategoriesPage;
