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

        </div>
    );
}