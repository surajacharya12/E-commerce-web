"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";
import API_URL from "../../api/api";
import { toast } from "react-toastify";
import OrderCancellation from "../../components/OrderCancellation";

export default function OrderDetailPage() {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showCancellation, setShowCancellation] = useState(false);
    const { isLoggedIn, loading: authLoading } = useAuth();
    const router = useRouter();
    const params = useParams();

    useEffect(() => {
        // Wait for auth to finish loading before making decisions
        if (authLoading) return;

        if (!isLoggedIn) {
            router.push("/signin");
            return;
        }
        if (params.id) {
            fetchOrderDetails();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoggedIn, params.id, authLoading]);

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/orders/${params.id}`);
            if (response.data.success) {
                setOrder(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching order details:", error);
            toast.error("Failed to load order details");
        } finally {
            setLoading(false);
        }
    };

    const handleCancellationSuccess = (updatedOrder) => {
        setOrder(updatedOrder);
        setShowCancellation(false);
    };

    const canCancelOrder = (orderStatus) => {
        return ['pending', 'processing'].includes(orderStatus.toLowerCase());
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "processing":
                return "bg-blue-100 text-blue-800 border-blue-200";
            case "shipped":
                return "bg-purple-100 text-purple-800 border-purple-200";
            case "delivered":
                return "bg-green-100 text-green-800 border-green-200";
            case "cancelled":
                return "bg-red-100 text-red-800 border-red-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    if (loading || authLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading order details...</p>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Not Found</h2>
                    <button
                        onClick={() => router.push("/orders")}
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                    >
                        Back to Orders
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 mt-10">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => router.push("/orders")}
                        className="p-2 hover:bg-white/50 rounded-xl transition-colors"
                    >
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="m15 18-6-6 6-6" />
                        </svg>
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            Order #{order.orderNumber || order._id.slice(-8).toUpperCase()}
                        </h1>
                        <p className="text-gray-600">
                            Placed on{" "}
                            {new Date(order.orderDate).toLocaleDateString("en-IN", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Order Items & Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Status */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">
                                Order Status
                            </h2>
                            <div
                                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(
                                    order.orderStatus
                                )}`}
                            >
                                <div className="w-2 h-2 rounded-full bg-current mr-2"></div>
                                <span className="capitalize">{order.orderStatus}</span>
                            </div>
                        </div>

                        {/* Items */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Order Items</h2>
                            <div className="space-y-4">
                                {order.items.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                                    >
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-800">
                                                {item.productName}
                                            </h3>
                                            {item.variant && (
                                                <p className="text-sm text-gray-600">
                                                    Variant: {item.variant}
                                                </p>
                                            )}
                                            <p className="text-sm text-gray-600">
                                                Quantity: {item.quantity}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-lg text-blue-600">
                                                ₹{item.price * item.quantity}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                ₹{item.price} each
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">
                                Shipping Address
                            </h2>
                            <div className="bg-gray-50 rounded-xl p-4">
                                <p className="font-medium text-gray-800">
                                    {order.shippingAddress.street}
                                </p>
                                <p className="text-gray-600">
                                    {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
                                    {order.shippingAddress.postalCode}
                                </p>
                                <p className="text-gray-600">
                                    {order.shippingAddress.country}
                                </p>
                                {order.shippingAddress.phone &&
                                    order.shippingAddress.phone !== "N/A" && (
                                        <p className="text-gray-600 mt-2">
                                            Phone: {order.shippingAddress.phone}
                                        </p>
                                    )}
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
                            <h2 className="text-xl font-bold text-gray-800 mb-6">
                                Order Summary
                            </h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal:</span>
                                    <span className="font-semibold">
                                        ₹{order.orderTotal?.subtotal || order.totalPrice}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Discount:</span>
                                    <span className="font-semibold text-green-600">
                                        -₹{order.orderTotal?.discount || 0}
                                    </span>
                                </div>
                            </div>

                            <hr className="border-gray-200 mb-4" />

                            <div className="flex justify-between text-lg mb-6">
                                <span className="font-bold text-gray-800">Total:</span>
                                <span className="font-bold text-blue-600">
                                    ₹{order.totalPrice}
                                </span>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Payment Method:</span>
                                    <span className="font-medium capitalize">
                                        {order.paymentMethod === "cod"
                                            ? "Cash on Delivery"
                                            : "Online Payment"}
                                    </span>
                                </div>

                                <div className="mt-4 space-y-3">
                                    <button
                                        onClick={() => router.push(`/order-slip/${order._id}`)}
                                        className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
                                    >
                                        View Order Slip
                                    </button>
                                    <button
                                        onClick={() => router.push(`/receipt/${order._id}`)}
                                        className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
                                    >
                                        View Receipt
                                    </button>
                                    {canCancelOrder(order.orderStatus) && (
                                        <button
                                            onClick={() => setShowCancellation(true)}
                                            className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors"
                                        >
                                            Cancel Order
                                        </button>
                                    )}
                                    {order.trackingUrl && (
                                        <a
                                            href={order.trackingUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors text-center block"
                                        >
                                            Track Order
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Order Cancellation Modal */}
            {showCancellation && order && (
                <OrderCancellation
                    order={order}
                    onClose={() => setShowCancellation(false)}
                    onCancellationSuccess={handleCancellationSuccess}
                />
            )}
        </div>
    );
}
