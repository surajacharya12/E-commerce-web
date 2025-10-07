"use client";
import React, { useState } from "react";
import { FiX, FiAlertTriangle, FiCheck, FiClock } from "react-icons/fi";
import axios from "axios";
import API_URL from "../api/api";
import { toast } from "react-toastify";

const OrderCancellation = ({ order, onClose, onCancellationSuccess }) => {
    const [reason, setReason] = useState("");
    const [customReason, setCustomReason] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const cancellationReasons = [
        "Changed my mind",
        "Found a better price elsewhere",
        "Ordered by mistake",
        "Delivery taking too long",
        "Product no longer needed",
        "Payment issues",
        "Wrong product selected",
        "Personal emergency",
        "Other (please specify)"
    ];

    const canCancelOrder = (orderStatus) => {
        return ['pending', 'processing'].includes(orderStatus.toLowerCase());
    };

    const handleReasonChange = (selectedReason) => {
        setReason(selectedReason);
        if (selectedReason !== "Other (please specify)") {
            setCustomReason("");
        }
    };

    const handleSubmitCancellation = async () => {
        if (!reason) {
            toast.error("Please select a reason for cancellation");
            return;
        }

        if (reason === "Other (please specify)" && !customReason.trim()) {
            toast.error("Please specify your reason for cancellation");
            return;
        }

        setIsSubmitting(true);

        try {
            const cancellationReason = reason === "Other (please specify)" ? customReason : reason;

            const response = await axios.patch(`${API_URL}/orders/${order._id}/status`, {
                orderStatus: "cancelled",
                cancellationReason: cancellationReason,
                cancelledAt: new Date().toISOString()
            });

            if (response.data.success) {
                toast.success("Order cancelled successfully!");
                if (onCancellationSuccess) {
                    onCancellationSuccess(response.data.data);
                }
                onClose();
            } else {
                throw new Error(response.data.message || "Failed to cancel order");
            }
        } catch (error) {
            console.error("Error cancelling order:", error);
            toast.error(`Failed to cancel order: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!canCancelOrder(order.orderStatus)) {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FiX className="w-8 h-8 text-red-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Cannot Cancel Order</h3>
                        <p className="text-gray-600 mb-6">
                            This order cannot be cancelled as it is already <span className="font-semibold capitalize">{order.orderStatus}</span>.
                        </p>
                        <button
                            onClick={onClose}
                            className="w-full bg-gray-600 text-white py-3 rounded-xl font-semibold hover:bg-gray-700 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (showConfirmation) {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FiAlertTriangle className="w-8 h-8 text-yellow-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Confirm Cancellation</h3>
                        <p className="text-gray-600 mb-4">
                            Are you sure you want to cancel this order?
                        </p>
                        <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
                            <p className="text-sm text-gray-600 mb-2">Order: #{order.orderNumber || order._id?.slice(-8).toUpperCase()}</p>
                            <p className="text-sm text-gray-600 mb-2">Amount: ₹{order.totalPrice}</p>
                            <p className="text-sm text-gray-600">Reason: {reason === "Other (please specify)" ? customReason : reason}</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowConfirmation(false)}
                                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                            >
                                Go Back
                            </button>
                            <button
                                onClick={handleSubmitCancellation}
                                disabled={isSubmitting}
                                className="flex-1 bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                                {isSubmitting ? "Cancelling..." : "Yes, Cancel"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-2xl font-bold text-gray-800">Cancel Order</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <FiX className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Order Info */}
                    <div className="bg-gray-50 rounded-xl p-4 mb-6">
                        <h3 className="font-semibold text-gray-800 mb-2">Order Details</h3>
                        <div className="space-y-1 text-sm text-gray-600">
                            <p>Order Number: <span className="font-mono font-semibold">#{order.orderNumber || order._id?.slice(-8).toUpperCase()}</span></p>
                            <p>Amount: <span className="font-semibold text-green-600">₹{order.totalPrice}</span></p>
                            <p>Status: <span className="font-semibold capitalize">{order.orderStatus}</span></p>
                            <p>Payment: <span className="capitalize">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</span></p>
                        </div>
                    </div>

                    {/* Cancellation Policy */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                        <div className="flex items-start gap-3">
                            <FiClock className="w-5 h-5 text-blue-600 mt-0.5" />
                            <div>
                                <h4 className="font-semibold text-blue-800 mb-1">Cancellation Policy</h4>
                                <ul className="text-sm text-blue-700 space-y-1">
                                    <li>• Orders can be cancelled before they are shipped</li>
                                    <li>• Refunds will be processed within 5-7 business days</li>
                                    <li>• COD orders can be cancelled without any charges</li>
                                    <li>• Online payments will be refunded to the original payment method</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Reason Selection */}
                    <div className="mb-6">
                        <h3 className="font-semibold text-gray-800 mb-3">Why do you want to cancel this order?</h3>
                        <div className="space-y-2">
                            {cancellationReasons.map((reasonOption) => (
                                <label
                                    key={reasonOption}
                                    className={`flex items-center p-3 border-2 rounded-xl cursor-pointer transition-colors ${reason === reasonOption
                                            ? 'border-red-500 bg-red-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="cancellationReason"
                                        value={reasonOption}
                                        checked={reason === reasonOption}
                                        onChange={(e) => handleReasonChange(e.target.value)}
                                        className="sr-only"
                                    />
                                    <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${reason === reasonOption
                                            ? 'border-red-500 bg-red-500'
                                            : 'border-gray-300'
                                        }`}>
                                        {reason === reasonOption && (
                                            <FiCheck className="w-2 h-2 text-white" strokeWidth={3} />
                                        )}
                                    </div>
                                    <span className="text-gray-700">{reasonOption}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Custom Reason Input */}
                    {reason === "Other (please specify)" && (
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Please specify your reason:
                            </label>
                            <textarea
                                value={customReason}
                                onChange={(e) => setCustomReason(e.target.value)}
                                placeholder="Please provide details about why you want to cancel this order..."
                                rows={3}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-red-500 focus:outline-none resize-none"
                                maxLength={500}
                            />
                            <p className="text-xs text-gray-500 mt-1">{customReason.length}/500 characters</p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                        >
                            Keep Order
                        </button>
                        <button
                            onClick={() => setShowConfirmation(true)}
                            disabled={!reason || (reason === "Other (please specify)" && !customReason.trim())}
                            className="flex-1 bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel Order
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderCancellation;