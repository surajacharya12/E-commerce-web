"use client";
import React, { useState } from "react";
import { FiTag, FiCopy, FiCheck } from "react-icons/fi";
import { toast } from "react-toastify";
import { useCoupons } from "../app/hooks/useCoupons";

const CartCoupons = ({ cartItems, onCouponApply }) => {
    const [copied, setCopied] = useState(null);
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponInput, setCouponInput] = useState("");

    // Get product IDs from cart items
    const productIds = cartItems.map(item => item.productId?._id).filter(Boolean);
    const { coupons, productDetails } = useCoupons(productIds);

    // Get all applicable coupons for cart items
    const applicableCoupons = coupons.filter(coupon =>
        productIds.some(productId =>
            coupon.applicableProducts.includes(productId.toString())
        )
    );

    const handleCopyCode = (couponCode, e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(couponCode);
        setCopied(couponCode);
        toast.success(`Coupon code ${couponCode} copied!`);
        setTimeout(() => setCopied(null), 2000);
    };

    const handleApplyCoupon = async (coupon) => {
        try {
            setAppliedCoupon(coupon);
            setCouponInput(coupon.couponCode);
            if (onCouponApply) await onCouponApply(coupon);
            toast.success(`Coupon ${coupon.couponCode} applied successfully!`);
        } catch (error) {
            toast.error("Failed to apply coupon");
            setAppliedCoupon(null);
        }
    };

    const handleManualCouponApply = async () => {
        if (!couponInput.trim()) {
            toast.error("Please enter a coupon code");
            return;
        }

        const coupon = applicableCoupons.find(c =>
            c.couponCode.toUpperCase() === couponInput.toUpperCase()
        );

        if (coupon) {
            await handleApplyCoupon(coupon);
        } else {
            toast.error("Invalid or expired coupon code");
        }
    };

    const getDiscountText = (coupon) =>
        coupon.discountType === "percentage"
            ? `${coupon.discountAmount}% OFF`
            : `₹${coupon.discountAmount} OFF`;

    const formatDate = (dateString) =>
        new Date(dateString).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });

    // Helper function to get applicable product names
    const getApplicableProductNames = (coupon) => {
        if (coupon.applicableProducts && coupon.applicableProducts.length > 0) {
            const productNames = coupon.applicableProducts
                .map(productId => {
                    const product = productDetails[productId];
                    return product ? product.name : null;
                })
                .filter(Boolean);

            if (productNames.length > 0) {
                return productNames.slice(0, 2).join(", ") + (productNames.length > 2 ? ` +${productNames.length - 2} more` : "");
            }
        }

        // Fallback to original structure
        if (coupon.applicableProduct?.name) {
            return coupon.applicableProduct.name;
        }
        if (coupon.applicableCategory?.name) {
            return `Category: ${coupon.applicableCategory.name}`;
        }
        if (coupon.applicableSubCategory?.name) {
            return `Sub-Category: ${coupon.applicableSubCategory.name}`;
        }

        return "All Products";
    };

    return (
        <div className={applicableCoupons.length === 0 ? "bg-gray-50 rounded-xl p-4 border border-gray-200" : "bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200"}>
            <div className="flex items-center gap-2 mb-4">
                <FiTag className={applicableCoupons.length === 0 ? "w-4 h-4 text-gray-500" : "w-5 h-5 text-green-600"} />
                <h3 className={applicableCoupons.length === 0 ? "font-medium text-gray-700" : "font-bold text-green-800"}>
                    {applicableCoupons.length === 0 ? "Apply Coupon" : `Available Coupons (${applicableCoupons.length})`}
                </h3>
            </div>

            {/* Manual Coupon Input */}
            <div className="mb-4">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="Enter coupon code"
                        className={`flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${applicableCoupons.length === 0 ? "border-gray-300 focus:ring-blue-500" : "border-gray-300 focus:ring-green-500"
                            }`}
                    />
                    <button
                        onClick={handleManualCouponApply}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${applicableCoupons.length === 0 ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-green-600 text-white hover:bg-green-700"
                            }`}
                    >
                        Apply
                    </button>
                </div>
                {applicableCoupons.length === 0 && (
                    <p className="text-xs text-gray-500 mt-2">No coupons available for current cart items</p>
                )}
            </div>

            {/* Available Coupons */}
            {applicableCoupons.length > 0 && (
                <>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {applicableCoupons.slice(0, 3).map((coupon) => (
                            <div
                                key={coupon._id}
                                className={`bg-white rounded-lg p-3 border transition-all ${appliedCoupon?._id === coupon._id ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-green-300"
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-2 py-1 rounded text-xs font-bold">
                                            {getDiscountText(coupon)}
                                        </div>
                                        <div className="text-xs text-gray-500">Till {formatDate(coupon.endDate)}</div>
                                    </div>
                                    <div className="flex gap-1">
                                        <button
                                            onClick={(e) => handleCopyCode(coupon.couponCode, e)}
                                            className="p-1 text-gray-500 hover:text-green-600 transition-colors"
                                            title="Copy code"
                                        >
                                            {copied === coupon.couponCode ? <FiCheck className="w-3 h-3" /> : <FiCopy className="w-3 h-3" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mb-2">
                                    <div className="font-mono text-sm font-bold text-green-800">{coupon.couponCode}</div>
                                    <button
                                        onClick={() => handleApplyCoupon(coupon)}
                                        disabled={appliedCoupon?._id === coupon._id}
                                        className={`px-3 py-1 rounded text-xs font-medium transition-colors ${appliedCoupon?._id === coupon._id
                                            ? "bg-green-200 text-green-800 cursor-not-allowed"
                                            : "bg-green-600 text-white hover:bg-green-700"
                                            }`}
                                    >
                                        {appliedCoupon?._id === coupon._id ? "Applied" : "Apply"}
                                    </button>
                                </div>

                                {/* Always show applicable products/categories */}
                                <div className="mt-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
                                    <div className="text-xs text-blue-600 font-medium mb-1">Applicable for:</div>
                                    <div className="text-xs text-blue-800">
                                        <span className="flex items-center gap-1">
                                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                            {getApplicableProductNames(coupon)}
                                        </span>
                                    </div>
                                    {coupon.minimumPurchaseAmount > 0 && (
                                        <div className="text-xs text-gray-500 mt-1">Min. purchase: ₹{coupon.minimumPurchaseAmount}</div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {applicableCoupons.length > 3 && (
                        <div className="text-xs text-green-600 mt-2 text-center">
                            +{applicableCoupons.length - 3} more coupons available
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default CartCoupons;
