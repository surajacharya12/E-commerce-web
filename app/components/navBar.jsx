"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { FiSearch, FiBell, FiShoppingCart, FiMenu, FiX } from "react-icons/fi";
import Image from "next/image";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isBellActive, setIsBellActive] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "Browse", href: "/browse" },
    { name: "Live Shopping", href: "/live-shopping" },
    { name: "Categories", href: "/categories" },
    { name: "Wishlist", href: "/wishlist" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full backdrop-blur-lg bg-white/80 shadow-lg border-b border-gray-100 z-50 rounded-b-2xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3 transition-all duration-300">
        {/* Left Section: Logo */}
        <div className="flex items-center gap-3">
          
            <Image src="/logo.svg" alt="Logo" width={36} height={36} className="rounded-lg" />
         
          <span className="font-extrabold text-2xl text-gray-900 tracking-tight drop-shadow-sm">ShopEase</span>
        </div>

        {/* Search Bar - Always Visible, Responsive */}
        <div className="flex-1 mx-6">
          <div className="flex items-center bg-white/70 border border-gray-200 shadow-sm hover:shadow-md transition rounded-xl px-4 py-2 backdrop-blur-md">
            <FiSearch className="text-blue-500 mr-3 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products, brands..."
              className="w-full bg-transparent focus:outline-none text-base text-gray-900 placeholder:text-gray-400 font-medium"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-5">
          {/* Nav Links - Desktop */}
          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`relative text-base font-semibold px-3 py-2 rounded-xl transition duration-200 ease-in-out
                  ${pathname === link.href
                    ? "text-blue-600 bg-blue-50 shadow-md scale-105"
                    : "text-gray-700 hover:text-blue-600 hover:bg-blue-50 hover:scale-105"}
                `}
                style={{ display: 'inline-block', transition: 'transform 0.2s, color 0.2s, background 0.2s' }}
              >
                {link.name}
                {pathname === link.href && (
                  <span className="absolute left-1/2 -bottom-1.5 -translate-x-1/2 w-2 h-2 bg-blue-500 rounded-full animate-bounce"></span>
                )}
              </a>
            ))}
          </div>

          {/* Icons */}
          <button
            aria-label="Notifications"
            className={`p-2 rounded-full transition-colors shadow-sm
              ${isBellActive ? "bg-blue-100 ring-2 ring-blue-400" : "hover:bg-blue-100"}`}
            onClick={() => setIsBellActive(!isBellActive)}
          >
             <a
            href="/cart"
            className={`p-2 rounded-full transition-colors shadow-sm flex items-center justify-center
              ${pathname === "/cart" ? "bg-blue-100 ring-2 ring-blue-400" : "hover:bg-blue-100"}`}
          >
            <FiShoppingCart className={`w-6 h-6 ${pathname === "/cart" ? "text-blue-600" : "text-blue-500"}`} />
          </a>
          </button>
          <button
          aria-label="Notifications"
            className={`p-2 rounded-full transition-colors shadow-sm
              ${isBellActive ? "bg-blue-100 ring-2 ring-blue-400" : "hover:bg-blue-100"}`}
            onClick={() => setIsBellActive(!isBellActive)}>
               <a
            href="/reminder"
            className={`p-2 rounded-full transition-colors shadow-sm flex items-center justify-center
              ${pathname === "/reminder" ? "bg-blue-100 ring-2 ring-blue-400" : "hover:bg-blue-100"}`}
          >
            <FiBell className={`w-6 h-6 ${pathname === "reminder" ? "text-blue-600" : "text-blue-500"}`} />
            </a>
          </button>
       

          {/* Sign In - Desktop */}
          <a
            href="/signin"
            className={`hidden md:inline-flex items-center bg-gradient-to-tr from-blue-600 via-purple-600 to-pink-600 text-white text-base font-semibold px-5 py-2 rounded-xl shadow-md transition
              ${pathname === "/signin" ? "ring-2 ring-pink-400 scale-105 shadow-lg" : "hover:scale-105 hover:shadow-lg"}`}
          >
            Sign in
          </a>

          {/* Mobile Menu Toggle */}
          <button
            aria-label="Mobile Menu"
            className="md:hidden p-2 hover:bg-blue-100 rounded-full shadow-sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <FiX className="w-7 h-7 text-blue-500" />
            ) : (
              <FiMenu className="w-7 h-7 text-blue-500" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/90 border-t border-gray-100 shadow-xl px-4 py-6 rounded-b-2xl animate-slide-down space-y-4 backdrop-blur-lg">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`block font-semibold px-3 py-3 rounded-xl transition duration-200 ease-in-out
                ${pathname === link.href
                  ? "text-blue-600 bg-blue-50 shadow-md scale-105"
                  : "text-gray-700 hover:text-blue-600 hover:bg-blue-50 hover:scale-105"}
              `}
              style={{ transition: 'transform 0.2s, color 0.2s, background 0.2s' }}
            >
              {link.name}
              {pathname === link.href && (
                <span className="absolute left-1/2 -bottom-1.5 -translate-x-1/2 w-2 h-2 bg-blue-500 rounded-full animate-bounce"></span>
              )}
            </a>
          ))}
          <hr className="border-gray-100" />
          <button className="w-full bg-gradient-to-tr from-blue-600 via-purple-600 to-pink-600 text-white px-5 py-3 rounded-xl font-semibold shadow-md hover:scale-105 hover:shadow-lg transition">
            Sign in
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
