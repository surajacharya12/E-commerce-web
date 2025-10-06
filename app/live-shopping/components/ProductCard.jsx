"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import FavoriteButton from "../../../components/FavoriteButton";
import { FiShoppingCart, FiStar } from "react-icons/fi";

const ProductCard = ({ product }) => {
  const router = useRouter();

  const handleCardClick = (e) => {
    // Prevent navigation if clicking on favorite button or add to cart button
    if (e.target.closest('.favorite-toggle-button') || e.target.closest('button')) {
      return;
    }
    router.push(`/product/${product._id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    // Add to cart logic here
    console.log('Added to cart:', product.name);
  };

  return (
    <div
      className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all overflow-hidden border border-gray-100 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative w-full h-64">
        <Image
          src={product.images?.[0]?.url || "/assets/product-placeholder.png"}
          alt={product.name}
          fill
          style={{ objectFit: "cover" }}
          className="transition-transform duration-300 group-hover:scale-105"
        />

        {/* Discount Badge */}
        {product.offerPrice && product.price > product.offerPrice && (
          <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
            {Math.round(((product.price - product.offerPrice) / product.price) * 100)}% OFF
          </div>
        )}

        {/* Favorite Button */}
        <div className="absolute top-4 right-4 favorite-toggle-button">
          <FavoriteButton productId={product._id} />
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">
          {product.name}
        </h3>
        <p className="text-gray-600 mb-3 text-sm line-clamp-2">
          {product.description}
        </p>

        {/* Rating and Stock */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium text-gray-700 ml-1">
              {product.rating?.averageRating?.toFixed(1) || "N/A"}
            </span>
            <span className="text-sm text-gray-500">
              ({product.rating?.totalReviews || 0} reviews)
            </span>
          </div>

          {/* Stock Status */}
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${(product.stock || 0) > 10
            ? 'bg-green-100 text-green-800'
            : (product.stock || 0) > 0
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
            }`}>
            {(product.stock || 0) > 0 ? `${product.stock} left` : 'Out of stock'}
          </span>
        </div>

        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-blue-600">
              ${product.offerPrice ? product.offerPrice.toFixed(2) : product.price.toFixed(2)}
            </span>
            {product.offerPrice && product.price > product.offerPrice && (
              <span className="text-lg text-gray-400 line-through">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={(product.stock || 0) === 0}
            className="px-4 py-2 rounded-full bg-blue-600 text-white flex items-center gap-2 font-semibold shadow hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100"
          >
            <FiShoppingCart className="w-5 h-5" />
            {(product.stock || 0) === 0 ? 'Out of Stock' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
