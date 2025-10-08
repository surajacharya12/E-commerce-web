"use client";
import React, { useState } from "react";
import { FiShoppingCart } from "react-icons/fi";
import { useCart } from "../app/context/CartContext";
import { useAuth } from "../app/hooks/useAuth";
import { toast } from "react-toastify";

const AddToCartButton = ({
    product,
    quantity = 1,
    className = "",
    size = "medium",
    variant = "primary",
    onSuccess,
    onError
}) => {
    const { addToCart } = useCart();
    const { isLoggedIn } = useAuth();
    const [isAdding, setIsAdding] = useState(false);

    const handleAddToCart = async (e) => {
        e.stopPropagation();

        if (!isLoggedIn) {
            const message = 'Please log in to add items to cart';
            if (onError) onError(message);
            else toast.error(message);
            return;
        }

        if ((product.stock || 0) === 0) {
            const message = 'This item is out of stock';
            if (onError) onError(message);
            else toast.error(message);
            return;
        }

        try {
            setIsAdding(true);
            await addToCart(product._id, quantity);
            toast.success(`${product.name} added to cart!`);

            if (onSuccess) {
                onSuccess(product, quantity);
            }
        } catch (error) {
            const message = error.message || 'Failed to add item to cart';
            if (onError) onError(message);
            else toast.error(message);
        } finally {
            setIsAdding(false);
        }
    };

    const isOutOfStock = (product.stock || 0) === 0;
    const isDisabled = isOutOfStock || isAdding;

    // Size variants
    const sizeClasses = {
        xs: "px-4 py-2.5 text-xs",
        small: "px-3 py-1.5 text-sm",
        medium: "px-4 py-2 text-sm",
        large: "px-6 py-3 text-base"
    };

    // Icon sizes
    const iconSizes = {
        xs: "w-4 h-4",
        small: "w-4 h-4",
        medium: "w-5 h-5",
        large: "w-6 h-6"
    };

    // Variant styles
    const getVariantClasses = () => {
        if (isOutOfStock) {
            return "bg-gray-400 text-white cursor-not-allowed";
        }

        switch (variant) {
            case "secondary":
                return "bg-white border-2 border-indigo-500 text-indigo-600 hover:bg-indigo-50";
            case "outline":
                return "bg-transparent border-2 border-gray-300 text-gray-700 hover:border-indigo-500 hover:text-indigo-600";
                case "gradient":
                    return "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700";
            case "minimal":
                return "bg-gray-100 text-gray-700 hover:bg-gray-200";
            default: // primary
                return "bg-blue-600 text-white hover:bg-blue-700";
        }
    };

    const buttonText = () => {
        if (isAdding) return "Adding...";
        if (isOutOfStock) return "Out of Stock";
        return "Add";
    };

    const buttonIcon = () => {
        if (isAdding) {
            return (
                <div className={`border-2 border-white border-t-transparent rounded-full animate-spin ${iconSizes[size]}`} />
            );
        }
        return <FiShoppingCart className={iconSizes[size]} />;
    };

    return (
        <button
            onClick={handleAddToCart}
            disabled={isDisabled}
            className={`
        ${sizeClasses[size]}
        ${getVariantClasses()}
        rounded-full flex items-center justify-center gap-2 font-semibold shadow 
        transition-all duration-300 transform hover:scale-105 
        disabled:hover:scale-100 disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
            aria-label={`Add ${product.name} to cart`}
        >
            {buttonIcon()}
            <span>{buttonText()}</span>
        </button>
    );
};

export default AddToCartButton;