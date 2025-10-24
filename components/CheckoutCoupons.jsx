"use client";
import React, { useState, useEffect } from "react";
import { FiTag, FiCopy, FiCheck, FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import { useCoupons } from "../app/hooks/useCoupons";

const CheckoutCoupons = ({
    productId,
    productName,
    subtotal,
    onCouponApply,
    onCouponRemove,
    appliedCoupon
}) => {
    const [copied, setCopied] = useState(null);
    const [couponInput, setCouponInput] = useState("");
    const [showCoupons, setShowCoupons] = useState(false);

    const { getCouponsForProduct, productDetails } = useCoupons([productId]);
    const coupons = getCouponsForProduct(productId);

    // Filter coupons that meet minimum purchase requirement
    const eligibleCoupons = coupons.filter(coupon =>
        !coupon.minimumPurchaseAmount || subtotal >= coupon.minimumPurchaseAmount
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
            if (coupon.minimumPurchaseAmount && subtotal < coupon.minimumPurchaseAmount) {
                toast.error(`Minimum purchase amount of ₹${coupon.minimumPurchaseAmount} required`);
                return;
            }

            setCouponInput(coupon.couponCode);
            if (onCouponApply) {
                await onCouponApply(coupon);
            }
            toast.success(`Coupon ${coupon.couponCode} applied successfully!`);
            setShowCoupons(false);
        } catch (error) {
            toast.error("Failed to apply coupon");
        }
    };

    const handleManualCouponApply = async () => {
        if (!couponInput.trim()) {
            toast.error("Please enter a coupon code");
            return;
        }

        try {
            const coupon = coupons.find(c =>
                c.couponCode.toUpperCase() === couponInput.toUpperCase()
            );

            if (coupon) {
                await handleApplyCoupon(coupon);
            } else {
                toast.error("Invalid or expired coupon code");
            }
        } catch (error) {
            toast.error("Failed to apply coupon");
        }
    };

    const handleRemoveCoupon = () => {
        setCouponInput("");
        if (onCouponRemove) {
            onCouponRemove();
        }
        toast.success("Coupon removed");
    };

    const getDiscountText = (coupon) => {
        if (coupon.discountType === "percentage") {
            return `${coupon.discountAmount}% OFF`;
        } else {
            return `₹${coupon.discountAmount} OFF`;
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

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

        // Fallback to enhanced coupon data or original structure
        if (coupon.applicableProductName) {
            return coupon.applicableProductName;
        }
        if (coupon.applicableProduct?.name) {
            return coupon.applicableProduct.name;
        }
        if (coupon.applicableCategoryName) {
            return `Category: ${coupon.applicableCategoryName}`;
        }
        if (coupon.applicableCategory?.name) {
            return `Category: ${coupon.applicableCategory.name}`;
        }
        if (coupon.applicableSubCategoryName) {
            return `Sub-Category: ${coupon.applicableSubCategoryName}`;
        }
        if (coupon.applicableSubCategory?.name) {
            return `Sub-Category: ${coupon.applicableSubCategory.name}`;
        }

        return "All Products";
    };

    return (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <FiTag className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-green-800">Apply Coupon</span>
                </div>
                {eligibleCoupons.length > 0 && (
                    <button
                        onClick={() => setShowCoupons(!showCoupons)}
                        className="text-xs text-green-600 hover:text-green-700 font-medium"
                    >
                        {showCoupons ? 'Hide' : 'Show'} Available ({eligibleCoupons.length})
                    </button>
                )}
            </div>

            {/* Applied Coupon Display */}
            {appliedCoupon && (
                <div className="mb-3 p-3 bg-green-100 rounded-lg border border-green-300">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">
                                {getDiscountText(appliedCoupon)}
                            </div>
                            <span className="font-mono text-sm font-bold text-green-800">
                                {appliedCoupon.couponCode}
                            </span>
                        </div>
                        <button
                            onClick={handleRemoveCoupon}
                            className="text-green-600 hover:text-green-800 p-1"
                            title="Remove coupon"
                        >
                            <FiX className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="text-xs mt-1 bg-green-100 p-1 rounded">
                        <span className="text-green-700 font-medium">Applied to: </span>
                        <span className="text-green-800">
                            {getApplicableProductNames(appliedCoupon)}
                        </span>
                    </div>
                </div>
            )}

            {/* Manual Coupon Input */}
            {!appliedCoupon && (
                <div className="flex gap-2 mb-3">
                    <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="Enter coupon code"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button
                        onClick={handleManualCouponApply}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                    >
                        Apply
                    </button>
                </div>
            )}

            {/* Available Coupons */}
            {showCoupons && eligibleCoupons.length > 0 && !appliedCoupon && (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                    {eligibleCoupons.slice(0, 3).map((coupon) => (
                        <div
                            key={coupon._id}
                            className="bg-white rounded-lg p-3 border border-gray-200 hover:border-green-300 transition-all"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-2 py-1 rounded text-xs font-bold">
                                        {getDiscountText(coupon)}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Till {formatDate(coupon.endDate)}
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => handleCopyCode(coupon.couponCode, e)}
                                    className="p-1 text-gray-500 hover:text-green-600 transition-colors"
                                    title="Copy code"
                                >
                                    {copied === coupon.couponCode ? (
                                        <FiCheck className="w-3 h-3" />
                                    ) : (
                                        <FiCopy className="w-3 h-3" />
                                    )}
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="font-mono text-sm font-bold text-green-800">
                                    {coupon.couponCode}
                                </div>
                                <button
                                    onClick={() => handleApplyCoupon(coupon)}
                                    className="px-3 py-1 bg-green-600 text-white rounded text-xs font-medium hover:bg-green-700 transition-colors"
                                >
                                    Apply
                                </button>
                            </div>

                            <div className="text-xs mt-1 bg-blue-50 p-2 rounded border border-blue-200">
                                <div className="text-blue-600 font-medium mb-1">Applicable for:</div>
                                <div className="text-blue-800">
                                    <span className="flex items-center gap-1">
                                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                        {getApplicableProductNames(coupon)}
                                    </span>
                                </div>
                            </div>

                            {coupon.minimumPurchaseAmount > 0 && (
                                <div className="text-xs text-gray-500 mt-1">
                                    Min. purchase: ₹{coupon.minimumPurchaseAmount}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {eligibleCoupons.length === 0 && (
                <div className="text-xs text-gray-500 text-center py-2">
                    No coupons available for this product
                </div>
            )}
        </div>
    );
};

export default CheckoutCoupons;