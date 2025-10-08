"use client";
import { FiCreditCard } from "react-icons/fi";

export default function OrderSummary({ order }) {
    const getDeliveryFee = () => {
        // Use backend-calculated delivery fee if available
        if (order.orderTotal?.deliveryFee !== undefined) {
            return `₹${order.orderTotal.deliveryFee}`;
        }

        // Fallback to frontend calculation for older orders
        if (order.deliveryMethod === 'homeDelivery') return '₹150';
        if (order.deliveryMethod === 'storeDelivery') return '₹100';
        return (order.orderTotal?.subtotal || order.totalPrice) > 500 ? 'Free' : '₹50';
    };

    return (
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
                    <span className="font-semibold">{getDeliveryFee()}</span>
                </div>
                {/* Tax removed per request */}
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
    );
}