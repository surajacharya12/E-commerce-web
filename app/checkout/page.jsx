// components/checkout/CheckOut.js
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../app/context/CartContext";
import { useAuth } from "../../app/hooks/useAuth";
import { toast } from "react-toastify";
import API_URL from "../api/api";
import DeliveryMethodStep from "./components/DeliveryMethodStep";
import PaymentMethodStep from "./components/PaymentMethodStep";
import CashOnDelivery from "./components/CashOnDelivery";
import OnlinePayment from "./components/OnlinePayment";
import OrderSummary from "./components/OrderSummary"; // New summary component

export const PAYMENT_METHODS = {
    COD: "cashOnDelivery",
    ONLINE: "onlinePayment",
};

export const DELIVERY_METHODS = {
    HOME: "homeDelivery",
    STORE: "storeDelivery",
};

export const CHECKOUT_STEPS = {
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
    const [loadingStores, setLoadingStores] = useState(false);

    const { cart, loading: cartLoading } = useCart();
    const { isLoggedIn, loading: authLoading } = useAuth();
    const router = useRouter();

    const getDeliveryFee = () => {
        if (!selectedDelivery) return 0;
        return selectedDelivery === DELIVERY_METHODS.HOME ? 150 : 100;
    };

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
        total: (cart.totalAmount || 0) + getDeliveryFee(),
    };

    useEffect(() => {
        if (authLoading || cartLoading) return;

        if (!isLoggedIn) {
            router.push('/signin');
            return;
        }

        if (!cart.items || cart.items.length === 0) {
            router.push('/cart');
            return;
        }
    }, [isLoggedIn, cart.items, cartLoading, authLoading, router]);

    const fetchStoreLocations = async () => {
        setLoadingStores(true);
        try {
            const response = await fetch(`${API_URL}/stores`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const result = await response.json();
            if (result.success && result.data) {
                setStoreLocations(result.data);
            } else {
                toast.error('Failed to load store locations');
            }
        } catch (error) {
            console.error('Error fetching store locations:', error);
            toast.error('Failed to load store locations. Please try again.');
        } finally {
            setLoadingStores(false);
        }
    };

    const handleDeliveryMethodSelect = (method) => {
        setSelectedDelivery(method);
        if (method === DELIVERY_METHODS.STORE) {
            fetchStoreLocations();
            // Stays on this step until a store is selected
        } else {
            setCurrentStep(CHECKOUT_STEPS.PAYMENT_METHOD);
        }
    };

    const handleStoreSelect = (store) => {
        setSelectedStore(store);
        setCurrentStep(CHECKOUT_STEPS.PAYMENT_METHOD);
    };

    const handlePaymentMethodSelect = (method) => {
        setSelectedPayment(method);
        setCurrentStep(CHECKOUT_STEPS.PAYOUT_FORM);
    };

    const handleOrderSubmit = async (paymentData) => {
        // This logic is typically handled within CashOnDelivery/OnlinePayment
        // These components will make the actual API call.
        console.log("Order submitted (via parent):", paymentData);
        // After successful submission, you'd navigate to an order confirmation page
        // router.push('/order-confirmation');
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
    };

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

    if (!isLoggedIn || !cart.items || cart.items.length === 0) {
        return null; // Redirect handled by useEffect
    }

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
                gridTemplateColumns: currentStep === CHECKOUT_STEPS.PAYMENT_FORM ? '1fr' : '1fr 350px', // Adjust layout for payment form
                gap: '30px',
                alignItems: 'start'
            }}>
                {currentStep === CHECKOUT_STEPS.DELIVERY_METHOD && (
                    <DeliveryMethodStep
                        selectedDelivery={selectedDelivery}
                        storeLocations={storeLocations}
                        loadingStores={loadingStores}
                        selectedStore={selectedStore}
                        onDeliveryMethodSelect={handleDeliveryMethodSelect}
                        onStoreSelect={handleStoreSelect}
                    />
                )}

                {currentStep === CHECKOUT_STEPS.PAYMENT_METHOD && (
                    <PaymentMethodStep
                        selectedDelivery={selectedDelivery}
                        selectedStore={selectedStore}
                        onPaymentMethodSelect={handlePaymentMethodSelect}
                        onBack={handleBackToDeliverySelection}
                    />
                )}

                {currentStep === CHECKOUT_STEPS.PAYMENT_FORM && selectedPayment === PAYMENT_METHODS.COD && (
                    <CashOnDelivery
                        onSubmit={handleOrderSubmit}
                        onBack={handleBackToPaymentSelection}
                        deliveryMethod={selectedDelivery}
                        deliveryFee={getDeliveryFee()}
                        selectedStore={selectedStore}
                        orderSummary={orderSummary} // Pass summary for display
                    />
                )}

                {currentStep === CHECKOUT_STEPS.PAYMENT_FORM && selectedPayment === PAYMENT_METHODS.ONLINE && (
                    <OnlinePayment
                        onSubmit={handleOrderSubmit}
                        onBack={handleBackToPaymentSelection}
                        deliveryMethod={selectedDelivery}
                        deliveryFee={getDeliveryFee()}
                        selectedStore={selectedStore}
                        orderSummary={orderSummary} // Pass summary for display
                    />
                )}

                {/* Order Summary is always present unless on payment form which takes full width */}
                {currentStep !== CHECKOUT_STEPS.PAYMENT_FORM && (
                    <OrderSummary
                        orderSummary={orderSummary}
                        selectedDelivery={selectedDelivery}
                        getDeliveryFee={getDeliveryFee}
                    />
                )}
            </div>
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