"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
// Import only the icons needed for the default fallback or potential use
import { Package } from 'lucide-react'; 
import { FiShoppingCart, FiHeart, FiStar } from "react-icons/fi";
import API_URL from '@/app/api/api';
import { useFavorites } from '@/app/hooks/useFavorites';
import { useAuth } from '@/app/hooks/useAuth';
import axios from 'axios';

// Map category names to a relevant lucide icon. Add more as needed.
const categoryIconMap = {
  'Technologies': 'Laptop', 
  'Fashion': 'Shirt',
  'Furniture': 'Sofa',
  'Sports': 'Dumbbell',
  'Beauty': 'Sparkles',
  'Others': 'Package',
};

const getIconComponent = (categoryName) => {
  const iconName = categoryIconMap[categoryName] || 'Package'; 
  
  const { Laptop, Shirt, Sofa, Dumbbell, Sparkles } = require('lucide-react'); 
  const IconComponents = { Laptop, Shirt, Sofa, Dumbbell, Sparkles, Package };
  return IconComponents[iconName] || Package;
};

const ExploreProduct = () => {
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState(''); 
  const { isLoggedIn } = useAuth();
  const { toggleFavorite, isFavorite } = useFavorites();

  // 1. Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_URL}/products`);
        if (response.data.success) {
          setProducts(response.data.data);
        }
      } catch (error) { 
        console.error("Error fetching products:", error); 
      }
    };
    fetchProducts();
  }, []);

  const categories = useMemo(() => {
   
    const uniqueCategories = [
      ...new Set(products
        .map(p => p.proCategoryId?.name)
        .filter(name => name) 
      )
    ];
    return uniqueCategories;
  }, [products]);

  useEffect(() => {
    if (categories.length > 0 && activeTab === '') {
      setActiveTab(categories[0]);
    }
  }, [categories, activeTab]);

  const currentProducts = useMemo(() => {
    return products.filter(p => p.proCategoryId?.name === activeTab);
  }, [products, activeTab]);

  return (
    <div className="px-4 md:px-6 lg:px-8 py-8 max-w-screen-xl mx-auto mt-0">
      <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">Explore Categories</h2>
      
      {/* Tabs */}
      <div className="mb-8 flex flex-wrap justify-center gap-4">
        {categories.length > 0 ? (
          categories.map(label => {
            const Icon = getIconComponent(label); 
            return (
              <button
                key={label}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold shadow-lg transition-all duration-300 transform hover:scale-105
                ${activeTab === label ? 'bg-blue-600 text-white ring-2 ring-blue-500 hover:bg-blue-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                onClick={() => setActiveTab(label)}
              >
                <Icon className="w-5 h-5" />
                {label}
              </button>
            );
          })
        ) : (
          <p className="text-gray-500">Loading categories...</p>
        )}
      </div>

      <hr className="my-8" />

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {currentProducts.length > 0 ? (
          currentProducts.map(product => (
            <div key={product._id} className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all overflow-hidden border border-gray-100">
              <div className="relative w-full h-64">
                <Image 
                  src={product.images[0]?.url || "/assets/product-placeholder.png"} 
                  alt={product.name} 
                  fill 
                  style={{ objectFit: "cover" }} 
                  className="transition-transform duration-300 group-hover:scale-105" 
                />
                {/* Offer Price Calculation */}
                {product.offerPrice && product.price > product.offerPrice && 
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
                    {Math.round(((product.price - product.offerPrice) / product.price) * 100)}% OFF
                  </div>
                }
                
                {/* Heart Icon (Favorite) */}
                <button 
                  className="absolute top-4 right-4 p-2 bg-white/80 rounded-full hover:bg-white transition-colors z-10" 
                  onClick={() => isLoggedIn && toggleFavorite(product._id)}
                  aria-label={isFavorite(product._id) ? "Remove from favorites" : "Add to favorites"}
                >
                  <FiHeart className={`w-5 h-5 ${isFavorite(product._id) ? "text-red-500 fill-red-500" : "text-gray-600"}`} />
                </button>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">{product.name}</h3>
                <p className="text-gray-600 mb-3 text-sm line-clamp-2">{product.description}</p>
                <div className="flex items-center gap-2 mb-4">
                  <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium text-gray-700 ml-1">{product.rating || 'N/A'}</span>
                  <span className="text-sm text-gray-500">({product.reviews || 0} reviews)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-blue-600">${product.offerPrice ? product.offerPrice.toFixed(2) : product.price.toFixed(2)}</span>
                    {product.offerPrice && product.price > product.offerPrice && 
                      <span className="text-lg text-gray-400 line-through">${product.price.toFixed(2)}</span>
                    }
                  </div>
                  <button className="px-4 py-2 rounded-full bg-blue-600 text-white flex items-center gap-2 font-semibold shadow hover:bg-blue-700 transition-all duration-300 transform hover:scale-105">
                    <FiShoppingCart className="w-5 h-5" /> Add
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-xl text-gray-500">No products found in the <span className="font-semibold text-blue-600">{activeTab}</span> category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreProduct;
