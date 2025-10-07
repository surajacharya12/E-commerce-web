"use client";
import React, { useState, useEffect } from "react";
import { FiStar, FiThumbsUp, FiUser, FiCalendar, FiShield, FiEdit2, FiSave, FiX } from "react-icons/fi";
import API_URL from "../app/api/api";
import { useAuth } from "../app/hooks/useAuth";
import { toast } from "react-toastify";

const ProductReviews = ({ productId, onRatingUpdate }) => {
    const [reviews, setReviews] = useState([]);
    const [reviewsWithUsers, setReviewsWithUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortBy, setSortBy] = useState("newest"); // newest, oldest, highest, lowest
    const [filterBy, setFilterBy] = useState("all"); // all, 5, 4, 3, 2, 1
    const [editingReview, setEditingReview] = useState(null);
    const [editRating, setEditRating] = useState(0);
    const [editComment, setEditComment] = useState("");
    const { userData } = useAuth();

    useEffect(() => {
        if (productId) {
            fetchReviews();
        }
    }, [productId]);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/ratings/product/${productId}`);
            const result = await response.json();

            if (result.success) {
                setReviews(result.data);
                // Fetch user information for each review
                await fetchUsersForReviews(result.data);
            } else {
                setError(result.message || "Failed to fetch reviews");
            }
        } catch (error) {
            setError("An error occurred while fetching reviews");
            console.error("Error fetching reviews:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsersForReviews = async (reviewsData) => {
        try {
            const reviewsWithUserData = await Promise.all(
                reviewsData.map(async (review) => {
                    try {
                        const userResponse = await fetch(`${API_URL}/users/${review.userId}`);
                        const userResult = await userResponse.json();

                        return {
                            ...review,
                            user: userResult.success ? userResult.data : null
                        };
                    } catch (error) {
                        console.error(`Error fetching user ${review.userId}:`, error);
                        return {
                            ...review,
                            user: null
                        };
                    }
                })
            );
            setReviewsWithUsers(reviewsWithUserData);
        } catch (error) {
            console.error("Error fetching users for reviews:", error);
            setReviewsWithUsers(reviewsData.map(review => ({ ...review, user: null })));
        }
    };

    // Calculate rating statistics
    const ratingStats = React.useMemo(() => {
        if (reviewsWithUsers.length === 0) return { average: 0, distribution: [0, 0, 0, 0, 0], total: 0 };

        const total = reviewsWithUsers.length;
        const sum = reviewsWithUsers.reduce((acc, review) => acc + review.rating, 0);
        const average = sum / total;

        const distribution = [0, 0, 0, 0, 0];
        reviewsWithUsers.forEach(review => {
            distribution[review.rating - 1]++;
        });

        return { average, distribution, total };
    }, [reviewsWithUsers]);

    // Filter and sort reviews
    const filteredAndSortedReviews = React.useMemo(() => {
        let filtered = reviewsWithUsers;

        // Filter by rating
        if (filterBy !== "all") {
            filtered = filtered.filter(review => review.rating === parseInt(filterBy));
        }

        // Sort reviews
        switch (sortBy) {
            case "newest":
                filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case "oldest":
                filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                break;
            case "highest":
                filtered.sort((a, b) => b.rating - a.rating);
                break;
            case "lowest":
                filtered.sort((a, b) => a.rating - b.rating);
                break;
            default:
                break;
        }

        return filtered;
    }, [reviewsWithUsers, sortBy, filterBy]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const renderStars = (rating, isEditable = false, onStarClick = null) => {
        return (
            <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                    <FiStar
                        key={star}
                        className={`w-4 h-4 ${star <= rating ? "text-yellow-400 fill-current" : "text-slate-300"} ${isEditable ? "cursor-pointer hover:text-yellow-300 transition-colors" : ""
                            }`}
                        onClick={isEditable && onStarClick ? () => onStarClick(star) : undefined}
                    />
                ))}
            </div>
        );
    };

    const handleEditReview = (review) => {
        setEditingReview(review._id);
        setEditRating(review.rating);
        setEditComment(review.review || "");
    };

    const handleCancelEdit = () => {
        setEditingReview(null);
        setEditRating(0);
        setEditComment("");
    };

    const handleSaveEdit = async (reviewId) => {
        try {
            const response = await fetch(`${API_URL}/ratings`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    productId,
                    userId: userData.id,
                    rating: editRating,
                    review: editComment,
                }),
            });

            const result = await response.json();

            if (result.success) {
                // Refresh reviews
                await fetchReviews();
                handleCancelEdit();
                if (onRatingUpdate) {
                    onRatingUpdate();
                }
            } else {
                toast.error(result.message || "Failed to update review");
            }
        } catch (error) {
            console.error("Error updating review:", error);
            toast.error("An error occurred while updating the review");
        }
    };

    if (loading) {
        return (
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
                <div className="animate-pulse">
                    <div className="h-6 bg-slate-200 rounded w-1/3 mb-4"></div>
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-20 bg-slate-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
                <div className="text-center text-red-600">
                    <p className="font-medium">Error loading reviews</p>
                    <p className="text-sm">{error}</p>
                    <button
                        onClick={fetchReviews}
                        className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-800">
                    Customer Reviews ({ratingStats.total})
                </h3>
                <button
                    onClick={fetchReviews}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                >
                    Refresh
                </button>
            </div>

            {/* Rating Overview */}
            {ratingStats.total > 0 && (
                <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-slate-800">
                                {ratingStats.average.toFixed(1)}
                            </div>
                            <div className="flex justify-center mb-1">
                                {renderStars(Math.round(ratingStats.average))}
                            </div>
                            <div className="text-sm text-slate-600">
                                Based on {ratingStats.total} reviews
                            </div>
                        </div>

                        <div className="flex-1 ml-8">
                            {[5, 4, 3, 2, 1].map((rating) => (
                                <div key={rating} className="flex items-center mb-1">
                                    <span className="text-sm w-8">{rating}</span>
                                    <FiStar className="w-4 h-4 text-yellow-400 fill-current mr-2" />
                                    <div className="flex-1 bg-slate-200 rounded-full h-2 mr-2">
                                        <div
                                            className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full"
                                            style={{
                                                width: `${ratingStats.total > 0 ? (ratingStats.distribution[rating - 1] / ratingStats.total) * 100 : 0}%`
                                            }}
                                        ></div>
                                    </div>
                                    <span className="text-sm text-slate-600 w-8">
                                        {ratingStats.distribution[rating - 1]}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Filters and Sorting */}
            {ratingStats.total > 0 && (
                <div className="flex flex-wrap gap-4 mb-6 p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium text-slate-700">Sort by:</label>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-3 py-1 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="newest">Newest</option>
                            <option value="oldest">Oldest</option>
                            <option value="highest">Highest Rating</option>
                            <option value="lowest">Lowest Rating</option>
                        </select>
                    </div>

                    <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium text-slate-700">Filter:</label>
                        <select
                            value={filterBy}
                            onChange={(e) => setFilterBy(e.target.value)}
                            className="px-3 py-1 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="all">All Ratings</option>
                            <option value="5">5 Stars</option>
                            <option value="4">4 Stars</option>
                            <option value="3">3 Stars</option>
                            <option value="2">2 Stars</option>
                            <option value="1">1 Star</option>
                        </select>
                    </div>
                </div>
            )}

            {/* Reviews List */}
            {filteredAndSortedReviews.length === 0 ? (
                <div className="text-center py-8">
                    <FiStar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-600 font-medium">
                        {filterBy === "all" ? "No reviews yet" : `No ${filterBy}-star reviews`}
                    </p>
                    <p className="text-sm text-slate-400">
                        {filterBy === "all"
                            ? "Be the first to review this product!"
                            : "Try selecting a different rating filter."
                        }
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredAndSortedReviews.map((review) => (
                        <div
                            key={review._id}
                            className="p-4 border border-slate-200 rounded-xl hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center space-x-3">
                                    {/* User Avatar */}
                                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                                        {review.user?.photo ? (
                                            <img
                                                src={review.user.photo}
                                                alt={review.user.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-white font-bold text-sm">
                                                {review.user?.name?.charAt(0)?.toUpperCase() || "U"}
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <div className="font-medium text-slate-800">
                                            {review.user?.name || "Anonymous User"}
                                        </div>
                                        <div className="flex items-center space-x-2 text-sm text-slate-500">
                                            <FiCalendar className="w-3 h-3" />
                                            <span>{formatDate(review.createdAt)}</span>
                                            {review.isVerifiedPurchase && (
                                                <>
                                                    <FiShield className="w-3 h-3 text-green-500" />
                                                    <span className="text-green-600">Verified Purchase</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {editingReview === review._id ? (
                                        <div className="flex items-center space-x-2">
                                            {renderStars(editRating, true, setEditRating)}
                                            <span className="text-sm font-medium text-slate-700">
                                                {editRating}/5
                                            </span>
                                        </div>
                                    ) : (
                                        <>
                                            {renderStars(review.rating)}
                                            <span className="text-sm font-medium text-slate-700">
                                                {review.rating}/5
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Review Content */}
                            {editingReview === review._id ? (
                                <div className="mt-3 space-y-3">
                                    <textarea
                                        value={editComment}
                                        onChange={(e) => setEditComment(e.target.value)}
                                        placeholder="Update your review..."
                                        rows={3}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                                    />
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => handleSaveEdit(review._id)}
                                            className="flex items-center space-x-1 px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                                        >
                                            <FiSave className="w-3 h-3" />
                                            <span>Save</span>
                                        </button>
                                        <button
                                            onClick={handleCancelEdit}
                                            className="flex items-center space-x-1 px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
                                        >
                                            <FiX className="w-3 h-3" />
                                            <span>Cancel</span>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                review.review && (
                                    <div className="mt-3">
                                        <p className="text-slate-700 leading-relaxed">
                                            {review.review}
                                        </p>
                                    </div>
                                )
                            )}

                            <div className="mt-3 flex items-center justify-between">
                                <div className="flex items-center space-x-4 text-sm text-slate-500">
                                    <button className="flex items-center space-x-1 hover:text-indigo-600 transition-colors">
                                        <FiThumbsUp className="w-4 h-4" />
                                        <span>Helpful</span>
                                    </button>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {/* Edit button for user's own reviews */}
                                    {userData && review.userId === userData.id && editingReview !== review._id && (
                                        <button
                                            onClick={() => handleEditReview(review)}
                                            className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-800 transition-colors text-sm"
                                        >
                                            <FiEdit2 className="w-3 h-3" />
                                            <span>Edit</span>
                                        </button>
                                    )}
                                    <div className="text-xs text-slate-400">
                                        {review.updatedAt !== review.createdAt && "Edited"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductReviews;