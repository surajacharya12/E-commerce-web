"use client";

import React from 'react';
import { FiShoppingCart, FiStar } from 'react-icons/fi';
import ExpandableDescription from '../../../components/ExpandableDescription';

const ProductInfo = ({ product, quantity, setQuantity, handleAddToCart, handleBuyNow, isAddingToCart, isLoggedIn }) => {
    return (
        <div className="space-y-6">
            <div>
                <div className="flex items-center space-x-2 mb-2">
                    {product.proCategoryId && (
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm font-medium rounded-full">
                            {product.proCategoryId.name}
                        </span>
                    )}
                    {product.proSubCategoryId && (
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded-full">
                            {product.proSubCategoryId.name}
                        </span>
                    )}
                </div>

                <h1 className="text-3xl md:text-4xl font-black text-slate-800 mb-4 leading-tight">
                    {product.name}
                </h1>

                {/* Rating */}
                {product.rating && (
                    <div className="flex items-center space-x-2 mb-4">
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <FiStar
                                    key={i}
                                    className={`w-5 h-5 ${i < Math.floor(product.rating.averageRating || 0)
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-slate-300'
                                        }`}
                                />
                            ))}
                        </div>
                        <span className="text-slate-600 font-medium">({(product.rating.averageRating || 0).toFixed(1)})</span>
                        <span className="text-slate-500">• {product.rating.totalReviews || 0} reviews</span>
                    </div>
                )}

                {/* Stock Status */}
                <div className="mb-4">
                    <div className="flex items-center space-x-2">
                        <span className="text-lg font-semibold text-slate-800">Stock:</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${(product.stock || 0) > 10
                            ? 'bg-green-100 text-green-800'
                            : (product.stock || 0) > 0
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                            {(product.stock || 0) > 0
                                ? `${product.stock} units available`
                                : 'Out of stock'
                            }
                        </span>
                    </div>
                </div>

                {/* Price */}
                <div className="flex items-center space-x-4 mb-6">
                    <span className="text-4xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        Rs. {(product.offerPrice || product.price).toFixed(2)}
                    </span>
                    {product.offerPrice && product.price > product.offerPrice && (
                        <span className="text-xl text-slate-400 line-through">
                            Rs. {product.price.toFixed(2)}
                        </span>
                    )}
                </div>
            </div>

            <ExpandableDescription description={product.description} />

            {/* Quantity and Actions */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
                <div className="flex items-center space-x-4 mb-6">
                    <span className="text-lg font-semibold text-slate-800">Quantity:</span>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-10 h-10 bg-slate-200 hover:bg-slate-300 rounded-xl flex items-center justify-center transition-colors"
                        >
                            -
                        </button>
                        <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                        <button
                            onClick={() => setQuantity(Math.min(product.stock || 0, quantity + 1))}
                            disabled={(product.stock || 0) <= quantity}
                            className="w-10 h-10 bg-slate-200 hover:bg-slate-300 disabled:bg-slate-100 disabled:text-slate-400 rounded-xl flex items-center justify-center transition-colors"
                        >
                            +
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                        onClick={handleAddToCart}
                        disabled={(product.stock || 0) === 0 || isAddingToCart}
                        className="flex items-center justify-center space-x-2 px-6 py-4 bg-white border-2 border-indigo-500 text-indigo-600 hover:bg-indigo-50 font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-400 disabled:hover:scale-100"
                    >
                        {isAddingToCart ? (
                            <>
                                <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                                <span>Adding...</span>
                            </>
                        ) : (product.stock || 0) === 0 ? (
                            <>
                                <FiShoppingCart className="w-5 h-5" />
                                <span>Out of Stock</span>
                            </>
                        ) : (
                            <>
                                <FiShoppingCart className="w-5 h-5" />
                                <span>Add</span>
                            </>
                        )}
                    </button>

                    <button
                        onClick={handleBuyNow}
                        disabled={(product.stock || 0) === 0}
                        className="flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-2xl hover:shadow-xl disabled:bg-gray-400 disabled:from-gray-400 disabled:to-gray-400 transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100"
                    >
                        <span>{(product.stock || 0) === 0 ? 'Out of Stock' : 'Buy Now'}</span>
                    </button>
                </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <svg className="w-6 h-6 text-green-500" viewBox="0 0 24 24" fill="none">
                        <path d="M3 3h18v18H3z" />
                    </svg>
                    <div>
                        <p className="font-semibold text-slate-800">Free Shipping</p>
                        <p className="text-sm text-slate-600">On orders over Rs. 6,650</p>
                    </div>
                </div>

                <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <svg className="w-6 h-6 text-blue-500" viewBox="0 0 24 24" fill="none">
                        <path d="M3 3h18v18H3z" />
                    </svg>
                    <div>
                        <p className="font-semibold text-slate-800">Warranty</p>
                        <p className="text-sm text-slate-600">1 year guarantee</p>
                    </div>
                </div>

                <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <svg className="w-6 h-6 text-orange-500" viewBox="0 0 24 24" fill="none">
                        <path d="M3 3h18v18H3z" />
                    </svg>
                    <div>
                        <p className="font-semibold text-slate-800">Returns</p>
                        <p className="text-sm text-slate-600">30-day policy</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductInfo;
