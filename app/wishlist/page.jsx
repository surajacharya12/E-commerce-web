"use client";
import { Heart, X, ShoppingCart, Loader2 } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import API_URL from '../api/api';
import { useAuth } from '../hooks/useAuth';


const WishlistItem = ({ item, onRemove, onAddToCart, onProductClick }) => {
  // Safety check for productId
  if (!item.productId) {
    return null;
  }

  const product = item.productId;
  const productName = product.name || 'Unknown Product';
  const productPrice = product.price || 0;
  const productId = product._id;

  return (
    <div
      className="relative group bg-white/70 backdrop-blur-md rounded-xl p-4 shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 border border-indigo-100/50 cursor-pointer"
      onClick={() => onProductClick(productId)}
    >

      {/* Remove Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(productId);
        }}
        className="absolute top-2 right-2 p-1 bg-white rounded-full text-gray-400 hover:text-pink-600 hover:bg-pink-50 transition-colors opacity-0 group-hover:opacity-100 z-10 shadow-md"
        aria-label={`Remove ${productName} from wishlist`}
        type="button"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Image */}
      <div className="aspect-square w-full bg-gray-200 rounded-lg overflow-hidden mb-3">
        <img
          src={product.images?.[0]?.url || product.imageUrl || "/assets/product-placeholder.png"}
          alt={productName}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Details */}
      <h3 className="text-sm font-semibold text-gray-800 truncate mb-1" title={productName}>
        {productName}
      </h3>
      <p className="text-lg font-bold text-indigo-600 mb-3">Rs. {productPrice.toFixed(2)}</p>

      {/* Action Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onAddToCart(product);
        }}
        className="w-full flex items-center justify-center space-x-2 py-2 text-sm rounded-lg text-white font-medium bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-indigo-500/30"
        aria-label={`Add ${productName} to cart`}
        type="button"
      >
        <ShoppingCart className="w-4 h-4" />
        <span>Add to Cart</span>
      </button>
    </div>
  );
};


const Wishlist = () => {
  const router = useRouter();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { userData, isLoggedIn, loading } = useAuth();
  const userId = userData?._id || userData?.id;

  const handleProductClick = (productId) => {
    router.push(`/product/${productId}`);
  };

  // Function to fetch wishlist items
  const fetchWishlist = async () => {
    if (!userId) {
      setError("Please log in to view your wishlist.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      console.log("Fetching wishlist for userId:", userId); // Debug log
      const response = await fetch(`${API_URL}/favorites/${userId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Wishlist API response:", data); // Debug log

      // Filter out any items with null or invalid productId
      const validItems = (data.data || []).filter(item => item.productId && item.productId._id);
      setWishlistItems(validItems);
    } catch (err) {
      console.error("Failed to fetch wishlist:", err);
      setError("Failed to load wishlist. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (loading) {
      return; // Wait for auth to finish loading
    }

    if (!isLoggedIn) {
      setIsLoading(false);
      setError("Please log in to view your wishlist.");
      return;
    }

    if (userId) {
      fetchWishlist();
    } else {
      setIsLoading(false);
      setError("User data not available. Please try logging in again.");
    }
  }, [userId, isLoggedIn, loading]);

  const handleRemoveFromWishlist = async (productIdToRemove) => {
    if (!userId) {
      alert('Please log in to remove items from wishlist.');
      return;
    }

    try {
      console.log("Removing product:", productIdToRemove, "for user:", userId); // Debug log
      const response = await fetch(`${API_URL}/favorites/${userId}/${productIdToRemove}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      fetchWishlist();
      alert('Item removed from wishlist!');
    } catch (err) {
      console.error("Failed to remove item from wishlist:", err);
      alert('Failed to remove item. Please try again.');
    }
  };

  const handleAddToCart = (item) => {
    console.log(`Adding ${item.name} (ID: ${item._id}) to cart. Implement actual cart logic here.`);
    alert(`Added "${item.name}" to cart (simulated).`);
  };

  const estimatedTotal = useMemo(() => {
    return wishlistItems.reduce((sum, item) => {
      const price = item.productId?.price || 0;
      return sum + (typeof price === 'number' ? price : 0);
    }, 0);
  }, [wishlistItems]);

  const isEmpty = wishlistItems.length === 0;

  return (
    <section className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6 md:p-12 pt-20">

      <div className="max-w-7xl mx-auto bg-white/70 backdrop-blur-xl rounded-3xl shadow-3xl p-8 md:p-12 border border-white/80">

        <div className="flex flex-col md:flex-row items-center justify-between mb-16 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl p-8 shadow-xl">
          <div className="flex flex-col text-center md:text-left">
            <h1 className="text-4xl font-extrabold mb-2">Curate Your Desires. 💖</h1>
            <p className="text-indigo-100 max-w-lg">
              Effortlessly save your favorite items, track price changes, and plan your next purchase. Your personal shopping sanctuary.
            </p>
          </div>
          <button
            className="mt-6 md:mt-0 px-8 py-3 rounded-full text-indigo-700 font-semibold bg-white hover:bg-indigo-50 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-2xl"
            aria-label="Shop now for wishlist items"
            type="button"
          >
            Start Exploring
          </button>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b pb-4 border-indigo-200">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
            My Wishlist <span className="text-indigo-600">({wishlistItems.length})</span>
          </h2>
          <div className="flex items-center space-x-4 p-3 bg-indigo-50 rounded-xl shadow-inner">
            <span className="font-medium text-gray-700">Estimated Total:</span>
            <span className="text-2xl font-extrabold text-indigo-700">
              Rs. {estimatedTotal.toFixed(2)}
            </span>
          </div>
        </div>

        {error && (
          <div className="text-center py-10 bg-red-50/50 rounded-xl text-red-700 font-medium">
            <p>{error}</p>
            {error.includes("log in") ? (
              <a
                href="/signin"
                className="mt-4 inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Go to Login
              </a>
            ) : (
              <button onClick={fetchWishlist} className="mt-4 px-4 py-2 bg-red-100 rounded-lg hover:bg-red-200 transition">
                Retry
              </button>
            )}
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-20 bg-gray-50/50 rounded-xl">
            <Loader2 className="w-10 h-10 mx-auto text-indigo-500 animate-spin mb-4" />
            <p className="text-xl font-medium text-gray-600">Summoning your perfect finds...</p>
          </div>
        ) : isEmpty && !error ? (
          <div className="text-center py-20 border border-dashed border-gray-300 rounded-2xl bg-white/80">
            <img
              src="/assets/empty-wishlist.svg"
              alt="Empty Wishlist"
              className="mx-auto w-32 opacity-90 mb-6"
            />
            <p className="text-2xl font-bold text-gray-700">Your Sanctuary Awaits Content! 🚀</p>
            <p className="text-gray-500 mt-2 max-w-md mx-auto">
              It looks a little lonely in here. Start exploring our collections to save your next dream purchase.
            </p>
            <button
              className="mt-6 px-6 py-2 rounded-full text-white font-semibold shadow-lg transition-all duration-300 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 transform hover:scale-[1.05]"
              type="button"
            >
              Find My Favorites
            </button>
          </div>
        ) : (
          <div className="grid gap-8 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {wishlistItems.map((item) => (
              <WishlistItem
                key={item._id}
                item={item}
                onRemove={handleRemoveFromWishlist}
                onAddToCart={handleAddToCart}
                onProductClick={handleProductClick}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Wishlist;