"use client";

import React from 'react';

const QuickFAQ = ({ faqs }) => {
    return (
        <div className="space-y-4">
            {faqs.map((faq, idx) => (
                <div key={idx} className="bg-white/20 rounded-2xl p-4">
                    <h4 className="font-semibold mb-2">{faq.title}</h4>
                    <p className="text-blue-100 text-sm">{faq.body}</p>
                </div>
            ))}
        </div>
    );
};

export default QuickFAQ;
