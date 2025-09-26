"use client";

import React, { useState, useEffect } from "react";
import API_URL from "@/app/api/api"; // your API base URL
import * as MdIcons from "react-icons/md"; // import all Material Design icons

// Utility to get icon component by name directly from backend
// Backend should send full icon name including 'Md' prefix, e.g., 'MdLaptop'
const getIconComponent = (iconName) => {
  if (!iconName) return null;
  return MdIcons[iconName] || null;
};

// Reusable Promotional Card Component
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
      } hover:scale-105 hover:rotate-1 bg-cover bg-center`}
      style={{
        backgroundImage: `url(${discountPhoto})`,
        transitionDelay: `${delay}ms`,
      }}
      onMouseEnter={() => setHoveredCard(id)}
      onMouseLeave={() => setHoveredCard(null)}
    >
      {/* Gradient overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-br from-blue-700/70 via-black/50 to-black/80`}
      ></div>

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
              {BadgeIcon && (
                <BadgeIcon className={`w-5 h-5 ${badgeColor} animate-pulse`} />
              )}
              <span
                className={`${badgeColor} text-xs font-bold uppercase tracking-wider`}
              >
                {badgeText}
              </span>
            </div>
            <h3 className="text-5xl font-black mb-2 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              {discountPercentage}
            </h3>
            <p className="text-gray-200 text-sm font-semibold">{discountName}</p>
          </div>
          
        </div>

        <div className="space-y-4">
         
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
    <div className="px-4 md:px-6 lg:px-8 py-8 max-w-screen-xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {discounts.map((card, index) => {
          // Directly use backend-provided icon names
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
              badgeText="Deal"
              badgeColor="text-yellow-400"
              delay={index * 200}
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
