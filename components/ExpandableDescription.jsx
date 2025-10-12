"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ExpandableDescription = ({ description, points = [] }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-md border border-white/20 space-y-3">
            <div className="text-slate-700 leading-relaxed">
                <p className={`${expanded ? "" : "line-clamp-3"}`}>{description}</p>
            </div>

            {points.length > 0 && (
                <AnimatePresence>
                    {expanded && (
                        <motion.ul
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="list-disc pl-6 space-y-1 text-slate-700"
                        >
                            {points.map((p, i) => (
                                <li key={i}>{p}</li>
                            ))}
                        </motion.ul>
                    )}
                </AnimatePresence>
            )}

            {(description?.length > 150 || points.length > 3) && (
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="text-indigo-600 font-semibold hover:underline focus:outline-none"
                >
                    {expanded ? "Show Less ▲" : "Read More ▼"}
                </button>
            )}
        </div>
    );
};

export default ExpandableDescription;
