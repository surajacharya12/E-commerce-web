import React from "react";

export default function DiscoverProductsCTA() {
  const handleViewProducts = () => {
    console.log("Navigating to All Products page...");
  };

  return (
    <section className="max-w-4xl mx-auto text-center py-16 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
        Ready to Discover Your Next Find?
      </h2>
      <p className="text-gray-600 text-lg sm:text-xl mb-8">
        Dive deeper into our extensive collection and uncover products tailored to your
        needs and desires. Your perfect item awaits.
      </p>
      <button
        onClick={handleViewProducts}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-md shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
      >
        View All Products
      </button>
    </section>
  );
}
