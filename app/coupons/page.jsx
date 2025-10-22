"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import CouponService from "../services/couponService";

export default function CouponsPage() {
    const [activeCoupons, setActiveCoupons] = useState([]);
    const [expiredCoupons, setExpiredCoupons] = useState([]);
    const [activeTab, setActiveTab] = useState("active");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadCoupons();
    }, []);

    const loadCoupons = async () => {
        setIsLoading(true);
        try {
            const coupons = await CouponService.getActiveCoupons();
            const now = new Date();

            const active = coupons.filter(coupon => {
                const endDate = new Date(coupon.endDate);
                return endDate > now;
            });

            const expired = coupons.filter(coupon => {
                const endDate = new Date(coupon.endDate);
                return endDate <= now;
            });

            setActiveCoupons(active);
            setExpiredCoupons(expired);
        } catch (error) {
            toast.error("Failed to load coupons");
        } finally {
            setIsLoading(false);
        }
    };

    const copyCouponCode = async (couponCode) => {
        try {
            await navigator.clipboard.writeText(couponCode);
            toast.success(`Coupon code ${couponCode} copied to clipboard!`);
        } catch (error) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = couponCode;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            toast.success(`Coupon code ${couponCode} copied!`);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto mb-4"></div>
                    <p className="text-slate-600 text-lg">Loading your coupons...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 mt-15">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-xl border-b border-white/20 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-2xl">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-slate-800">My Coupons</h1>
                                <p className="text-slate-600">Save money with exclusive offers</p>
                            </div>
                        </div>
                        <button
                            onClick={loadCoupons}
                            className="p-3 bg-white/60 backdrop-blur-sm rounded-xl hover:bg-white/80 transition-colors"
                        >
                            <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
                {/* Tabs */}
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 mb-8">
                    <div className="flex">
                        <button
                            onClick={() => setActiveTab("active")}
                            className={`flex-1 py-4 px-6 text-center font-semibold rounded-l-2xl transition-all duration-200 ${activeTab === "active"
                                ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                                : "text-slate-600 hover:bg-slate-50"
                                }`}
                        >
                            <div className="flex items-center justify-center space-x-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                                <span>Active ({activeCoupons.length})</span>
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab("expired")}
                            className={`flex-1 py-4 px-6 text-center font-semibold rounded-r-2xl transition-all duration-200 ${activeTab === "expired"
                                ? "bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg"
                                : "text-slate-600 hover:bg-slate-50"
                                }`}
                        >
                            <div className="flex items-center justify-center space-x-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Expired ({expiredCoupons.length})</span>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Coupons Grid */}
                <CouponsList
                    coupons={activeTab === "active" ? activeCoupons : expiredCoupons}
                    isActive={activeTab === "active"}
                    onCopyCode={copyCouponCode}
                />
            </div>
        </div>
    );
}

function CouponsList({ coupons, isActive, onCopyCode }) {
    if (coupons.length === 0) {
        return (
            <div className="text-center py-16">
                <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${isActive ? 'bg-orange-100' : 'bg-gray-100'
                    }`}>
                    <svg className={`w-12 h-12 ${isActive ? 'text-orange-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={
                            isActive
                                ? "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                                : "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        } />
                    </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">
                    {isActive ? "No Active Coupons" : "No Expired Coupons"}
                </h3>
                <p className="text-slate-600 max-w-md mx-auto">
                    {isActive
                        ? "Check back later for new exclusive offers and discounts!"
                        : "Your expired coupons will appear here for reference."
                    }
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coupons.map((coupon) => (
                <CouponCard
                    key={coupon._id}
                    coupon={coupon}
                    isActive={isActive}
                    onCopyCode={onCopyCode}
                />
            ))}
        </div>
    );
}

function CouponCard({ coupon, isActive, onCopyCode }) {
    const discountText = CouponService.formatCouponDiscount(coupon);
    const minAmount = coupon.minimumPurchaseAmount || 0;
    const daysLeft = CouponService.getDaysUntilExpiry(coupon.endDate);
    const endDate = new Date(coupon.endDate);

    return (
        <div
            className={`relative overflow-hidden rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer ${isActive
                ? 'bg-gradient-to-br from-orange-500 to-red-500 hover:shadow-2xl'
                : 'bg-gradient-to-br from-gray-400 to-gray-500'
                }`}
            onClick={() => isActive && onCopyCode(coupon.couponCode)}
        >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 right-4 w-20 h-20 border-4 border-white rounded-full"></div>
                <div className="absolute bottom-4 left-4 w-16 h-16 border-4 border-white rounded-full"></div>
            </div>

            <div className="relative p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="bg-white/20 p-3 rounded-xl">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={
                                isActive
                                    ? "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                                    : "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            } />
                        </svg>
                    </div>
                    {isActive && (
                        <div className="bg-white rounded-full px-3 py-1">
                            <span className="text-orange-500 text-xs font-bold">TAP TO COPY</span>
                        </div>
                    )}
                </div>

                {/* Discount Amount */}
                <div className="mb-4">
                    <h3 className="text-white text-3xl font-bold mb-2">{discountText}</h3>
                    <div className="bg-white/20 rounded-lg px-4 py-2 inline-block">
                        <span className="text-white font-mono text-lg font-semibold tracking-wider">
                            {coupon.couponCode}
                        </span>
                    </div>
                </div>

                {/* Details */}
                <div className="space-y-3">
                    {minAmount > 0 && (
                        <div className="flex items-center text-white/90">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            <span className="text-sm">Min. order ₹{minAmount}</span>
                        </div>
                    )}

                    <div className="flex items-center text-white/90">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm">
                            {isActive
                                ? daysLeft > 0
                                    ? `Expires in ${daysLeft} days`
                                    : "Expires today"
                                : `Expired on ${endDate.toLocaleDateString()}`
                            }
                        </span>
                    </div>
                </div>

                {/* Action Hint */}
                {isActive && (
                    <div className="mt-6 pt-4 border-t border-white/20">
                        <div className="flex items-center justify-center text-white/80">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm font-medium">Click to copy code</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}