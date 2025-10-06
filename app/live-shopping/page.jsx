"use client";
import React, { useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import API_URL from "../api/api";
import Banner from "../../components/shared/Banner";
import ActiveFiltersBar from "./components/ActiveFiltersBar";
import FilterSection from "./components/FilterSection";
import ProductGrid from "./components/ProductGrid";


const ProductListingContent = () => {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Get URL parameters for pre-filtering
  const categoryId = searchParams.get('category');
  const categoryName = searchParams.get('categoryName');
  const subCategoryId = searchParams.get('subCategory');
  const subCategoryName = searchParams.get('subCategoryName');
  const urlSearchTerm = searchParams.get('search');

  // Filters data
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [variantTypes, setVariantTypes] = useState([]);
  const [variants, setVariants] = useState([]);

  // Selected filters
  const [priceRange, setPriceRange] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedVariantTypes, setSelectedVariantTypes] = useState([]);
  const [selectedVariants, setSelectedVariants] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [searchTerm, setSearchTerm] = useState(urlSearchTerm || "");

  const toggleFilter = (list, setList, value) => {
    if (list.includes(value)) {
      setList(list.filter((item) => item !== value));
    } else {
      setList([...list, value]);
    }
  };

  const handleClearFilters = () => {
    setPriceRange(maxPrice);
    setSelectedCategories([]);
    setSelectedSubCategories([]);
    setSelectedBrands([]);
    setSelectedVariantTypes([]);
    setSelectedVariants([]);
    setSelectedRatings([]);
    setSearchTerm("");
  };

  // --- Fetch Products ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const result = await response.json();
        if (result.success) {
          const data = result.data;
          setProducts(data);

          const extractUnique = (data, keyFn) => {
            return [...new Map(data.map(keyFn).filter(item => item && item._id).map(item => [item._id, item])).values()];
          };

          setCategories(extractUnique(data, p => p.proCategoryId));
          setSubCategories(extractUnique(data, p => p.proSubCategoryId));
          setBrands(extractUnique(data, p => p.proBrandId));
          setVariantTypes(extractUnique(data, p => p.proVariantTypeId));
          setVariants(extractUnique(data, p => p.proVariantId));

          const prices = data.map(p => p.offerPrice || p.price).filter(p => typeof p === "number");
          const maxPriceValue = prices.length > 0 ? Math.max(...prices) : 1000;

          setMaxPrice(maxPriceValue);
          setPriceRange(maxPriceValue);

          // Pre-select filters based on URL parameters
          if (categoryId) {
            setSelectedCategories([categoryId]);
          }
          if (subCategoryId) {
            setSelectedSubCategories([subCategoryId]);
          }
        } else {
          setError(result.message || "Failed to fetch products.");
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryId, subCategoryId]);

  // Update search term when URL parameter changes
  useEffect(() => {
    if (urlSearchTerm !== null) {
      setSearchTerm(urlSearchTerm || "");
    }
  }, [urlSearchTerm]);

  // --- Filtering Logic ---
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const productPrice = product.offerPrice || product.price;
      if (productPrice > priceRange) return false;
      if (selectedCategories.length > 0 && !selectedCategories.includes(product.proCategoryId?._id)) return false;
      if (selectedSubCategories.length > 0 && !selectedSubCategories.includes(product.proSubCategoryId?._id)) return false;
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.proBrandId?._id)) return false;
      if (selectedVariantTypes.length > 0 && !selectedVariantTypes.includes(product.proVariantTypeId?._id)) return false;
      if (selectedVariants.length > 0 && !selectedVariants.includes(product.proVariantId?._id)) return false;
      if (selectedRatings.length > 0 && !selectedRatings.some(minRating => (product.rating?.averageRating || 0) >= minRating)) return false;

      // Search filter
      if (searchTerm.trim()) {
        const searchLower = searchTerm.toLowerCase();
        const nameMatch = product.name?.toLowerCase().includes(searchLower);
        const descriptionMatch = product.description?.toLowerCase().includes(searchLower);
        if (!nameMatch && !descriptionMatch) return false;
      }

      return true;
    });
  }, [products, priceRange, selectedCategories, selectedSubCategories, selectedBrands, selectedVariantTypes, selectedVariants, selectedRatings, searchTerm]);

  const isAnyFilterActive = useMemo(() => {
    return (
      priceRange < maxPrice ||
      selectedCategories.length > 0 ||
      selectedSubCategories.length > 0 ||
      selectedBrands.length > 0 ||
      selectedVariantTypes.length > 0 ||
      selectedVariants.length > 0 ||
      selectedRatings.length > 0 ||
      searchTerm.trim().length > 0
    );
  }, [priceRange, maxPrice, selectedCategories, selectedSubCategories, selectedBrands, selectedVariantTypes, selectedVariants, selectedRatings, searchTerm]);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-600">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-sans">
      <div className="-mx-4 md:-mx-6 lg:-mx-10">
        <Banner
          categoryName={categoryName}
          subCategoryName={subCategoryName}
          title="The Best Place To Find Amazing Products"
          subtitle="Discover premium quality products with unbeatable prices and exceptional customer service."
        />
      </div>

      {/* Mobile-Friendly Breadcrumb Navigation */}
      {(categoryName || subCategoryName) && (
        <div className="px-4 md:px-6 lg:px-10 pt-6 md:pt-8">
          <nav className="flex items-center space-x-2 md:space-x-3 bg-white/70 backdrop-blur-sm rounded-2xl md:rounded-full px-4 md:px-6 py-3 shadow-lg border border-white/20 overflow-x-auto">
            <a href="/categories" className="flex items-center space-x-1 md:space-x-2 text-slate-600 hover:text-indigo-600 transition-all duration-300 hover:scale-105 whitespace-nowrap">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              </svg>
              <span className="font-medium text-sm md:text-base">Categories</span>
            </a>
            <div className="w-1.5 h-1.5 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full flex-shrink-0"></div>
            <span className="font-semibold text-slate-800 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent text-sm md:text-base truncate">
              {categoryName || subCategoryName}
            </span>
          </nav>
        </div>
      )}

      {/* Mobile Filter Toggle - Enhanced Visibility */}
      <div className="lg:hidden px-4 md:px-6 py-4">
        <div className="relative">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-4 px-6 rounded-2xl font-bold shadow-2xl hover:shadow-indigo-500/25 transition-all duration-300 transform hover:scale-105 border border-white/20 backdrop-blur-sm"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span className="text-lg">{showFilters ? 'Hide Filters' : 'Show Filters & Sort'}</span>
            <svg className={`w-5 h-5 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Filter Count Badge */}
          {isAnyFilterActive && (
            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
              {(selectedCategories.length + selectedSubCategories.length + selectedBrands.length + selectedRatings.length + (priceRange < maxPrice ? 1 : 0))}
            </div>
          )}
        </div>
      </div>

      <main className="flex flex-col lg:flex-row gap-6 p-4 md:p-6 lg:p-10">
        {/* Mobile-Friendly Sidebar */}
        <aside className={`w-full lg:w-80 bg-white/95 backdrop-blur-xl p-4 md:p-6 lg:p-8 rounded-2xl lg:rounded-3xl shadow-xl lg:shadow-2xl border border-white/20 lg:sticky lg:top-8 lg:h-fit order-2 lg:order-1 transition-all duration-300 ${showFilters ? 'fixed lg:relative top-0 left-0 right-0 z-50 lg:z-auto max-h-screen overflow-y-auto animate-slideDown' : 'hidden lg:block'}`}>
          <div className="flex justify-between items-center mb-6 lg:mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </div>
              <h2 className="text-xl lg:text-2xl font-bold text-slate-800">Filters & Sort</h2>
            </div>

            <div className="flex items-center space-x-2">
              {isAnyFilterActive && (
                <button
                  className="px-3 py-1 lg:px-4 lg:py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs lg:text-sm font-semibold rounded-full hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  onClick={handleClearFilters}
                >
                  Clear all
                </button>
              )}

              {/* Mobile Close Button */}
              <button
                onClick={() => setShowFilters(false)}
                className="lg:hidden w-8 h-8 bg-slate-200 hover:bg-slate-300 rounded-full flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Active Filters */}
          <ActiveFiltersBar
            priceRange={priceRange}
            maxPrice={maxPrice}
            setPriceRange={setPriceRange}
            categories={categories}
            subCategories={subCategories}
            brands={brands}
            selectedCategories={selectedCategories}
            selectedSubCategories={selectedSubCategories}
            selectedBrands={selectedBrands}
            selectedRatings={selectedRatings}
            setSelectedCategories={setSelectedCategories}
            setSelectedSubCategories={setSelectedSubCategories}
            setSelectedBrands={setSelectedBrands}
            setSelectedRatings={setSelectedRatings}
            toggleFilter={toggleFilter}
            isAnyFilterActive={isAnyFilterActive}
            categoryName={categoryName}
            subCategoryName={subCategoryName}
          />

          {/* Modern Price Filter */}
          <div className="mb-8 pb-6 border-b border-gradient-to-r from-indigo-200 to-purple-200">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-800">Price Range</h3>
            </div>
            <div className="relative">
              <input
                type="range"
                min="0"
                max={maxPrice}
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full h-2 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-sm font-medium text-slate-600 mt-3">
                <span className="px-3 py-1 bg-slate-100 rounded-full">Rs. 0</span>
                <span className="px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full">Rs. {priceRange}</span>
              </div>
            </div>
          </div>

          <style jsx>{`
            .slider::-webkit-slider-thumb {
              appearance: none;
              height: 20px;
              width: 20px;
              border-radius: 50%;
              background: linear-gradient(45deg, #6366f1, #8b5cf6);
              cursor: pointer;
              box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
            }
            .slider::-moz-range-thumb {
              height: 20px;
              width: 20px;
              border-radius: 50%;
              background: linear-gradient(45deg, #6366f1, #8b5cf6);
              cursor: pointer;
              border: none;
              box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
            }
            
            @keyframes slideDown {
              from {
                opacity: 0;
                transform: translateY(-20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            
            .animate-slideDown {
              animation: slideDown 0.3s ease-out;
            }
          `}</style>

          {/* Modern Rating Filter */}
          <div className="mb-8 pb-6 border-b border-gradient-to-r from-indigo-200 to-purple-200">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-800">Customer Rating</h3>
            </div>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => (
                <label key={rating} className="flex items-center space-x-3 cursor-pointer group hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50 p-2 rounded-xl transition-all duration-300">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={selectedRatings.includes(rating)}
                      onChange={() => toggleFilter(selectedRatings, setSelectedRatings, rating)}
                    />
                    <div className={`w-5 h-5 rounded-lg border-2 transition-all duration-300 ${selectedRatings.includes(rating)
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500 border-yellow-400'
                      : 'border-slate-300 group-hover:border-yellow-400'
                      }`}>
                      {selectedRatings.includes(rating) && (
                        <svg className="w-3 h-3 text-white absolute top-0.5 left-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-slate-300'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="text-sm font-medium text-slate-600 ml-2">& up</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* --- Other Filters --- */}
          <FilterSection title="Categories" items={categories} selectedItems={selectedCategories} setList={setSelectedCategories} toggleFilter={toggleFilter} />
          <FilterSection title="SubCategories" items={subCategories} selectedItems={selectedSubCategories} setList={setSelectedSubCategories} toggleFilter={toggleFilter} />
          <FilterSection title="Brands" items={brands} selectedItems={selectedBrands} setList={setSelectedBrands} toggleFilter={toggleFilter} />
          <FilterSection title="Variant Types" items={variantTypes} selectedItems={selectedVariantTypes} setList={setSelectedVariantTypes} toggleFilter={toggleFilter} labelKey="type" />
          <FilterSection title="Variants" items={variants} selectedItems={selectedVariants} setList={setSelectedVariants} toggleFilter={toggleFilter} />

          {/* Mobile Apply Filters Button */}
          <div className="lg:hidden mt-6 pt-6 border-t border-slate-200">
            <button
              onClick={() => setShowFilters(false)}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-6 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Apply Filters & View Results
            </button>
          </div>
        </aside>

        {/* Mobile Overlay */}
        {showFilters && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setShowFilters(false)}
          />
        )}

        {/* Product Grid - Mobile First */}
        <div className="flex-1 order-1 lg:order-2">
          <ProductGrid
            products={products}
            filteredProducts={filteredProducts}
            categoryName={categoryName}
            subCategoryName={subCategoryName}
            searchTerm={searchTerm}
            onClearFilters={handleClearFilters}
          />
        </div>
      </main>
    </div>
  );
};

const ProductListingPage = () => {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    }>
      <ProductListingContent />
    </Suspense>
  );
};

export default ProductListingPage;
