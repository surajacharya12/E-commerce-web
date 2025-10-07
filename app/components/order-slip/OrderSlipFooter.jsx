"use client";
import { FiMail, FiPhone } from "react-icons/fi";
import { contactInfo } from "@/lib/info";

export default function OrderSlipFooter() {
    return (
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
                        {contactInfo.email.display}
                    </span>
                    <span className="flex items-center gap-1">
                        <FiPhone className="w-4 h-4" />
                        {contactInfo.phone.display}
                    </span>
                </p>
                <p className="text-sm mt-4">This order slip is valid until delivery completion.</p>
            </div>
        </div>
    );
}