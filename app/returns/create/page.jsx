"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    FiRotateCcw,
    FiArrowLeft,
    FiPackage,
    FiCheck,
    FiX,
    FiAlertCircle,
} from "react-icons/fi";
import ReturnService from "../../services/returnService";

export default function CreateReturnPage() {
    const router = useRouter();
    const [userId, setUserId] = useState(null);
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);
    const [returnType, setReturnType] = useState("refund");
    const [returnReason, setReturnReason] = useState("");
    const [returnDescription, setReturnDescription] = useState("");
    const [refundMethod, setRefundMethod] = useState("original_payment");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const storedUserId = localStorage.getItem("userId");
        if (storedUserId) {
            setUserId(storedUserId);
            loadOrders(storedUserId);
        } else {
            router.push("/signin");
        }
    }, [router]);

    const loadOrders = async (userId) => {
        try {
            setLoading(true);
            setError(null);

            // Use the new dedicated endpoint for delivered orders
            const data = await ReturnService.getDeliveredOrders(userId);
            console.log('Delivered orders response:', data);

            if (data.success) {
                const deliveredOrders = data.data || [];
                console.log('Delivered orders found:', deliveredOrders.length);
                setOrders(deliveredOrders);
            } else {
                throw new Error(data.message || 'Failed to load delivered orders');
            }
        } catch (err) {
            console.error('Error loading delivered orders:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleOrderSelect = (order) => {
        setSelectedOrder(order);
        setSelectedItems(
            order.items.map(item => ({
                ...item,
                returnQuantity: 0,
                selected: false,
            }))
        );
    };

    const handleItemSelection = (index, selected, returnQuantity = 1) => {
        const updatedItems = [...selectedItems];
        updatedItems[index] = {
            ...updatedItems[index],
            selected,
            returnQuantity: selected ? returnQuantity : 0,
        };
        setSelectedItems(updatedItems);
    };

    const calculateTotalAmount = () => {
        return selectedItems
            .filter(item => item.selected)
            .reduce((total, item) => total + (item.price * item.returnQuantity), 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedOrder) {
            setError("Please select an order");
            return;
        }

        const itemsToReturn = selectedItems.filter(item => item.selected);
        if (itemsToReturn.length === 0) {
            setError("Please select at least one item to return");
            return;
        }

        if (!returnReason || !returnDescription.trim()) {
            setError("Please fill in all required fields");
            return;
        }

        try {
            setSubmitting(true);
            setError(null);

            const returnData = {
                orderID: selectedOrder._id,
                orderNumber: selectedOrder.orderNumber,
                userID: userId,
                returnType,
                returnReason,
                returnDescription: returnDescription.trim(),
                items: itemsToReturn.map(item => ({
                    productID: item.productID._id || item.productID,
                    productName: item.productName,
                    quantity: item.quantity,
                    price: item.price,
                    variant: item.variant,
                    returnQuantity: item.returnQuantity,
                    condition: 'used',
                })),
                refundMethod: returnType === 'refund' ? refundMethod : undefined,
                images: [], // You can add image upload functionality later
            };

            await ReturnService.createReturn(returnData);

            // Redirect to returns list with success message
            router.push("/returns?success=created");
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (!userId || loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 mt-16 md:mt-0">
            <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-4 md:py-8">
                {/* Header */}
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-2xl border border-white/20 mb-4 md:mb-8">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => router.back()}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <FiArrowLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
                            <FiRotateCcw className="w-6 h-6 md:w-8 md:h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black text-gray-900">Create Return Request</h1>
                            <p className="text-gray-600 text-sm md:text-base">
                                Select items from your delivered orders to return
                            </p>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                        <div className="flex items-center space-x-2">
                            <FiAlertCircle className="w-5 h-5 text-red-600" />
                            <p className="text-red-800">{error}</p>
                        </div>
                    </div>
                )}

                {orders.length === 0 ? (
                    <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/20">
                        <div className="text-center">
                            <FiPackage className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Eligible Orders</h3>
                            <p className="text-gray-600 mb-6">
                                You don't have any orders available for returns. Orders must be delivered to be eligible for returns.
                            </p>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                <div className="flex items-center justify-center mb-2">
                                    <FiAlertCircle className="w-5 h-5 text-blue-600 mr-2" />
                                    <span className="text-blue-800 font-medium">Testing Returns</span>
                                </div>
                                <p className="text-blue-700 text-sm text-center">
                                    Only delivered orders within 30 days are eligible for returns. Make sure you have delivered orders to create returns.
                                </p>
                            </div>
                            <button
                                onClick={() => router.push("/orders")}
                                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300"
                            >
                                View Orders
                            </button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Order Selection */}
                        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Select Order</h2>
                            <div className="space-y-3">
                                {orders.map((order) => (
                                    <div
                                        key={order._id}
                                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${selectedOrder?._id === order._id
                                            ? "border-indigo-500 bg-indigo-50"
                                            : "border-gray-200 hover:border-gray-300"
                                            }`}
                                        onClick={() => handleOrderSelect(order)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-semibold text-gray-900">Order #{order.orderNumber}</h3>
                                                <p className="text-sm text-gray-600">
                                                    {order.items?.length || 0} items • ₹{order.totalPrice?.toFixed(2) || "0.00"}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Delivered on {new Date(order.updatedAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="w-5 h-5 rounded-full border-2 border-indigo-500 flex items-center justify-center">
                                                {selectedOrder?._id === order._id && (
                                                    <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Item Selection */}
                        {selectedOrder && (
                            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Select Items to Return</h2>
                                <div className="space-y-4">
                                    {selectedItems.map((item, index) => (
                                        <div
                                            key={index}
                                            className={`p-4 border-2 rounded-xl transition-all duration-200 ${item.selected
                                                ? "border-indigo-500 bg-indigo-50"
                                                : "border-gray-200"
                                                }`}
                                        >
                                            <div className="flex items-start space-x-4">
                                                <input
                                                    type="checkbox"
                                                    checked={item.selected}
                                                    onChange={(e) => handleItemSelection(index, e.target.checked)}
                                                    className="mt-1 w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                                                />
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-gray-900">{item.productName}</h3>
                                                    {item.variant && (
                                                        <p className="text-sm text-gray-600">Variant: {item.variant}</p>
                                                    )}
                                                    <p className="text-sm text-gray-600">
                                                        Price: ₹{item.price?.toFixed(2)} • Ordered: {item.quantity}
                                                    </p>
                                                    {item.selected && (
                                                        <div className="mt-3">
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                Return Quantity
                                                            </label>
                                                            <select
                                                                value={item.returnQuantity}
                                                                onChange={(e) => handleItemSelection(index, true, parseInt(e.target.value))}
                                                                className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                            >
                                                                {Array.from({ length: item.quantity }, (_, i) => i + 1).map(qty => (
                                                                    <option key={qty} value={qty}>{qty}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Return Details */}
                        {selectedItems.some(item => item.selected) && (
                            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Return Details</h2>

                                <div className="space-y-4">
                                    {/* Return Type */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Return Type</label>
                                        <div className="flex space-x-4">
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    value="refund"
                                                    checked={returnType === "refund"}
                                                    onChange={(e) => setReturnType(e.target.value)}
                                                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                                                />
                                                <span className="ml-2 text-sm text-gray-700">Refund</span>
                                            </label>
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    value="exchange"
                                                    checked={returnType === "exchange"}
                                                    onChange={(e) => setReturnType(e.target.value)}
                                                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                                                />
                                                <span className="ml-2 text-sm text-gray-700">Exchange</span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Return Reason */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Reason for Return *
                                        </label>
                                        <select
                                            value={returnReason}
                                            onChange={(e) => setReturnReason(e.target.value)}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        >
                                            <option value="">Select a reason</option>
                                            {ReturnService.getReturnReasons().map((reason) => (
                                                <option key={reason.value} value={reason.value}>
                                                    {reason.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Description *
                                        </label>
                                        <textarea
                                            value={returnDescription}
                                            onChange={(e) => setReturnDescription(e.target.value)}
                                            required
                                            rows={4}
                                            placeholder="Please describe the issue in detail..."
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>

                                    {/* Refund Method (only for refunds) */}
                                    {returnType === "refund" && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Refund Method
                                            </label>
                                            <select
                                                value={refundMethod}
                                                onChange={(e) => setRefundMethod(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            >
                                                <option value="original_payment">Original Payment Method</option>
                                                <option value="store_credit">Store Credit</option>
                                                <option value="bank_transfer">Bank Transfer</option>
                                            </select>
                                        </div>
                                    )}

                                    {/* Total Amount */}
                                    <div className="bg-gray-50 p-4 rounded-xl">
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-semibold text-gray-900">Total Return Amount:</span>
                                            <span className="text-xl font-bold text-indigo-600">
                                                ₹{calculateTotalAmount().toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        {selectedItems.some(item => item.selected) && (
                            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {submitting ? (
                                        <div className="flex items-center justify-center space-x-2">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            <span>Submitting Return Request...</span>
                                        </div>
                                    ) : (
                                        "Submit Return Request"
                                    )}
                                </button>
                            </div>
                        )}
                    </form>
                )}
            </div>
        </div>
    );
}