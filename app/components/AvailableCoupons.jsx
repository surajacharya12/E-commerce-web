"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import CouponService from "../services/couponService";

export default function AvailableCoupons({ onCouponSelected }) {
    const [coupons, setCoupons] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadCoupons();
    }, []);

    const loadCoupons = async () => {
        try {
            const activeCoupons = await CouponService.getActiveCoupons();
            setCoupons(activeCoupons);
        } catch (error) {
            console.error("Error loading coupons:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCouponClick = async (couponCode) => {
        try {
            await navigator.clipboard.writeText(couponCode);
            toast.success(`Coupon code ${couponCode} copied to clipboard!`);
            onCouponSelected(couponCode);
        } catch (error) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = couponCode;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            toast.success(`Coupon code ${couponCode} copied!`);
            onCouponSelected(couponCode);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (coupons.length === 0) {
        return (
            <div className="text-center py-8">
                <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                </div>
                <p className="text-gray-500">No coupons available at the moment</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Available Coupons</h3>

            <div className="grid gap-4">
                {coupons.map((coupon) => (
                    <CouponCard
                        key={coupon._id}
                        coupon={coupon}
                        onSelect={handleCouponClick}
                    />
                ))}
            </div>
        </div>
    );
}

function CouponCard({ coupon, onSelect }) {
    const discountText = CouponService.formatCouponDiscount(coupon);
    const minAmount = coupon.minimumPurchaseAmount || 0;
    const daysLeft = CouponService.getDaysUntilExpiry(coupon.endDate);

    return (
        <div
            onClick={() => onSelect(coupon.couponCode)}
            className="bg-gradient-to-r from-red-500 to-orange-500 rounded-xl p-4 cursor-pointer transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="bg-white/20 p-3 rounded-lg">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                    </div>

                    <div className="flex-1">
                        <h4 className="text-white text-xl font-bold mb-1">
                            {discountText}
                        </h4>
                        <p className="text-white text-lg font-semibold tracking-wider mb-2">
                            {coupon.couponCode}
                        </p>

                        <div className="space-y-1">
                            {minAmount > 0 && (
                                <p className="text-white/90 text-sm">
                                    Min. order ₹{minAmount}
                                </p>
                            )}
                            {daysLeft > 0 && (
                                <p className="text-white/90 text-sm">
                                    Expires in {daysLeft} days
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-full px-4 py-2">
                    <span className="text-orange-500 text-xs font-bold">
                        TAP TO COPY
                    </span>
                </div>
            </div>
        </div>
    );
}