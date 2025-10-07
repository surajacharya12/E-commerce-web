"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";
import { useAuth } from "../hooks/useAuth";
import CashOnDelivery from "./components/CashOnDelivery";
import OnlinePayment from "./components/OnlinePayment";
import { toast } from "react-toastify";
import API_URL from "../api/api";

const PAYMENT_METHODS = {
    COD: "cashOnDelivery",
    ONLINE: "onlinePayment",
};

const DELIVERY_METHODS = {
    HOME: "homeDelivery",
    STORE: "storeDelivery",
};

const CHECKOUT_STEPS = {
    DELIVERY_METHOD: "deliveryMethod",
    PAYMENT_METHOD: "paymentMethod",
    PAYMENT_FORM: "paymentForm",
};

export default function CheckOut() {
    const [currentStep, setCurrentStep] = useState(CHECKOUT_STEPS.DELIVERY_METHOD);
    const [selectedDelivery, setSelectedDelivery] = useState(null);
    const [selectedStore, setSelectedStore] = useState(null);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [storeLocations, setStoreLocations] = useState([]);
    const [filteredStores, setFilteredStores] = useState([]);
    const [storeSearchTerm, setStoreSearchTerm] = useState("");
    const [loadingStores, setLoadingStores] = useState(false);
    const [showStoreDropdown, setShowStoreDropdown] = useState(false);
    const { cart, loading: cartLoading } = useCart();
    const { isLoggedIn, userData, loading: authLoading } = useAuth();
    const router = useRouter();

    // Calculate delivery fee based on selected delivery method
    const getDeliveryFee = () => {
        if (!selectedDelivery) return 0;
        return selectedDelivery === DELIVERY_METHODS.HOME ? 150 : 100;
    };

    // Calculate order summary from cart
    const orderSummary = {
        items: (cart.items || []).map(item => ({
            id: item.productId._id,
            name: item.productId.name,
            price: item.price,
            quantity: item.quantity,
            image: item.productId.images?.[0]?.url
        })),
        subtotal: cart.totalAmount || 0,
        deliveryFee: getDeliveryFee(),
        tax: Math.round((cart.totalAmount || 0) * 0.1), // 10% tax
        total: (cart.totalAmount || 0) + getDeliveryFee() + Math.round((cart.totalAmount || 0) * 0.1),
    };

    // Redirect if not logged in or cart is empty
    useEffect(() => {
        // Debug logging (remove in production)
        console.log('Checkout useEffect:', {
            authLoading,
            isLoggedIn,
            cartLoading,
            cartItemsLength: cart.items?.length
        });

        // Wait for auth loading to complete before making decisions
        if (authLoading) {
            console.log('Auth still loading, waiting...');
            return;
        }

        // Redirect to signin if not logged in
        if (!isLoggedIn) {
            console.log('User not logged in, redirecting to signin');
            router.push('/signin');
            return;
        }

        // Wait for cart loading to complete before checking if cart is empty
        if (cartLoading) {
            console.log('Cart still loading, waiting...');
            return;
        }

        // Redirect to cart if cart is empty
        if (!cart.items || cart.items.length === 0) {
            console.log('Cart is empty, redirecting to cart page');
            router.push('/cart');
            return;
        }

        console.log('All checks passed, showing checkout');
    }, [isLoggedIn, cart.items, cartLoading, authLoading, router]);

    // Fetch store locations from backend
    const fetchStoreLocations = async () => {
        try {
            setLoadingStores(true);
            const response = await fetch(`${API_URL}/stores`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const result = await response.json();
            if (result.success && result.data) {
                setStoreLocations(result.data);
                setFilteredStores(result.data);
            } else {
                console.error('Failed to fetch store locations:', result.message);
                toast.error('Failed to load store locations');
                setStoreLocations([]);
                setFilteredStores([]);
            }
        } catch (error) {
            console.error('Error fetching store locations:', error);
            toast.error('Failed to load store locations. Please try again.');
            setStoreLocations([]);
            setFilteredStores([]);
        } finally {
            setLoadingStores(false);
        }
    };

    // Filter stores based on search term
    const handleStoreSearch = (searchTerm) => {
        setStoreSearchTerm(searchTerm);
        if (!searchTerm.trim()) {
            setFilteredStores(storeLocations);
            return;
        }

        const filtered = storeLocations.filter(store =>
            store.storeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            store.storeLocation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            store.storeManagerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            store.storeEmail?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredStores(filtered);
    };

    const handleDeliveryMethodSelect = (method) => {
        setSelectedDelivery(method);
        if (method === DELIVERY_METHODS.STORE) {
            // Fetch store locations and show dropdown
            fetchStoreLocations();
            setShowStoreDropdown(true);
        } else {
            // For home delivery, proceed directly to payment method
            setCurrentStep(CHECKOUT_STEPS.PAYMENT_METHOD);
        }
    };

    const handleStoreSelect = (store) => {
        setSelectedStore(store);
        setShowStoreDropdown(false);
        setCurrentStep(CHECKOUT_STEPS.PAYMENT_METHOD);
    };

    const handlePaymentMethodSelect = (method) => {
        setSelectedPayment(method);
        setCurrentStep(CHECKOUT_STEPS.PAYMENT_FORM);
    };

    const handleOrderSubmit = async (paymentData) => {
        try {
            // This will be handled by the individual payment components
            // They will call the backend API directly
            console.log("Order submitted:", paymentData);
        } catch (error) {
            console.error("Error submitting order:", error);
            toast.error("Failed to place order. Please try again.");
        }
    };

    const handleBackToPaymentSelection = () => {
        setCurrentStep(CHECKOUT_STEPS.PAYMENT_METHOD);
        setSelectedPayment(null);
    };

    const handleBackToDeliverySelection = () => {
        setCurrentStep(CHECKOUT_STEPS.DELIVERY_METHOD);
        setSelectedDelivery(null);
        setSelectedStore(null);
        setSelectedPayment(null);
        setShowStoreDropdown(false);
    };

    // Show loading state while cart is loading or user auth is being checked
    if (authLoading || cartLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading checkout...</p>
                </div>
            </div>
        );
    }

    // Don't render anything if user is not logged in (redirect will happen)
    if (!isLoggedIn) {
        return null;
    }

    // Don't render anything if cart is empty (redirect will happen)
    if (!cart.items || cart.items.length === 0) {
        return null;
    }

    // Delivery method selection screen
    if (currentStep === CHECKOUT_STEPS.DELIVERY_METHOD) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            }}>
                <div style={{
                    maxWidth: '800px',
                    width: '100%',
                    display: 'grid',
                    gridTemplateColumns: '1fr 350px',
                    gap: '30px',
                    alignItems: 'start'
                }}>
                    {/* Delivery Method Selection */}
                    <div className="bg-white rounded-2xl shadow-lg" style={{ padding: '40px' }}>
                        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                            <h2 style={{
                                fontSize: '32px',
                                fontWeight: '700',
                                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                margin: '0 0 10px 0'
                            }}>🚚 Choose Delivery Method</h2>
                            <p style={{ color: '#64748b', fontSize: '16px', margin: '0' }}>
                                Select how you'd like to receive your order
                            </p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {/* Home Delivery Option */}
                            <div
                                onClick={() => handleDeliveryMethodSelect(DELIVERY_METHODS.HOME)}
                                className="cursor-pointer transition-all duration-300 hover:shadow-xl"
                                style={{
                                    padding: '25px',
                                    borderRadius: '16px',
                                    border: selectedDelivery === DELIVERY_METHODS.HOME ? '2px solid #10b981' : '2px solid #e2e8f0',
                                    backgroundColor: selectedDelivery === DELIVERY_METHODS.HOME ? '#ecfdf5' : 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '20px'
                                }}
                                onMouseOver={(e) => {
                                    if (selectedDelivery !== DELIVERY_METHODS.HOME) {
                                        e.currentTarget.style.borderColor = '#10b981';
                                        e.currentTarget.style.backgroundColor = '#ecfdf5';
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                    }
                                }}
                                onMouseOut={(e) => {
                                    if (selectedDelivery !== DELIVERY_METHODS.HOME) {
                                        e.currentTarget.style.borderColor = '#e2e8f0';
                                        e.currentTarget.style.backgroundColor = 'white';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                    }
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
                                }}>🏠</div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{
                                        fontSize: '20px',
                                        fontWeight: '600',
                                        color: '#1e293b',
                                        margin: '0 0 8px 0'
                                    }}>Home Delivery</h3>
                                    <p style={{
                                        color: '#64748b',
                                        fontSize: '14px',
                                        margin: '0 0 8px 0'
                                    }}>Get your order delivered directly to your doorstep. Convenient and safe.</p>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '15px',
                                        fontSize: '12px',
                                        color: '#10b981'
                                    }}>
                                        <span>✓ Door-to-door service</span>
                                        <span>✓ 3-5 business days</span>
                                        <span style={{ fontWeight: '600', color: '#ef4444' }}>₹150 delivery charge</span>
                                    </div>
                                </div>
                                <div style={{ fontSize: '20px', color: '#10b981' }}>
                                    {selectedDelivery === DELIVERY_METHODS.HOME ? '✓' : '→'}
                                </div>
                            </div>

                            {/* Store Pickup Option */}
                            <div
                                onClick={() => handleDeliveryMethodSelect(DELIVERY_METHODS.STORE)}
                                className="cursor-pointer transition-all duration-300 hover:shadow-xl"
                                style={{
                                    padding: '25px',
                                    borderRadius: '16px',
                                    border: selectedDelivery === DELIVERY_METHODS.STORE ? '2px solid #3b82f6' : '2px solid #e2e8f0',
                                    backgroundColor: selectedDelivery === DELIVERY_METHODS.STORE ? '#eff6ff' : 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '20px'
                                }}
                                onMouseOver={(e) => {
                                    if (selectedDelivery !== DELIVERY_METHODS.STORE) {
                                        e.currentTarget.style.borderColor = '#3b82f6';
                                        e.currentTarget.style.backgroundColor = '#eff6ff';
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                    }
                                }}
                                onMouseOut={(e) => {
                                    if (selectedDelivery !== DELIVERY_METHODS.STORE) {
                                        e.currentTarget.style.borderColor = '#e2e8f0';
                                        e.currentTarget.style.backgroundColor = 'white';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                    }
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
                                }}>🏪</div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{
                                        fontSize: '20px',
                                        fontWeight: '600',
                                        color: '#1e293b',
                                        margin: '0 0 8px 0'
                                    }}>Store Pickup</h3>
                                    <p style={{
                                        color: '#64748b',
                                        fontSize: '14px',
                                        margin: '0 0 8px 0'
                                    }}>Pick up your order from our store. Save on delivery charges.</p>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '15px',
                                        fontSize: '12px',
                                        color: '#3b82f6'
                                    }}>
                                        <span>✓ Ready in 2-3 days</span>
                                        <span>✓ No waiting at home</span>
                                        <span style={{ fontWeight: '600', color: '#ef4444' }}>₹100 pickup charge</span>
                                    </div>
                                </div>
                                <div style={{ fontSize: '20px', color: '#3b82f6' }}>
                                    {selectedDelivery === DELIVERY_METHODS.STORE ? '✓' : '→'}
                                </div>
                            </div>

                            {/* Store Selection Dropdown */}
                            {showStoreDropdown && selectedDelivery === DELIVERY_METHODS.STORE && (
                                <div style={{
                                    marginTop: '20px',
                                    padding: '25px',
                                    borderRadius: '16px',
                                    border: '2px solid #3b82f6',
                                    backgroundColor: '#f8fafc',
                                    animation: 'slideDown 0.3s ease-out'
                                }}>
                                    <h4 style={{
                                        fontSize: '18px',
                                        fontWeight: '600',
                                        color: '#1e293b',
                                        marginBottom: '16px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}>
                                        📍 Select Store Location
                                    </h4>

                                    {/* Search Bar */}
                                    <div style={{
                                        position: 'relative',
                                        marginBottom: '16px'
                                    }}>
                                        <div style={{
                                            position: 'absolute',
                                            left: '12px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            color: '#64748b',
                                            fontSize: '16px'
                                        }}>
                                            🔍
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Search by store name, location, or manager..."
                                            value={storeSearchTerm}
                                            onChange={(e) => handleStoreSearch(e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '12px 12px 12px 40px',
                                                border: '2px solid #e2e8f0',
                                                borderRadius: '12px',
                                                fontSize: '14px',
                                                outline: 'none',
                                                backgroundColor: 'white',
                                                transition: 'border-color 0.2s'
                                            }}
                                            onFocus={(e) => {
                                                e.target.style.borderColor = '#3b82f6';
                                            }}
                                            onBlur={(e) => {
                                                e.target.style.borderColor = '#e2e8f0';
                                            }}
                                        />
                                    </div>

                                    {loadingStores ? (
                                        <div style={{ textAlign: 'center', padding: '20px' }}>
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                                            <p style={{ color: '#64748b' }}>Loading store locations...</p>
                                        </div>
                                    ) : filteredStores.length === 0 ? (
                                        <div style={{ textAlign: 'center', padding: '20px' }}>
                                            <p style={{ color: '#ef4444', fontWeight: '500' }}>
                                                {storeSearchTerm ? 'No stores found matching your search' : 'No store locations available'}
                                            </p>
                                            {storeSearchTerm && (
                                                <button
                                                    onClick={() => handleStoreSearch('')}
                                                    style={{
                                                        marginTop: '8px',
                                                        padding: '6px 12px',
                                                        backgroundColor: '#3b82f6',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '6px',
                                                        fontSize: '12px',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    Clear Search
                                                </button>
                                            )}
                                        </div>
                                    ) : (
                                        <div style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '12px',
                                            maxHeight: '300px',
                                            overflowY: 'auto'
                                        }}>
                                            {filteredStores.map((store) => (
                                                <div
                                                    key={store._id}
                                                    onClick={() => handleStoreSelect(store)}
                                                    className="cursor-pointer transition-all duration-200 hover:shadow-md"
                                                    style={{
                                                        padding: '16px',
                                                        borderRadius: '12px',
                                                        border: '1px solid #e2e8f0',
                                                        backgroundColor: 'white',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '12px'
                                                    }}
                                                    onMouseOver={(e) => {
                                                        e.currentTarget.style.borderColor = '#3b82f6';
                                                        e.currentTarget.style.backgroundColor = '#eff6ff';
                                                    }}
                                                    onMouseOut={(e) => {
                                                        e.currentTarget.style.borderColor = '#e2e8f0';
                                                        e.currentTarget.style.backgroundColor = 'white';
                                                    }}
                                                >
                                                    <div style={{
                                                        width: '50px',
                                                        height: '50px',
                                                        borderRadius: '12px',
                                                        background: store.gradientColor ? `linear-gradient(135deg, var(--${store.gradientColor.replace('from-', '').replace(' to-', ', var(--').replace('-500', '').replace('-400', '')}))` : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '18px',
                                                        color: 'white',
                                                        fontWeight: 'bold'
                                                    }}>
                                                        {store.storeBadge || '🏪'}
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        <h5 style={{
                                                            fontSize: '16px',
                                                            fontWeight: '600',
                                                            color: '#1e293b',
                                                            margin: '0 0 4px 0'
                                                        }}>{store.storeName}</h5>
                                                        <p style={{
                                                            fontSize: '14px',
                                                            color: '#64748b',
                                                            margin: '0'
                                                        }}>
                                                            📍 {store.storeLocation}
                                                        </p>
                                                        <p style={{
                                                            fontSize: '12px',
                                                            color: '#64748b',
                                                            margin: '2px 0 0 0'
                                                        }}>
                                                            👤 Manager: {store.storeManagerName}
                                                        </p>
                                                        {store.storePhoneNumber && (
                                                            <p style={{
                                                                fontSize: '12px',
                                                                color: '#64748b',
                                                                margin: '2px 0 0 0'
                                                            }}>
                                                                📞 {store.storePhoneNumber}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div style={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        gap: '4px'
                                                    }}>
                                                        {store.isActive && (
                                                            <span style={{
                                                                fontSize: '10px',
                                                                backgroundColor: '#10b981',
                                                                color: 'white',
                                                                padding: '2px 6px',
                                                                borderRadius: '4px',
                                                                fontWeight: '500'
                                                            }}>
                                                                ACTIVE
                                                            </span>
                                                        )}
                                                        <div style={{ fontSize: '16px', color: '#3b82f6' }}>→</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order Summary Sidebar */}
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
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#64748b' }}>Tax:</span>
                                <span style={{ color: '#1e293b' }}>₹{orderSummary.tax}</span>
                            </div>
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
                </div>
            </div>
        );
    }

    // Payment method selection screen
    if (currentStep === CHECKOUT_STEPS.PAYMENT_METHOD) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            }}>
                <div style={{
                    maxWidth: '800px',
                    width: '100%',
                    display: 'grid',
                    gridTemplateColumns: '1fr 350px',
                    gap: '30px',
                    alignItems: 'start'
                }}>
                    {/* Payment Method Selection */}
                    <div className="bg-white rounded-2xl shadow-lg" style={{ padding: '40px' }}>
                        {/* Back Button */}
                        <div style={{ marginBottom: '32px' }}>
                            <button
                                onClick={handleBackToDeliverySelection}
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
                                onClick={() => handlePaymentMethodSelect(PAYMENT_METHODS.COD)}
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
                                onClick={() => handlePaymentMethodSelect(PAYMENT_METHODS.ONLINE)}
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

                    {/* Order Summary Sidebar */}
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
                                    {orderSummary.deliveryFee === 0 ? 'Free' : `₹${orderSummary.deliveryFee}`}
                                </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#64748b' }}>Tax:</span>
                                <span style={{ color: '#1e293b' }}>₹{orderSummary.tax}</span>
                            </div>
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
                </div>
            </div>
        );
    }

    // Show selected payment component
    if (currentStep === CHECKOUT_STEPS.PAYMENT_FORM) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100" style={{
                padding: '20px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            }}>
                {selectedPayment === PAYMENT_METHODS.COD && (
                    <CashOnDelivery
                        onSubmit={handleOrderSubmit}
                        onBack={handleBackToPaymentSelection}
                        deliveryMethod={selectedDelivery}
                        deliveryFee={getDeliveryFee()}
                        selectedStore={selectedStore}
                    />
                )}

                {selectedPayment === PAYMENT_METHODS.ONLINE && (
                    <OnlinePayment
                        onSubmit={handleOrderSubmit}
                        onBack={handleBackToPaymentSelection}
                        deliveryMethod={selectedDelivery}
                        deliveryFee={getDeliveryFee()}
                        selectedStore={selectedStore}
                    />
                )}
            </div>
        );
    }

    return (
        <div>
            <style jsx global>{`
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
}