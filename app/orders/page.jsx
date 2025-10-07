"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import API_URL from "../api/api";
import OrderCancellation from "../components/OrderCancellation";
import ContactBanner from "../../components/ContactBanner";

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCancellation, setShowCancellation] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const { isLoggedIn, userData, loading: authLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Wait for auth to finish loading before making decisions
        if (authLoading) return;

        if (!isLoggedIn) {
            router.push('/signin');
            return;
        }
        fetchOrders();
    }, [isLoggedIn, userData?.id, router, authLoading]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/orders/orderByUserId/${userData.id}`);
            if (response.data.success) {
                setOrders(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = (order) => {
        setSelectedOrder(order);
        setShowCancellation(true);
    };

    const handleCancellationSuccess = (updatedOrder) => {
        // Update the order in the list
        setOrders(prevOrders =>
            prevOrders.map(order =>
                order._id === updatedOrder._id ? updatedOrder : order
            )
        );
        setShowCancellation(false);
        setSelectedOrder(null);
    };

    const canCancelOrder = (orderStatus) => {
        return ['pending', 'processing'].includes(orderStatus.toLowerCase());
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'processing': return 'bg-blue-100 text-blue-800';
            case 'shipped': return 'bg-purple-100 text-purple-800';
            case 'delivered': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading || authLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading your orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 mt-10">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.back()}
                            className="p-2 hover:bg-white/50 rounded-xl transition-colors"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="m15 18-6-6 6-6" />
                            </svg>
                        </button>
                        <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                            {orders.length} orders
                        </span>
                    </div>
                </div>

                {orders.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-32 h-32 mx-auto mb-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                                <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">No Orders Yet</h2>
                        <p className="text-gray-600 mb-8">You haven't placed any orders yet</p>
                        <button
                            onClick={() => router.push('/live-shopping')}
                            className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                        >
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order._id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800">
                                            Order #{order.orderNumber || order._id.slice(-8).toUpperCase()}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {new Date(order.orderDate).toLocaleDateString('en-IN', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${getStatusColor(order.orderStatus)}`}>
                                        {order.orderStatus}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="font-semibold text-gray-700 mb-2">Items ({order.items.length})</h4>
                                        <div className="space-y-2">
                                            {order.items.slice(0, 3).map((item, index) => (
                                                <div key={index} className="flex justify-between text-sm">
                                                    <span className="text-gray-600">
                                                        {item.productName} x {item.quantity}
                                                    </span>
                                                    <span className="font-medium">₹{item.price * item.quantity}</span>
                                                </div>
                                            ))}
                                            {order.items.length > 3 && (
                                                <p className="text-sm text-gray-500">
                                                    +{order.items.length - 3} more items
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold text-gray-700 mb-2">Order Summary</h4>
                                        <div className="space-y-1 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Payment Method:</span>
                                                <span className="font-medium capitalize">
                                                    {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Total Amount:</span>
                                                <span className="font-bold text-lg text-blue-600">₹{order.totalPrice}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-gray-600">
                                            <span className="font-medium">Delivery Address:</span> {order.shippingAddress.street}, {order.shippingAddress.city} - {order.shippingAddress.postalCode}
                                        </div>
                                        <div className="flex gap-2 flex-wrap">
                                            <button
                                                onClick={() => router.push(`/orders/${order._id}`)}
                                                className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                                            >
                                                Details
                                            </button>
                                            <button
                                                onClick={() => router.push(`/order-slip/${order._id}`)}
                                                className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                                            >
                                                Order Slip
                                            </button>
                                            <button
                                                onClick={() => router.push(`/receipt/${order._id}`)}
                                                className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                                            >
                                                Receipt
                                            </button>
                                            {canCancelOrder(order.orderStatus) && (
                                                <button
                                                    onClick={() => handleCancelOrder(order)}
                                                    className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Contact Banner */}
            <div className="max-w-6xl mx-auto px-4 mt-8">
                <ContactBanner
                    variant="minimal"
                    message="Need help with your orders?"
                    className="shadow-lg"
                />
            </div>

            {/* Order Cancellation Modal */}
            {showCancellation && selectedOrder && (
                <OrderCancellation
                    order={selectedOrder}
                    onClose={() => {
                        setShowCancellation(false);
                        setSelectedOrder(null);
                    }}
                    onCancellationSuccess={handleCancellationSuccess}
                />
            )}
        </div>
    );
}