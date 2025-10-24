import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FiStar } from "react-icons/fi";
import API_URL from "@/app/api/api";
import axios from "axios";
import { toast } from "react-toastify";
// Removed ProductModal - now using unified product detail page
import FavoriteButton from "../../../components/FavoriteButton";
import AddToCartButton from "../../../components/AddToCartButton";
import CouponBadge from "../../../components/CouponBadge";
import { displayPrice } from "../../utils/currency";
import { useCoupons } from "../../hooks/useCoupons";

const ExploreProduct = () => {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("");

  // Get product IDs for coupon fetching
  const productIds = useMemo(() => products.map(p => p._id), [products]);
  const { getCouponsForProduct } = useCoupons(productIds);

  // Removed selectedProduct state - now using unified product detail page

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_URL}/products`);
        if (response.data.success) {
          setProducts(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const categories = useMemo(() => {
    return [
      ...new Set(
        products
          .map((p) => p.proCategoryId?.name)
          .filter((name) => name)
      ),
    ];
  }, [products]);

  useEffect(() => {
    if (categories.length > 0 && activeTab === "") {
      setActiveTab(categories[0]);
    }
  }, [categories, activeTab]);

  const currentProducts = useMemo(() => {
    return products.filter(
      (p) => p.proCategoryId?.name === activeTab
    );
  }, [products, activeTab]);

  // Handle card click - navigate to product detail page
  const handleCardClick = (product, e) => {
    // Use closest() to check if the target or any of its ancestors has the class
    if (e.target.closest('.favorite-toggle-button') || e.target.closest('button')) {
      return; // If the click is on the favorite button or any button, stop here
    }
    router.push(`/product/${product._id}`); // Navigate to product detail page
  };



  // Removed handleCloseDetail - now using unified product detail page

  return (
    <div className="px-4 md:px-6 lg:px-8 py-8 max-w-screen-xl mx-auto mt-0">
      <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
        Explore Categories
      </h2>

      {/* Tabs */}
      <div className="mb-8 flex flex-wrap justify-center gap-4">
        {categories.length > 0 ? (
          categories.map((label) => (
            <button
              key={label}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 ${activeTab === label
                ? "bg-blue-600 text-white ring-2 ring-blue-500 hover:bg-blue-700"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              onClick={() => setActiveTab(label)}
            >
              {label}
            </button>
          ))
        ) : (
          <p className="text-gray-500">Loading categories...</p>
        )}
      </div>

      <hr className="my-8" />

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {currentProducts.length > 0 ? (
          currentProducts.map((product) => (
            <div
              key={product._id}
              className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all overflow-hidden border border-gray-100 cursor-pointer"
              // 🔥 FIX: Pass event object to handleCardClick
              onClick={(e) => handleCardClick(product, e)} // open detail
            >
              <div className="relative w-full h-64">
                <Image
                  src={
                    product.images[0]?.url ||
                    "/assets/product-placeholder.png"
                  }
                  alt={product.name}
                  fill
                  style={{ objectFit: "cover" }}
                  className="transition-transform duration-300 group-hover:scale-105"
                />
                {product.offerPrice &&
                  product.price > product.offerPrice && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
                      {Math.round(
                        ((product.price - product.offerPrice) /
                          product.price) *
                        100
                      )}
                      % OFF
                    </div>
                  )}

                {/* Coupon Badge */}
                {(() => {
                  const productCoupons = getCouponsForProduct(product._id);
                  return productCoupons.length > 0 && (
                    <div className="absolute bottom-4 left-4">
                      <CouponBadge coupon={productCoupons[0]} size="small" />
                    </div>
                  );
                })()}

                {/* 🔥 FIX: Added 'favorite-toggle-button' class */}
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
                {/* Coupon Information */}
                {(() => {
                  const productCoupons = getCouponsForProduct(product._id);
                  return productCoupons.length > 0 && (
                    <div className="mb-3 p-2 bg-green-50 border border-green-200 rounded-lg">
                      <div className="text-xs text-green-700 font-medium mb-1">
                        🎉 {productCoupons.length} coupon{productCoupons.length > 1 ? 's' : ''} available!
                      </div>
                      <div className="text-xs text-green-600">
                        Use code: <span className="font-mono font-bold">{productCoupons[0].couponCode}</span>
                        {productCoupons.length > 1 && <span> +{productCoupons.length - 1} more</span>}
                      </div>
                    </div>
                  );
                })()}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-blue-600">
                      {displayPrice(product.offerPrice || product.price)}
                    </span>
                    {product.offerPrice &&
                      product.price > product.offerPrice && (
                        <span className="text-lg text-gray-400 line-through">
                          {displayPrice(product.price)}
                        </span>
                      )}
                  </div>
                  <AddToCartButton
                    product={product}
                    size="medium"
                    variant="primary"
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-xl text-gray-500">
              No products found in the{" "}
              <span className="font-semibold text-blue-600">
                {activeTab}
              </span>{" "}
              category.
            </p>
          </div>
        )}
      </div>

      {/* Removed Product Detail Overlay - now using unified product detail page */}
    </div>
  );
};

export default ExploreProduct;