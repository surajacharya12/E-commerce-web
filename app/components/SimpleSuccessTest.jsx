"use client";
import React from "react";
import { FiCheck } from "react-icons/fi";

const SimpleSuccessTest = ({ orderData }) => {
    console.log("SimpleSuccessTest rendered with orderData:", orderData);

    return (
        <div className="fixed inset-0 bg-green-100 flex items-center justify-center z-50">
            <div className="text-center">
                <div className="w-32 h-32 mx-auto rounded-full bg-green-500 flex items-center justify-center mb-4">
                    <FiCheck className="w-16 h-16 text-white" strokeWidth={3} />
                </div>
                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                    🎉 Order Confirmed!
                </h1>
                <p className="text-xl text-gray-600 mb-4">
                    Order Number: {orderData?.orderNumber || orderData?._id?.slice(-8)}
                </p>
                <p className="text-lg text-gray-600">
                    Total: ₹{orderData?.totalPrice}
                </p>
            </div>
        </div>
    );
};

export default SimpleSuccessTest;