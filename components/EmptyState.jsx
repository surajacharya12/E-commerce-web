"use client";
import React from "react";

const EmptyState = ({
    searchTerm,
    onClearSearch,
    title,
    message,
    showClearButton = true
}) => {
    const defaultTitle = searchTerm ? `No Results for "${searchTerm}"` : "No Products Found";
    const defaultMessage = searchTerm
        ? `We couldn't find any products matching "${searchTerm}". Try searching with different keywords.`
        : "No products found. Try adjusting your search or browse our categories.";

    return (
        <div className="text-center p-8 md:p-12 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 mx-auto max-w-2xl">
            <div className="mb-6">
                {searchTerm ? (
                    <svg className="w-16 h-16 mx-auto text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                ) : (
                    <svg className="w-16 h-16 mx-auto text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                )}
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">
                {title || defaultTitle}
            </h3>
            <p className="text-lg text-slate-600 mb-6">
                {message || defaultMessage}
            </p>
            {showClearButton && onClearSearch && searchTerm && (
                <button
                    onClick={onClearSearch}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                    Clear Search
                </button>
            )}
        </div>
    );
};

export default EmptyState;