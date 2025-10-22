"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    FiRotateCcw,
    FiPlus,
    FiFilter,
    FiCalendar,
    FiPackage,
    FiDollarSign,
    FiEye,
    FiX,
    FiRefreshCw,
} from "react-icons/fi";
import ReturnService from "../services/returnService";

export default function ReturnsPage() {
    const router = useRouter();
    const [returns, setReturns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Get user ID from localStorage or context
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        // Get user ID from localStorage
        const storedUserId = localStorage.getItem("userId");
        if (storedUserId) {
            setUserId(storedUserId);
        } else {
            // Redirect to login if no user ID
            router.push("/signin");
        }
    }, [router]);

    useEffect(() => {
        if (userId) {
            loadReturns();
        }
    }, [userId, selectedStatus, currentPage]);

    const loadReturns = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await ReturnService.getUserReturns(userId, {
                page: currentPage,
                limit: 10,
                status: selectedStatus || undefined,
            });

            setReturns(response.data || []);
            setTotalPages(response.pagination?.totalPages || 1);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusFilter = (status) => {
        setSelectedStatus(status);
        setCurrentPage(1);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const statusFilters = [
        { value: "", label: "All Returns" },
        { value: "requested", label: "Requested" },
        { value: "approved", label: "Approved" },
        { value: "rejected", label: "Rejected" },
        { value: "picked_up", label: "Picked Up" },
        { value: "processing", label: "Processing" },
        { value: "refunded", label: "Refunded" },
        { value: "cancelled", label: "Cancelled" },
    ];

    if (!userId) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 mt-20 md:mt-0">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 md:py-8">
                {/* Header */}
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-2xl border border-white/20 mb-4 md:mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center space-x-4 mb-4 md:mb-0">
                            <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
                                <FiRotateCcw className="w-6 h-6 md:w-8 md:h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-black text-gray-900">My Returns</h1>
                                <p className="text-gray-600 text-sm md:text-base">
                                    Manage your return requests and track their status
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => router.push("/returns/create")}
                            className="flex items-center space-x-2 px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                        >
                            <FiPlus className="w-4 h-4 md:w-5 md:h-5" />
                            <span>New Return</span>
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 md:p-6 shadow-xl border border-white/20 mb-6">
                    <div className="flex items-center space-x-4 mb-4">
                        <FiFilter className="w-5 h-5 text-gray-600" />
                        <h3 className="text-lg font-semibold text-gray-900">Filter Returns</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {statusFilters.map((filter) => (
                            <button
                                key={filter.value}
                                onClick={() => handleStatusFilter(filter.value)}
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${selectedStatus === filter.value
                                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Returns List */}
                {loading ? (
                    <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/20">
                        <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mr-3"></div>
                            <span className="text-gray-600">Loading returns...</span>
                        </div>
                    </div>
                ) : error ? (
                    <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/20">
                        <div className="text-center">
                            <FiX className="w-12 h-12 text-red-500 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Returns</h3>
                            <p className="text-gray-600 mb-4">{error}</p>
                            <button
                                onClick={loadReturns}
                                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300"
                            >
                                <FiRefreshCw className="w-4 h-4 inline mr-2" />
                                Try Again
                            </button>
                        </div>
                    </div>
                ) : returns.length === 0 ? (
                    <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/20">
                        <div className="text-center">
                            <FiPackage className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Returns Found</h3>
                            <p className="text-gray-600 mb-6">
                                {selectedStatus
                                    ? `No returns found with status "${statusFilters.find(f => f.value === selectedStatus)?.label}"`
                                    : "You haven't made any return requests yet."}
                            </p>
                            <button
                                onClick={() => router.push("/returns/create")}
                                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300"
                            >
                                <FiPlus className="w-4 h-4 inline mr-2" />
                                Create Return Request
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {returns.map((returnRequest) => (
                            <div
                                key={returnRequest._id}
                                className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 md:p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300"
                            >
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                    <div className="flex-1 mb-4 md:mb-0">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <h3 className="text-lg font-bold text-gray-900">
                                                Return #{returnRequest.returnNumber}
                                            </h3>
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium border ${ReturnService.getStatusColor(
                                                    returnRequest.returnStatus
                                                )}`}
                                            >
                                                {ReturnService.getStatusDisplayText(returnRequest.returnStatus)}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 text-sm mb-2">
                                            Order #{returnRequest.orderNumber}
                                        </p>
                                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                                            <div className="flex items-center space-x-1">
                                                <FiCalendar className="w-4 h-4" />
                                                <span>{formatDate(returnRequest.returnDate)}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <FiPackage className="w-4 h-4" />
                                                <span>{returnRequest.items?.length || 0} item(s)</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <FiDollarSign className="w-4 h-4" />
                                                <span>₹{returnRequest.returnAmount?.toFixed(2) || "0.00"}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <button
                                            onClick={() => router.push(`/returns/${returnRequest._id}`)}
                                            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                                        >
                                            <FiEye className="w-4 h-4" />
                                            <span>View Details</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-white/20 mt-6">
                        <div className="flex items-center justify-between">
                            <button
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <span className="text-gray-600">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}