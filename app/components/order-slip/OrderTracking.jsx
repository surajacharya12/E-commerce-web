"use client";
import { FiTruck } from "react-icons/fi";

export default function OrderTracking({ trackingUrl }) {
    if (!trackingUrl) return null;

    return (
        <div className="bg-green-50 rounded-2xl p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FiTruck className="w-5 h-5 text-green-600" />
                Track Your Order
            </h3>
            <a
                href={trackingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
            >
                <FiTruck className="w-5 h-5" />
                Track Package
            </a>
        </div>
    );
}