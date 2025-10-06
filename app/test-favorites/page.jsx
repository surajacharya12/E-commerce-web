"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useFavorites } from "../hooks/useFavorites";
import FavoriteButton from "../../components/FavoriteButton";
import API_URL from "../api/api";
import axios from "axios";

const TestFavorites = () => {
    const { isLoggedIn, userData } = useAuth();
    const { favorites, loading } = useFavorites();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${API_URL}/products`);
                if (response.data.success) {
                    setProducts(response.data.data.slice(0, 6)); // Get first 6 products for testing
                }
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        fetchProducts();
    }, []);

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">
                        Please Log In
                    </h1>
                    <p className="text-gray-600">
                        You need to be logged in to test the favorites functionality.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Test Favorites Functionality
                    </h1>
                    <p className="text-gray-600">
                        Welcome, {userData?.name}! Click the heart icons to add/remove items from your favorites.
                    </p>
                </div>

                {/* Current Favorites Count */}
                <div className="bg-white rounded-lg shadow p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4">Your Favorites</h2>
                    {loading ? (
                        <p>Loading favorites...</p>
                    ) : (
                        <div>
                            <p className="text-gray-600 mb-4">
                                You have {favorites.length} item(s) in your favorites
                            </p>
                            <a
                                href="/wishlist"
                                className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                View Wishlist
                            </a>
                        </div>
                    )}
                </div>

                {/* Test Products */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <div
                            key={product._id}
                            className="bg-white rounded-lg shadow-lg overflow-hidden"
                        >
                            <div className="relative">
                                <img
                                    src={product.images[0]?.url || "/assets/product-placeholder.png"}
                                    alt={product.name}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="absolute top-2 right-2">
                                    <FavoriteButton productId={product._id} />
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                    {product.name}
                                </h3>
                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                    {product.description}
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-xl font-bold text-blue-600">
                                        ${product.offerPrice || product.price}
                                    </span>
                                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TestFavorites;