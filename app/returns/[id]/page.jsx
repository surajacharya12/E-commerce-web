"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
    FiRotateCcw,
    FiArrowLeft,
    FiCalendar,
    FiPackage,
    FiDollarSign,
    FiUser,
    FiMapPin,
    FiX,
    FiCheck,
    FiClock,
    FiAlertCircle,
} from "react-icons/fi";
import ReturnService from "../../services/returnService";
import { useAuth } from "../../hooks/useAuth";

export default function ReturnDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const returnId = params.id;
    const { isLoggedIn, userData, loading: authLoading } = useAuth();

    const [returnRequest, setReturnRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cancelling, setCancelling] = useState(false);

    useEffect(() => {
        if (!authLoading) {
            if (!isLoggedIn || !userData) {
                router.push("/signin");
            } else {
                loadReturnDetails();
            }
        }
    }, [isLoggedIn, userData, authLoading, returnId, router]);

    const loadReturnDetails = async () => {
        try {
            setLoading(true);
            setError(null);

            console.log("Loading return details for ID:", returnId);
            const response = await ReturnService.getReturnDetails(returnId);
            console.log("Return details response:", response);

            if (response && response.data) {
                setReturnRequest(response.data);
            } else if (response) {
                setReturnRequest(response);
            } else {
                throw new Error("No return data received");
            }
        } catch (err) {
            console.error("Error loading return details:", err);
            setError(err.message || "Failed to load return details");
        } finally {
            setLoading(false);
        }
    };

    const handleCancelReturn = async () => {
        if (!returnRequest || !userData || !userData._id) return;

        const confirmed = window.confirm(
            "Are you sure you want to cancel this return request? This action cannot be undone."
        );

        if (!confirmed) return;

        try {
            setCancelling(true);
            await ReturnService.cancelReturn(returnId, userData._id);
            await loadReturnDetails();
            alert("Return request cancelled successfully");
        } catch (err) {
            alert(`Error cancelling return: ${err.message}`);
        } finally {
            setCancelling(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getReasonDisplayText = (reason) => {
        const reasons = ReturnService.getReturnReasons();
        const reasonObj = reasons.find((r) => r.value === reason);
        return reasonObj ? reasonObj.label : reason;
    };

    if (authLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Checking authentication...</p>
                </div>
            </div>
        );
    }

    if (!isLoggedIn || !userData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/20 text-center max-w-md">
                    <FiUser className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Authentication Required
                    </h3>
                    <p className="text-gray-600 mb-4">
                        Please sign in to view your return details.
                    </p>
                    <button
                        onClick={() => router.push("/signin")}
                        className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300"
                    >
                        Sign In
                    </button>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading return details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/20 text-center max-w-md">
                    <FiX className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Error Loading Return
                    </h3>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => router.back()}
                        className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    if (!returnRequest) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/20 text-center max-w-md">
                    <FiPackage className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Return Not Found
                    </h3>
                    <p className="text-gray-600 mb-4">
                        The return request you're looking for doesn't exist.
                    </p>
                    <button
                        onClick={() => router.push("/returns")}
                        className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300"
                    >
                        View All Returns
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 mt-16 md:mt-0">
            <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-4 md:py-8">
                {/* Header */}
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-2xl border border-white/20 mb-4 md:mb-8">
                    <div className="flex items-center justify-between">
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
                                <h1 className="text-2xl md:text-3xl font-black text-gray-900">
                                    Return #{returnRequest.returnNumber}
                                </h1>
                                <p className="text-gray-600 text-sm md:text-base">
                                    Order #{returnRequest.orderNumber}
                                </p>
                            </div>
                        </div>
                        <span
                            className={`px-4 py-2 rounded-full text-sm font-medium border ${ReturnService.getStatusColor(
                                returnRequest.returnStatus
                            )}`}
                        >
                            {ReturnService.getStatusDisplayText(
                                returnRequest.returnStatus
                            )}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Return Information */}
                        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">
                                Return Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center space-x-3">
                                    <FiCalendar className="w-5 h-5 text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Requested On
                                        </p>
                                        <p className="font-medium text-gray-900">
                                            {formatDate(returnRequest.returnDate)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <FiPackage className="w-5 h-5 text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Return Type
                                        </p>
                                        <p className="font-medium text-gray-900 capitalize">
                                            {returnRequest.returnType}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <FiDollarSign className="w-5 h-5 text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Return Amount
                                        </p>
                                        <p className="font-medium text-gray-900">
                                            ₹{returnRequest.returnAmount?.toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <FiUser className="w-5 h-5 text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Refund Method
                                        </p>
                                        <p className="font-medium text-gray-900 capitalize">
                                            {returnRequest.refundMethod?.replace("_", " ")}
                                        </p>
                                    </div>
                                </div>
                                {returnRequest.processedAt && (
                                    <div className="flex items-center space-x-3">
                                        <FiCheck className="w-5 h-5 text-gray-500" />
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Processed On
                                            </p>
                                            <p className="font-medium text-gray-900">
                                                {formatDate(returnRequest.processedAt)}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {returnRequest.refundedAt && (
                                    <div className="flex items-center space-x-3">
                                        <FiDollarSign className="w-5 h-5 text-green-500" />
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Refunded On
                                            </p>
                                            <p className="font-medium text-gray-900">
                                                {formatDate(returnRequest.refundedAt)}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Return Details */}
                        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">
                                Return Details
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Reason</p>
                                    <p className="font-medium text-gray-900">
                                        {getReasonDisplayText(returnRequest.returnReason)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Description</p>
                                    <p className="text-gray-700">
                                        {returnRequest.returnDescription}
                                    </p>
                                </div>
                                {returnRequest.adminNotes && (
                                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                                        <p className="text-sm text-blue-600 font-medium mb-1">
                                            Admin Notes
                                        </p>
                                        <p className="text-blue-800">
                                            {returnRequest.adminNotes}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ✅ Fixed Return Items Section */}
                        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">
                                Return Items
                            </h2>
                            <div className="space-y-4">
                                {returnRequest.items && returnRequest.items.length > 0 ? (
                                    returnRequest.items.map((item, index) => (
                                        <div
                                            key={index}
                                            className="border border-gray-200 rounded-xl p-4"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-gray-900">
                                                        {item.productName}
                                                    </h3>
                                                    {item.variant && (
                                                        <p className="text-sm text-gray-600">
                                                            Variant: {item.variant}
                                                        </p>
                                                    )}
                                                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                                                        <span>
                                                            Return Qty: {item.returnQuantity}
                                                        </span>
                                                        <span>
                                                            Price: ₹{item.price?.toFixed(2)}
                                                        </span>
                                                        <span className="capitalize">
                                                            Condition: {item.condition}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold text-gray-900">
                                                        ₹
                                                        {(
                                                            item.price * item.returnQuantity
                                                        )?.toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-600 text-sm">
                                        No items found for this return request.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Status Timeline */}
                        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">
                                Status Timeline
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            Return Requested
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {formatDate(returnRequest.returnDate)}
                                        </p>
                                    </div>
                                </div>

                                {returnRequest.processedAt && (
                                    <div className="flex items-center space-x-3">
                                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                Processed
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {formatDate(returnRequest.processedAt)}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {returnRequest.refundedAt && (
                                    <div className="flex items-center space-x-3">
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                Refunded
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {formatDate(returnRequest.refundedAt)}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {returnRequest.returnStatus === "requested" && (
                                    <div className="flex items-center space-x-3">
                                        <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                                        <div>
                                            <p className="font-medium text-gray-500">
                                                Pending Review
                                            </p>
                                            <p className="text-sm text-gray-400">
                                                Waiting for approval
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        {returnRequest.returnStatus === "requested" && (
                            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">
                                    Actions
                                </h3>
                                <button
                                    onClick={handleCancelReturn}
                                    disabled={cancelling}
                                    className="w-full px-4 py-3 bg-red-500 text-white font-medium rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {cancelling ? (
                                        <div className="flex items-center justify-center space-x-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            <span>Cancelling...</span>
                                        </div>
                                    ) : (
                                        "Cancel Return Request"
                                    )}
                                </button>
                            </div>
                        )}

                        {/* Help */}
                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
                            <div className="text-center">
                                <FiAlertCircle className="w-8 h-8 text-indigo-600 mx-auto mb-3" />
                                <h3 className="text-lg font-bold text-gray-900 mb-2">
                                    Need Help?
                                </h3>
                                <p className="text-gray-600 text-sm mb-4">
                                    Have questions about your return? Our support team is here
                                    to help.
                                </p>
                                <button
                                    onClick={() => router.push("/customer-service")}
                                    className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300"
                                >
                                    Contact Support
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
