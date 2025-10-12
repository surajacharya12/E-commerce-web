// components/checkout/steps/PaymentMethodStep.js
import React from 'react';
import { PAYMENT_METHODS, DELIVERY_METHODS } from '@/app/checkout/page'; // Import constants

export default function PaymentMethodStep({
    selectedDelivery,
    selectedStore,
    onPaymentMethodSelect,
    onBack
}) {
    return (
        <div className="bg-white rounded-2xl shadow-lg" style={{ padding: '40px' }}>
            {/* Back Button */}
            <div style={{ marginBottom: '32px' }}>
                <button
                    onClick={onBack}
                    className="flex items-center gap-3 px-4 py-2 text-slate-600 hover:text-slate-800 transition-all duration-300 hover:bg-slate-100 rounded-xl"
                    style={{
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500'
                    }}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="m15 18-6-6 6-6" />
                    </svg>
                    Back to Delivery Method
                </button>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h2 style={{
                    fontSize: '32px',
                    fontWeight: '700',
                    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    margin: '0 0 10px 0'
                }}>💳 Choose Payment Method</h2>
                <p style={{ color: '#64748b', fontSize: '16px', margin: '0' }}>
                    Select your preferred payment option
                </p>
                <div style={{
                    marginTop: '12px',
                    padding: '8px 16px',
                    backgroundColor: '#f0f9ff',
                    borderRadius: '8px',
                    fontSize: '14px',
                    color: '#0369a1'
                }}>
                    {selectedDelivery === DELIVERY_METHODS.HOME ?
                        '🏠 Home Delivery - ₹150' :
                        selectedStore ?
                            `🏪 ${selectedStore.storeName} - ₹100` :
                            '🏪 Store Pickup - ₹100'
                    }
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Cash on Delivery Option */}
                <div
                    onClick={() => onPaymentMethodSelect(PAYMENT_METHODS.COD)}
                    className="cursor-pointer transition-all duration-300 hover:shadow-xl"
                    style={{
                        padding: '25px',
                        borderRadius: '16px',
                        border: '2px solid #e2e8f0',
                        backgroundColor: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.borderColor = '#10b981';
                        e.currentTarget.style.backgroundColor = '#ecfdf5';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.borderColor = '#e2e8f0';
                        e.currentTarget.style.backgroundColor = 'white';
                        e.currentTarget.style.transform = 'translateY(0)';
                    }}
                >
                    <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '12px',
                        backgroundColor: '#ecfdf5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px'
                    }}>💰</div>
                    <div style={{ flex: 1 }}>
                        <h3 style={{
                            fontSize: '20px',
                            fontWeight: '600',
                            color: '#1e293b',
                            margin: '0 0 8px 0'
                        }}>Cash on Delivery</h3>
                        <p style={{
                            color: '#64748b',
                            fontSize: '14px',
                            margin: '0'
                        }}>Pay when your order arrives at your doorstep. No advance payment required.</p>
                        <div style={{
                            marginTop: '8px',
                            display: 'flex',
                            gap: '15px',
                            fontSize: '12px',
                            color: '#10b981'
                        }}>
                            <span>✓ No online payment</span>
                            <span>✓ Cash/Card at delivery</span>
                            <span>✓ Easy returns</span>
                        </div>
                    </div>
                    <div style={{ fontSize: '20px', color: '#10b981' }}>→</div>
                </div>

                {/* Online Payment Option */}
                <div
                    onClick={() => onPaymentMethodSelect(PAYMENT_METHODS.ONLINE)}
                    className="cursor-pointer transition-all duration-300 hover:shadow-xl"
                    style={{
                        padding: '25px',
                        borderRadius: '16px',
                        border: '2px solid #e2e8f0',
                        backgroundColor: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.borderColor = '#3b82f6';
                        e.currentTarget.style.backgroundColor = '#eff6ff';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.borderColor = '#e2e8f0';
                        e.currentTarget.style.backgroundColor = 'white';
                        e.currentTarget.style.transform = 'translateY(0)';
                    }}
                >
                    <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '12px',
                        backgroundColor: '#eff6ff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px'
                    }}>💳</div>
                    <div style={{ flex: 1 }}>
                        <h3 style={{
                            fontSize: '20px',
                            fontWeight: '600',
                            color: '#1e293b',
                            margin: '0 0 8px 0'
                        }}>Online Payment</h3>
                        <p style={{
                            color: '#64748b',
                            fontSize: '14px',
                            margin: '0'
                        }}>Pay securely with your credit/debit card or UPI. Fast and secure checkout.</p>
                        <div style={{
                            marginTop: '8px',
                            display: 'flex',
                            gap: '15px',
                            fontSize: '12px',
                            color: '#3b82f6'
                        }}>
                            <span>✓ Instant payment</span>
                            <span>✓ 256-bit SSL</span>
                            <span>✓ Multiple options</span>
                        </div>
                    </div>
                    <div style={{ fontSize: '20px', color: '#3b82f6' }}>→</div>
                </div>
            </div>
        </div>
    );
}