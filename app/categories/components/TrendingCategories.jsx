"use client";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const TrendingCategories = ({ subCategories }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
      <h2 className="text-4xl font-bold text-gray-900 mb-8 border-b pb-4 text-center">
        Trending Categories
      </h2>

      {subCategories.length === 0 ? (
        <p className="text-gray-600 text-lg text-center">No trending subcategories available.</p>
      ) : (
        <div className="relative">
          {subCategories.length > 4 && (
            <>
              <button
                onClick={() => scroll("left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow hover:bg-gray-100"
              >
                <ChevronLeft className="w-6 h-6 text-gray-700" />
              </button>
              <button
                onClick={() => scroll("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow hover:bg-gray-100"
              >
                <ChevronRight className="w-6 h-6 text-gray-700" />
              </button>
            </>
          )}
          <div
            ref={scrollRef}
            className={`flex gap-8 overflow-x-auto transition-all ${subCategories.length > 4 ? "px-12" : ""}`}
            style={{
              scrollbarWidth: "none", // Firefox
              msOverflowStyle: "none", // IE 10+
            }}
          >
            {subCategories.map((subCategory) => (
              <div
                key={subCategory._id}
                className="min-w-[250px] bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transform transition hover:scale-105 hover:shadow-2xl cursor-pointer flex-shrink-0"
                onClick={() => alert(`Navigating to trending sub-category: ${subCategory.name}`)}
              >
                <div className="h-48 w-full overflow-hidden">
                  <img
                    src={subCategory.image && subCategory.image !== "" ? subCategory.image : "/placeholder-trending.png"}
                    alt={subCategory.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-2xl font-semibold text-indigo-700 mb-2">{subCategory.name}</h3>
                  <p className="text-gray-600 text-sm">
                    Explore popular products in {subCategory.name}.
                  </p>
                  <button className="mt-4 inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition">
                    View Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        div::-webkit-scrollbar {
          display: none; /* Chrome, Safari */
        }
      `}</style>
    </section>
  );
};

export default TrendingCategories;
