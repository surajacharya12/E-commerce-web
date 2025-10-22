"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import CouponService from "../services/couponService";

export default function CouponInput({
    onCouponApplied,
    purchaseAmount,
    productIds = [],
    appliedCoupon = null
}) {
    const [couponCode, setCouponCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [error, setError] = useState("");

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) {
            setError("Please enter a coupon code");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const result = await CouponService.applyCoupon({
                couponCode: couponCode.trim(),
                purchaseAmount,
                productIds,
            });

            if (result.success) {
                onCouponApplied(result.data);
                setIsExpanded(false);
                setCouponCode("");
                toast.success(result.message || "Coupon applied successfully!");
            } else {
                setError(result.message || "Invalid coupon code");
            }
        } catch (error) {
            setError("Failed to apply coupon. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveCoupon = () => {
        onCouponApplied(null);
        setCouponCode("");
        setError("");
        setIsExpanded(false);
    };

    if (appliedCoupon) {
        return (
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 mb-4 shadow-lg">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="bg-white/20 p-2 rounded-lg">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-white font-semibold text-lg">
                                {appliedCoupon.couponDetails.couponCode}
                            </p>
                            <p className="text-white/90 text-sm">
                                Saved ₹{appliedCoupon.discountAmount.toFixed(2)}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleRemoveCoupon}
                        className="text-white/80 hover:text-white transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-4 overflow-hidden">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
                <div className="flex items-center space-x-3">
                    <div className="bg-orange-100 p-2 rounded-lg">
                        <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                    </div>
                    <span className="text-gray-800 font-semibold">Apply Coupon Code</span>
                </div>
                <svg
                    className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isExpanded && (
                <div className="border-t border-gray-200 p-4">
                    <div className="flex space-x-3">
                        <div className="flex-1">
                            <input
                                type="text"
                                value={couponCode}
                                onChange={(e) => {
                                    setCouponCode(e.target.value.toUpperCase());
                                    if (error) setError("");
                                }}
                                placeholder="Enter coupon code"
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors ${error ? 'border-red-300' : 'border-gray-300'
                                    }`}
                            />
                            {error && (
                                <p className="text-red-500 text-sm mt-2">{error}</p>
                            )}
                        </div>
                        <button
                            onClick={handleApplyCoupon}
                            disabled={isLoading || !couponCode.trim()}
                            className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <span>Apply</span>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}