"use client";

import React, { useState, useEffect } from "react";
import API_URL from "@/app/api/api";
import * as MdIcons from "react-icons/md";

// Utility: map backend icon names to React components
const getIconComponent = (iconName) => {
  if (!iconName) return null;
  return MdIcons[iconName] || null;
};

// Reusable Promotional Card
const PromotionalCard = ({
  id,
  discountPercentage,
  discountName,
  description,
  discountPhoto,
  icon: Icon,
  badgeIcon: BadgeIcon,
  badgeText,
  badgeColor = "text-white",
  delay = 0,
  hoveredCard,
  setHoveredCard,
  tagIcon: TagIcon,
  tagText,
  tagTexxt,
  tagBgFrom = "from-blue-500",
  tagBgTo = "to-blue-600",
  isVisible,
}) => {
  return (
    <div
      className={`group relative rounded-3xl overflow-hidden shadow-2xl transition-all duration-700 transform ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      } hover:scale-[1.04] bg-cover bg-center`}
      style={{
        backgroundImage: `url(${discountPhoto})`,
        transitionDelay: `${delay}ms`,
      }}
      onMouseEnter={() => setHoveredCard(id)}
      onMouseLeave={() => setHoveredCard(null)}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70"></div>

      {/* Decorative glowing shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-6 -right-6 w-32 h-32 bg-blue-500/30 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-pink-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* Card Content */}
      <div className="relative p-8 h-full flex flex-col justify-between min-h-[300px]">
        {/* Top Section */}
        <div>
          {/* Badge */}
          <div className="flex items-center gap-2 mb-3">
            {BadgeIcon && (
              <BadgeIcon className={`w-5 h-5 ${badgeColor} animate-bounce`} />
            )}
            <span
              className={`${badgeColor} text-xs font-bold uppercase tracking-wider`}
            >
              {badgeText}
            </span>
          </div>

          {/* Discount Info */}
          <h3 className="text-5xl font-extrabold mb-1 bg-gradient-to-r from-yellow-400 via-pink-400 to-red-500 bg-clip-text text-transparent drop-shadow-lg">
            {discountPercentage}
          </h3>
          <p className="text-white/90 text-lg font-semibold">
            {discountName}
          </p>

          {/* Description */}
          <p className="text-gray-300 mt-3 text-sm leading-relaxed line-clamp-3">
            {description}
          </p>
        </div>

        {/* Bottom Tag Section */}
        <div className="mt-6">
          <div className="flex items-center justify-between gap-3">
            {/* Styled Tag */}
            <div
              className={`flex-1 text-center bg-gradient-to-r ${tagBgFrom} ${tagBgTo} text-white px-5 py-2 rounded-xl font-bold text-sm shadow-lg border border-white/20`}
            >
              {tagText}
            </div>

            {/* Extra Tag with Icon */}
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

// Main Promotional Section
export default function PromotionalSection() {
  const [discounts, setDiscounts] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    setIsVisible(true);

    const fetchDiscounts = async () => {
      try {
        const res = await fetch(`${API_URL}/discounts`);
        const data = await res.json();
        if (data.success) setDiscounts(data.data);
      } catch (error) {
        console.error("Failed to fetch discounts:", error);
      }
    };

    fetchDiscounts();
  }, []);

  return (
    <div className="px-4 md:px-6 lg:px-8 py-12 max-w-screen-xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
        🔥 Exclusive Deals
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {discounts.map((card, index) => {
          const Icon = getIconComponent(card.discountIcon);
          const BadgeIcon = getIconComponent(card.dealIcon);
          const TagIcon = getIconComponent(card.categoryIcon);

          return (
            <PromotionalCard
              key={card._id}
              id={card._id}
              discountPercentage={`${card.discountPercentage}% OFF`}
              discountName={card.discountName}
              description={card.description}
              discountPhoto={card.discountPhoto}
              icon={Icon}
              badgeIcon={BadgeIcon}
              badgeText="Hot Deal"
              badgeColor="text-yellow-400"
              delay={index * 150}
              hoveredCard={hoveredCard}
              setHoveredCard={setHoveredCard}
              tagIcon={TagIcon}
              tagText="Limited Time"
              tagTexxt={card.discountName}
              isVisible={isVisible}
            />
          );
        })}
      </div>
    </div>
  );
}
