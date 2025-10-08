"use client";
import React, { useState } from "react";
import ProductCard from "./ProductCard";

const ProductGrid = ({ products, filteredProducts, categoryName, subCategoryName, searchTerm, onClearFilters }) => {
  // --- Pagination State ---
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9; // adjust if needed

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <section className="w-full">
      <div className="mb-6">
        {(categoryName || subCategoryName) && (
          <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl shadow-lg">
            <p className="text-blue-800 font-semibold flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              Showing products in: <span className="font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent ml-1">{categoryName || subCategoryName}</span>
            </p>
          </div>
        )}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            {categoryName || subCategoryName ? `${categoryName || subCategoryName} Products` : "Product Results"}
          </h2>
          <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-white/20">
            <span className="text-sm font-medium text-slate-600">
              {filteredProducts.length} of {products.length} products
            </span>
          </div>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center p-8 md:p-12 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20">
          <div className="mb-6">
            {searchTerm ? (
              <svg className="w-16 h-16 mx-auto text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            ) : (
              <svg className="w-16 h-16 mx-auto text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
              </svg>
            )}
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-2">
            {searchTerm ? `No Results for "${searchTerm}"` : "No Products Found"}
          </h3>
          <p className="text-lg text-slate-600 mb-6">
            {searchTerm
              ? `We couldn't find any products matching "${searchTerm}". Try searching with different keywords or clear your filters.`
              : "No products found matching your current filters. Try adjusting your filters to see more results!"
            }
          </p>
          {onClearFilters && (
            <button
              onClick={onClearFilters}
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Clear All Filters
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Modern Product Grid */}
          {/* Use up to 3 columns on xl to give each card more width; 2xl keep 4 if desired */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6">
            {currentProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {/* Modern Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-wrap justify-center items-center mt-8 gap-2">
              {/* Prev Button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${currentPage === 1
                  ? "text-slate-400 bg-slate-100 cursor-not-allowed"
                  : "text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-lg transform hover:scale-105"
                  }`}
              >
                Previous
              </button>

              {/* Page Numbers */}
              <div className="flex gap-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let page;
                  if (totalPages <= 5) {
                    page = i + 1;
                  } else if (currentPage <= 3) {
                    page = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    page = totalPages - 4 + i;
                  } else {
                    page = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 rounded-xl font-bold transition-all duration-300 ${currentPage === page
                        ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg scale-110"
                        : "text-slate-600 bg-white/80 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:scale-105"
                        }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${currentPage === totalPages
                  ? "text-slate-400 bg-slate-100 cursor-not-allowed"
                  : "text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-lg transform hover:scale-105"
                  }`}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default ProductGrid;
