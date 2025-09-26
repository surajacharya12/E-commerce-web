"use client";
import React, { useEffect, useState, useMemo } from "react";
import API_URL from "../api/api"; 
import Banner from "./components/Banner";
import ActiveFiltersBar from "./components/ActiveFiltersBar";
import FilterSection from "./components/FilterSection";
import ProductGrid from "./components/ProductGrid";

const ProductListingPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  }, []);

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
      if (selectedRatings.length > 0 && !selectedRatings.some(minRating => product.rating >= minRating)) return false;
      return true;
    });
  }, [products, priceRange, selectedCategories, selectedSubCategories, selectedBrands, selectedVariantTypes, selectedVariants, selectedRatings]);

  const isAnyFilterActive = useMemo(() => {
    return (
      priceRange < maxPrice ||
      selectedCategories.length > 0 ||
      selectedSubCategories.length > 0 ||
      selectedBrands.length > 0 ||
      selectedVariantTypes.length > 0 ||
      selectedVariants.length > 0 ||
      selectedRatings.length > 0
    );
  }, [priceRange, maxPrice, selectedCategories, selectedSubCategories, selectedBrands, selectedVariantTypes, selectedVariants, selectedRatings]);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-600">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Banner />

      <main className="flex flex-col md:flex-row gap-6 p-6 md:p-10">
        {/* Sidebar */}
        <aside className="w-full md:w-1/4 bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Filters</h2>
            {isAnyFilterActive && (
              <button
                className="text-red-500 text-sm font-medium hover:underline"
                onClick={handleClearFilters}
              >
                Clear all
              </button>
            )}
          </div>

          {/* Active Filters */}
          <ActiveFiltersBar
            priceRange={priceRange}
            maxPrice={maxPrice}
            setPriceRange={setPriceRange}
            categories={categories}
            brands={brands}
            selectedCategories={selectedCategories}
            selectedBrands={selectedBrands}
            selectedRatings={selectedRatings}
            setSelectedRatings={setSelectedRatings}
            toggleFilter={toggleFilter}
            isAnyFilterActive={isAnyFilterActive}
          />

          {/* --- Price Filter --- */}
          <div className="mb-6 border-b pb-4">
            <h3 className="text-lg font-semibold mb-3">Price</h3>
            <input
              type="range"
              min="0"
              max={maxPrice}
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
            <div className="flex justify-between text-sm text-gray-600 mt-1">
              <span>$0</span>
              <span>${priceRange}</span>
            </div>
          </div>

          {/* --- Rating Filter --- */}
          <div className="mb-6 border-b pb-4">
            <h3 className="text-lg font-semibold mb-3">Rating</h3>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <label key={rating} className="flex items-center space-x-2 text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    className="form-checkbox text-yellow-500"
                    checked={selectedRatings.includes(rating)}
                    onChange={() => toggleFilter(selectedRatings, setSelectedRatings, rating)}
                  />
                  <span>
                    {"★".repeat(rating)}
                    {"☆".repeat(5 - rating)} & up
                  </span>
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
        </aside>

        {/* Product Grid */}
        <ProductGrid products={products} filteredProducts={filteredProducts} />
      </main>
    </div>
  );
};

export default ProductListingPage;
