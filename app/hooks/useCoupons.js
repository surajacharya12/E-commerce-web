"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "@/app/api/api";

export const useCoupons = (productIds = []) => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [productDetails, setProductDetails] = useState({});

  // Function to extract product details from coupon data
  const extractProductDetails = (couponsData) => {
    const productMap = {};

    couponsData.forEach((coupon) => {
      // Extract product details from populated coupon data
      if (coupon.applicableProduct && coupon.applicableProduct._id) {
        productMap[coupon.applicableProduct._id] = coupon.applicableProduct;
      }
    });

    setProductDetails(productMap);
  };

  useEffect(() => {
    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      setCoupons([]);
      setProductDetails({});
      return;
    }

    const fetchCoupons = async () => {
      setLoading(true);
      setError(null);

      // Debug logging
      console.log("Fetching coupons for productIds:", productIds);
      console.log("API_URL:", API_URL);

      try {
        // Validate API_URL exists
        if (!API_URL) {
          throw new Error("API URL is not configured");
        }

        const response = await axios.post(
          `${API_URL}/couponCodes/applicable-coupons`,
          {
            productIds: productIds,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
            timeout: 10000, // 10 second timeout
          }
        );

        if (response.data && response.data.success) {
          console.log("Coupon API Response:", response.data.data);
          const couponsData = response.data.data || [];
          setCoupons(couponsData);

          // Extract product details from coupon data
          extractProductDetails(couponsData);
        } else {
          setError(response.data?.message || "No coupons found");
        }
      } catch (err) {
        console.error("Error fetching coupons:", err);

        if (err.code === "ECONNABORTED") {
          setError("Request timeout - please try again");
        } else if (err.response) {
          // Server responded with error status
          setError(
            `Server error: ${err.response.status} - ${
              err.response.data?.message || "Unknown error"
            }`
          );
        } else if (err.request) {
          // Request was made but no response received
          setError("Network error - please check your connection");
        } else {
          // Something else happened
          setError(err.message || "Failed to fetch coupons");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, [productIds]);

  // Get coupons for a specific product
  const getCouponsForProduct = (productId) => {
    return coupons
      .filter((coupon) =>
        coupon.applicableProducts.includes(productId.toString())
      )
      .map((coupon) => {
        // Find the first applicable product that has details
        const applicableProductId = coupon.applicableProducts.find(
          (id) => productDetails[id]
        );
        const productDetail = applicableProductId
          ? productDetails[applicableProductId]
          : null;

        return {
          ...coupon,
          // Add product name information for display
          applicableProductName:
            productDetail?.name || coupon.applicableProduct?.name || null,
          applicableCategoryName:
            productDetail?.category?.name ||
            coupon.applicableCategory?.name ||
            null,
          applicableSubCategoryName:
            productDetail?.subCategory?.name ||
            coupon.applicableSubCategory?.name ||
            null,
          // Add the full product detail for more information
          productDetail: productDetail,
        };
      });
  };

  return {
    coupons,
    loading,
    error,
    getCouponsForProduct,
    productDetails,
  };
};

export default useCoupons;
