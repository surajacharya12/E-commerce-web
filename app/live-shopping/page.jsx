"use client";

const LiveShopping = () => {
  return (
  
   <section className="h-screen w-screen bg-gray-100 flex items-start justify-center p-4 mt-10">
     <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-xl shadow-2xl overflow-hidden">
       {/* Left Side: Text and Button */}
       <div className="flex-1 flex flex-col justify-center p-8 md:p-12">
         <h1 className="text-4xl font-bold text-gray-800 mb-4">Experience Live Shopping!</h1>
         <h1 className="text-4xl font-bold text-gray-800 mb-4">Shop, Interact & Win Deals in Real Time.</h1>
         <p className="text-lg text-gray-600 mb-8">
           Join our live shopping events to discover trending products, interact with hosts, and grab exclusive offers instantly. Enjoy real-time demos, Q&A, and flash sales—all from the comfort of your home.
         </p>
         <button
           className="px-8 py-3 rounded-full text-white font-semibold shadow-lg transition-all duration-300 ease-in-out bg-gradient-to-r from-pink-500 to-red-600 hover:from-pink-600 hover:to-red-700 transform hover:scale-105 w-fit"
           aria-label="Start live shopping now"
           type="button"
         >
           Start Live Shopping
         </button>
       </div>
       {/* Right Side: Image */}
       <div className="flex-1 flex items-center justify-center bg-gray-50 p-8">
         <img
           src="/assets/liveshoping.png"
           alt="Live shopping illustration"
           className="w-full max-w-xs md:max-w-sm rounded-xl shadow-lg object-contain"
           style={{ minHeight: '250px', maxHeight: '350px' }}
         />
       </div>
     </div>
   </section>
  )
};

export default LiveShopping;
