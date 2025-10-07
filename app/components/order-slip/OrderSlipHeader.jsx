"use client";
import { FiArrowLeft, FiDownload, FiPrinter } from "react-icons/fi";

export default function OrderSlipHeader({
    onBack,
    onDownload,
    onPrint,
    onCancelOrder,
    canCancel
}) {
    return (
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
                <button
                    onClick={onBack}
                    className="p-2 hover:bg-white/50 rounded-xl transition-colors"
                >
                    <FiArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-3xl font-bold text-gray-800">Order Slip</h1>
            </div>
            <div className="flex gap-3">
                <button
                    onClick={onDownload}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
                >
                    <FiDownload className="w-4 h-4" />
                    Download
                </button>
                <button
                    onClick={onPrint}
                    className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-gray-700 transition-colors"
                >
                    <FiPrinter className="w-4 h-4" />
                    Print
                </button>
                {canCancel && (
                    <button
                        onClick={onCancelOrder}
                        className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-red-700 transition-colors"
                    >
                        Cancel Order
                    </button>
                )}
            </div>
        </div>
    );
}