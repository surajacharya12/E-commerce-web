"use client";

const Wishlist = () => {
  return (
   <section className="h-screen w-screen bg-gray-100 flex items-start justify-center p-4 mt-10">
     <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-xl shadow-2xl overflow-hidden">
       {/* Left Side: Text and Button */}
       <div className="flex-1 flex flex-col justify-center p-8 md:p-12">
         <h1 className="text-4xl font-bold text-gray-800 mb-4">Curate Your Desires.</h1>
         <h1 className="text-4xl font-bold text-gray-800 mb-4">Your Perfect Finds Await.</h1>
         <p className="text-lg text-gray-600 mb-8">
           Effortlessly save your favorite items, track price changes, and plan your next purchase. Your personal shopping sanctuary.
         </p>
         <button
           className="px-8 py-3 rounded-full text-white font-semibold shadow-lg transition-all duration-300 ease-in-out bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105 w-fit"
           aria-label="Shop now for wishlist items"
           type="button"
         >
           Start Exploring
         </button>
       </div>
       {/* Right Side: Image */}
       <div className="flex-1 flex items-center justify-center bg-gray-50 p-8">
         <img
           src="/assets/wishlist.png"
           alt="Wishlist illustration"
           className="w-full max-w-xs md:max-w-sm rounded-xl shadow-lg object-contain"
           style={{ minHeight: '250px', maxHeight: '350px' }}
         />
       </div>
     </div>
   </section>
  )
};

export default Wishlist;
