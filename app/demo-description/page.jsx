"use client";
import React from 'react';
import ExpandableDescription from '../../components/ExpandableDescription';

const DemoDescriptionPage = () => {
    const shortDescription = "This is a short product description that doesn't need expansion.";

    const longDescription = `This is a very long product description that demonstrates the expandable functionality. 
    
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.

Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.`;

    const multiLineDescription = `Line 1: Product features
Line 2: High quality materials
Line 3: Durable construction
Line 4: Modern design
Line 5: Easy to use
Line 6: Great value for money`;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
            <div className="max-w-4xl mx-auto px-4 space-y-8">
                <h1 className="text-3xl font-bold text-center text-slate-800 mb-8">
                    Expandable Description Demo
                </h1>

                <div>
                    <h2 className="text-xl font-semibold text-slate-700 mb-4">Short Description (No Expansion)</h2>
                    <ExpandableDescription description={shortDescription} />
                </div>

                <div>
                    <h2 className="text-xl font-semibold text-slate-700 mb-4">Long Description (Character-based Expansion)</h2>
                    <ExpandableDescription description={longDescription} />
                </div>

                <div>
                    <h2 className="text-xl font-semibold text-slate-700 mb-4">Multi-line Description (Line-based Expansion)</h2>
                    <ExpandableDescription description={multiLineDescription} />
                </div>
            </div>
        </div>
    );
};

export default DemoDescriptionPage;