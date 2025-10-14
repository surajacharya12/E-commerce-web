"use client";
import React from "react";

const ActiveFiltersBar = ({
  priceRange,
  maxPrice,
  setPriceRange,
  categories,
  subCategories,
  brands,
  colors,                 // Renamed from variantTypes
  sizes,                  // Renamed from variants
  selectedCategories,
  selectedSubCategories,
  selectedBrands,
  selectedColors,         // Renamed from selectedVariantTypes
  selectedSizes,          // Renamed from selectedVariants
  selectedRatings,
  setSelectedCategories,
  setSelectedSubCategories,
  setSelectedBrands,
  setSelectedColors,      // Renamed from setSelectedVariantTypes
  setSelectedSizes,       // Renamed from setSelectedVariants
  setSelectedRatings,
  toggleFilter,
  isAnyFilterActive,
  categoryName,
  subCategoryName,
}) => {
  return (
    <div className="mb-8 min-h-[60px] flex flex-wrap gap-3 items-center bg-gradient-to-r from-slate-50 to-blue-50 border border-indigo-200 p-4 rounded-2xl shadow-lg backdrop-blur-sm">
      <div className="flex items-center space-x-2">
        <div className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1 0 013 12V7a4 4 0 014-4z" />
          </svg>
        </div>
        <span className="text-sm font-bold text-slate-700">Active Filters:</span>
      </div>

      {/* Category from URL */}
      {categoryName && (
        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
          📂 {categoryName}
          <button
            className="ml-1 text-green-600 hover:text-green-900"
            onClick={() => {
              setSelectedCategories([]);
              window.history.pushState({}, '', '/live-shopping');
            }}
          >
            &times;
          </button>
        </span>
      )}

      {/* SubCategory from URL */}
      {subCategoryName && (
        <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
          🏷️ {subCategoryName}
          <button
            className="ml-1 text-purple-600 hover:text-purple-900"
            onClick={() => {
              setSelectedSubCategories([]);
              window.history.pushState({}, '', '/live-shopping');
            }}
          >
            &times;
          </button>
        </span>
      )}

      {priceRange < maxPrice && (
        <span className="bg-gradient-to-r from-blue-400 to-cyan-500 text-white text-sm font-semibold px-4 py-2 rounded-full flex items-center shadow-lg transform hover:scale-105 transition-all duration-300">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
          Max: Rs. {priceRange}
          <button
            className="ml-2 w-5 h-5 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            onClick={() => setPriceRange(maxPrice)}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </span>
      )}

      {selectedRatings.map((rating) => (
        <span
          key={rating}
          className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center"
        >
          {rating} ★ & up
          <button
            className="ml-1 text-yellow-600 hover:text-yellow-900"
            onClick={() => toggleFilter(selectedRatings, setSelectedRatings, rating)}
          >
            &times;
          </button>
        </span>
      ))}

      {selectedCategories.map((id) => {
        const cat = categories.find((c) => c._id === id);
        return (
          cat && !categoryName && ( // Don't show if already showing from URL
            <span
              key={id}
              className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center"
            >
              {cat.name}
              <button
                className="ml-1 text-blue-600 hover:text-blue-900"
                onClick={() => toggleFilter(selectedCategories, setSelectedCategories, id)}
              >
                &times;
              </button>
            </span>
          )
        );
      })}

      {selectedSubCategories.map((id) => {
        const subCat = subCategories.find((c) => c._id === id);
        return (
          subCat && !subCategoryName && ( // Don't show if already showing from URL
            <span
              key={id}
              className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center"
            >
              {subCat.name}
              <button
                className="ml-1 text-indigo-600 hover:text-indigo-900"
                onClick={() => toggleFilter(selectedSubCategories, setSelectedSubCategories, id)}
              >
                &times;
              </button>
            </span>
          )
        );
      })}

      {selectedBrands.map((id) => {
        const brand = brands.find((b) => b._id === id);
        return (
          brand && (
            <span
              key={id}
              className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center"
            >
              {brand.name}
              <button
                className="ml-1 text-blue-600 hover:text-blue-900"
                onClick={() => toggleFilter(selectedBrands, setSelectedBrands, id)}
              >
                &times;
              </button>
            </span>
          )
        );
      })}

      {/* Active Color Filters */}
      {selectedColors && selectedColors.map((id) => {
        const color = (colors || []).find((c) => c._id === id);
        return (
          color && (
            <span
              key={id}
              className="bg-fuchsia-100 text-fuchsia-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center"
            >
              <div
                className="w-3 h-3 rounded-full mr-1"
                style={{ backgroundColor: color.hexCode || '#ccc' }} // Display color swatch
              ></div>
              {color.name}
              <button
                className="ml-1 text-fuchsia-600 hover:text-fuchsia-900"
                onClick={() => toggleFilter(selectedColors, setSelectedColors, id)}
              >
                &times;
              </button>
            </span>
          )
        );
      })}

      {/* Active Size Filters */}
      {selectedSizes && selectedSizes.map((id) => {
        const size = (sizes || []).find((s) => s._id === id);
        return (
          size && (
            <span
              key={id}
              className="bg-rose-100 text-rose-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center"
            >
              {size.name}
              <button
                className="ml-1 text-rose-600 hover:text-rose-900"
                onClick={() => toggleFilter(selectedSizes, setSelectedSizes, id)}
              >
                &times;
              </button>
            </span>
          )
        );
      })}

      {!isAnyFilterActive && <span className="text-sm text-gray-500">None</span>}
    </div>
  );
};

export default ActiveFiltersBar;