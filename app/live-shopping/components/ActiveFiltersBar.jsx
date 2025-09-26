"use client";
import React from "react";

const ActiveFiltersBar = ({
  priceRange,
  maxPrice,
  setPriceRange,
  categories,
  brands,
  selectedCategories,
  selectedBrands,
  selectedRatings,
  setSelectedRatings,
  toggleFilter,
  isAnyFilterActive,
}) => {
  return (
    <div className="mb-6 min-h-[40px] flex flex-wrap gap-2 items-center border border-gray-200 p-2 rounded-lg">
      <span className="text-sm font-semibold text-gray-700">Active:</span>

      {priceRange < maxPrice && (
        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
          Price: ${priceRange}
          <button
            className="ml-1 text-blue-600 hover:text-blue-900"
            onClick={() => setPriceRange(maxPrice)}
          >
            &times;
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
          cat && (
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

      {!isAnyFilterActive && <span className="text-sm text-gray-500">None</span>}
    </div>
  );
};

export default ActiveFiltersBar;
