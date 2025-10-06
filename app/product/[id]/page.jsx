"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { FiShoppingCart, FiStar, FiArrowLeft, FiShare2, FiTruck, FiShield, FiRefreshCw } from "react-icons/fi";
import API_URL from "../../api/api";
import FavoriteButton from "../../../components/FavoriteButton";
import RatingComponent from "../../../components/RatingComponent";
import ProductReviews from "../../../components/ProductReviews";
import ProductChat from "../../../components/ProductChat";
import ExpandableDescription from "../../../components/ExpandableDescription";
import { useAuth } from "../../hooks/useAuth";

const ProductDetail = () => {
    const params = useParams();
    const router = useRouter();
    const { isLoggedIn } = useAuth();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [isZoomed, setIsZoomed] = useState(false);
    const [showShareMenu, setShowShareMenu] = useState(false);

    // Get user ID from auth system
    const { userData } = useAuth();
    const userId = isLoggedIn && userData ? userData.id : null;

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`${API_URL}/products/${params.id}`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

                const result = await response.json();
                if (result.success) {
                    setProduct(result.data);
                    // Fetch related products from the same category
                    fetchRelatedProducts(result.data.proCategoryId?._id);
                } else {
                    setError(result.message || "Product not found.");
                }
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchRelatedProducts = async (categoryId) => {
            if (!categoryId) return;
            try {
                const response = await fetch(`${API_URL}/products`);
                if (response.ok) {
                    const result = await response.json();
                    if (result.success) {
                        const related = result.data
                            .filter(p => p.proCategoryId?._id === categoryId && p._id !== params.id)
                            .slice(0, 4);
                        setRelatedProducts(related);
                    }
                }
            } catch (e) {
                console.error("Error fetching related products:", e);
            }
        };

        if (params.id) {
            fetchProduct();
        }
    }, [params.id]);

    const handleAddToCart = () => {
        if (!isLoggedIn) {
            alert("Please log in to add items to cart");
            return;
        }
        // Add to cart logic here
        console.log(`Added ${quantity} of ${product.name} to cart`);
        alert(`Added ${quantity} ${product.name} to cart!`);
    };

    const handleBuyNow = () => {
        if (!isLoggedIn) {
            alert("Please log in to purchase");
            return;
        }
        // Buy now logic here
        console.log(`Buy now: ${quantity} of ${product.name}`);
        alert(`Proceeding to checkout with ${quantity} ${product.name}`);
    };

    const handleShare = async (platform) => {
        const url = window.location.href;
        const title = `Check out this amazing product: ${product.name}`;
        const text = `${product.name} - ${product.description.substring(0, 100)}...`;

        switch (platform) {
            case 'copy':
                try {
                    await navigator.clipboard.writeText(url);
                    alert('Link copied to clipboard!');
                } catch (err) {
                    // Fallback for older browsers
                    const textArea = document.createElement('textarea');
                    textArea.value = url;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                    alert('Link copied to clipboard!');
                }
                break;
            case 'whatsapp':
                window.open(`https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`);
                break;
            case 'facebook':
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
                break;
            case 'twitter':
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
                break;
            case 'email':
                window.open(`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${text}\n\n${url}`)}`);
                break;
            default:
                if (navigator.share) {
                    navigator.share({
                        title: title,
                        text: text,
                        url: url,
                    });
                } else {
                    handleShare('copy');
                }
        }
        setShowShareMenu(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-xl font-semibold text-slate-600">Loading product details...</p>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center mt-15">
                <div className="text-center bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Product Not Found</h2>
                    <p className="text-slate-600 mb-6">{error || "The product you're looking for doesn't exist."}</p>
                    <button
                        onClick={() => router.back()}
                        className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 mt-15">
            {/* Header with Back Button */}
            <div className="bg-white/80 backdrop-blur-xl border-b border-white/20 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center space-x-2 text-slate-600 hover:text-indigo-600 transition-colors"
                        >
                            <FiArrowLeft className="w-5 h-5" />
                            <span className="font-medium">Back</span>
                        </button>

                        <div className="flex items-center space-x-4">
                            {/* Share Button with Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowShareMenu(!showShareMenu)}
                                    className="p-2 text-slate-600 hover:text-indigo-600 transition-colors rounded-xl hover:bg-indigo-50"
                                >
                                    <FiShare2 className="w-5 h-5" />
                                </button>

                                {/* Share Menu */}
                                {showShareMenu && (
                                    <div className="absolute right-0 top-12 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-4 min-w-[200px] z-50">
                                        <div className="space-y-2">
                                            <button
                                                onClick={() => handleShare('copy')}
                                                className="w-full flex items-center space-x-3 px-3 py-2 text-slate-700 hover:bg-indigo-50 rounded-xl transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                </svg>
                                                <span className="font-medium">Copy Link</span>
                                            </button>
                                            <button
                                                onClick={() => handleShare('whatsapp')}
                                                className="w-full flex items-center space-x-3 px-3 py-2 text-slate-700 hover:bg-green-50 rounded-xl transition-colors"
                                            >
                                                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.63z" />
                                                </svg>
                                                <span className="font-medium">WhatsApp</span>
                                            </button>
                                            <button
                                                onClick={() => handleShare('facebook')}
                                                className="w-full flex items-center space-x-3 px-3 py-2 text-slate-700 hover:bg-blue-50 rounded-xl transition-colors"
                                            >
                                                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                                </svg>
                                                <span className="font-medium">Facebook</span>
                                            </button>
                                            <button
                                                onClick={() => handleShare('twitter')}
                                                className="w-full flex items-center space-x-3 px-3 py-2 text-slate-700 hover:bg-sky-50 rounded-xl transition-colors"
                                            >
                                                <svg className="w-4 h-4 text-sky-500" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                                </svg>
                                                <span className="font-medium">Twitter</span>
                                            </button>
                                            <button
                                                onClick={() => handleShare('email')}
                                                className="w-full flex items-center space-x-3 px-3 py-2 text-slate-700 hover:bg-gray-50 rounded-xl transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                                <span className="font-medium">Email</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <FavoriteButton productId={product._id} className="p-2" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Product Images with Zoom */}
                    <div className="space-y-4">
                        <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/20 overflow-hidden">
                            <div
                                className="aspect-square relative cursor-zoom-in group"
                                onClick={() => setIsZoomed(true)}
                            >
                                <Image
                                    src={product.images?.[selectedImage]?.url || "https://via.placeholder.com/500"}
                                    alt={product.name}
                                    fill
                                    className="object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                                />
                                {product.offerPrice && product.price > product.offerPrice && (
                                    <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse z-10">
                                        {Math.round(((product.price - product.offerPrice) / product.price) * 100)}% OFF
                                    </div>
                                )}
                                {/* Zoom Indicator */}
                                <div className="absolute bottom-4 right-4 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Image Thumbnails */}
                        {product.images && product.images.length > 1 && (
                            <div className="flex space-x-2 overflow-x-auto">
                                {product.images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${selectedImage === index
                                            ? 'border-indigo-500 shadow-lg scale-105'
                                            : 'border-slate-200 hover:border-indigo-300'
                                            }`}
                                    >
                                        <Image
                                            src={image.url}
                                            alt={`${product.name} ${index + 1}`}
                                            width={80}
                                            height={80}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center space-x-2 mb-2">
                                {product.proCategoryId && (
                                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm font-medium rounded-full">
                                        {product.proCategoryId.name}
                                    </span>
                                )}
                                {product.proSubCategoryId && (
                                    <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded-full">
                                        {product.proSubCategoryId.name}
                                    </span>
                                )}
                            </div>

                            <h1 className="text-3xl md:text-4xl font-black text-slate-800 mb-4 leading-tight">
                                {product.name}
                            </h1>

                            {/* Rating */}
                            {product.rating && (
                                <div className="flex items-center space-x-2 mb-4">
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <FiStar
                                                key={i}
                                                className={`w-5 h-5 ${i < Math.floor(product.rating.averageRating || 0)
                                                    ? 'text-yellow-400 fill-current'
                                                    : 'text-slate-300'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-slate-600 font-medium">
                                        ({(product.rating.averageRating || 0).toFixed(1)})
                                    </span>
                                    <span className="text-slate-500">
                                        • {product.rating.totalReviews || 0} reviews
                                    </span>
                                </div>
                            )}

                            {/* Stock Status */}
                            <div className="mb-4">
                                <div className="flex items-center space-x-2">
                                    <span className="text-lg font-semibold text-slate-800">Stock:</span>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${(product.stock || 0) > 10
                                        ? 'bg-green-100 text-green-800'
                                        : (product.stock || 0) > 0
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : 'bg-red-100 text-red-800'
                                        }`}>
                                        {(product.stock || 0) > 0
                                            ? `${product.stock} units available`
                                            : 'Out of stock'
                                        }
                                    </span>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="flex items-center space-x-4 mb-6">
                                <span className="text-4xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    Rs. {(product.offerPrice || product.price).toFixed(2)}
                                </span>
                                {product.offerPrice && product.price > product.offerPrice && (
                                    <span className="text-xl text-slate-400 line-through">
                                        Rs. {product.price.toFixed(2)}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <ExpandableDescription description={product.description} />

                        {/* Quantity and Actions */}
                        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
                            <div className="flex items-center space-x-4 mb-6">
                                <span className="text-lg font-semibold text-slate-800">Quantity:</span>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-10 bg-slate-200 hover:bg-slate-300 rounded-xl flex items-center justify-center transition-colors"
                                    >
                                        -
                                    </button>
                                    <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(Math.min(product.stock || 0, quantity + 1))}
                                        disabled={(product.stock || 0) <= quantity}
                                        className="w-10 h-10 bg-slate-200 hover:bg-slate-300 disabled:bg-slate-100 disabled:text-slate-400 rounded-xl flex items-center justify-center transition-colors"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={(product.stock || 0) === 0}
                                    className="flex items-center justify-center space-x-2 px-6 py-4 bg-white border-2 border-indigo-500 text-indigo-600 font-bold rounded-2xl hover:bg-indigo-50 disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-400 transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100"
                                >
                                    <FiShoppingCart className="w-5 h-5" />
                                    <span>{(product.stock || 0) === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                                </button>

                                <button
                                    onClick={handleBuyNow}
                                    disabled={(product.stock || 0) === 0}
                                    className="flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-2xl hover:shadow-xl disabled:bg-gray-400 disabled:from-gray-400 disabled:to-gray-400 transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100"
                                >
                                    <span>{(product.stock || 0) === 0 ? 'Out of Stock' : 'Buy Now'}</span>
                                </button>
                            </div>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                                <FiTruck className="w-6 h-6 text-green-500" />
                                <div>
                                    <p className="font-semibold text-slate-800">Free Shipping</p>
                                    <p className="text-sm text-slate-600">On orders over Rs. 6,650</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                                <FiShield className="w-6 h-6 text-blue-500" />
                                <div>
                                    <p className="font-semibold text-slate-800">Warranty</p>
                                    <p className="text-sm text-slate-600">1 year guarantee</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                                <FiRefreshCw className="w-6 h-6 text-orange-500" />
                                <div>
                                    <p className="font-semibold text-slate-800">Returns</p>
                                    <p className="text-sm text-slate-600">30-day policy</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Rating Section */}
                {isLoggedIn && (
                    <div className="mt-12">
                        <RatingComponent
                            productId={product._id}
                            userId={userId}
                            onRatingUpdate={() => {
                                // Refresh product data to get updated ratings
                                const fetchProduct = async () => {
                                    try {
                                        const response = await fetch(`${API_URL}/products/${params.id}`);
                                        if (response.ok) {
                                            const result = await response.json();
                                            if (result.success) {
                                                setProduct(result.data);
                                            }
                                        }
                                    } catch (e) {
                                        console.error("Error refreshing product:", e);
                                    }
                                };
                                fetchProduct();
                            }}
                        />
                    </div>
                )}

                {/* Product Reviews Section */}
                <div className="mt-12">
                    <ProductReviews
                        productId={product._id}
                        onRatingUpdate={() => {
                            // Refresh product data to get updated ratings
                            const fetchProduct = async () => {
                                try {
                                    const response = await fetch(`${API_URL}/products/${params.id}`);
                                    if (response.ok) {
                                        const result = await response.json();
                                        if (result.success) {
                                            setProduct(result.data);
                                        }
                                    }
                                } catch (e) {
                                    console.error("Error refreshing product:", e);
                                }
                            };
                            fetchProduct();
                        }}
                    />
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-16">
                        <h2 className="text-3xl font-black text-slate-800 mb-8 text-center">
                            Related Products
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((relatedProduct) => (
                                <div
                                    key={relatedProduct._id}
                                    className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all overflow-hidden border border-gray-100 cursor-pointer"
                                    onClick={(e) => {
                                        if (e.target.closest('.favorite-toggle-button') || e.target.closest('button')) {
                                            return;
                                        }
                                        router.push(`/product/${relatedProduct._id}`);
                                    }}
                                >
                                    <div className="relative w-full h-48">
                                        <Image
                                            src={relatedProduct.images?.[0]?.url || "/assets/product-placeholder.png"}
                                            alt={relatedProduct.name}
                                            fill
                                            style={{ objectFit: "cover" }}
                                            className="transition-transform duration-300 group-hover:scale-105"
                                        />

                                        {/* Discount Badge */}
                                        {relatedProduct.offerPrice && relatedProduct.price > relatedProduct.offerPrice && (
                                            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                                                {Math.round(((relatedProduct.price - relatedProduct.offerPrice) / relatedProduct.price) * 100)}% OFF
                                            </div>
                                        )}

                                        {/* Favorite Button */}
                                        <div className="absolute top-2 right-2 favorite-toggle-button">
                                            <FavoriteButton productId={relatedProduct._id} />
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-lg font-bold text-gray-800 mb-2 truncate">
                                            {relatedProduct.name}
                                        </h3>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xl font-bold text-blue-600">
                                                Rs. {(relatedProduct.offerPrice || relatedProduct.price).toFixed(2)}
                                            </span>
                                            {relatedProduct.offerPrice && relatedProduct.price > relatedProduct.offerPrice && (
                                                <span className="text-sm text-gray-400 line-through">
                                                    Rs. {relatedProduct.price.toFixed(2)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Image Zoom Modal */}
            {isZoomed && (
                <div
                    className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setIsZoomed(false)}
                >
                    <div className="relative max-w-4xl max-h-full">
                        {/* Close Button */}
                        <button
                            onClick={() => setIsZoomed(false)}
                            className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10"
                        >
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Zoomed Image */}
                        <div className="relative w-full h-full">
                            <Image
                                src={product.images?.[selectedImage]?.url || "https://via.placeholder.com/800"}
                                alt={product.name}
                                width={800}
                                height={800}
                                className="object-contain rounded-2xl shadow-2xl max-h-[80vh] w-auto"
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>

                        {/* Navigation Arrows for Multiple Images */}
                        {product.images && product.images.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedImage(selectedImage > 0 ? selectedImage - 1 : product.images.length - 1);
                                    }}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedImage(selectedImage < product.images.length - 1 ? selectedImage + 1 : 0);
                                    }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </>
                        )}

                        {/* Image Counter */}
                        {product.images && product.images.length > 1 && (
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
                                {selectedImage + 1} / {product.images.length}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Click outside to close share menu */}
            {showShareMenu && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowShareMenu(false)}
                />
            )}

            {/* Product Chat Component */}
            <ProductChat
                productId={product._id}
                productName={product.name}
            />
        </div>
    );
};

export default ProductDetail;