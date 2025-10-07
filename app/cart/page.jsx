"use client";
import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiArrowLeft } from "react-icons/fi";
import { displayPrice } from "../utils/currency";

const CartPage = () => {
    const { cart, updateQuantity, removeFromCart, clearCart, loading } = useCart();
    const { isLoggedIn } = useAuth();
    const router = useRouter();
    const [expandedDescriptions, setExpandedDescriptions] = useState({});

    const toggleDescription = (itemId) => {
        setExpandedDescriptions(prev => ({
            ...prev,
            [itemId]: !prev[itemId]
        }));
    };

    const truncateText = (text, maxLength = 100) => {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Please Login</h2>
                    <p className="text-gray-600 mb-6">You need to login to view your cart</p>
                    <button
                        onClick={() => router.push('/signin')}
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                    >
                        Login Now
                    </button>
                </div>
            </div>
        );
    }

    const handleQuantityChange = async (productId, newQuantity) => {
        if (newQuantity < 1) return;
        try {
            await updateQuantity(productId, newQuantity);
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    const handleRemoveItem = async (productId) => {
        try {
            await removeFromCart(productId);
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    const handleClearCart = async () => {
        if (window.confirm('Are you sure you want to clear your cart?')) {
            try {
                await clearCart();
            } catch (error) {
                console.error('Error clearing cart:', error);
            }
        }
    };

    if (cart.items.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <div className="text-center py-16">
                        <div className="w-32 h-32 mx-auto mb-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <FiShoppingBag className="w-16 h-16 text-gray-400" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
                        <p className="text-gray-600 mb-8">Looks like you haven't added anything to your cart yet</p>
                        <button
                            onClick={() => router.push('/live-shopping')}
                            className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
                        >
                            <FiArrowLeft className="w-5 h-5" />
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 mt-10">
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.back()}
                            className="p-2 hover:bg-white/50 rounded-xl transition-colors"
                        >
                            <FiArrowLeft className="w-6 h-6 text-gray-600" />
                        </button>
                        <h1 className="text-3xl font-bold text-gray-800">Shopping Cart</h1>
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                            {cart.totalItems} items
                        </span>
                    </div>
                    {cart.items.length > 0 && (
                        <button
                            onClick={handleClearCart}
                            disabled={loading}
                            className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-semibold disabled:opacity-50"
                        >
                            Clear Cart
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cart.items.map((item) => (
                            <div key={item._id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow group">
                                <div className="flex items-center gap-4">
                                    {/* Clickable Product Section */}
                                    <div
                                        className="flex items-center gap-4 flex-1 cursor-pointer hover:bg-gray-50 rounded-xl p-2 -m-2 transition-colors"
                                        onClick={() => router.push(`/product/${item.productId._id}`)}
                                    >
                                        {/* Product Image */}
                                        <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                                            <Image
                                                src={item.productId.images?.[0]?.url || "/assets/product-placeholder.png"}
                                                alt={item.productId.name}
                                                width={96}
                                                height={96}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg font-semibold text-gray-800 truncate hover:text-blue-600 transition-colors">
                                                {item.productId.name}
                                            </h3>
                                            <p className="text-sm text-gray-500 mb-2">
                                                {item.productId.proCategoryId?.name}
                                            </p>

                                            {/* Product Description with See More */}
                                            {item.productId.description && (
                                                <div className="mb-3">
                                                    <p className="text-sm text-gray-600 leading-relaxed">
                                                        {expandedDescriptions[item._id]
                                                            ? item.productId.description
                                                            : truncateText(item.productId.description, 80)
                                                        }
                                                    </p>
                                                    {item.productId.description.length > 80 && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                toggleDescription(item._id);
                                                            }}
                                                            className="text-xs text-blue-500 hover:text-blue-700 font-medium mt-1 transition-colors"
                                                        >
                                                            {expandedDescriptions[item._id] ? 'See less' : 'See more'}
                                                        </button>
                                                    )}
                                                </div>
                                            )}

                                            <div className="flex items-center gap-2">
                                                <span className="text-xl font-bold text-blue-600">
                                                    {displayPrice(item.price)}
                                                </span>
                                                {item.productId.offerPrice && item.productId.price > item.productId.offerPrice && (
                                                    <span className="text-sm text-gray-400 line-through">
                                                        {displayPrice(item.productId.price)}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1 text-xs text-blue-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                                Click to view details
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quantity Controls */}
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => handleQuantityChange(item.productId._id, item.quantity - 1)}
                                            disabled={loading || item.quantity <= 1}
                                            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                                        >
                                            <FiMinus className="w-4 h-4" />
                                        </button>
                                        <span className="w-12 text-center font-semibold">{item.quantity}</span>
                                        <button
                                            onClick={() => handleQuantityChange(item.productId._id, item.quantity + 1)}
                                            disabled={loading || item.quantity >= item.productId.stock}
                                            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                                        >
                                            <FiPlus className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Remove Button */}
                                    <button
                                        onClick={() => handleRemoveItem(item.productId._id)}
                                        disabled={loading}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50"
                                    >
                                        <FiTrash2 className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Stock Warning */}
                                {item.productId.stock < 5 && item.productId.stock > 0 && (
                                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
                                        <p className="text-sm text-yellow-800">
                                            Only {item.productId.stock} left in stock!
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                            <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal ({cart.totalItems} items)</span>
                                    <span className="font-semibold">{displayPrice(cart.totalAmount)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="font-semibold text-green-600">Free</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tax</span>
                                    <span className="font-semibold">{displayPrice(cart.totalAmount * 0.1)}</span>
                                </div>
                                <hr className="border-gray-200" />
                                <div className="flex justify-between text-lg">
                                    <span className="font-bold text-gray-800">Total</span>
                                    <span className="font-bold text-blue-600">
                                        {displayPrice(cart.totalAmount + cart.totalAmount * 0.1)}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={() => router.push('/checkout')}
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                {loading ? 'Processing...' : 'Proceed to Checkout'}
                            </button>

                            <button
                                onClick={() => router.push('/live-shopping')}
                                className="w-full mt-4 border-2 border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;