"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FiShoppingCart, FiStar, FiHeart } from "react-icons/fi";
import BuyNowButton from "./BuyNowButton";

export default function ProductCard({ product, className = "" }) {
    const displayPrice = product.offerPrice || product.price;
    const hasDiscount = product.offerPrice && product.price > product.offerPrice;
    const discountPercentage = hasDiscount
        ? Math.round(((product.price - product.offerPrice) / product.price) * 100)
        : 0;

    return (
        <div className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden ${className}`}>
            {/* Product Image */}
            <div className="relative">
                <Link href={`/product/${product._id}`}>
                    <div className="aspect-square relative overflow-hidden">
                        {product.images && product.images.length > 0 ? (
                            <Image
                                src={product.images[0].url}
                                alt={product.name}
                                fill
                                className="object-cover hover:scale-110 transition-transform duration-300"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <FiShoppingCart className="w-12 h-12 text-gray-400" />
                            </div>
                        )}
                    </div>
                </Link>

                {/* Discount Badge */}
                {hasDiscount && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        -{discountPercentage}%
                    </div>
                )}

                {/* Wishlist Button */}
                <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                    <FiHeart className="w-4 h-4 text-gray-600 hover:text-red-500" />
                </button>

                {/* Stock Status */}
                {product.stock <= 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold">
                            Out of Stock
                        </span>
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="p-4">
                <Link href={`/product/${product._id}`}>
                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                        {product.name}
                    </h3>
                </Link>

                {/* Rating */}
                {product.rating && (
                    <div className="flex items-center mb-2">
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <FiStar
                                    key={i}
                                    className={`w-4 h-4 ${i < Math.floor(product.rating.averageRating || 0)
                                            ? "text-yellow-400 fill-current"
                                            : "text-gray-300"
                                        }`}
                                />
                            ))}
                        </div>
                        <span className="text-sm text-gray-600 ml-2">
                            ({product.rating.totalReviews || 0})
                        </span>
                    </div>
                )}

                {/* Price */}
                <div className="flex items-center mb-3">
                    <span className="text-xl font-bold text-gray-800">
                        ₹{displayPrice.toLocaleString("en-IN")}
                    </span>
                    {hasDiscount && (
                        <span className="text-sm text-gray-500 line-through ml-2">
                            ₹{product.price.toLocaleString("en-IN")}
                        </span>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                    {/* Add to Cart Button */}
                    <button
                        disabled={product.stock <= 0}
                        className="w-full py-2 px-4 border-2 border-blue-500 text-blue-500 hover:bg-blue-50 font-semibold rounded-lg transition-colors disabled:border-gray-300 disabled:text-gray-400 disabled:hover:bg-transparent"
                    >
                        {product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
                    </button>

                    {/* Buy Now Button */}
                    <BuyNowButton
                        product={product}
                        quantity={1}
                        className="w-full py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors disabled:bg-gray-400"
                        disabled={product.stock <= 0}
                    />
                </div>
            </div>
        </div>
    );
}