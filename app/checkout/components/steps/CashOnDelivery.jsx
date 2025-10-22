"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCart } from "../../../context/CartContext";
import { useAuth } from "../../../hooks/useAuth";
import API_URL from "../../../api/api";
import { toast } from "react-toastify";
import OrderSuccessAnimation from "../../../components/OrderSuccessAnimation";

export default function CashOnDelivery({ onBack, deliveryMethod, deliveryFee, selectedStore, isBuyNow = false, buyNowData = null, isCart = false, cartData = null }) {
    const [codDetails, setCodDetails] = useState({
        name: "",
        phone: "",
        address: "",
        city: "",
        postalCode: "",
        alternatePhone: "",
        deliveryInstructions: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [orderData, setOrderData] = useState(null);
    const { cart, clearCart } = useCart();
    const { userData } = useAuth();
    const router = useRouter();

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setCodDetails((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validateForm = () => {
        const required = ['name', 'phone', 'address', 'city', 'postalCode'];
        return required.every(field => codDetails[field].trim() !== '');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("🚀 COD Form submitted");

        if (!validateForm()) {
            console.log("❌ Form validation failed");
            toast.error("Please fill in all required fields");
            return;
        }

        console.log("✅ Form validation passed");
        setIsSubmitting(true);

        try {
            let subtotal, currentDeliveryFee, total, orderData;

            if (isBuyNow && buyNowData) {
                // Handle Buy Now order
                console.log("🛒 Buy Now data:", buyNowData);
                console.log("👤 User data:", userData);

                subtotal = buyNowData.product.price * buyNowData.quantity;
                currentDeliveryFee = deliveryFee || 0;
                total = subtotal + currentDeliveryFee;

                console.log("💰 Buy Now totals:", { subtotal, deliveryFee: currentDeliveryFee, total });

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
                        phone: codDetails.phone,
                        street: codDetails.address,
                        city: codDetails.city,
                        state: "Nepal",
                        postalCode: codDetails.postalCode,
                        country: "Nepal"
                    },
                    paymentMethod: "cod",
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
                console.log("🛒 Cart data:", cartSource);
                console.log("👤 User data:", userData);

                subtotal = cartSource.totalAmount;
                currentDeliveryFee = deliveryFee || 0;
                total = subtotal + currentDeliveryFee;

                console.log("💰 Order totals:", { subtotal, deliveryFee: currentDeliveryFee, total });

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
                        phone: codDetails.phone,
                        street: codDetails.address,
                        city: codDetails.city,
                        state: "Nepal",
                        postalCode: codDetails.postalCode,
                        country: "Nepal"
                    },
                    paymentMethod: "cod",
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
            console.log("📤 Sending order data:", orderData);
            const response = await axios.post(`${API_URL}/orders`, orderData);
            console.log("📥 API Response:", response.data);

            if (response.data.success) {
                // Debug logs
                console.log("✅ COD Order successful:", response.data.data);

                if (!isBuyNow) {
                    console.log("🧹 Clearing cart...");
                    // Clear cart after successful order (only for regular checkout)
                    await clearCart();
                    console.log("✅ Cart cleared");
                }

                console.log("🎬 Setting success animation...");

                // Show success animation
                setOrderData(response.data.data);
                setShowSuccess(true);

                console.log("✅ Success state set to true");

                // Double-check the state was set
                setTimeout(() => {
                    console.log("🔍 Checking state after 100ms - showSuccess:", showSuccess);
                }, 100);
            } else {
                console.log("❌ API returned success: false");
                throw new Error(response.data.message || "Failed to place order");
            }
        } catch (error) {
            console.error("❌ Error placing order:", error);
            console.error("❌ Error details:", error.response?.data);
            toast.error(`Failed to place order: ${error.response?.data?.message || error.message}`);
        } finally {
            console.log("🏁 Setting isSubmitting to false");
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
    console.log("🔄 COD Component render - showSuccess:", showSuccess, "orderData:", !!orderData, "isSubmitting:", isSubmitting);



    // Show success animation
    if (showSuccess && orderData) {
        console.log("🎬 Rendering success animation for COD");
        return (
            <OrderSuccessAnimation
                orderData={orderData}
                onComplete={handleSuccessComplete}
            />
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
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    borderRadius: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 24px auto',
                    boxShadow: '0 20px 40px rgba(16, 185, 129, 0.3)'
                }}>
                    <span style={{ fontSize: '32px' }}>💰</span>
                </div>
                <h2 style={{
                    fontSize: '32px',
                    fontWeight: '800',
                    background: 'linear-gradient(135deg, #1e293b, #475569)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '12px',
                    letterSpacing: '-0.02em'
                }}>Cash on Delivery</h2>
                <p style={{
                    color: '#64748b',
                    fontSize: '18px',
                    fontWeight: '400',
                    lineHeight: '1.6'
                }}>
                    Pay when your order arrives at your doorstep
                </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {/* Personal Information */}
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
                        }}>👤</span>
                        Personal Information
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '15px',
                                fontWeight: '600',
                                color: '#1e293b',
                                marginBottom: '10px'
                            }}>Full Name *</label>
                            <input
                                type="text"
                                name="name"
                                value={codDetails.name}
                                onChange={handleInputChange}
                                placeholder="Enter your full name"
                                required
                                className="w-full transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                            }}>Phone Number *</label>
                            <input
                                type="tel"
                                name="phone"
                                value={codDetails.phone}
                                onChange={handleInputChange}
                                placeholder="+1 (555) 123-4567"
                                required
                                className="w-full transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    <div style={{ marginTop: '24px' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '15px',
                            fontWeight: '600',
                            color: '#1e293b',
                            marginBottom: '10px'
                        }}>Alternate Phone (Optional)</label>
                        <input
                            type="tel"
                            name="alternatePhone"
                            value={codDetails.alternatePhone}
                            onChange={handleInputChange}
                            placeholder="Alternate contact number"
                            className="w-full transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

                {/* Delivery Address */}
                <div className="bg-gradient-to-br from-slate-50 to-purple-50 rounded-3xl" style={{
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
                            background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '18px'
                        }}>📍</span>
                        Delivery Address
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '15px',
                                fontWeight: '600',
                                color: '#1e293b',
                                marginBottom: '10px'
                            }}>Street Address *</label>
                            <input
                                type="text"
                                name="address"
                                value={codDetails.address}
                                onChange={handleInputChange}
                                placeholder="House/Flat No., Street, Area"
                                required
                                className="w-full transition-all duration-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
                                }}>City *</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={codDetails.city}
                                    onChange={handleInputChange}
                                    placeholder="Enter city"
                                    required
                                    className="w-full transition-all duration-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
                                }}>Postal Code *</label>
                                <input
                                    type="text"
                                    name="postalCode"
                                    value={codDetails.postalCode}
                                    onChange={handleInputChange}
                                    placeholder="123456"
                                    required
                                    className="w-full transition-all duration-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '15px',
                                fontWeight: '600',
                                color: '#1e293b',
                                marginBottom: '10px'
                            }}>Delivery Instructions (Optional)</label>
                            <textarea
                                name="deliveryInstructions"
                                value={codDetails.deliveryInstructions}
                                onChange={handleInputChange}
                                placeholder="Any special instructions for delivery..."
                                rows="4"
                                className="w-full transition-all duration-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                style={{
                                    padding: '16px 20px',
                                    border: '2px solid #e2e8f0',
                                    borderRadius: '16px',
                                    fontSize: '16px',
                                    outline: 'none',
                                    resize: 'vertical',
                                    minHeight: '100px',
                                    backgroundColor: 'white',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* COD Information */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl" style={{
                    padding: '28px',
                    border: '1px solid rgba(251, 191, 36, 0.3)',
                    boxShadow: '0 4px 20px rgba(251, 191, 36, 0.1)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <span style={{
                            width: '40px',
                            height: '40px',
                            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '18px'
                        }}>ℹ️</span>
                        <h4 style={{ fontSize: '18px', fontWeight: '700', color: '#92400e', margin: '0' }}>
                            Cash on Delivery Information
                        </h4>
                    </div>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '16px',
                        color: '#92400e',
                        fontSize: '15px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span>
                            Payment collected at delivery
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span>
                            Keep exact change ready
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span>
                            {deliveryMethod === 'homeDelivery' ? 'Home Delivery: ₹150' :
                                selectedStore ? `Store Pickup at ${selectedStore.storeName}: ₹100` : 'Store Pickup: ₹100'}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span>
                            Delivery: 3-5 business days
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full transition-all duration-500 transform hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    style={{
                        background: isSubmitting ? '#9ca3af' : 'linear-gradient(135deg, #10b981, #059669)',
                        color: 'white',
                        padding: '20px 32px',
                        border: 'none',
                        borderRadius: '20px',
                        fontSize: '18px',
                        fontWeight: '700',
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        boxShadow: '0 10px 30px rgba(16, 185, 129, 0.4)',
                        letterSpacing: '0.5px'
                    }}
                    onMouseOver={(e) => {
                        if (!isSubmitting) {
                            e.target.style.background = 'linear-gradient(135deg, #059669, #047857)';
                            e.target.style.boxShadow = '0 15px 40px rgba(16, 185, 129, 0.5)';
                        }
                    }}
                    onMouseOut={(e) => {
                        if (!isSubmitting) {
                            e.target.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                            e.target.style.boxShadow = '0 10px 30px rgba(16, 185, 129, 0.4)';
                        }
                    }}
                >
                    {isSubmitting ? (
                        <>
                            <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Processing Order...
                        </>
                    ) : (
                        "💰 Confirm Cash on Delivery Order"
                    )}
                </button>


            </form>
        </div>
    );
}
