"use client";
import React from "react";
import { FiDownload, FiPrinter, FiCheck, FiPackage, FiTruck, FiHome } from "react-icons/fi";
import { contactInfo } from "@/lib/info";

const OrderReceipt = ({ order, onClose, onDownload, onPrint }) => {
    if (!order) return null;

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <FiPackage className="w-5 h-5 text-yellow-500" />;
            case 'processing': return <FiPackage className="w-5 h-5 text-blue-500" />;
            case 'shipped': return <FiTruck className="w-5 h-5 text-purple-500" />;
            case 'delivered': return <FiHome className="w-5 h-5 text-green-500" />;
            default: return <FiPackage className="w-5 h-5 text-gray-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
            case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                <FiCheck className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">Order Confirmed!</h2>
                                <p className="text-indigo-100">Thank you for your purchase</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Receipt Content */}
                <div className="p-6" id="receipt-content">
                    {/* Order Info */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-3 bg-gray-50 px-6 py-3 rounded-xl">
                            <span className="text-gray-600 font-medium">Order Number:</span>
                            <span className="text-2xl font-bold text-indigo-600 font-mono">
                                {order.orderNumber || order._id?.slice(-8).toUpperCase()}
                            </span>
                        </div>
                        <p className="text-gray-500 mt-2">
                            {new Date(order.orderDate).toLocaleDateString('en-IN', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </p>
                    </div>

                    {/* Status */}
                    <div className="mb-8">
                        <div className={`inline-flex items-center gap-3 px-4 py-3 rounded-xl border ${getStatusColor(order.orderStatus)}`}>
                            {getStatusIcon(order.orderStatus)}
                            <span className="font-semibold capitalize">Order {order.orderStatus}</span>
                        </div>
                    </div>

                    {/* Items */}
                    <div className="mb-8">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Order Items</h3>
                        <div className="space-y-4">
                            {order.items?.map((item, index) => (
                                <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-800">{item.productName}</h4>
                                        {item.variant && (
                                            <p className="text-sm text-gray-600">Variant: {item.variant}</p>
                                        )}
                                        <p className="text-sm text-gray-600">Qty: {item.quantity} × ₹{item.price}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-lg text-indigo-600">
                                            ₹{(item.price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="mb-8 bg-gray-50 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal:</span>
                                <span className="font-semibold">₹{order.orderTotal?.subtotal || order.totalPrice}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Delivery Fee:</span>
                                <span className="font-semibold">
                                    {(order.orderTotal?.subtotal || order.totalPrice) > 500 ? 'Free' : '₹50'}
                                </span>
                            </div>
                            {/* Tax removed per request */}
                            <div className="flex justify-between">
                                <span className="text-gray-600">Discount:</span>
                                <span className="font-semibold text-green-600">-₹{order.orderTotal?.discount || 0}</span>
                            </div>
                            <hr className="border-gray-300" />
                            <div className="flex justify-between text-xl font-bold">
                                <span>Total:</span>
                                <span className="text-indigo-600">₹{order.totalPrice}</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment & Delivery Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-blue-50 rounded-xl p-4">
                            <h4 className="font-bold text-gray-800 mb-2">Payment Method</h4>
                            <p className="text-gray-600 capitalize">
                                {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                            </p>
                        </div>
                        <div className="bg-green-50 rounded-xl p-4">
                            <h4 className="font-bold text-gray-800 mb-2">Estimated Delivery</h4>
                            <p className="text-gray-600">
                                {order.paymentMethod === 'cod' ? '3-5 business days' : '2-4 business days'}
                            </p>
                        </div>
                    </div>

                    {/* Delivery Address */}
                    <div className="mb-8 bg-purple-50 rounded-xl p-4">
                        <h4 className="font-bold text-gray-800 mb-2">Delivery Address</h4>
                        <div className="text-gray-600">
                            <p>{order.shippingAddress?.street}</p>
                            <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.postalCode}</p>
                            <p>{order.shippingAddress?.country}</p>
                            {order.shippingAddress?.phone && order.shippingAddress.phone !== 'N/A' && (
                                <p className="mt-2">Phone: {order.shippingAddress.phone}</p>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center text-gray-500 text-sm border-t pt-6">
                        <p className="mb-2">Thank you for shopping with ShopSwift!</p>
                        <p>For any queries, contact us at {contactInfo.email.display}</p>
                    </div>
                </div>


            </div>
        </div>
    );
};

export default OrderReceipt;