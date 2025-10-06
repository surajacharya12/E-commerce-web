"use client";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

const AllCategories = ({ categories }) => {
  const scrollRef = useRef(null);
  const router = useRouter();

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
      <div className="text-center mb-12">
        <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2 rounded-full mb-4">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span className="font-semibold">Explore Categories</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-slate-800 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
          All Product Categories
        </h2>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Discover amazing products across all our carefully curated categories
        </p>
      </div>

      {categories.length === 0 ? (
        <p className="text-gray-600 text-lg text-center">No categories available.</p>
      ) : (
        <div className="relative">
          {categories.length > 3 && (
            <>
              <button
                onClick={() => scroll("left")}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/90 backdrop-blur-xl p-3 rounded-2xl shadow-2xl border border-white/20 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-600 hover:text-white transition-all duration-300 transform hover:scale-110"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => scroll("right")}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/90 backdrop-blur-xl p-3 rounded-2xl shadow-2xl border border-white/20 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-600 hover:text-white transition-all duration-300 transform hover:scale-110"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
          <div
            ref={scrollRef}
            className={`flex gap-6 overflow-x-auto px-2 ${categories.length > 3 ? "px-12" : ""}`}
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {categories.map((category) => (
              <div
                key={category._id}
                className="group min-w-[220px] bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden transform transition-all duration-500 hover:scale-110 hover:shadow-3xl cursor-pointer flex-shrink-0 hover:rotate-1"
                onClick={() => router.push(`/live-shopping?category=${category._id}&categoryName=${encodeURIComponent(category.name)}`)}
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
                  <img
                    src={category.image && category.image !== "no_url" ? category.image : "/placeholder.png"}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold z-20">
                    New
                  </div>
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3 group-hover:scale-105 transition-transform">
                    {category.name}
                  </h3>
                  <button
                    className="group/btn relative px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/live-shopping?category=${category._id}&categoryName=${encodeURIComponent(category.name)}`);
                    }}
                  >
                    <span className="relative z-10 flex items-center space-x-2">
                      <span>Explore</span>
                      <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default AllCategories;
