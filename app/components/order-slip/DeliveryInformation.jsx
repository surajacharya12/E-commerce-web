"use client";
import { FiMapPin, FiShoppingBag, FiHome } from "react-icons/fi";

export default function DeliveryInformation({ order }) {
    return (
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
                                    {order.deliveryMethod === 'storeDelivery' && (
                                        <p className="font-medium">Pickup Fee: ₹{order.orderTotal?.deliveryFee || 100}</p>
                                    )}
                                </>
                            ) : (
                                <>
                                    <p className="font-semibold">ShopSwift Store - Main Branch</p>
                                    <p>123 Commerce Street, Shopping District</p>
                                    <p>Kathmandu, Nepal</p>
                                    <p className="font-medium mt-2">Store Hours: 10:00 AM - 8:00 PM (Mon-Sun)</p>
                                    {order.deliveryMethod === 'storeDelivery' && (
                                        <p className="font-medium">Pickup Fee: ₹{order.orderTotal?.deliveryFee || 100}</p>
                                    )}
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
                            {order.deliveryMethod === 'homeDelivery' && (
                                <p className="font-medium">Delivery Fee: ₹{order.orderTotal?.deliveryFee || 150}</p>
                            )}
                            <p>Estimated Delivery: 3-5 business days</p>
                            <p>Delivery Time: 9:00 AM - 6:00 PM</p>
                            <p className="text-sm mt-2">• Please ensure someone is available to receive the order</p>
                            <p className="text-sm">• ID verification may be required</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}