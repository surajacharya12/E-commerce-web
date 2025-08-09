"use client";
import React from "react";
import Image from "next/image";
import { FiShoppingCart } from "react-icons/fi";
import { Zap } from "lucide-react";
import ExploreProduct from "./components/exploreProduct";
import { useAuth } from "../hooks/useAuth";
import PromotionalSection from "./components/PromotionalSection";

const Browse = () => {
  const { isLoggedIn, userData } = useAuth();

  return (
    <div className="px-4 md:px-6 lg:px-8 py-8 max-w-screen-xl mx-auto mt-6 space-y-10">
      {/* Welcome Message */}
      {isLoggedIn && userData && (
        <div className="bg-gradient-to-r from-green-400/90 to-emerald-500/90 text-white rounded-2xl shadow-lg p-5 flex items-center gap-4 backdrop-blur-md border border-white/20 animate-fadeIn">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-lg font-bold">
              {userData.name.charAt(0)}
            </div>
          </div>
          {/* Text */}
          <div>
            <p className="text-lg font-semibold leading-tight">
              Welcome back, <span className="font-bold">{userData.name}</span> 🎉
            </p>
            <p className="text-sm opacity-90">
              We’ve missed you! Ready to explore new deals today?
            </p>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="flex justify-center">
        <section
          className="w-full max-w-6xl bg-cover bg-center rounded-3xl shadow-2xl p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-10 items-center backdrop-blur-xl bg-white/60 border border-white/30 hover:shadow-[0_20px_50px_rgba(0,0,0,0.2)] transition-shadow duration-500"
          style={{ backgroundImage: "url('/assets/hero.png')" }}
          aria-label="Hero promotional banner"
        >
          {/* Left Content */}
          <div className="flex-1 space-y-6 z-10 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 text-indigo-900">
              <h2 className="text-4xl lg:text-5xl font-extrabold leading-tight tracking-tighter">
                Flash Sale
              </h2>
              <Zap className="w-9 h-9 lg:w-11 lg:h-11 text-yellow-400 animate-pulse" aria-hidden="true" />
            </div>
            <p className="text-base lg:text-lg text-gray-700 max-w-lg mx-auto md:mx-0">
              Discover unbeatable deals on our top-rated products. Don’t miss
              out on these limited-time offers to elevate your style and enjoy
              premium quality at a fraction of the price.
            </p>
            <button
              className="mt-6 px-8 py-3 rounded-full text-white font-semibold shadow-lg transition-all duration-300 ease-in-out bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105"
              aria-label="Shop now for flash sale items"
              type="button"
            >
              <FiShoppingCart className="inline-block mr-2 w-5 h-5" aria-hidden="true" />
              Shop Now
            </button>
          </div>

          {/* Right Image */}
          <div className="flex-1 flex justify-center items-center relative z-10 w-full md:w-auto h-[250px] md:h-[350px]" aria-hidden="true">
            <div className="relative w-full max-w-[400px] h-full">
              <Image
                src="/assets/product.png"
                alt="AI interview preparation product"
                fill
                style={{ objectFit: "contain" }}
                className="rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
                priority
                loading="eager"
              />
            </div>
            <div className="absolute top-10 right-10 w-24 h-24 lg:w-32 lg:h-32 -z-10 animate-spin-slow">
              <Image
                src="/assets/star.png"
                alt="Star icon overlay"
                fill
                style={{ objectFit: "contain" }}
                loading="lazy"
              />
            </div>
          </div>
        </section>
      </div>

      {/* Explore Products Section */}
      <PromotionalSection />
      <ExploreProduct />
    </div>
  );
};

export default Browse;
