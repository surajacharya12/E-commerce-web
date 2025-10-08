"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import FavoriteButton from "../../../components/FavoriteButton";
import AddToCartButton from "../../../components/AddToCartButton";
import { FiStar } from "react-icons/fi";

const ProductCard = ({ product }) => {
  const router = useRouter();

  const handleCardClick = (e) => {
    // Prevent navigation if clicking on favorite or add-to-cart buttons
    if (e.target.closest(".favorite-toggle-button") || e.target.closest("button")) return;
    router.push(`/product/${product._id}`);
  };

  const discount =
    product.offerPrice && product.price > product.offerPrice
      ? Math.round(((product.price - product.offerPrice) / product.price) * 100)
      : 0;

  return (
    <div
      className="group relative cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg">
        {/* Image Section */}
        <div className="relative w-full h-56 sm:h-64 md:h-72">
          <Image
            src={product.images?.[0]?.url || "/assets/product-placeholder.png"}
            alt={product.name}
            fill
            style={{ objectFit: "cover" }}
            className="rounded-t-2xl transition-transform duration-300 group-hover:scale-105"
          />

          {/* Discount Badge */}
          {discount > 0 && (
            <div className="absolute top-3 left-3 bg-red-500 text-white text-xs sm:text-sm font-semibold px-2 py-1 rounded-md shadow-md">
              {discount}% OFF
            </div>
          )}

          {/* Favorite Button */}
          <div className="absolute top-3 right-3 favorite-toggle-button">
            <div className="w-8 h-8 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm">
              <FavoriteButton productId={product._id} />
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="px-5 py-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1 truncate">
            {product.name}
          </h3>

          <p className="text-gray-500 text-sm line-clamp-2 mb-3">
            {product.description}
          </p>

          {/* Rating & Stock */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center text-sm text-gray-600">
              <FiStar className="text-yellow-400 mr-1" />
              {product.rating?.averageRating?.toFixed(1) || "N/A"}
              <span className="text-gray-400 ml-1">
                ({product.rating?.totalReviews || 0} reviews)
              </span>
            </div>

            <span
              className={`text-xs font-medium px-2 py-1 rounded-full ${
                (product.stock || 0) > 10
                  ? "bg-green-100 text-green-800"
                  : (product.stock || 0) > 0
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {(product.stock || 0) > 0
                ? `${product.stock} left`
                : "Out of stock"}
            </span>
          </div>

          {/* Price & Add Button */}
          <div className="flex items-center justify-between">
            <div className="flex items-end gap-2">
              <span className="text-blue-600 text-xl sm:text-2xl font-bold">
                Rs.{" "}
                {product.offerPrice
                  ? product.offerPrice.toFixed(2)
                  : product.price.toFixed(2)}
              </span>
              {discount > 0 && (
                <span className="text-gray-400 text-sm line-through">
                  Rs. {product.price.toFixed(2)}
                </span>
              )}
            </div>

            <div onClick={(e) => e.stopPropagation()}>
              <AddToCartButton
                product={product}
                size="small"
                variant="gradient"
                className="px-4 py-2"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
