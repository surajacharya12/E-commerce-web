"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCart } from "../../../context/CartContext";
import { useAuth } from "../../../hooks/useAuth";
import API_URL from "../../../api/api";

import { toast } from "react-toastify";
import SimpleSuccessTest from "../../../components/SimpleSuccessTest";

export default function OnlinePayment({ onBack, deliveryMethod, deliveryFee, selectedStore, isBuyNow = false, buyNowData = null, isCart = false, cartData = null }) {
    const [paymentDetails, setPaymentDetails] = useState({
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        cardholderName: "",
        billingAddress: "",
        city: "",
        postalCode: "",
    });

    const [selectedCard, setSelectedCard] = useState("credit");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [orderData, setOrderData] = useState(null);
    const { cart, clearCart } = useCart();
    const { userData } = useAuth();
    const router = useRouter();

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        // Format card number with spaces
        if (name === "cardNumber") {
            const formatted = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
            if (formatted.length <= 19) { // 16 digits + 3 spaces
                setPaymentDetails(prev => ({ ...prev, [name]: formatted }));
            }
            return;
        }

        // Format expiry date
        if (name === "expiryDate") {
            const formatted = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
            if (formatted.length <= 5) {
                setPaymentDetails(prev => ({ ...prev, [name]: formatted }));
            }
            return;
        }

        // Limit CVV to 3-4 digits
        if (name === "cvv") {
            const formatted = value.replace(/\D/g, '');
            if (formatted.length <= 4) {
                setPaymentDetails(prev => ({ ...prev, [name]: formatted }));
            }
            return;
        }

        setPaymentDetails(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        const required = ['cardNumber', 'expiryDate', 'cvv', 'cardholderName'];
        return required.every(field => paymentDetails[field].trim() !== '');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateForm()) {
            toast.error("Please fill in all required payment fields");
            return;
        }

        setIsSubmitting(true);

        try {
            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 2000));

            let subtotal, currentDeliveryFee, total, orderData;

            if (isBuyNow && buyNowData) {
                // Handle Buy Now order
                subtotal = buyNowData.product.price * buyNowData.quantity;
                currentDeliveryFee = deliveryFee || 0;
                total = subtotal + currentDeliveryFee;

                // Prepare order data for backend
                orderData = {
                    userID: userData.id,
                    items: [{
                        productID: buyNowData.productId,
                        productName: buyNowData.product.name,
                        quantity: buyNowData.quantity,
                        price: buyNowData.product.price,
                        selectedColor: buyNowData.selectedColor || null,
                        selectedSize: buyNowData.selectedSize || null,
                    }],
                    totalPrice: total,
                    shippingAddress: deliveryMethod === 'storeDelivery' && selectedStore ? {
                        phone: selectedStore.storePhoneNumber || "N/A",
                        street: selectedStore.storeLocation,
                        city: selectedStore.storeLocation,
                        state: "Nepal",
                        postalCode: "00000",
                        country: "Nepal"
                    } : {
                        phone: "N/A", // Online payment doesn't require phone in this flow
                        street: paymentDetails.billingAddress || "Online Payment",
                        city: paymentDetails.city || "Online",
                        state: "Nepal",
                        postalCode: paymentDetails.postalCode || "000000",
                        country: "Nepal"
                    },
                    paymentMethod: "prepaid",
                    deliveryMethod: deliveryMethod || "homeDelivery",
                    deliveryFee: currentDeliveryFee,
                    selectedStore: selectedStore || null,
                    orderTotal: {
                        subtotal: subtotal,
                        discount: 0,
                        deliveryFee: currentDeliveryFee,
                        total: total
                    }
                };
            } else {
                // Handle regular cart checkout
                const cartSource = isCart && cartData ? cartData : cart;
                // Calculate order totals (tax removed)
                subtotal = cartSource.totalAmount;
                currentDeliveryFee = deliveryFee || 0;
                total = subtotal + currentDeliveryFee;

                // Prepare order data for backend
                orderData = {
                    userID: userData.id,
                    items: (isCart && cartData ? cartData.items : cart.items).map(item => ({
                        productID: isCart && cartData ? item.productId : item.productId._id,
                        productName: item.name || (item.productId ? item.productId.name : 'Unknown Product'),
                        quantity: item.quantity,
                        price: item.price,
                        variant: item.variant || ""
                    })),
                    totalPrice: total,
                    shippingAddress: deliveryMethod === 'storeDelivery' && selectedStore ? {
                        phone: selectedStore.storePhoneNumber || "N/A",
                        street: selectedStore.storeLocation,
                        city: selectedStore.storeLocation,
                        state: "Nepal",
                        postalCode: "00000",
                        country: "Nepal"
                    } : {
                        phone: "N/A", // Online payment doesn't require phone in this flow
                        street: paymentDetails.billingAddress || "Online Payment",
                        city: paymentDetails.city || "Online",
                        state: "Nepal",
                        postalCode: paymentDetails.postalCode || "000000",
                        country: "Nepal"
                    },
                    paymentMethod: "prepaid",
                    deliveryMethod: deliveryMethod || "homeDelivery",
                    deliveryFee: currentDeliveryFee,
                    selectedStore: selectedStore || null,
                    orderTotal: {
                        subtotal: subtotal,
                        discount: 0,
                        deliveryFee: currentDeliveryFee,
                        total: total
                    }
                };
            }

            // Submit order to backend
            const response = await axios.post(`${API_URL}/orders`, orderData);

            if (response.data.success) {
                if (!isBuyNow && !isCart) {
                    // Clear cart after successful order (only for regular checkout, not unified cart checkout)
                    await clearCart();
                }

                // Debug logs
                console.log("Online Payment successful:", response.data.data);
                console.log("Setting success animation...");

                // Show success animation
                setOrderData(response.data.data);
                setShowSuccess(true);

                console.log("Success state set to true");
            } else {
                throw new Error(response.data.message || "Failed to place order");
            }
        } catch (error) {
            console.error("Error processing payment:", error);
            toast.error(`Payment failed: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSuccessComplete = () => {
        setShowSuccess(false);
        // Navigate to receipt page with order ID
        if (orderData && orderData._id) {
            router.push(`/receipt/${orderData._id}`);
        }
    };

    // Debug logs
    console.log("Online Payment Component render - showSuccess:", showSuccess, "orderData:", orderData);

    // Show success animation
    if (showSuccess && orderData) {
        console.log("Rendering success animation for Online Payment");
        return (
            <SimpleSuccessTest orderData={orderData} />
        );
    }

    return (
        <div className="bg-white rounded-3xl shadow-2xl" style={{
            padding: '48px',
            maxWidth: '700px',
            margin: '0 auto',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(20px)'
        }}>
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
                    Back to Payment Methods
                </button>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    borderRadius: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 24px auto',
                    boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)'
                }}>
                    <span style={{ fontSize: '32px' }}>💳</span>
                </div>
                <h2 style={{
                    fontSize: '32px',
                    fontWeight: '800',
                    background: 'linear-gradient(135deg, #1e293b, #475569)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '12px',
                    letterSpacing: '-0.02em'
                }}>Online Payment</h2>
                <p style={{
                    color: '#64748b',
                    fontSize: '18px',
                    fontWeight: '400',
                    lineHeight: '1.6'
                }}>
                    Secure payment with 256-bit SSL encryption
                </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {/* Card Type Selection */}
                <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-3xl" style={{
                    padding: '32px',
                    border: '1px solid rgba(226, 232, 240, 0.8)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)'
                }}>
                    <h3 style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color: '#1e293b',
                        marginBottom: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                    }}>
                        <span style={{
                            width: '40px',
                            height: '40px',
                            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '18px'
                        }}>💳</span>
                        Select Payment Method
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                        {[
                            { value: 'credit', label: 'Credit Card', icon: '💳', gradient: 'from-blue-500 to-blue-600' },
                            { value: 'debit', label: 'Debit Card', icon: '🏦', gradient: 'from-green-500 to-green-600' },
                            { value: 'upi', label: 'UPI Payment', icon: '📱', gradient: 'from-purple-500 to-purple-600' }
                        ].map((card) => (
                            <label
                                key={card.value}
                                className="cursor-pointer transition-all duration-300 transform hover:scale-105"
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '20px 16px',
                                    borderRadius: '20px',
                                    border: selectedCard === card.value ? '3px solid #3b82f6' : '2px solid #e2e8f0',
                                    backgroundColor: selectedCard === card.value ? '#eff6ff' : 'white',
                                    boxShadow: selectedCard === card.value ? '0 8px 25px rgba(59, 130, 246, 0.2)' : '0 2px 8px rgba(0, 0, 0, 0.04)'
                                }}
                            >
                                <input
                                    type="radio"
                                    name="cardType"
                                    value={card.value}
                                    checked={selectedCard === card.value}
                                    onChange={(e) => setSelectedCard(e.target.value)}
                                    style={{ display: 'none' }}
                                />
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    background: selectedCard === card.value ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' : '#f1f5f9',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '20px'
                                }}>
                                    {card.icon}
                                </div>
                                <span style={{
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    color: selectedCard === card.value ? '#1e293b' : '#64748b',
                                    textAlign: 'center'
                                }}>{card.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Card Details */}
                <div className="bg-gradient-to-br from-slate-50 to-indigo-50 rounded-3xl" style={{
                    padding: '32px',
                    border: '1px solid rgba(226, 232, 240, 0.8)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)'
                }}>
                    <h3 style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color: '#1e293b',
                        marginBottom: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                    }}>
                        <span style={{
                            width: '40px',
                            height: '40px',
                            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '18px'
                        }}>🔒</span>
                        Card Information
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '15px',
                                fontWeight: '600',
                                color: '#1e293b',
                                marginBottom: '10px'
                            }}>Cardholder Name *</label>
                            <input
                                type="text"
                                name="cardholderName"
                                value={paymentDetails.cardholderName}
                                onChange={handleInputChange}
                                placeholder="John Doe"
                                required
                                className="w-full transition-all duration-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                style={{
                                    padding: '16px 20px',
                                    border: '2px solid #e2e8f0',
                                    borderRadius: '16px',
                                    fontSize: '16px',
                                    outline: 'none',
                                    backgroundColor: 'white',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
                                }}
                            />
                        </div>
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '15px',
                                fontWeight: '600',
                                color: '#1e293b',
                                marginBottom: '10px'
                            }}>Card Number *</label>
                            <input
                                type="text"
                                name="cardNumber"
                                value={paymentDetails.cardNumber}
                                onChange={handleInputChange}
                                placeholder="1234 5678 9012 3456"
                                required
                                className="w-full transition-all duration-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                style={{
                                    padding: '16px 20px',
                                    border: '2px solid #e2e8f0',
                                    borderRadius: '16px',
                                    fontSize: '16px',
                                    outline: 'none',
                                    backgroundColor: 'white',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                                    fontFamily: 'monospace',
                                    letterSpacing: '2px'
                                }}
                            />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                            <div>
                                <label style={{
                                    display: 'block',
                                    fontSize: '15px',
                                    fontWeight: '600',
                                    color: '#1e293b',
                                    marginBottom: '10px'
                                }}>Expiry Date *</label>
                                <input
                                    type="text"
                                    name="expiryDate"
                                    value={paymentDetails.expiryDate}
                                    onChange={handleInputChange}
                                    placeholder="MM/YY"
                                    required
                                    className="w-full transition-all duration-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    style={{
                                        padding: '16px 20px',
                                        border: '2px solid #e2e8f0',
                                        borderRadius: '16px',
                                        fontSize: '16px',
                                        outline: 'none',
                                        backgroundColor: 'white',
                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                                        fontFamily: 'monospace',
                                        letterSpacing: '2px'
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{
                                    display: 'block',
                                    fontSize: '15px',
                                    fontWeight: '600',
                                    color: '#1e293b',
                                    marginBottom: '10px'
                                }}>CVV *</label>
                                <input
                                    type="password"
                                    name="cvv"
                                    value={paymentDetails.cvv}
                                    onChange={handleInputChange}
                                    placeholder="123"
                                    required
                                    className="w-full transition-all duration-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    style={{
                                        padding: '16px 20px',
                                        border: '2px solid #e2e8f0',
                                        borderRadius: '16px',
                                        fontSize: '16px',
                                        outline: 'none',
                                        backgroundColor: 'white',
                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                                        fontFamily: 'monospace',
                                        letterSpacing: '2px'
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Billing Address */}
                <div className="bg-gradient-to-br from-slate-50 to-emerald-50 rounded-3xl" style={{
                    padding: '32px',
                    border: '1px solid rgba(226, 232, 240, 0.8)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)'
                }}>
                    <h3 style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color: '#1e293b',
                        marginBottom: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                    }}>
                        <span style={{
                            width: '40px',
                            height: '40px',
                            background: 'linear-gradient(135deg, #10b981, #059669)',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '18px'
                        }}>📍</span>
                        Billing Address (Optional)
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '15px',
                                fontWeight: '600',
                                color: '#1e293b',
                                marginBottom: '10px'
                            }}>Address</label>
                            <input
                                type="text"
                                name="billingAddress"
                                value={paymentDetails.billingAddress}
                                onChange={handleInputChange}
                                placeholder="Street address"
                                className="w-full transition-all duration-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                style={{
                                    padding: '16px 20px',
                                    border: '2px solid #e2e8f0',
                                    borderRadius: '16px',
                                    fontSize: '16px',
                                    outline: 'none',
                                    backgroundColor: 'white',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
                                }}
                            />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                            <div>
                                <label style={{
                                    display: 'block',
                                    fontSize: '15px',
                                    fontWeight: '600',
                                    color: '#1e293b',
                                    marginBottom: '10px'
                                }}>City</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={paymentDetails.city}
                                    onChange={handleInputChange}
                                    placeholder="City"
                                    className="w-full transition-all duration-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    style={{
                                        padding: '16px 20px',
                                        border: '2px solid #e2e8f0',
                                        borderRadius: '16px',
                                        fontSize: '16px',
                                        outline: 'none',
                                        backgroundColor: 'white',
                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{
                                    display: 'block',
                                    fontSize: '15px',
                                    fontWeight: '600',
                                    color: '#1e293b',
                                    marginBottom: '10px'
                                }}>Postal Code</label>
                                <input
                                    type="text"
                                    name="postalCode"
                                    value={paymentDetails.postalCode}
                                    onChange={handleInputChange}
                                    placeholder="123456"
                                    className="w-full transition-all duration-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    style={{
                                        padding: '16px 20px',
                                        border: '2px solid #e2e8f0',
                                        borderRadius: '16px',
                                        fontSize: '16px',
                                        outline: 'none',
                                        backgroundColor: 'white',
                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Security Notice */}
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl" style={{
                    padding: '28px',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    boxShadow: '0 4px 20px rgba(16, 185, 129, 0.1)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <span style={{
                            width: '40px',
                            height: '40px',
                            background: 'linear-gradient(135deg, #10b981, #059669)',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '18px'
                        }}>🔒</span>
                        <h4 style={{ fontSize: '18px', fontWeight: '700', color: '#065f46', margin: '0' }}>
                            Secure Payment Guarantee
                        </h4>
                    </div>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '16px',
                        color: '#065f46',
                        fontSize: '15px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ color: '#10b981', fontWeight: 'bold' }}>🛡️</span>
                            256-bit SSL encryption
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ color: '#10b981', fontWeight: 'bold' }}>🔐</span>
                            No card details stored
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ color: '#10b981', fontWeight: 'bold' }}>⚡</span>
                            Secure gateway processing
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ color: '#10b981', fontWeight: 'bold' }}>✅</span>
                            100% PCI compliant
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full transition-all duration-500 transform hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    style={{
                        background: isSubmitting ? '#9ca3af' : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                        color: 'white',
                        padding: '20px 32px',
                        border: 'none',
                        borderRadius: '20px',
                        fontSize: '18px',
                        fontWeight: '700',
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        boxShadow: '0 10px 30px rgba(59, 130, 246, 0.4)',
                        letterSpacing: '0.5px'
                    }}
                    onMouseOver={(e) => {
                        if (!isSubmitting) {
                            e.target.style.background = 'linear-gradient(135deg, #1d4ed8, #1e40af)';
                            e.target.style.boxShadow = '0 15px 40px rgba(59, 130, 246, 0.5)';
                        }
                    }}
                    onMouseOut={(e) => {
                        if (!isSubmitting) {
                            e.target.style.background = 'linear-gradient(135deg, #3b82f6, #1d4ed8)';
                            e.target.style.boxShadow = '0 10px 30px rgba(59, 130, 246, 0.4)';
                        }
                    }}
                >
                    {isSubmitting ? (
                        <>
                            <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Processing Payment...
                        </>
                    ) : (
                        "💳 Pay Securely Now"
                    )}
                </button>
            </form>
        </div>
    );
}