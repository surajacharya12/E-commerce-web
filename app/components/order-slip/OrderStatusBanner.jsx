"use client";
import { FiShoppingBag } from "react-icons/fi";
import { getStatusIcon, getStatusColor, getStatusMessage, getDeliveryEstimate } from "./OrderSlipUtils";

export default function OrderStatusBanner({ order }) {
    return (
        <>
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
        </>
    );
}