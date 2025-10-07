"use client";

import React from 'react';
import Image from 'next/image';

const ProductImages = ({ product, selectedImage, setSelectedImage, setIsZoomed }) => {
    return (
        <div className="space-y-4">
            <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/20 overflow-hidden">
                <div
                    className="aspect-square relative cursor-zoom-in group"
                    onClick={() => setIsZoomed(true)}
                >
                    <Image
                        src={product.images?.[selectedImage]?.url || "https://via.placeholder.com/500"}
                        alt={product.name}
                        fill
                        className="object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                    />
                    {product.offerPrice && product.price > product.offerPrice && (
                        <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse z-10">
                            {Math.round(((product.price - product.offerPrice) / product.price) * 100)}% OFF
                        </div>
                    )}

                    {/* Zoom Indicator */}
                    <div className="absolute bottom-4 right-4 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Image Thumbnails */}
            {product.images && product.images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto">
                    {product.images.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedImage(index)}
                            className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${selectedImage === index
                                ? 'border-indigo-500 shadow-lg scale-105'
                                : 'border-slate-200 hover:border-indigo-300'
                                }`}
                        >
                            <Image
                                src={image.url}
                                alt={`${product.name} ${index + 1}`}
                                width={80}
                                height={80}
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductImages;
