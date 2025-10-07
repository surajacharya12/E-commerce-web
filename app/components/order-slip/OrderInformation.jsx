"use client";
import { FiCalendar, FiMail, FiHome, FiShoppingBag, FiTruck } from "react-icons/fi";

export default function OrderInformation({ order, userData }) {
    return (
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
    );
}