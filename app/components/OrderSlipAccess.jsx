"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import API_URL from "../api/api";
import { FiFileText, FiChevronDown, FiChevronUp, FiClock, FiPackage, FiTruck, FiHome } from "react-icons/fi";

const OrderSlipAccess = () => {
    const [orders, setOrders] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { isLoggedIn, userData, loading: authLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && isLoggedIn && userData?.id) {
            fetchRecentOrders();

            // Set up periodic refresh every 2 minutes to keep order count updated
            const interval = setInterval(() => {
                fetchRecentOrders();
            }, 120000); // 2 minutes

            return () => clearInterval(interval);
        }
    }, [isLoggedIn, userData?.id, authLoading]);

    const fetchRecentOrders = async () => {
        if (!userData?.id) return;

        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/orders/orderByUserId/${userData.id}`);
            if (response.data.success) {
                // Only show orders that are not delivered (user can still access slip until delivery)
                const activeOrders = response.data.data.filter(order =>
                    order.orderStatus !== 'delivered' && order.orderStatus !== 'cancelled'
                );
                setOrders(activeOrders.slice(0, 5)); // Show last 5 active orders
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <FiClock className="w-4 h-4 text-yellow-500" />;
            case 'processing': return <FiPackage className="w-4 h-4 text-blue-500" />;
            case 'shipped': return <FiTruck className="w-4 h-4 text-purple-500" />;
            case 'delivered': return <FiHome className="w-4 h-4 text-green-500" />;
            default: return <FiPackage className="w-4 h-4 text-gray-500" />;
        }
    };

    if (authLoading || !isLoggedIn) return null;

    return (
        <div className="fixed bottom-6 left-6 z-40">
            <div className="relative">
                {/* Dropdown Menu */}
                {isOpen && (
                    <div className="absolute bottom-16 left-0 bg-white rounded-2xl shadow-2xl border border-gray-200 w-80 max-h-96 overflow-hidden">
                        <div className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                            <h3 className="font-bold text-lg">Active Order Slips</h3>
                            <p className="text-indigo-100 text-sm">Access your order slips anytime</p>
                        </div>

                        <div className="max-h-64 overflow-y-auto">
                            {loading ? (
                                <div className="p-4 text-center">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto"></div>
                                    <p className="text-gray-500 text-sm mt-2">Loading orders...</p>
                                </div>
                            ) : orders.length === 0 ? (
                                <div className="p-4 text-center text-gray-500">
                                    <FiFileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                    <p className="text-sm">No active orders</p>
                                    <p className="text-xs">Order slips appear here until delivery</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-200">
                                    {orders.map((order) => (
                                        <div
                                            key={order._id}
                                            onClick={() => {
                                                router.push(`/order-slip/${order._id}`);
                                                setIsOpen(false);
                                            }}
                                            className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        {getStatusIcon(order.orderStatus)}
                                                        <span className="font-semibold text-sm text-gray-800">
                                                            #{order.orderNumber || order._id?.slice(-8).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-gray-600 capitalize">
                                                        {order.orderStatus} • ₹{order.totalPrice}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {new Date(order.orderDate).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <FiFileText className="w-5 h-5 text-indigo-600" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="p-3 bg-gray-50 border-t">
                            <button
                                onClick={() => {
                                    router.push('/orders');
                                    setIsOpen(false);
                                }}
                                className="w-full text-center text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                            >
                                View All Orders
                            </button>
                        </div>
                    </div>
                )}

                {/* Toggle Button */}
                <button
                    onClick={() => {
                        setIsOpen(!isOpen);
                        if (!isOpen) {
                            fetchRecentOrders(); // Refresh orders when opening
                        }
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 relative group"
                    title={`${orders.length} active order${orders.length !== 1 ? 's' : ''}`}
                >
                    <div className="flex items-center gap-2">
                        <FiFileText className="w-5 h-5" />
                        {isOpen ? <FiChevronDown className="w-4 h-4" /> : <FiChevronUp className="w-4 h-4" />}
                    </div>

                    {/* Order Count Badge */}
                    {orders.length > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg border-2 border-white animate-bounce">
                            {orders.length > 9 ? '9+' : orders.length}
                        </span>
                    )}
                </button>
            </div>
        </div>
    );
};

export default OrderSlipAccess;