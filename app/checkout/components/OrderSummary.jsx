// components/checkout/components/OrderSummary.js
import React from 'react';

export default function OrderSummary({ orderSummary, selectedDelivery, getDeliveryFee }) {
    return (
        <div className="bg-white rounded-2xl shadow-lg" style={{
            padding: '30px',
            height: 'fit-content'
        }}>
            <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#1e293b',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            }}>📋 Order Summary</h3>

            <div style={{ marginBottom: '20px' }}>
                {orderSummary.items.map((item, index) => (
                    <div key={index} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '10px 0',
                        borderBottom: index < orderSummary.items.length - 1 ? '1px solid #f1f5f9' : 'none'
                    }}>
                        <div>
                            <div style={{ fontWeight: '500', color: '#1e293b' }}>{item.name}</div>
                            <div style={{ fontSize: '14px', color: '#64748b' }}>Qty: {item.quantity}</div>
                        </div>
                        <div style={{ fontWeight: '600', color: '#1e293b' }}>
                            ₹{item.price * item.quantity}
                        </div>
                    </div>
                ))}
            </div>

            <div style={{
                borderTop: '2px solid #f1f5f9',
                paddingTop: '15px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Subtotal:</span>
                    <span style={{ color: '#1e293b' }}>₹{orderSummary.subtotal}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Delivery:</span>
                    <span style={{ color: '#1e293b' }}>
                        {selectedDelivery ? `₹${getDeliveryFee()}` : 'Select delivery method'}
                    </span>
                </div>
                {orderSummary.discount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#16a34a' }}>
                            Discount ({orderSummary.appliedCoupon?.couponDetails?.couponCode}):
                        </span>
                        <span style={{ color: '#16a34a', fontWeight: '600' }}>
                            -₹{orderSummary.discount.toFixed(2)}
                        </span>
                    </div>
                )}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#1e293b',
                    paddingTop: '8px',
                    borderTop: '1px solid #f1f5f9'
                }}>
                    <span>Total:</span>
                    <span>₹{orderSummary.total}</span>
                </div>
            </div>
        </div>
    );
}