"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiCheck, FiShoppingBag, FiClock } from "react-icons/fi";

const OrderSuccessAnimation = ({ orderData, onComplete }) => {
    const [showTick, setShowTick] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [countdown, setCountdown] = useState(3);
    const router = useRouter();

    console.log("OrderSuccessAnimation rendered with:", { orderData, onComplete });

    useEffect(() => {
        // Show tick animation after a brief delay
        const tickTimer = setTimeout(() => {
            setShowTick(true);
        }, 500);

        // Show order details after tick animation
        const detailsTimer = setTimeout(() => {
            setShowDetails(true);
        }, 1500);

        // Start countdown
        const countdownTimer = setTimeout(() => {
            const interval = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        // Navigate to order receipt
                        if (orderData?._id) {
                            router.push(`/receipt/${orderData._id}`);
                        }
                        if (onComplete) onComplete();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }, 2000);

        return () => {
            clearTimeout(tickTimer);
            clearTimeout(detailsTimer);
            clearTimeout(countdownTimer);
        };
    }, [orderData, router, onComplete]);

    const handleViewNow = () => {
        if (orderData?._id) {
            router.push(`/receipt/${orderData._id}`);
        }
        if (onComplete) onComplete();
    };

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-green-50 via-blue-50 to-indigo-100 flex items-center justify-center z-50">
            <div className="text-center max-w-md mx-auto px-6">
                {/* Animated Tick */}
                <div className="relative mb-8">
                    <div
                        className={`w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center shadow-2xl transform transition-all duration-1000 ${showTick ? 'scale-100 rotate-0' : 'scale-0 rotate-180'
                            }`}
                    >
                        <FiCheck
                            className={`w-16 h-16 text-white transform transition-all duration-700 delay-300 ${showTick ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                                }`}
                            strokeWidth={3}
                        />
                    </div>

                    {/* Ripple Effect */}
                    <div
                        className={`absolute inset-0 w-32 h-32 mx-auto rounded-full border-4 border-green-400 transform transition-all duration-1000 ${showTick ? 'scale-150 opacity-0' : 'scale-100 opacity-100'
                            }`}
                    />
                    <div
                        className={`absolute inset-0 w-32 h-32 mx-auto rounded-full border-4 border-green-300 transform transition-all duration-1000 delay-200 ${showTick ? 'scale-200 opacity-0' : 'scale-100 opacity-100'
                            }`}
                    />
                </div>

                {/* Success Message */}
                <div
                    className={`transform transition-all duration-700 delay-500 ${showTick ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                        }`}
                >
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">
                        🎉 Order Confirmed!
                    </h1>
                    <p className="text-xl text-gray-600 mb-8">
                        Thank you for your purchase!
                    </p>
                </div>

                {/* Order Details */}
                <div
                    className={`transform transition-all duration-700 delay-700 ${showDetails ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                        }`}
                >
                    {orderData && (
                        <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200 mb-8">
                            <div className="flex items-center justify-center gap-3 mb-4">
                                <FiShoppingBag className="w-6 h-6 text-indigo-600" />
                                <h3 className="text-lg font-bold text-gray-800">Order Details</h3>
                            </div>

                            <div className="space-y-3 text-left">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Order Number:</span>
                                    <span className="font-bold text-indigo-600 font-mono">
                                        {orderData.orderNumber || orderData._id?.slice(-8).toUpperCase()}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Total Amount:</span>
                                    <span className="font-bold text-green-600 text-xl">
                                        ₹{orderData.totalPrice}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Payment Method:</span>
                                    <span className="font-semibold capitalize">
                                        {orderData.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Status:</span>
                                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold capitalize">
                                        {orderData.orderStatus || 'Pending'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation Options */}
                    <div className="space-y-4">
                        <button
                            onClick={handleViewNow}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                        >
                            View Order Receipt Now
                        </button>

                        <div className="flex items-center justify-center gap-2 text-gray-500">
                            <FiClock className="w-4 h-4" />
                            <span className="text-sm">
                                Auto-redirecting in {countdown} seconds...
                            </span>
                        </div>
                    </div>
                </div>

                {/* Floating Particles */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className={`absolute w-2 h-2 bg-gradient-to-r from-green-400 to-blue-400 rounded-full transform transition-all duration-3000 ${showTick ? 'animate-bounce' : ''
                                }`}
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 2}s`,
                                animationDuration: `${2 + Math.random() * 2}s`
                            }}
                        />
                    ))}
                </div>
            </div>

            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(180deg); }
                }
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default OrderSuccessAnimation;