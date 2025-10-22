"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-toastify";
import API_URL from "../api/api";

export default function BuyNowButton({
    product,
    quantity = 1,
    selectedColor = null,
    selectedSize = null,
    className = "",
    disabled = false
}) {
    const [loading, setLoading] = useState(false);
    const { user, isLoggedIn } = useAuth();
    const router = useRouter();

    const handleBuyNow = async () => {
        if (!isLoggedIn) {
            toast.error("Please login to continue");
            router.push("/signin");
            return;
        }

        if (!product) {
            toast.error("Product information not available");
            return;
        }

        setLoading(true);

        try {
            // Store buy now data in sessionStorage for checkout page
            const buyNowData = {
                type: "buyNow",
                productId: product._id,
                quantity,
                selectedColor,
                selectedSize,
                product: {
                    id: product._id,
                    name: product.name,
                    price: product.offerPrice || product.price,
                    originalPrice: product.price,
                    offerPrice: product.offerPrice,
                    image: product.images?.[0]?.url,
                    stock: product.stock,
                },
            };

            sessionStorage.setItem("buyNowData", JSON.stringify(buyNowData));

            // Navigate to unified checkout
            router.push("/checkout/unified");
        } catch (error) {
            console.error("Error initiating buy now:", error);
            toast.error("Failed to proceed to checkout");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleBuyNow}
            disabled={disabled || loading || !product?.stock}
            className={`
        w-full py-3 px-6 rounded-lg font-semibold text-white
        transition-all duration-200 transform hover:scale-105
        ${loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : product?.stock
                        ? "bg-orange-500 hover:bg-orange-600 active:scale-95"
                        : "bg-gray-400 cursor-not-allowed"
                }
        ${className}
      `}
        >
            {loading ? (
                <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                </div>
            ) : !product?.stock ? (
                "Out of Stock"
            ) : (
                "Buy Now"
            )}
        </button>
    );
}