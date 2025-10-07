"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";
import API_URL from "../../api/api";
import { toast } from "react-toastify";
import OrderCancellation from "../../components/OrderCancellation";
import {
    FiDownload,
    FiPrinter,
    FiCheck,
    FiPackage,
    FiTruck,
    FiHome,
    FiArrowLeft,
    FiClock,
    FiMapPin,
    FiPhone,
    FiMail,
    FiCalendar,
    FiCreditCard,
    FiShoppingBag
} from "react-icons/fi";

export default function OrderSlipPage() {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showCancellation, setShowCancellation] = useState(false);
    const { isLoggedIn, userData, loading: authLoading } = useAuth();
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
            toast.error("Failed to load order slip");
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        window.print();
    };

    const handlePrint = () => {
        window.print();
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <FiClock className="w-6 h-6 text-yellow-500" />;
            case 'processing': return <FiPackage className="w-6 h-6 text-blue-500" />;
            case 'shipped': return <FiTruck className="w-6 h-6 text-purple-500" />;
            case 'delivered': return <FiHome className="w-6 h-6 text-green-500" />;
            default: return <FiPackage className="w-6 h-6 text-gray-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'processing': return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-300';
            case 'delivered': return 'bg-green-100 text-green-800 border-green-300';
            case 'cancelled': return 'bg-red-100 text-red-800 border-red-300';
            default: return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const getStatusMessage = (status) => {
        switch (status) {
            case 'pending': return 'Your order has been placed and is being processed.';
            case 'processing': return 'Your order is being prepared for shipment.';
            case 'shipped': return 'Your order is on the way to your delivery address.';
            case 'delivered': return 'Your order has been successfully delivered.';
            case 'cancelled': return 'Your order has been cancelled.';
            default: return 'Order status is being updated.';
        }
    };

    const getDeliveryEstimate = (orderDate, status, paymentMethod) => {
        if (status === 'delivered') return 'Delivered';
        if (status === 'cancelled') return 'Cancelled';

        const orderDateObj = new Date(orderDate);
        const deliveryDays = paymentMethod === 'cod' ? 5 : 4;
        const estimatedDelivery = new Date(orderDateObj);
        estimatedDelivery.setDate(orderDateObj.getDate() + deliveryDays);

        return estimatedDelivery.toLocaleDateString('en-IN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleCancellationSuccess = (updatedOrder) => {
        setOrder(updatedOrder);
        setShowCancellation(false);
    };

    const canCancelOrder = (orderStatus) => {
        return ['pending', 'processing'].includes(orderStatus.toLowerCase());
    };

    if (loading || authLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading order slip...</p>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Slip Not Found</h2>
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

    // Check if user owns this order
    if (order.userID?._id !== userData?.id && order.userID !== userData?.id) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
                    <p className="text-gray-600 mb-4">You don't have permission to view this order slip.</p>
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
                {/* Header - Hidden in print */}
                <div className="flex items-center justify-between mb-8 print:hidden">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push("/orders")}
                            className="p-2 hover:bg-white/50 rounded-xl transition-colors"
                        >
                            <FiArrowLeft className="w-6 h-6" />
                        </button>
                        <h1 className="text-3xl font-bold text-gray-800">Order Slip</h1>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleDownload}
                            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
                        >
                            <FiDownload className="w-4 h-4" />
                            Download
                        </button>
                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-gray-700 transition-colors"
                        >
                            <FiPrinter className="w-4 h-4" />
                            Print
                        </button>
                        {canCancelOrder(order.orderStatus) && (
                            <button
                                onClick={() => setShowCancellation(true)}
                                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-red-700 transition-colors"
                            >
                                Cancel Order
                            </button>
                        )}
                    </div>
                </div>

                {/* Order Slip */}
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 print:bg-gray-800">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                                    <FiShoppingBag className="w-8 h-8" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold">ShopEase</h2>
                                    <p className="text-indigo-100">Order Slip</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-indigo-100">Order Number</p>
                                <p className="text-3xl font-bold font-mono">
                                    {order.orderNumber || order._id?.slice(-8).toUpperCase()}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Status Banner */}
                    <div className="p-6 bg-gradient-to-r from-gray-50 to-blue-50">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`p-4 rounded-2xl border-2 ${getStatusColor(order.orderStatus)}`}>
                                    {getStatusIcon(order.orderStatus)}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-800 capitalize">
                                        Order {order.orderStatus}
                                    </h3>
                                    <p className="text-gray-600 text-lg">
                                        {getStatusMessage(order.orderStatus)}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-gray-600">Expected Delivery</p>
                                <p className="text-lg font-bold text-indigo-600">
                                    {getDeliveryEstimate(order.orderDate, order.orderStatus, order.paymentMethod)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Order Progress */}
                    <div className="p-6 bg-white">
                        <h3 className="text-xl font-bold text-gray-800 mb-6">Order Progress</h3>
                        <div className="flex items-center justify-between relative">
                            <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 rounded-full">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${order.orderStatus === 'pending' ? 'w-1/4 bg-yellow-500' :
                                        order.orderStatus === 'processing' ? 'w-2/4 bg-blue-500' :
                                            order.orderStatus === 'shipped' ? 'w-3/4 bg-purple-500' :
                                                order.orderStatus === 'delivered' ? 'w-full bg-green-500' :
                                                    'w-0 bg-gray-400'
                                        }`}
                                />
                            </div>

                            {['pending', 'processing', 'shipped', 'delivered'].map((status, index) => (
                                <div key={status} className="flex flex-col items-center relative z-10">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 ${order.orderStatus === status ? 'bg-indigo-600 border-indigo-600 text-white' :
                                        ['pending', 'processing', 'shipped', 'delivered'].indexOf(order.orderStatus) > index ?
                                            'bg-green-500 border-green-500 text-white' :
                                            'bg-white border-gray-300 text-gray-400'
                                        }`}>
                                        {status === 'pending' && <FiClock className="w-5 h-5" />}
                                        {status === 'processing' && <FiPackage className="w-5 h-5" />}
                                        {status === 'shipped' && <FiTruck className="w-5 h-5" />}
                                        {status === 'delivered' && <FiHome className="w-5 h-5" />}
                                    </div>
                                    <p className={`mt-2 text-sm font-medium capitalize ${order.orderStatus === status ? 'text-indigo-600' :
                                        ['pending', 'processing', 'shipped', 'delivered'].indexOf(order.orderStatus) > index ?
                                            'text-green-600' : 'text-gray-400'
                                        }`}>
                                        {status}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Details Grid */}
                    <div className="p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                            {/* Order Information */}
                            <div className="bg-gray-50 rounded-2xl p-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <FiCalendar className="w-5 h-5 text-indigo-600" />
                                    Order Information
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Order Date:</span>
                                        <span className="font-semibold">
                                            {new Date(order.orderDate).toLocaleDateString('en-IN', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Order Number:</span>
                                        <span className="font-semibold font-mono">
                                            {order.orderNumber || order._id?.slice(-8).toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Payment Method:</span>
                                        <span className="font-semibold capitalize">
                                            {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Delivery Method:</span>
                                        <span className="font-semibold capitalize flex items-center gap-1">
                                            {order.deliveryMethod === 'homeDelivery' ? (
                                                <>
                                                    <FiHome className="w-4 h-4 text-green-600" />
                                                    Home Delivery
                                                </>
                                            ) : order.deliveryMethod === 'storeDelivery' ? (
                                                <>
                                                    <FiShoppingBag className="w-4 h-4 text-blue-600" />
                                                    Store Pickup
                                                </>
                                            ) : (
                                                <>
                                                    <FiTruck className="w-4 h-4 text-gray-600" />
                                                    Standard Delivery
                                                </>
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Total Amount:</span>
                                        <span className="font-bold text-xl text-indigo-600">₹{order.totalPrice}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Customer Information */}
                            <div className="bg-blue-50 rounded-2xl p-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <FiMail className="w-5 h-5 text-blue-600" />
                                    Customer Information
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Name:</span>
                                        <span className="font-semibold">
                                            {order.userID?.name || userData?.name || 'N/A'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Email:</span>
                                        <span className="font-semibold">
                                            {order.userID?.email || userData?.email || 'N/A'}
                                        </span>
                                    </div>
                                    {order.shippingAddress?.phone && order.shippingAddress.phone !== 'N/A' && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Phone:</span>
                                            <span className="font-semibold">{order.shippingAddress.phone}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Delivery Information */}
                        <div className="bg-purple-50 rounded-2xl p-6 mb-8">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <FiMapPin className="w-5 h-5 text-purple-600" />
                                {order.deliveryMethod === 'storeDelivery' ? 'Pickup Information' : 'Delivery Address'}
                            </h3>

                            {order.deliveryMethod === 'storeDelivery' ? (
                                <div className="space-y-4">
                                    <div className="bg-blue-100 border border-blue-300 rounded-xl p-4">
                                        <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                                            <FiShoppingBag className="w-5 h-5" />
                                            Store Pickup Details
                                        </h4>
                                        <div className="text-blue-700 space-y-1">
                                            {order.selectedStore ? (
                                                <>
                                                    <p className="font-semibold">{order.selectedStore.storeName}</p>
                                                    <p>{order.selectedStore.storeLocation}</p>
                                                    <p>Nepal</p>
                                                    {order.selectedStore.storePhoneNumber && (
                                                        <p className="font-medium mt-2">📞 {order.selectedStore.storePhoneNumber}</p>
                                                    )}
                                                    <p className="font-medium">Manager: {order.selectedStore.storeManagerName}</p>
                                                    <p className="font-medium">Store Hours: 10:00 AM - 8:00 PM (Mon-Sun)</p>
                                                    <p className="font-medium">Pickup Fee: ₹100</p>
                                                </>
                                            ) : (
                                                <>
                                                    <p className="font-semibold">ShopEase Store - Main Branch</p>
                                                    <p>123 Commerce Street, Shopping District</p>
                                                    <p>Kathmandu, Nepal</p>
                                                    <p className="font-medium mt-2">Store Hours: 10:00 AM - 8:00 PM (Mon-Sun)</p>
                                                    <p className="font-medium">Pickup Fee: ₹100</p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div className="bg-yellow-100 border border-yellow-300 rounded-xl p-4">
                                        <h4 className="font-bold text-yellow-800 mb-2">Pickup Instructions:</h4>
                                        <ul className="text-yellow-700 space-y-1 text-sm">
                                            <li>• Bring a valid ID and this order slip</li>
                                            <li>• Order will be ready for pickup in 2-3 business days</li>
                                            <li>• You'll receive a pickup notification via SMS/Email</li>
                                            <li>• Items will be held for 7 days after notification</li>
                                        </ul>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="text-gray-700 text-lg leading-relaxed">
                                        <p className="font-semibold">{order.shippingAddress?.street}</p>
                                        <p>{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
                                        <p>{order.shippingAddress?.postalCode}, {order.shippingAddress?.country}</p>
                                        {order.shippingAddress?.phone && order.shippingAddress.phone !== 'N/A' && (
                                            <p className="mt-2 font-medium">Contact: {order.shippingAddress.phone}</p>
                                        )}
                                    </div>
                                    <div className="bg-green-100 border border-green-300 rounded-xl p-4">
                                        <h4 className="font-bold text-green-800 mb-2 flex items-center gap-2">
                                            <FiHome className="w-5 h-5" />
                                            Home Delivery Details
                                        </h4>
                                        <div className="text-green-700 space-y-1">
                                            <p className="font-medium">Delivery Fee: ₹150</p>
                                            <p>Estimated Delivery: 3-5 business days</p>
                                            <p>Delivery Time: 9:00 AM - 6:00 PM</p>
                                            <p className="text-sm mt-2">• Please ensure someone is available to receive the order</p>
                                            <p className="text-sm">• ID verification may be required</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Order Items */}
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <FiShoppingBag className="w-5 h-5 text-green-600" />
                                Order Items ({order.items?.length || 0})
                            </h3>
                            <div className="space-y-4">
                                {order.items?.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center p-6 border-2 border-gray-200 rounded-2xl hover:border-indigo-300 transition-colors">
                                        <div className="flex-1">
                                            <h4 className="font-bold text-lg text-gray-800">{item.productName}</h4>
                                            {item.variant && (
                                                <p className="text-gray-600 mt-1">Variant: {item.variant}</p>
                                            )}
                                            <div className="flex items-center gap-4 mt-2">
                                                <span className="text-gray-600">Quantity: {item.quantity}</span>
                                                <span className="text-gray-600">Price: ₹{item.price} each</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-2xl text-indigo-600">
                                                ₹{(item.price * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="bg-gradient-to-r from-gray-50 to-indigo-50 rounded-2xl p-6 mb-8">
                            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <FiCreditCard className="w-5 h-5 text-indigo-600" />
                                Order Summary
                            </h3>
                            <div className="space-y-4 text-lg">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal:</span>
                                    <span className="font-semibold">₹{order.orderTotal?.subtotal || order.totalPrice}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        {order.deliveryMethod === 'storeDelivery' ? 'Pickup Fee:' : 'Delivery Fee:'}
                                    </span>
                                    <span className="font-semibold">
                                        {order.deliveryMethod === 'homeDelivery' ? '₹150' :
                                            order.deliveryMethod === 'storeDelivery' ? '₹100' :
                                                (order.orderTotal?.subtotal || order.totalPrice) > 500 ? 'Free' : '₹50'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tax (10%):</span>
                                    <span className="font-semibold">₹{Math.round((order.orderTotal?.subtotal || order.totalPrice) * 0.1)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Discount:</span>
                                    <span className="font-semibold text-green-600">-₹{order.orderTotal?.discount || 0}</span>
                                </div>
                                <hr className="border-gray-300 my-4" />
                                <div className="flex justify-between text-2xl font-bold">
                                    <span>Total Amount:</span>
                                    <span className="text-indigo-600">₹{order.totalPrice}</span>
                                </div>
                            </div>
                        </div>

                        {/* Tracking Information */}
                        {order.trackingUrl && (
                            <div className="bg-green-50 rounded-2xl p-6 mb-8">
                                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <FiTruck className="w-5 h-5 text-green-600" />
                                    Track Your Order
                                </h3>
                                <a
                                    href={order.trackingUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
                                >
                                    <FiTruck className="w-5 h-5" />
                                    Track Package
                                </a>
                            </div>
                        )}

                        {/* Footer */}
                        <div className="text-center text-gray-500 border-t-2 border-gray-200 pt-8">
                            <div className="mb-4">
                                <h4 className="text-lg font-bold text-gray-800 mb-2">Thank you for shopping with ShopEase!</h4>
                                <p className="text-lg">We appreciate your business and hope you love your purchase.</p>
                            </div>
                            <div className="space-y-2">
                                <p>For any queries or support, contact us:</p>
                                <p className="flex items-center justify-center gap-4">
                                    <span className="flex items-center gap-1">
                                        <FiMail className="w-4 h-4" />
                                        support@shopease.com
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <FiPhone className="w-4 h-4" />
                                        +91-1234567890
                                    </span>
                                </p>
                                <p className="text-sm mt-4">This order slip is valid until delivery completion.</p>
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

            <style jsx global>{`
                @media print {
                    body { margin: 0; }
                    .print\\:hidden { display: none !important; }
                    .print\\:bg-gray-800 { background-color: #1f2937 !important; }
                    @page { margin: 1cm; }
                }
            `}</style>
        </div>
    );
}