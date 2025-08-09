import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Laptop, Shirt, Sofa, Dumbbell, Sparkles, Package, TrendingUp, Zap, Gift } from 'lucide-react';
import { FiShoppingCart, FiHeart, FiStar, FiEye, FiShare2 } from "react-icons/fi";

const ExploreProduct = () => {
  const [activeTab, setActiveTab] = useState('Technologies');
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const tabs = [
    { label: 'Technologies', icon: Laptop },
    { label: 'Fashion', icon: Shirt },
    { label: 'Furniture', icon: Sofa },
    { label: 'Sports', icon: Dumbbell },
    { label: 'Beauty', icon: Sparkles },
    { label: 'Others', icon: Package }
  ];

  const products = {
    Technologies: [
      {
        id: 1,
        name: "MacBook Pro 16\"",
        price: 2499.99,
        originalPrice: 2799.99,
        image: "/assets/product-placeholder.png",
        rating: 4.8,
        reviews: 124,
        description: "Powerful laptop with M2 chip for professionals"
      },
      {
        id: 2,
        name: "iPhone 15 Pro",
        price: 999.99,
        originalPrice: 1099.99,
        image: "/assets/product-placeholder.png",
        rating: 4.9,
        reviews: 89,
        description: "Latest iPhone with titanium design"
      },
      {
        id: 3,
        name: "AirPods Pro",
        price: 249.99,
        originalPrice: 279.99,
        image: "/assets/product-placeholder.png",
        rating: 4.7,
        reviews: 203,
        description: "Wireless earbuds with noise cancellation"
      }
    ],
    Fashion: [
      {
        id: 4,
        name: "Designer Jacket",
        price: 199.99,
        originalPrice: 299.99,
        image: "/assets/product-placeholder.png",
        rating: 4.6,
        reviews: 67,
        description: "Premium leather jacket for all seasons"
      },
      {
        id: 5,
        name: "Running Shoes",
        price: 129.99,
        originalPrice: 159.99,
        image: "/assets/product-placeholder.png",
        rating: 4.5,
        reviews: 156,
        description: "Comfortable athletic shoes for daily wear"
      },
      {
        id: 6,
        name: "Casual T-Shirt",
        price: 29.99,
        originalPrice: 39.99,
        image: "/assets/product-placeholder.png",
        rating: 4.3,
        reviews: 89,
        description: "100% cotton comfortable t-shirt"
      }
    ],
    Furniture: [
      {
        id: 7,
        name: "Modern Sofa",
        price: 899.99,
        originalPrice: 1199.99,
        image: "/assets/product-placeholder.png",
        rating: 4.7,
        reviews: 45,
        description: "3-seater comfortable living room sofa"
      },
      {
        id: 8,
        name: "Office Chair",
        price: 299.99,
        originalPrice: 399.99,
        image: "/assets/product-placeholder.png",
        rating: 4.4,
        reviews: 78,
        description: "Ergonomic chair for home office"
      },
      {
        id: 9,
        name: "Coffee Table",
        price: 199.99,
        originalPrice: 249.99,
        image: "/assets/product-placeholder.png",
        rating: 4.6,
        reviews: 34,
        description: "Modern glass-top coffee table"
      }
    ],
    Sports: [
      {
        id: 10,
        name: "Yoga Mat",
        price: 49.99,
        originalPrice: 69.99,
        image: "/assets/product-placeholder.png",
        rating: 4.5,
        reviews: 112,
        description: "Non-slip premium yoga mat"
      },
      {
        id: 11,
        name: "Dumbbells Set",
        price: 149.99,
        originalPrice: 199.99,
        image: "/assets/product-placeholder.png",
        rating: 4.8,
        reviews: 67,
        description: "Adjustable weight dumbbells"
      },
      {
        id: 12,
        name: "Tennis Racket",
        price: 89.99,
        originalPrice: 119.99,
        image: "/assets/product-placeholder.png",
        rating: 4.4,
        reviews: 23,
        description: "Professional grade tennis racket"
      }
    ],
    Beauty: [
      {
        id: 13,
        name: "Skincare Set",
        price: 79.99,
        originalPrice: 99.99,
        image: "/assets/product-placeholder.png",
        rating: 4.7,
        reviews: 145,
        description: "Complete skincare routine set"
      },
      {
        id: 14,
        name: "Hair Dryer",
        price: 129.99,
        originalPrice: 159.99,
        image: "/assets/product-placeholder.png",
        rating: 4.6,
        reviews: 89,
        description: "Professional ionic hair dryer"
      },
      {
        id: 15,
        name: "Makeup Kit",
        price: 59.99,
        originalPrice: 79.99,
        image: "/assets/product-placeholder.png",
        rating: 4.5,
        reviews: 167,
        description: "Complete makeup essentials kit"
      }
    ],
    Others: [
      {
        id: 16,
        name: "Smart Watch",
        price: 299.99,
        originalPrice: 399.99,
        image: "/assets/product-placeholder.png",
        rating: 4.6,
        reviews: 234,
        description: "Fitness tracking smartwatch"
      },
      {
        id: 17,
        name: "Bluetooth Speaker",
        price: 79.99,
        originalPrice: 99.99,
        image: "/assets/product-placeholder.png",
        rating: 4.4,
        reviews: 156,
        description: "Portable wireless speaker"
      },
      {
        id: 18,
        name: "Travel Backpack",
        price: 89.99,
        originalPrice: 119.99,
        image: "/assets/product-placeholder.png",
        rating: 4.7,
        reviews: 78,
        description: "Durable travel backpack with USB port"
      }
    ]
  };

  const currentProducts = products[activeTab] || [];

  return (
    <>

      <section className="p-6 md:p-12 bg-gray-50 rounded-xl items-center text-center shadow-inner mt-8">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Explore New Products
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-2">
          Discover a wide range of cutting-edge products and fashion trends to suit your unique needs.
        </p>
      </section>

      <div className="px-4 md:px-6 lg:px-8 py-8 max-w-screen-xl mx-auto mt-0">
        {/* Modern Tab Button UI with Icons */}
        <div className="mb-8 flex flex-wrap justify-center gap-4">
          {tabs.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none
              ${activeTab === label
                  ? 'bg-blue-600 text-white ring-2 ring-blue-500 hover:bg-blue-700'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              onClick={() => setActiveTab(label)}
              type="button"
              aria-pressed={activeTab === label}
            >
              {Icon && <Icon className="w-5 h-5" />}
              {label}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentProducts.map((product, index) => (
            <div
              key={product.id}
              className={`group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} hover:scale-105 hover:-rotate-1`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="relative w-full h-64">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  style={{ objectFit: "cover" }}
                  className="transition-transform duration-300 group-hover:scale-105"
                />
                {/* Discount Badge */}
                {product.originalPrice > product.price && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </div>
                )}
                {/* Wishlist Button */}
                <button className="absolute top-4 right-4 p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
                  <FiHeart className="w-5 h-5 text-gray-600 hover:text-red-500" />
                </button>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-3 text-sm">
                  {product.description}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-700 ml-1">{product.rating}</span>
                  </div>
                  <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-blue-600">${product.price}</span>
                    {product.originalPrice > product.price && (
                      <span className="text-lg text-gray-400 line-through">${product.originalPrice}</span>
                    )}
                  </div>
                  <button
                    className="px-4 py-2 rounded-full bg-blue-600 text-white flex items-center gap-2 font-semibold shadow hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
                    type="button"
                    aria-label={`Add ${product.name} to cart`}
                  >
                    <FiShoppingCart className="w-5 h-5" />
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Show more button */}
        <div className="text-center mt-12">
          <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
            Load More Products
          </button>
        </div>
      </div>
    </>
  );
};

export default ExploreProduct;