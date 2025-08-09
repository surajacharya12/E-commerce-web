import React, { useState, useEffect } from 'react';
import { Laptop, Shirt, Sparkles, Zap, Gift, TrendingUp } from 'lucide-react';

// Reusable Promotional Card Component
const PromotionalCard = ({
    id,
    discount,
    category,
    description,
    backgroundImage,
    gradientFrom,
    gradientTo,
    icon: Icon,
    badgeIcon: BadgeIcon,
    badgeText,
    badgeColor,
    delay,
    isVisible,
    hoveredCard,
    setHoveredCard,
    tagIcon: TagIcon,
    tagText,
    tagTexxt,
    tagBgFrom = 'from-blue-500',
    tagBgTo = 'to-blue-600'
}) => {
    return (
        <div
            className={`group relative rounded-3xl overflow-hidden shadow-2xl transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                } hover:scale-105 hover:rotate-1 bg-cover bg-center`}
            style={{
                backgroundImage: `url(${backgroundImage})`,
                transitionDelay: `${delay}ms`,
            }}
            onMouseEnter={() => setHoveredCard(id)}
            onMouseLeave={() => setHoveredCard(null)}
        >
            {/* Gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${gradientFrom} via-black/50 ${gradientTo}`}></div>

            {/* Animated background shapes */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-4 -right-4 w-32 h-32 bg-gradient-to-br from-white/20 to-white/5 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-gradient-to-tr from-white/10 to-white/5 rounded-full blur-2xl"></div>
            </div>

            {/* Content */}
            <div className="relative p-8 h-full flex flex-col justify-between min-h-[280px]">
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <BadgeIcon className={`w-5 h-5 ${badgeColor} animate-pulse`} />
                            <span className={`${badgeColor} text-xs font-bold uppercase tracking-wider`}>{badgeText}</span>
                        </div>
                        <h3 className="text-5xl font-black mb-2 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                            {discount}
                        </h3>
                        <p className="text-gray-200 text-sm font-semibold">{category}</p>
                    </div>
                    <div
                        className={`w-20 h-20 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm rounded-2xl flex items-center justify-center transition-all duration-500 ${hoveredCard === id ? 'rotate-12 scale-110' : ''
                            } border border-white/20`}
                    >
                        <Icon className="w-10 h-10 text-white drop-shadow-lg" />
                    </div>
                </div>

                <div className="space-y-4">
                    <p className="text-white/90 text-sm leading-relaxed font-medium">{description}</p>
                    <div className="flex items-center gap-3">
                        {/* Styled Tag */}
                        <div
                            className={`flex-1 inline-block text-center bg-gradient-to-r ${tagBgFrom} ${tagBgTo} text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-xl border border-white/20`}
                        >
                            {tagText}
                        </div>
                        {TagIcon && (
                            <div className="flex items-center gap-1 text-white/80 text-xs font-semibold">
                                <TagIcon className="w-4 h-4" />
                                <span>{tagTexxt}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Main Section Component
export default function PromotionalSection() {
    const [isVisible, setIsVisible] = useState(false);
    const [hoveredCard, setHoveredCard] = useState(null);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const promotionalCards = [
        {
            id: 'electronics',
            discount: '10% OFF',
            category: 'Electronics & Gadgets',
            description: 'Cutting-edge technology at unbeatable prices. Limited time offer!',
            backgroundImage: '/assets/headphone.png',
            gradientFrom: 'from-purple-900/70',
            gradientTo: 'to-black/80',
            icon: Laptop,
            badgeIcon: Zap,
            badgeText: 'Flash Sale',
            badgeColor: 'text-yellow-400',
            delay: 0,
            tagIcon: TrendingUp,
            tagText: 'Limited Time',
            tagBgFrom: 'from-blue-500',
            tagBgTo: 'to-blue-600',
            tagTexxt: 'Hot Tech'
        },
        {
            id: 'fashion',
            discount: '25% OFF',
            category: 'Fashion & Lifestyle',
            description: 'Trendy fashion pieces that define your style. Express yourself!',
            backgroundImage: '/assets/fashion.png',
            gradientFrom: 'from-pink-900/70',
            gradientTo: 'to-black/80',
            icon: Shirt,
            badgeIcon: Gift,
            badgeText: 'Best Deal',
            badgeColor: 'text-pink-400',
            delay: 200,
            tagIcon: Sparkles,
            tagText: 'Limited Time',
            tagBgFrom: 'from-pink-500',
            tagBgTo: 'to-pink-600',
            tagTexxt: 'Trending Now'
        },
        {
            id: 'beauty',
            discount: '15% OFF',
            category: 'Beauty & Wellness',
            description: 'Premium beauty products for your self-care routine. Glow up!',
            backgroundImage: '/assets/beauty.png',
            gradientFrom: 'from-emerald-900/70',
            gradientTo: 'to-black/80',
            icon: Sparkles,
            badgeIcon: Sparkles,
            badgeText: 'Premium',
            badgeColor: 'text-emerald-400',
            delay: 400,
            tagIcon: TrendingUp,
            tagText: 'Limited Time',
            tagBgFrom: 'from-emerald-500',
            tagBgTo: 'to-emerald-600',
            tagTexxt: 'Self-Care Pick'
        }
    ];

    return (
        <div className="px-4 md:px-6 lg:px-8 py-8 max-w-screen-xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                {promotionalCards.map((card) => (
                    <PromotionalCard
                        key={card.id}
                        {...card}
                        isVisible={isVisible}
                        hoveredCard={hoveredCard}
                        setHoveredCard={setHoveredCard}
                    />
                ))}
            </div>
        </div>
    );
}
