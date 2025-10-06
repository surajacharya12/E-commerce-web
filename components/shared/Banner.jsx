"use client";
import React, { useState, useEffect } from "react";

const Banner = ({
    title = "Amazing Products",
    subtitle = "Discover premium quality products with unbeatable prices and exceptional customer service.",
    categoryName,
    subCategoryName,
    showSearchBar = false,
    onSearchChange,
    searchTerm = "",
    isSlideshow = false,
    slides = []
}) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Auto-advance slideshow
    useEffect(() => {
        if (isSlideshow && slides.length > 1) {
            const interval = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % slides.length);
            }, 5000); // Change slide every 5 seconds
            return () => clearInterval(interval);
        }
    }, [isSlideshow, slides.length]);

    // Get current slide data or use props
    const currentSlideData = isSlideshow && slides.length > 0 ? slides[currentSlide] : {
        title,
        subtitle,
        categoryName,
        subCategoryName
    };
    const displayTitle = currentSlideData.categoryName || currentSlideData.subCategoryName
        ? `Discover Amazing ${currentSlideData.categoryName || currentSlideData.subCategoryName} Products`
        : currentSlideData.title;

    const badgeText = currentSlideData.categoryName || currentSlideData.subCategoryName
        ? `Exploring ${currentSlideData.categoryName || currentSlideData.subCategoryName} 🔥`
        : "Absolutely hot collections 🔥";

    // Dynamic gradient based on slide or default
    const gradientClass = currentSlideData.gradient || "from-indigo-600 via-purple-600 to-pink-600";

    return (
        <section className={`relative overflow-hidden bg-gradient-to-br ${gradientClass} text-white py-20 px-6 md:px-20 mt-14 w-full transition-all duration-1000 ease-in-out`}>
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-yellow-300/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-300/10 rounded-full blur-2xl animate-bounce"></div>
            </div>

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between max-w-7xl mx-auto">
                <div className="max-w-2xl text-center lg:text-left mb-12 lg:mb-0">
                    <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
                        <p className="text-sm font-semibold tracking-wide">
                            {badgeText}
                        </p>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6 bg-gradient-to-r from-white via-yellow-200 to-pink-200 bg-clip-text text-transparent">
                        {currentSlideData.categoryName || currentSlideData.subCategoryName ? (
                            <>
                                Discover Amazing{" "}
                                <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent animate-pulse">
                                    {currentSlideData.categoryName || currentSlideData.subCategoryName}
                                </span>{" "}
                                Products
                            </>
                        ) : (
                            <>
                                {currentSlideData.title.split(' ').slice(0, -1).join(' ')}{" "}
                                <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                                    {currentSlideData.title.split(' ').slice(-1)}
                                </span>
                            </>
                        )}
                    </h1>

                    <p className="text-xl text-indigo-100 mb-8 leading-relaxed">
                        {currentSlideData.subtitle}
                    </p>

                    {/* Search Bar Integration */}
                    {showSearchBar && (
                        <div className="mb-8">
                            <div className="relative max-w-md mx-auto lg:mx-0">
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchTerm}
                                    onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                                    className="w-full px-6 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-300"
                                />
                                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                    <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button className="group relative px-8 py-4 bg-white text-indigo-600 rounded-2xl font-bold shadow-2xl hover:shadow-white/25 transition-all duration-300 transform hover:scale-105 overflow-hidden">
                            <span className="relative z-10">Shop Now!</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </button>
                        <button className="px-8 py-4 border-2 border-white/30 text-white rounded-2xl font-semibold backdrop-blur-sm hover:bg-white/10 transition-all duration-300 transform hover:scale-105">
                            Learn More
                        </button>
                    </div>
                </div>

                <div className="relative w-full lg:w-auto flex items-center justify-center">
                    {/* Floating Product Cards */}
                    <div className="relative">
                        {/* Main Product */}
                        <div className="relative bg-white/20 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/30 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                            <img
                                src={currentSlideData.image || "/assets/live.png"}
                                alt="Featured Product"
                                className="w-56 md:w-72 transform hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-4 shadow-xl">
                                <div className="flex items-center space-x-2">
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <svg key={i} className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <span className="text-white font-bold text-lg">$330</span>
                                </div>
                            </div>
                        </div>

                        {/* Floating Secondary Product */}
                        <div className="absolute -top-8 -right-8 bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-white/50 transform -rotate-12 hover:rotate-0 transition-all duration-500 hover:scale-110">
                            <img
                                src="/assets/hot.png"
                                alt="Earbuds"
                                className="w-20 md:w-24"
                            />
                            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-green-400 to-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                Hot!
                            </div>
                        </div>

                        {/* Floating Discount Badge */}
                        <div className="absolute -bottom-8 -left-8 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-2xl p-4 shadow-2xl transform rotate-12 hover:rotate-0 transition-transform duration-500">
                            <div className="text-center">
                                <div className="text-2xl font-black">50%</div>
                                <div className="text-xs font-semibold">OFF</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Slideshow Controls */}
            {isSlideshow && slides.length > 1 && (
                <>
                    {/* Navigation Arrows */}
                    <button
                        onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 z-20"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 z-20"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    {/* Slide Indicators */}
                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide
                                    ? 'bg-white scale-125'
                                    : 'bg-white/50 hover:bg-white/75'
                                    }`}
                            />
                        ))}
                    </div>

                    {/* Slide Counter */}
                    <div className="absolute top-6 right-6 bg-black/30 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold z-20">
                        {currentSlide + 1} / {slides.length}
                    </div>
                </>
            )}
        </section>
    );
};

export default Banner;