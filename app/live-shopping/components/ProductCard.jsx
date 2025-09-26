"use client";
import React from "react";

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <img
        src={product.images?.[0]?.url || "https://via.placeholder.com/200"}
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-sm text-gray-600 line-clamp-2 min-h-[40px]">{product.description}</p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-xl font-bold text-blue-600">${product.offerPrice || product.price}</span>
          {product.offerPrice && (
            <span className="text-sm text-gray-500 line-through ml-2">${product.price}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
