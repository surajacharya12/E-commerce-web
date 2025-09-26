"use client";
import React from "react";

const Banner = () => {
  return (
    <section className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-16 px-6 md:px-20 flex flex-col md:flex-row items-center justify-between mt-14">
      <div className="max-w-xl text-center md:text-left mb-8 md:mb-0">
        <p className="text-sm uppercase tracking-wide mb-2">
          Absolutely hot collections 🔥
        </p>
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
          The Best Place To Find And Buy Amazing{" "}
          <span className="text-yellow-300">Product</span>
        </h1>
        <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold shadow-lg hover:bg-gray-100 transition-colors">
          Shop now!
        </button>
      </div>
      <div className="relative w-full md:w-auto flex items-center justify-center">
        <div className="absolute inset-0 bg-blue-700 opacity-30 rounded-full transform scale-125"></div>
        <div className="flex flex-col items-center z-10">
          <img
            src="/assets/live.png"
            alt="Headphones"
            className="w-48 md:w-64 transform -rotate-12 translate-x-4"
          />
          <div className="flex items-center mt-4">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-5 h-5 ${i < 4 ? "text-yellow-400" : "text-gray-300"}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c..."></path>
              </svg>
            ))}
            <span className="ml-2 text-lg font-semibold">$330</span>
          </div>
        </div>
        <img
          src="https://res.cloudinary.com/dvfztwzcd/image/upload/v1709198651/online_store/products/airbuds_plvjzn.png"
          alt="Earbuds"
          className="absolute top-1/2 left-3/4 transform -translate-x-1/2 -translate-y-1/2 w-28 md:w-36 bg-white p-2 rounded-lg shadow-lg"
        />
      </div>
    </section>
  );
};

export default Banner;
