"use client";

const Categories = () => {
  return (
   <section className="h-screen w-screen bg-gray-100 flex items-start justify-center p-4 mt-10">
     <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-xl shadow-2xl overflow-hidden">
       {/* Left Side: Text and Button */}
       <div className="flex-1 flex flex-col justify-center p-8 md:p-12">
         <h1 className="text-4xl font-bold text-gray-800 mb-4">Browse Categories</h1>
         <p className="text-lg text-gray-600 mb-8">
           Discover products by category and find exactly what you need. From the latest tech gadgets to stylish fashion, home essentials, and more—explore our curated selections and shop with ease.
         </p>
         <button
           className="px-8 py-3 rounded-full text-white font-semibold shadow-lg transition-all duration-300 ease-in-out bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 transform hover:scale-105 w-fit"
           aria-label="Browse categories now"
           type="button"
         >
           Browse Now
         </button>
       </div>
       {/* Right Side: Image */}
       <div className="flex-1 flex items-center justify-center bg-gray-50 p-8">
         <img
           src="/assets/categories.png"
           alt="Wishlist illustration"
           className="w-full max-w-xs md:max-w-sm rounded-xl shadow-lg object-contain"
           style={{ minHeight: '250px', maxHeight: '350px' }}
         />
       </div>
     </div>
   </section>
  )
};
export default Categories;
