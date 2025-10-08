"use client";
import React, { useState } from 'react';

const ExpandableDescription = ({ description, points = [], maxLength = 300, maxLines = 4 }) => {
    const [showFullDescription, setShowFullDescription] = useState(false);

    // Check if description is long enough to need expansion
    const needsExpansion = description && (
        description.split('\n').length > maxLines ||
        description.length > maxLength
    );

    if (!description) return null;

    return (
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <h3 className="text-lg font-bold text-slate-800 mb-3">Description</h3>
            <div className="text-slate-600 leading-relaxed">
                <p className={`${!showFullDescription ? 'line-clamp-4' : ''} transition-all duration-300`}>
                    {description}
                </p>

                {/* Render points (highlights) if provided */}
                {points && Array.isArray(points) && points.length > 0 && (
                    <div className="mt-4">
                        <h4 className="font-semibold text-slate-800 mb-2">Highlights</h4>
                        <ul className="list-disc list-inside text-slate-700 space-y-1">
                            {points.map((p, idx) => (
                                <li key={idx}>{p}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {needsExpansion && (
                    <button
                        onClick={() => setShowFullDescription(!showFullDescription)}
                        className="mt-2 text-indigo-600 hover:text-indigo-800 font-medium text-sm transition-colors duration-200 flex items-center space-x-1"
                    >
                        <span>{showFullDescription ? 'See less' : 'See more'}</span>
                        <svg
                            className={`w-4 h-4 transition-transform duration-200 ${showFullDescription ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
};

export default ExpandableDescription;