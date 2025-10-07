"use client";

import React from 'react';
import Image from 'next/image';
import FavoriteButton from '../../../components/FavoriteButton';

const RelatedProducts = ({ relatedProducts, router }) => {
    if (!relatedProducts || relatedProducts.length === 0) return null;

    return (
        <div className="mt-16">
            <h2 className="text-3xl font-black text-slate-800 mb-8 text-center">Related Products</h2>
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
                            <h3 className="text-lg font-bold text-gray-800 mb-2 truncate">{relatedProduct.name}</h3>
                            <div className="flex items-center justify-between">
                                <span className="text-xl font-bold text-blue-600">Rs. {(relatedProduct.offerPrice || relatedProduct.price).toFixed(2)}</span>
                                {relatedProduct.offerPrice && relatedProduct.price > relatedProduct.offerPrice && (
                                    <span className="text-sm text-gray-400 line-through">Rs. {relatedProduct.price.toFixed(2)}</span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RelatedProducts;
