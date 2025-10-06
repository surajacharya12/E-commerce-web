"use client";

import React from "react";
import { usePathname } from "next/navigation";
import {
    FiHelpCircle,
    FiShoppingCart,
    FiCreditCard,
    FiTruck,
    FiRotateCcw,
    FiPhone
} from "react-icons/fi";

const HelpCenterNav = () => {
    const pathname = usePathname();

    const helpPages = [
        {
            id: "help-center",
            title: "Help Center",
            href: "/help-center",
            icon: FiHelpCircle,
            description: "Main help hub"
        },
        {
            id: "customer-service",
            title: "Customer Service",
            href: "/customer-service",
            icon: FiPhone,
            description: "Contact support"
        },
        {
            id: "how-to-buy",
            title: "How To Buy",
            href: "/how-to-buy",
            icon: FiShoppingCart,
            description: "Shopping guide"
        },
        {
            id: "payment",
            title: "Payment",
            href: "/payment",
            icon: FiCreditCard,
            description: "Payment info"
        },
        {
            id: "shipping",
            title: "Shipping",
            href: "/shipping",
            icon: FiTruck,
            description: "Delivery details"
        },
        {
            id: "return-refund",
            title: "Returns & Refunds",
            href: "/return-refund",
            icon: FiRotateCcw,
            description: "Return policy"
        }
    ];

    return (
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-white/20 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">Help Topics</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {helpPages.map((page) => {
                    const Icon = page.icon;
                    const isActive = pathname === page.href;

                    return (
                        <a
                            key={page.id}
                            href={page.href}
                            className={`flex flex-col items-center p-3 rounded-xl transition-all duration-200 text-center ${isActive
                                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg scale-105'
                                    : 'text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:scale-105'
                                }`}
                        >
                            <Icon className={`w-6 h-6 mb-2 ${isActive ? 'text-white' : 'text-indigo-600'}`} />
                            <span className="text-xs font-medium">{page.title}</span>
                            <span className={`text-xs mt-1 ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                                {page.description}
                            </span>
                        </a>
                    );
                })}
            </div>
        </div>
    );
};

export default HelpCenterNav;