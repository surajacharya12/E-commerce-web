const HeroSection = () => {
  return (
    <section className="w-full bg-gray-100 flex items-center justify-center py-20 px-4">
      <div className="flex flex-col md:flex-row w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-500 ease-out hover:shadow-indigo-400/50">
        <div className="flex-1 flex flex-col justify-center p-8 md:p-16">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
            Explore All Categories 🚀
          </h1>
          <p className="text-xl text-gray-700 mb-10 leading-relaxed">
            Discover products by category and find exactly what you need.
          </p>
          <button
           className="px-8 py-3 rounded-full text-white font-semibold shadow-lg transition-all duration-300 ease-in-out bg-gradient-to-r from-purple-400 to-blue-300 hover:from-blue-700 hover:to-red-700 transform hover:scale-105 w-fit"
           aria-label="Start live shopping now"
           type="button"
         >
Start Browsing Now         </button>
          
        </div>
        <div className="flex-1 flex items-center justify-center bg-indigo-50/50 p-8">
          <img
            src="/assets/categories.png"
            alt="Categories illustration"
            className="w-full max-w-sm md:max-w-md rounded-2xl shadow-2xl object-contain"
            style={{ minHeight: "300px", maxHeight: "400px" }}
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
