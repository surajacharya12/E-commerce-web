"use client";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

const TrendingCategories = ({ subCategories }) => {
  const scrollRef = useRef(null);
  const router = useRouter();

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount =
        direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
      <div className="text-center mb-12">
        <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-pink-500 to-red-600 text-white px-6 py-2 rounded-full mb-4">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span className="font-semibold">Trending Now</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-slate-800 via-pink-600 to-red-600 bg-clip-text text-transparent mb-4">
          Trending Categories
        </h2>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Discover what's hot right now - the most popular categories everyone's talking about
        </p>
      </div>

      {subCategories.length === 0 ? (
        <p className="text-gray-600 text-lg text-center">
          No trending subcategories available.
        </p>
      ) : (
        <div className="relative">
          {subCategories.length > 3 && (
            <>
              <button
                onClick={() => scroll("left")}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/90 backdrop-blur-xl p-3 rounded-2xl shadow-2xl border border-white/20 hover:bg-gradient-to-r hover:from-pink-500 hover:to-red-600 hover:text-white transition-all duration-300 transform hover:scale-110"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => scroll("right")}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/90 backdrop-blur-xl p-3 rounded-2xl shadow-2xl border border-white/20 hover:bg-gradient-to-r hover:from-pink-500 hover:to-red-600 hover:text-white transition-all duration-300 transform hover:scale-110"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <div
            ref={scrollRef}
            className={`flex gap-6 overflow-x-auto px-2 ${subCategories.length > 3 ? "px-12" : ""}`}
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {subCategories.map((subCategory) => (
              <div
                key={subCategory._id}
                className="group min-w-[240px] bg-gradient-to-br from-white to-pink-50 backdrop-blur-xl rounded-3xl shadow-2xl border border-pink-200/50 overflow-hidden transform transition-all duration-500 hover:scale-110 hover:shadow-3xl cursor-pointer flex-shrink-0 hover:-rotate-1"
                onClick={() =>
                  router.push(`/live-shopping?subCategory=${subCategory._id}&subCategoryName=${encodeURIComponent(subCategory.name)}`)
                }
              >
                <div className="relative h-52 w-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-pink-600/80 via-transparent to-transparent z-10"></div>
                  <img
                    src={
                      subCategory.image && subCategory.image !== ""
                        ? subCategory.image
                        : "/placeholder-trending.png"
                    }
                    alt={subCategory.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-pink-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold z-20 animate-pulse">
                    🔥 Trending
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 z-20">
                    <h3 className="text-2xl font-black text-white mb-1 group-hover:scale-105 transition-transform">
                      {subCategory.name}
                    </h3>
                    <p className="text-pink-100 text-sm font-medium">
                      Explore {subCategory.name}
                    </p>
                  </div>
                </div>
                <div className="p-6 text-center">
                  <button
                    className="group/btn relative w-full px-6 py-3 bg-gradient-to-r from-pink-500 to-red-600 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/live-shopping?subCategory=${subCategory._id}&subCategoryName=${encodeURIComponent(subCategory.name)}`);
                    }}
                  >
                    <span className="relative z-10 flex items-center justify-center space-x-2">
                      <span>View Now</span>
                      <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
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

export default TrendingCategories;
