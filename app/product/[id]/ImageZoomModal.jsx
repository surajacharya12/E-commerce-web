"use client";

import React from 'react';
import Image from 'next/image';

const ImageZoomModal = ({ isZoomed, setIsZoomed, product, selectedImage, setSelectedImage }) => {
    if (!isZoomed) return null;

    return (
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
    );
};

export default ImageZoomModal;
