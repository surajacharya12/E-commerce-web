"use client";
import React, { useState } from "react";
import { FiTag, FiCopy, FiCheck } from "react-icons/fi";
import { toast } from "react-toastify";

const CouponBadge = ({ coupon, size = "small" }) => {
    const [copied, setCopied] = useState(false);

    const handleCopyCode = (e) => {
        e.stopPropagation(); // Prevent card click
        navigator.clipboard.writeText(coupon.couponCode);
        setCopied(true);
        toast.success(`Coupon code ${coupon.couponCode} copied!`);
        setTimeout(() => setCopied(false), 2000);
    };

    const getDiscountText = () => {
        if (coupon.discountType === "percentage") {
            return `${coupon.discountAmount}% OFF`;
        } else {
            return `₹${coupon.discountAmount} OFF`;
        }
    };

    if (size === "small") {
        return (
            <div className="inline-flex items-center gap-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-md">
                <FiTag className="w-3 h-3" />
                <span>{getDiscountText()}</span>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg p-3 shadow-lg">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <FiTag className="w-4 h-4" />
                    <span className="font-bold text-sm">{getDiscountText()}</span>
                </div>
                <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-1 bg-white/20 hover:bg-white/30 px-2 py-1 rounded text-xs font-medium transition-colors"
                >
                    {copied ? <FiCheck className="w-3 h-3" /> : <FiCopy className="w-3 h-3" />}
                    {copied ? "Copied!" : "Copy"}
                </button>
            </div>
            <div className="text-xs opacity-90">
                Code: <span className="font-mono font-bold">{coupon.couponCode}</span>
            </div>
            {coupon.minimumPurchaseAmount > 0 && (
                <div className="text-xs opacity-75 mt-1">
                    Min. purchase: ₹{coupon.minimumPurchaseAmount}
                </div>
            )}
        </div>
    );
};

export default CouponBadge;