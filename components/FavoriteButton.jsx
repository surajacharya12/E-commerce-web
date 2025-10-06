"use client";
import { FiHeart } from "react-icons/fi";
import { useFavorites } from "../app/hooks/useFavorites";
import { useAuth } from "../app/hooks/useAuth";

const FavoriteButton = ({ productId, className = "" }) => {
    const { isLoggedIn, userData, loading } = useAuth();
    const { toggleFavorite, isFavorite } = useFavorites();

    const handleClick = (e) => {
        e.stopPropagation();

        // Don't do anything if still loading
        if (loading) {
            return;
        }

        // Debug log for development
        console.log("FavoriteButton auth state:", {
            isLoggedIn,
            userData,
            userDataId: userData?._id,
            userDataKeys: userData ? Object.keys(userData) : null,
            loading
        });

        // Get user ID from userData (try different possible field names)
        const userId = userData?._id || userData?.id;

        // Use the same authentication check as useFavorites hook
        if (!isLoggedIn || !userId) {
            alert(`Please log in to add items to your wishlist. Debug: isLoggedIn=${isLoggedIn}, userData=${!!userData}, userId=${userId}`);
            return;
        }
        toggleFavorite(productId);
    };

    // Safety check for productId
    if (!productId) {
        return null;
    }

    const isCurrentlyFavorite = isFavorite(productId);

    return (
        <button
            onClick={handleClick}
            className={`p-2 bg-white/80 rounded-full hover:bg-white transition-colors z-10 ${className}`}
            aria-label={
                isCurrentlyFavorite
                    ? "Remove from favorites"
                    : "Add to favorites"
            }
        >
            <FiHeart
                className={`w-5 h-5 ${isCurrentlyFavorite
                    ? "text-red-500 fill-red-500"
                    : "text-gray-600"
                    }`}
            />
        </button>
    );
};

export default FavoriteButton;