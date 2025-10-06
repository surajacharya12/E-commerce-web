"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FiSearch, FiBell, FiShoppingCart, FiMenu, FiX } from "react-icons/fi";
import Image from "next/image";
import { useAuth } from "../hooks/useAuth";
import API_URL from "../api/api";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [popularProducts, setPopularProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, logout } = useAuth();

  // Fetch popular products from backend
  useEffect(() => {
    const fetchPopularProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const result = await response.json();
        if (result.success && result.data) {
          // Get first 8 products and format them for search suggestions
          // Prioritize products with images and proper names
          const products = result.data
            .filter(product => product.name && product.name.trim().length > 0)
            .slice(0, 8)
            .map(product => ({
              term: product.name.trim(),
              image: product.images?.[0]?.url || '/assets/placeholder-product.png',
              category: product.proCategoryId?.name || 'Products',
              id: product._id,
              price: product.offerPrice || product.price
            }));
          setPopularProducts(products);
        }
      } catch (error) {
        console.error('Error fetching popular products:', error);
        // Fallback to empty array if API fails
        setPopularProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularProducts();
  }, []);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setIsSearchFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter suggestions based on search term
  const filteredSuggestions = searchTerm
    ? popularProducts.filter(item =>
      item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : popularProducts;

  const handleSignOut = () => {
    logout();
    window.location.href = "/signin";
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Navigate to live shopping with search parameter
      router.push(`/live-shopping?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
    setShowSuggestions(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
      setShowSuggestions(false);
    }
    if (e.key === 'Escape') {
      setShowSuggestions(false);
      setIsSearchFocused(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.term);
    setShowSuggestions(false);
    router.push(`/live-shopping?search=${encodeURIComponent(suggestion.term)}`);
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
    setShowSuggestions(true);
  };

  const handleSearchBlur = () => {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => {
      setIsSearchFocused(false);
      setShowSuggestions(false);
    }, 200);
  };

  const navLinks = [
    { name: "Browse", href: "/browse" },
    { name: "Live Shopping", href: "/live-shopping" },
    { name: "Categories", href: "/categories" },
    { name: "Wishlist", href: "/wishlist" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full backdrop-blur-2xl bg-white/90 shadow-2xl border-b border-white/20 z-50 rounded-b-3xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between navbar-mobile px-4 md:px-6 py-2 md:py-3 transition-all duration-300">
        {/* Left Section: Logo */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <Image
            src="/assets/logo.png"
            alt="Logo"
            width={50}
            height={50}
            className="logo-mobile rounded-lg sm:w-[60px] sm:h-[60px] md:w-[80px] md:h-[80px] lg:w-[106px] lg:h-[106px]"
          />
        </div>

        {/* Modern Search Bar with Suggestions - Desktop Only */}
        <div className="hidden md:flex flex-1 mx-6 relative" ref={searchRef}>
          <form onSubmit={handleSearch} className="relative group">
            <div className={`flex items-center bg-gradient-to-r from-slate-50 to-blue-50 border-2 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl px-6 py-3 backdrop-blur-xl ${isSearchFocused ? 'border-indigo-400 shadow-indigo-200/50' : 'border-slate-200 group-hover:border-indigo-300'
              }`}>
              <button
                type="submit"
                className="text-indigo-500 mr-4 w-6 h-6 group-hover:text-purple-600 transition-colors hover:scale-110"
              >
                <FiSearch />
              </button>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchInputChange}
                onKeyDown={handleKeyDown}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                placeholder="Search for amazing products..."
                className="w-full bg-transparent focus:outline-none text-base text-slate-800 placeholder:text-slate-400 font-medium"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    setShowSuggestions(false);
                  }}
                  className="ml-2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <FiX className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl"></div>
          </form>

          {/* Search Suggestions Dropdown */}
          {showSuggestions && (isSearchFocused || searchTerm) && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-2xl z-50 max-h-96 overflow-y-auto">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-slate-700">
                    {searchTerm ? 'Search Results' : 'Popular Products'}
                  </h3>
                  <span className="text-xs text-slate-500">
                    {loading ? 'Loading...' : `${filteredSuggestions.length} items`}
                  </span>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredSuggestions.map((suggestion, index) => (
                      <button
                        key={suggestion.id || index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full flex items-center space-x-3 p-3 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 rounded-xl transition-all duration-200 group"
                      >
                        <div className="w-12 h-12 bg-white rounded-lg shadow-md flex items-center justify-center overflow-hidden group-hover:shadow-lg transition-shadow">
                          <img
                            src={suggestion.image}
                            alt={suggestion.term}
                            className="w-10 h-10 object-cover rounded-md"
                            onError={(e) => {
                              e.target.src = '/assets/placeholder-product.png';
                            }}
                          />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
                            {suggestion.term}
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="text-xs text-slate-500">
                              in {suggestion.category}
                            </div>
                            {suggestion.price && (
                              <div className="text-xs font-semibold text-green-600">
                                ${suggestion.price}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-slate-400 group-hover:text-indigo-500 transition-colors">
                          <FiSearch className="w-4 h-4" />
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {!loading && searchTerm && filteredSuggestions.length === 0 && (
                  <div className="text-center py-8">
                    <div className="text-slate-400 mb-2">
                      <FiSearch className="w-8 h-8 mx-auto" />
                    </div>
                    <p className="text-slate-600 font-medium">No suggestions found</p>
                    <p className="text-sm text-slate-400">Try searching for something else</p>
                  </div>
                )}

                {!loading && !searchTerm && filteredSuggestions.length === 0 && (
                  <div className="text-center py-8">
                    <div className="text-slate-400 mb-2">
                      <FiSearch className="w-8 h-8 mx-auto" />
                    </div>
                    <p className="text-slate-600 font-medium">No products available</p>
                    <p className="text-sm text-slate-400">Check back later for suggestions</p>
                  </div>
                )}

                <div className="mt-4 pt-3 border-t border-slate-200">
                  <button
                    onClick={() => {
                      if (searchTerm.trim()) {
                        handleSearch({ preventDefault: () => { } });
                      }
                    }}
                    className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-medium"
                  >
                    <FiSearch className="w-4 h-4" />
                    <span>Search for "{searchTerm || 'products'}"</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 md:gap-5">
          {/* Modern Nav Links - Desktop */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`relative text-sm font-bold px-4 py-3 rounded-2xl transition-all duration-300 ease-in-out transform
                  ${pathname === link.href
                    ? "text-white bg-gradient-to-r from-indigo-500 to-purple-600 shadow-xl scale-105"
                    : "text-slate-700 hover:text-indigo-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:scale-105 hover:shadow-lg"}
                `}
              >
                {link.name}
                {pathname === link.href && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full animate-pulse"></div>
                )}
              </a>
            ))}
          </div>

          {/* Mobile Search Button */}
          <button
            aria-label="Search"
            className="md:hidden p-2 hover:bg-blue-100 rounded-full shadow-sm"
            onClick={() => {
              setIsMobileSearchOpen(!isMobileSearchOpen);
              setShowSuggestions(!isMobileSearchOpen);
              setIsMobileMenuOpen(false);
            }}
          >
            <FiSearch className="w-6 h-6 text-blue-500" />
          </button>

          {/* Icons */}
          <a
            href="/cart"
            className={`p-2 rounded-full transition-colors shadow-sm flex items-center justify-center
            ${pathname === "/cart" ? "bg-blue-100 ring-2 ring-blue-400" : "hover:bg-blue-100"}`}
          >
            <FiShoppingCart className={`w-5 h-5 md:w-6 md:h-6 ${pathname === "/cart" ? "text-blue-600" : "text-blue-500"}`} />
          </a>

          <a
            href="/reminder"
            className={`p-2 rounded-full transition-colors shadow-sm flex items-center justify-center
            ${pathname === "/reminder" ? "bg-blue-100 ring-2 ring-blue-400" : "hover:bg-blue-100"}`}
          >
            <FiBell className={`w-5 h-5 md:w-6 md:h-6 ${pathname === "/reminder" ? "text-blue-600" : "text-blue-500"}`} />
          </a>

          {/* Sign In/Out - Desktop */}
          {isLoggedIn ? (
            <button
              onClick={handleSignOut}
              className="hidden md:inline-flex items-center bg-gradient-to-tr from-pink-600 via-purple-600 to-blue-600 text-white text-base font-semibold px-5 py-2 rounded-xl shadow-md transition hover:scale-105 hover:shadow-lg"
            >
              Logout
            </button>
          ) : (
            <a
              href="/signin"
              className={`hidden md:inline-flex items-center bg-gradient-to-tr from-blue-600 via-purple-600 to-pink-600 text-white text-base font-semibold px-5 py-2 rounded-xl shadow-md transition
                ${pathname === "/signin" ? "ring-2 ring-pink-400 scale-105 shadow-lg" : "hover:scale-105 hover:shadow-lg"}`}
            >
              Sign in
            </a>
          )}

          {/* Mobile Menu Toggle */}
          <button
            aria-label="Mobile Menu"
            className="md:hidden p-2 hover:bg-blue-100 rounded-full shadow-sm"
            onClick={() => {
              setIsMobileMenuOpen(!isMobileMenuOpen);
              setIsMobileSearchOpen(false);
              setShowSuggestions(false);
            }}
          >
            {isMobileMenuOpen ? (
              <FiX className="w-6 h-6 text-blue-500" />
            ) : (
              <FiMenu className="w-6 h-6 text-blue-500" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {isMobileSearchOpen && (
        <div className="md:hidden fixed inset-0 top-[80px] sm:top-[90px] bg-black/50 backdrop-blur-sm z-40 animate-fade-in" onClick={() => {
          setIsMobileSearchOpen(false);
          setShowSuggestions(false);
        }}>
          <div className="bg-white/95 backdrop-blur-xl m-3 sm:m-4 rounded-2xl shadow-2xl p-3 sm:p-4 animate-slide-down" onClick={(e) => e.stopPropagation()}>
            <div className="relative" ref={searchRef}>
              <form onSubmit={handleSearch} className="relative group">
                <div className={`flex items-center bg-gradient-to-r from-slate-50 to-blue-50 border-2 shadow-lg rounded-2xl px-4 py-3 backdrop-blur-xl ${isSearchFocused ? 'border-indigo-400 shadow-indigo-200/50' : 'border-slate-200'}`}>
                  <button
                    type="submit"
                    className="text-indigo-500 mr-3 w-5 h-5 transition-colors hover:scale-110"
                  >
                    <FiSearch />
                  </button>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={handleSearchFocus}
                    placeholder="Search for amazing products..."
                    className="w-full bg-transparent focus:outline-none text-base text-slate-800 placeholder:text-slate-400 font-medium"
                    autoFocus
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchTerm("");
                      }}
                      className="ml-2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </form>

              {/* Mobile Search Suggestions */}
              {(isSearchFocused || searchTerm) && (
                <div className="mt-3 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-xl shadow-xl max-h-64 overflow-y-auto">
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-bold text-slate-700">
                        {searchTerm ? 'Search Results' : 'Popular Products'}
                      </h3>
                      <span className="text-xs text-slate-500">
                        {loading ? 'Loading...' : `${filteredSuggestions.length} items`}
                      </span>
                    </div>

                    {loading ? (
                      <div className="flex items-center justify-center py-6">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {filteredSuggestions.slice(0, 5).map((suggestion, index) => (
                          <button
                            key={suggestion.id || index}
                            onClick={() => {
                              handleSuggestionClick(suggestion);
                              setIsMobileSearchOpen(false);
                              setShowSuggestions(false);
                            }}
                            className="w-full flex items-center space-x-3 p-2 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 rounded-lg transition-all duration-200 group"
                          >
                            <div className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center overflow-hidden">
                              <img
                                src={suggestion.image}
                                alt={suggestion.term}
                                className="w-8 h-8 object-cover rounded-md"
                                onError={(e) => {
                                  e.target.src = '/assets/placeholder-product.png';
                                }}
                              />
                            </div>
                            <div className="flex-1 text-left">
                              <div className="font-semibold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">
                                {suggestion.term}
                              </div>
                              <div className="text-xs text-slate-500">
                                in {suggestion.category}
                              </div>
                            </div>
                            <div className="text-slate-400 group-hover:text-indigo-500 transition-colors">
                              <FiSearch className="w-4 h-4" />
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="mt-3 pt-2 border-t border-slate-200">
                      <button
                        onClick={() => {
                          if (searchTerm.trim()) {
                            handleSearch({ preventDefault: () => { } });
                            setIsMobileSearchOpen(false);
                            setShowSuggestions(false);
                          }
                        }}
                        className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-medium text-sm"
                      >
                        <FiSearch className="w-4 h-4" />
                        <span>Search for "{searchTerm || 'products'}"</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
              {pathname === link.href && (
                <span className="absolute left-1/2 -bottom-1.5 -translate-x-1/2 w-2 h-2 bg-blue-500 rounded-full animate-bounce"></span>
              )}
            </a>
          ))}
          <hr className="border-gray-100" />
          {isLoggedIn ? (
            <button
              className="w-full bg-gradient-to-tr from-pink-600 via-purple-600 to-blue-600 text-white px-5 py-3 rounded-xl font-semibold shadow-md hover:scale-105 hover:shadow-lg transition"
              onClick={handleSignOut}
            >
              Logout
            </button>
          ) : (
            <a
              href="/signin"
              className="w-full bg-gradient-to-tr from-blue-600 via-purple-600 to-pink-600 text-white px-5 py-3 rounded-xl font-semibold shadow-md hover:scale-105 hover:shadow-lg transition text-center block"
            >
              Sign in
            </a>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
