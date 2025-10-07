"use client";
import React from "react";
import ExploreProduct from "./components/exploreProduct";
import { useAuth } from "../hooks/useAuth";
import PromotionalSection from "./components/PromotionalSection";
import Banner from "../../components/shared/Banner";
import ContactBanner from "../../components/ContactBanner";


const Browse = () => {
  const { isLoggedIn, userData } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="px-4 md:px-6 lg:px-8 py-8 max-w-screen-xl mx-auto mt-6 space-y-12">
        {/* Modern Welcome Message */}
        {isLoggedIn && userData && (
          <div className="relative overflow-hidden bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 text-white rounded-3xl shadow-2xl p-6 flex items-center gap-6 backdrop-blur-xl border border-white/30">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
              <div className="absolute -bottom-20 -left-20 w-32 h-32 bg-yellow-300/20 rounded-full blur-xl animate-bounce"></div>
            </div>

            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-black border border-white/30 shadow-xl">
                {userData.name.charAt(0)}
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>

            {/* Text */}
            <div className="relative z-10 flex-1">
              <p className="text-2xl font-black leading-tight mb-2">
                Welcome back, <span className="bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">{userData.name}</span> 🎉
              </p>
              <p className="text-emerald-100 font-medium">
                We've missed you! Ready to explore amazing deals today?
              </p>
            </div>

            {/* Action Button */}
            <div className="relative">
              <button className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white font-bold rounded-2xl border border-white/30 hover:bg-white/30 transition-all duration-300 transform hover:scale-105 shadow-xl">
                Start Shopping
              </button>
            </div>
          </div>
        )}

        {/* Modern Hero Section with Slideshow */}
        <div className="relative overflow-hidden -mt-6 -mx-4 md:-mx-6 lg:-mx-8">
          <Banner
            isSlideshow={true}
            slides={[
              {
                title: "Flash Sale Extravaganza",
                subtitle: "Discover unbeatable deals on our top-rated products. Don't miss out on these limited-time offers to elevate your style and enjoy premium quality at incredible prices.",
                gradient: "from-indigo-600 via-purple-600 to-pink-600",
                image: "/assets/live.png"
              },
              {
                title: "New Arrivals Collection",
                subtitle: "Explore the latest trends and cutting-edge technology. Be the first to experience innovation with our newest product lineup featuring premium quality and modern design.",
                gradient: "from-emerald-500 via-teal-600 to-cyan-600",
                image: "/assets/yoyo.png"
              },
              {
                title: "Premium Electronics Hub",
                subtitle: "Transform your digital lifestyle with our curated selection of high-performance electronics. From smartphones to smart home devices, find everything you need.",
                gradient: "from-orange-500 via-red-600 to-pink-600",
                image: "/assets/live.png"
              },
              {
                title: "Fashion Forward Trends",
                subtitle: "Step into style with our exclusive fashion collection. Discover timeless pieces and contemporary designs that express your unique personality and confidence.",
                gradient: "from-violet-600 via-purple-600 to-fuchsia-600",
                image: "/assets/fashionfashion.png"
              }
            ]}
          />
        </div>

        {/* Explore Products Section */}
        <PromotionalSection />
        <ExploreProduct />

        {/* Contact Banner */}
        <ContactBanner
          message="Questions about our products?"
          showHours={true}
          className="shadow-xl"
        />
      </div>
    </div>
  );
};

export default Browse;