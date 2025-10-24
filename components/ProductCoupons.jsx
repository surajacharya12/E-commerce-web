"use client";
import React, { useState } from "react";
import { FiTag, FiCopy, FiCheck, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { toast } from "react-toastify";
import { useCoupons } from "../app/hooks/useCoupons";

const ProductCoupons = ({ productId, productName }) => {
    const [copied, setCopied] = useState(null);
    const [showAll, setShowAll] = useState(false);
    const { getCouponsForProduct } = useCoupons([productId]);

    const coupons = getCouponsForProduct(productId);

    const handleCopyCode = (couponCode, e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(couponCode);
        setCopied(couponCode);
        toast.success(`Coupon code ${couponCode} copied!`);
        setTimeout(() => setCopied(null), 2000);
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

    if (!coupons || coupons.length === 0) {
        return null;
    }

    const displayedCoupons = showAll ? coupons : coupons.slice(0, 2);

    return (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
                <FiTag className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-bold text-green-800">
                    Available Coupons ({coupons.length})
                </h3>
            </div>

            <div className="space-y-3">
                {displayedCoupons.map((coupon) => (
                    <div
                        key={coupon._id}
                        className="bg-white rounded-xl p-4 border border-green-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                                    {getDiscountText(coupon)}
                                </div>
                                <div className="text-sm text-gray-600">
                                    Valid till {formatDate(coupon.endDate)}
                                </div>
                            </div>
                            <button
                                onClick={(e) => handleCopyCode(coupon.couponCode, e)}
                                className="flex items-center gap-2 bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                            >
                                {copied === coupon.couponCode ? (
                                    <>
                                        <FiCheck className="w-4 h-4" />
                                        Copied!
                                    </>
                                ) : (
                                    <>
                                        <FiCopy className="w-4 h-4" />
                                        Copy Code
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Applicable Product/Category Display */}
                        <div className="mb-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="text-xs text-blue-600 font-medium">Applicable for:</div>
                            <div className="text-sm font-semibold text-blue-800">
                                {coupon.applicableProductName ? (
                                    <span className="flex items-center gap-1">
                                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                        Product: {coupon.applicableProductName}
                                    </span>
                                ) : coupon.applicableCategoryName ? (
                                    <span className="flex items-center gap-1">
                                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                        Category: {coupon.applicableCategoryName}
                                    </span>
                                ) : coupon.applicableSubCategoryName ? (
                                    <span className="flex items-center gap-1">
                                        <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                                        Sub-Category: {coupon.applicableSubCategoryName}
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1">
                                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                                        All Products
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="font-mono font-bold text-green-800 bg-green-100 px-3 py-1 rounded-lg">
                                {coupon.couponCode}
                            </div>
                            {coupon.minimumPurchaseAmount > 0 && (
                                <div className="text-xs text-gray-500">
                                    Min. purchase: ₹{coupon.minimumPurchaseAmount}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {coupons.length > 2 && (
                <button
                    onClick={() => setShowAll(!showAll)}
                    className="flex items-center gap-2 mt-4 text-green-600 hover:text-green-700 font-medium text-sm transition-colors"
                >
                    {showAll ? (
                        <>
                            <FiChevronUp className="w-4 h-4" />
                            Show Less
                        </>
                    ) : (
                        <>
                            <FiChevronDown className="w-4 h-4" />
                            Show {coupons.length - 2} More Coupons
                        </>
                    )}
                </button>
            )}
        </div>
    );
};

export default ProductCoupons;