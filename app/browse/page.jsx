"use client";
import React from "react";
import Image from "next/image";
import { FiShoppingCart} from "react-icons/fi";
import { Zap } from 'lucide-react';
const Browse = () => {
return (
    <div className="px-4 md:px-6 lg:px-8 py-8 max-w-screen-xl mx-auto">

     {/* Hero Section */}
      <div className="mt-10">
        <section
          className="w-full bg-cover bg-center rounded-2xl shadow-md p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center ml-8 md:ml-20"
          style={{ backgroundImage: "url('/assets/hero.png')" }}
          aria-label="Hero promotional banner"
        >

           {/* Left Content */}
          <div className="flex-1 space-y-6 z-10 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-indigo-900">
              <h2 className="text-4xl lg:text-5xl font-extrabold leading-tight tracking-tighter">
                Flash Sale
              </h2>
              <Zap className="w-8 h-8 lg:w-10 lg:h-10 text-yellow-500 animate-pulse" aria-hidden="true" />
            </div>
            <p className="text-base lg:text-lg text-gray-700 max-w-lg mx-auto md:mx-0">
         Discover unbeatable deals on our top-rated products. Don't miss out on these limited-time offers to elevate your style and experience premium quality at a fraction of the price.
            </p>
            {/* The button is now a call to action with a gradient */}
            <button
              className="mt-6 px-8 py-3 rounded-full text-white font-semibold shadow-lg transition-all duration-300 ease-in-out bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105"
              aria-label="Shop now for flash sale items"
              type="button"
            >
              <FiShoppingCart className="inline-block mr-2 w-5 h-5" aria-hidden="true" />
              Shop Now
            </button>
          </div>

          {/* Right Image with a modern, layered effect */}
         <div className="flex-1 flex justify-center items-center relative z-10 w-full md:w-auto h-[250px] md:h-[350px]" aria-hidden="true">

            {/* Main Product Image */}
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
            {/* Decorative Star Overlay */}
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

      {/* Your Interviews Section */}
      {/* <MyGivenInterviews />
        <MyCreatedInterviews />
      */}
    </div>
  );
};

export default Browse;