"use client";
import React, { useState, useEffect } from "react";

const SearchBar = ({
    searchTerm = "",
    onSearchChange,
    placeholder = "Search products...",
    className = ""
}) => {
    const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            if (onSearchChange) {
                onSearchChange(localSearchTerm);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [localSearchTerm, onSearchChange]);

    // Update local state when prop changes
    useEffect(() => {
        setLocalSearchTerm(searchTerm);
    }, [searchTerm]);

    const handleClear = () => {
        setLocalSearchTerm("");
        if (onSearchChange) {
            onSearchChange("");
        }
    };

    return (
        <div className={`relative ${className}`}>
            <div className="relative">
                <input
                    type="text"
                    placeholder={placeholder}
                    value={localSearchTerm}
                    onChange={(e) => setLocalSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 pl-12 pr-10 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-2xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 shadow-lg hover:shadow-xl"
                />

                {/* Search Icon */}
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>

                {/* Clear Button */}
                {localSearchTerm && (
                    <button
                        onClick={handleClear}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-slate-200 hover:bg-slate-300 rounded-full flex items-center justify-center transition-colors duration-200"
                    >
                        <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Search Results Indicator */}
            {localSearchTerm && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-xl p-3 shadow-lg z-10">
                    <div className="flex items-center space-x-2 text-sm text-slate-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <span>Searching for: <strong className="text-indigo-600">"{localSearchTerm}"</strong></span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchBar;