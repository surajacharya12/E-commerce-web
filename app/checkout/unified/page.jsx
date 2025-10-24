"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../context/CartContext";
import { toast } from "react-toastify";
import API_URL from "../../api/api";
import DeliveryMethodStep from "../components/DeliveryMethodStep";
import PaymentMethodStep from "../components/PaymentMethodStep";
import CashOnDelivery from "../components/steps/CashOnDelivery";
import OnlinePayment from "../components/steps/OnlinePayment";
import CheckoutCoupons from "../../../components/CheckoutCoupons";

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

export default function UnifiedCheckout() {
    const [currentStep, setCurrentStep] = useState(CHECKOUT_STEPS.DELIVERY_METHOD);
    const [selectedDelivery, setSelectedDelivery] = useState(null);
    const [selectedStore, setSelectedStore] = useState(null);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [storeLocations, setStoreLocations] = useState([]);
    const [loadingStores, setLoadingStores] = useState(false);
    const [checkoutData, setCheckoutData] = useState(null);
    const [checkoutType, setCheckoutType] = useState(null); // 'cart' or 'buyNow'
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [discountAmount, setDiscountAmount] = useState(0);

    const { isLoggedIn, loading: authLoading } = useAuth();
    const { clearCart } = useCart();
    const router = useRouter();

    useEffect(() => {
        // Check for cart checkout data first
        const cartData = sessionStorage.getItem("checkoutData");
        const buyNowData = sessionStorage.getItem("buyNowData");

        if (cartData) {
            try {
                const data = JSON.parse(cartData);
                if (data.type === "cart") {
                    setCheckoutData(data);
                    setCheckoutType("cart");
                    return;
                }
            } catch (error) {
                console.error("Error parsing cart checkout data:", error);
            }
        }

        if (buyNowData) {
            try {
                const data = JSON.parse(buyNowData);
                if (data.type === "buyNow") {
                    setCheckoutData(data);
                    setCheckoutType("buyNow");
                    return;
                }
            } catch (error) {
                console.error("Error parsing buy now data:", error);
            }
        }

        // No valid checkout data found
        toast.error("No checkout data found");
        router.push("/");
    }, [router]);

    useEffect(() => {
        if (authLoading) return;

        if (!isLoggedIn) {
            router.push('/signin');
            return;
        }
    }, [isLoggedIn, authLoading, router]);

    const getDeliveryFee = () => {
        if (!selectedDelivery) return 0;
        return selectedDelivery === DELIVERY_METHODS.HOME ? 150 : 100;
    };

    const handleCouponApply = async (coupon) => {
        try {
            const subtotal = checkoutType === "cart"
                ? checkoutData.totalAmount
                : checkoutData.product.price * checkoutData.quantity;

            // Calculate discount
            let discount = 0;
            if (coupon.discountType === "percentage") {
                discount = (subtotal * coupon.discountAmount) / 100;
            } else {
                discount = coupon.discountAmount;
            }

            // Ensure discount doesn't exceed subtotal
            discount = Math.min(discount, subtotal);

            setAppliedCoupon(coupon);
            setDiscountAmount(discount);
        } catch (error) {
            console.error('Error applying coupon:', error);
            throw error;
        }
    };

    const handleCouponRemove = () => {
        setAppliedCoupon(null);
        setDiscountAmount(0);
    };

    const orderSummary = checkoutData ? {
        items: checkoutType === "cart"
            ? checkoutData.items
            : [{
                id: checkoutData.product.id,
                name: checkoutData.product.name,
                price: checkoutData.product.price,
                quantity: checkoutData.quantity,
                image: checkoutData.product.image,
                selectedColor: checkoutData.selectedColor,
                selectedSize: checkoutData.selectedSize,
            }],
        subtotal: checkoutType === "cart"
            ? checkoutData.totalAmount
            : checkoutData.product.price * checkoutData.quantity,
        discount: discountAmount,
        deliveryFee: getDeliveryFee(),
        total: (checkoutType === "cart"
            ? checkoutData.totalAmount
            : checkoutData.product.price * checkoutData.quantity) - discountAmount + getDeliveryFee(),
        appliedCoupon: appliedCoupon
    } : null;

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
        setCurrentStep(CHECKOUT_STEPS.PAYMENT_FORM);
    };

    const handleOrderSubmit = async (paymentData) => {
        console.log("Order submitted:", paymentData);

        // Clear checkout data after successful order
        if (checkoutType === "cart") {
            sessionStorage.removeItem("checkoutData");
            // Clear the cart
            await clearCart();
        } else {
            sessionStorage.removeItem("buyNowData");
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
    };

    if (authLoading || !checkoutData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading checkout...</p>
                </div>
            </div>
        );
    }

    if (!isLoggedIn) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>

            <div className="relative z-10 min-h-screen flex items-center justify-center p-4 md:p-8">
                <div className="w-full max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8 md:mb-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl md:rounded-3xl shadow-lg mb-4 md:mb-6">
                            <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5M7 13l-1.1 5m0 0h9.1M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2 md:mb-4">
                            {checkoutType === "cart" ? "Complete Your Order" : "Buy Now Checkout"}
                        </h1>
                        <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
                            {checkoutType === "cart"
                                ? "Review your items and complete your purchase securely"
                                : "Fast and secure checkout for your selected item"}
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        {/* Main Content */}
                        <div className="w-full transition-all duration-500 ease-in-out">
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
                                    orderSummary={orderSummary}
                                    isBuyNow={checkoutType === "buyNow"}
                                    buyNowData={checkoutType === "buyNow" ? checkoutData : null}
                                    isCart={checkoutType === "cart"}
                                    cartData={checkoutType === "cart" ? checkoutData : null}
                                    appliedCoupon={appliedCoupon}
                                    discountAmount={discountAmount}
                                />
                            )}

                            {currentStep === CHECKOUT_STEPS.PAYMENT_FORM && selectedPayment === PAYMENT_METHODS.ONLINE && (
                                <OnlinePayment
                                    onSubmit={handleOrderSubmit}
                                    onBack={handleBackToPaymentSelection}
                                    deliveryMethod={selectedDelivery}
                                    deliveryFee={getDeliveryFee()}
                                    selectedStore={selectedStore}
                                    orderSummary={orderSummary}
                                    isBuyNow={checkoutType === "buyNow"}
                                    buyNowData={checkoutType === "buyNow" ? checkoutData : null}
                                    isCart={checkoutType === "cart"}
                                    cartData={checkoutType === "cart" ? checkoutData : null}
                                    appliedCoupon={appliedCoupon}
                                    discountAmount={discountAmount}
                                />
                            )}

                        </div>

                        {/* Order Summary Below */}
                        {currentStep !== CHECKOUT_STEPS.PAYMENT_FORM && orderSummary && (
                            <div className="mt-8">
                                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 lg:p-8">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                            {checkoutType === "cart" ? "Cart Summary" : "Order Summary"}
                                        </h3>
                                        <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full">
                                            <span className="text-white text-sm font-bold">{orderSummary.items.length}</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                                        {orderSummary.items.map((item, index) => (
                                            <div key={item.id || index} className="group relative overflow-hidden bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 border border-gray-100 hover:shadow-lg transition-all duration-300">
                                                <div className="flex items-center space-x-4">
                                                    {item.image && (
                                                        <div className="relative overflow-hidden rounded-xl">
                                                            <img
                                                                src={item.image}
                                                                alt={item.name}
                                                                className="w-16 h-16 object-cover group-hover:scale-110 transition-transform duration-300"
                                                            />
                                                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                        </div>
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-semibold text-gray-900 truncate">{item.name}</h4>
                                                        <div className="flex items-center space-x-2 mt-1">
                                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                                                Qty: {item.quantity}
                                                            </span>
                                                        </div>
                                                        {item.selectedColor && (
                                                            <div className="flex items-center space-x-1 mt-1">
                                                                <div className="w-3 h-3 rounded-full border border-gray-300" style={{ backgroundColor: item.selectedColor.toLowerCase() }}></div>
                                                                <span className="text-xs text-gray-600">{item.selectedColor}</span>
                                                            </div>
                                                        )}
                                                        {item.selectedSize && (
                                                            <span className="inline-block text-xs text-gray-600 mt-1">Size: {item.selectedSize}</span>
                                                        )}
                                                        <div className="mt-2">
                                                            <p className="font-bold text-lg bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                                                ₹{(item.price * item.quantity).toFixed(2)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Coupon Section for Buy Now */}
                                    {checkoutType === "buyNow" && (
                                        <div className="mb-6">
                                            <CheckoutCoupons
                                                productId={checkoutData.productId}
                                                productName={checkoutData.product.name}
                                                subtotal={orderSummary.subtotal}
                                                onCouponApply={handleCouponApply}
                                                onCouponRemove={handleCouponRemove}
                                                appliedCoupon={appliedCoupon}
                                            />
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-6 border-t border-gray-200">
                                        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100">
                                            <span className="flex items-center text-gray-600">
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                </svg>
                                                Subtotal
                                            </span>
                                            <span className="font-semibold">₹{orderSummary.subtotal.toFixed(2)}</span>
                                        </div>

                                        {orderSummary.discount > 0 && (
                                            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
                                                <span className="flex items-center text-green-700">
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                                    </svg>
                                                    Discount
                                                </span>
                                                <span className="font-semibold text-green-700">-₹{orderSummary.discount.toFixed(2)}</span>
                                            </div>
                                        )}

                                        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                                            <span className="flex items-center text-blue-700">
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                </svg>
                                                Delivery Fee
                                            </span>
                                            <span className="font-semibold text-blue-700">₹{orderSummary.deliveryFee.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200">
                                            <span className="flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent font-bold">
                                                <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                                </svg>
                                                Total
                                            </span>
                                            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent font-bold text-xl">₹{orderSummary.total.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    {orderSummary.discount > 0 && (
                                        <div className="text-center mt-4 p-3 bg-green-50 rounded-xl border border-green-200">
                                            <span className="text-green-700 font-semibold">
                                                🎉 You saved ₹{orderSummary.discount.toFixed(2)} with coupon {appliedCoupon?.couponCode}!
                                            </span>
                                        </div>
                                    )}

                                    {/* Security Badge */}
                                    <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
                                        <div className="flex items-center justify-center space-x-2">
                                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                            <span className="text-sm font-medium text-green-800">Secure Checkout</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}