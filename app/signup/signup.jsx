"use client";

import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
// Remove import, use public folder path
const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundImage: "url('/assets/bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#7ea49d"
      }}
    >
      {/* Header */}
      <header className="flex justify-between items-center p-6">
        <div className="flex items-center gap-2">
          {/* Replace with your actual logo */}
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-green-700">Logo</div>
          <span className="text-white font-semibold text-lg">ShopEase</span>
        </div>
        <div className="text-white text-sm">
          Already have an account?{" "}
          <a href="/signin" className="underline hover:text-gray-300">
            Sign in
          </a>
        </div>
      </header>

      {/* Main content */}
      <main className="flex flex-1 items-center justify-center px-6">
        <div className="flex max-w-4xl w-full rounded-lg overflow-hidden shadow-lg bg-white">
          {/* Left side - Form */}
          <div className="w-full md:w-1/2 p-8">
            <h2 className="text-3xl font-bold mb-8 text-gray-900 text-center">Sign up</h2>
            <form>
              <div className="mb-6">
                <label htmlFor="name" className="block text-gray-700 mb-2 font-semibold">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Your Name"
                  className="w-full p-3 rounded-md border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="email" className="block text-gray-700 mb-2 font-semibold">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="example.email@gmail.com"
                  className="w-full p-3 rounded-md border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>
              <div className="mb-4 relative">
                <label htmlFor="password" className="block text-gray-700 mb-2 font-semibold">
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Create a password (8+ characters)"
                  className="w-full p-3 rounded-md border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600"
                />
                <button
                  type="button"
                  className="absolute right-3 top-10 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                </button>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
              >
                Sign up
              </button>
            </form>

            <p className="text-center text-gray-500 my-6">Or sign up with</p>
            <div className="flex justify-center gap-4">
              <button
                aria-label="Sign in with Google"
                className="px-5 py-2 rounded-full bg-red-100 text-red-600 font-semibold hover:bg-red-200 transition"
              >
                G
              </button>
              <button
                aria-label="Sign in with Apple"
                className="px-5 py-2 rounded-full bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition"
              >
                
              </button>
            </div>
          </div>

          {/* Right side - Illustration */}
          <div className="hidden md:flex w-1/2 bg-green-700 relative">
            <div className="m-auto">
              {/* SVG or image illustration similar to the one in the photo */}
               <img
                 src="/assets/image.png"
                 alt="Illustration"
                 width={550}
                 height={600}
                 style={{ display: 'block', margin: '0 auto', objectFit: 'cover', height: '600px' }}
               />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Signup;
