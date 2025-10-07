"use client";
import { FiShoppingBag } from "react-icons/fi";

export default function OrderItems({ items }) {
    return (
        <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <FiShoppingBag className="w-5 h-5 text-green-600" />
                Order Items ({items?.length || 0})
            </h3>
            <div className="space-y-4">
                {items?.map((item, index) => (
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
    );
}