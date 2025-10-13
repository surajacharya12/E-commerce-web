// components/checkout/steps/PaymentMethodStep.js
import React from 'react';
import { PAYMENT_METHODS, DELIVERY_METHODS } from '@/app/checkout/page';

export default function PaymentMethodStep({
    selectedDelivery,
    selectedStore,
    onPaymentMethodSelect,
    onBack
}) {
    const deliveryInfo = selectedDelivery === DELIVERY_METHODS.HOME
        ? '🏠 Home Delivery - ₹150'
        : selectedStore
            ? `🏪 ${selectedStore.storeName} - ₹100`
            : '🏪 Store Pickup - ₹100';

    const paymentOptions = [
        {
            id: PAYMENT_METHODS.COD,
            title: 'Cash on Delivery',
            description: 'Pay when your order arrives at your doorstep. No advance payment required.',
            benefits: ['No online payment', 'Cash/Card at delivery', 'Easy returns'],
            icon: '💰',
            color: 'green-100',
            borderColor: 'green-500',
            hoverBg: 'bg-green-50',
            arrowColor: 'text-green-500'
        },
        {
            id: PAYMENT_METHODS.ONLINE,
            title: 'Online Payment',
            description: 'Pay securely with your credit/debit card or UPI. Fast and secure checkout.',
            benefits: ['Instant payment', '256-bit SSL', 'Multiple options'],
            icon: '💳',
            color: 'blue-100',
            borderColor: 'blue-500',
            hoverBg: 'bg-blue-50',
            arrowColor: 'text-blue-500'
        }
    ];

    return (
        <div className="bg-white rounded-2xl shadow-lg p-10 max-w-3xl mx-auto">
            {/* Back Button */}
            <button
                onClick={onBack}
                className="flex items-center gap-3 px-4 py-2 text-slate-600 hover:text-slate-800 transition-all duration-300 hover:bg-slate-100 rounded-xl mb-8"
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m15 18-6-6 6-6" />
                </svg>
                Back to Delivery Method
            </button>

            {/* Title */}
            <div className="text-center mb-10">
                <h2 className="text-4xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-2">
                    💳 Choose Payment Method
                </h2>
                <p className="text-gray-500 text-base mb-3">Select your preferred payment option</p>
                <div className="inline-block px-4 py-2 rounded-lg text-sm text-blue-700 bg-blue-100">
                    {deliveryInfo}
                </div>
            </div>

            {/* Payment Options */}
            <div className="flex flex-col gap-5">
                {paymentOptions.map(option => (
                    <div
                        key={option.id}
                        onClick={() => onPaymentMethodSelect(option.id)}
                        className={`cursor-pointer transition-all duration-300 hover:shadow-xl border-2 border-gray-200 rounded-xl p-6 flex items-center gap-6 hover:${option.hoverBg} hover:border-${option.borderColor} transform hover:-translate-y-1`}
                    >
                        <div className={`w-16 h-16 flex items-center justify-center text-2xl rounded-lg bg-${option.color}`}>
                            {option.icon}
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-800 mb-1">{option.title}</h3>
                            <p className="text-gray-500 text-sm mb-2">{option.description}</p>
                            <div className="flex gap-4 text-xs text-green-500">
                                {option.benefits.map((benefit, idx) => <span key={idx}>✓ {benefit}</span>)}
                            </div>
                        </div>
                        <div className={`text-2xl ${option.arrowColor}`}>→</div>
                    </div>
                ))}
            </div>
        </div>
    );
}