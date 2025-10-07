"use client";
import React, { useState, useEffect } from "react";
import { FiStar } from "react-icons/fi";
import API_URL from "../app/api/api";
import { toast } from "react-toastify";

const RatingComponent = ({ productId, userId, onRatingUpdate }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [review, setReview] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [userRating, setUserRating] = useState(null);

    useEffect(() => {
        if (userId && productId) {
            fetchUserRating();
        }
    }, [userId, productId]);

    const fetchUserRating = async () => {
        try {
            const response = await fetch(`${API_URL}/ratings/product/${productId}`);
            const result = await response.json();

            if (result.success) {
                const existingRating = result.data.find(r => r.userId === userId);
                if (existingRating) {
                    setUserRating(existingRating);
                    setRating(existingRating.rating);
                    setReview(existingRating.review || "");
                }
            }
        } catch (error) {
            console.error("Error fetching user rating:", error);
        }
    };

    const handleSubmitRating = async () => {
        if (!userId) {
            toast.error("Please log in to rate this product");
            return;
        }

        if (rating === 0) {
            toast.error("Please select a rating");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(`${API_URL}/ratings`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    productId,
                    userId,
                    rating,
                    review,
                }),
            });

            const result = await response.json();

            if (result.success) {
                setUserRating(result.data);
                toast.success(userRating ? "Rating updated successfully!" : "Rating submitted successfully!");
                if (onRatingUpdate) {
                    onRatingUpdate();
                }
            } else {
                toast.error(result.message || "Failed to submit rating");
            }
        } catch (error) {
            toast.error("An error occurred while submitting rating");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
            <h3 className="text-lg font-bold text-slate-800 mb-4">
                {userRating ? "Update Your Rating" : "Rate This Product"}
            </h3>

            <div className="space-y-4">
                {/* Star Rating */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Your Rating
                    </label>
                    <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                className="p-1 transition-colors"
                            >
                                <FiStar
                                    className={`w-8 h-8 ${star <= (hoverRating || rating)
                                        ? "text-yellow-400 fill-current"
                                        : "text-slate-300"
                                        }`}
                                />
                            </button>
                        ))}
                    </div>
                    <p className="text-sm text-slate-600 mt-1">
                        {rating > 0 && (
                            <span>
                                {rating === 1 && "Poor"}
                                {rating === 2 && "Fair"}
                                {rating === 3 && "Good"}
                                {rating === 4 && "Very Good"}
                                {rating === 5 && "Excellent"}
                            </span>
                        )}
                    </p>
                </div>

                {/* Review Text */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Review (Optional)
                    </label>
                    <textarea
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        placeholder="Share your experience with this product..."
                        rows={3}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                    />
                </div>

                {/* Submit Button */}
                <button
                    onClick={handleSubmitRating}
                    disabled={isSubmitting || rating === 0}
                    className="w-full px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-2xl hover:shadow-xl disabled:bg-gray-400 disabled:from-gray-400 disabled:to-gray-400 transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100"
                >
                    {isSubmitting
                        ? "Submitting..."
                        : userRating
                            ? "Update Rating"
                            : "Submit Rating"
                    }
                </button>

                {/* User's Current Rating Display */}
                {userRating && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-green-800">Your Rating:</span>
                                <div className="flex">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <FiStar
                                            key={star}
                                            className={`w-4 h-4 ${star <= userRating.rating
                                                ? "text-yellow-400 fill-current"
                                                : "text-slate-300"
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm text-green-700">
                                    ({userRating.rating}/5)
                                </span>
                            </div>
                            <span className="text-xs text-green-600">
                                {new Date(userRating.updatedAt).toLocaleDateString()}
                            </span>
                        </div>
                        {userRating.review && (
                            <p className="text-sm text-green-700 mt-2 italic">
                                "{userRating.review}"
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RatingComponent;