"use client";

import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useAuth } from "../hooks/useAuth";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API_URL from "../api/api";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    try {
      const response = await fetch(`${API_URL}/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Auto-login the user after successful registration
        if (data.data && data.data.user) {
          login(data.data.user.email, data.data.token, data.data.user);
        }

        toast.success(data.message || "Registration successful!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        // Redirect to browse page after successful registration and auto-login
        setTimeout(() => router.push("/browse"), 1000);
      } else {
        toast.error(data.message || "An error occurred.", {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error("Registration failed:", error);
      toast.error("Failed to connect to the server.", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-yellow-300/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-300/10 rounded-full blur-2xl animate-bounce"></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Modern Header */}
        <header className="flex justify-between items-center p-8 mt-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-tr from-yellow-400 via-pink-400 to-purple-500 rounded-2xl flex items-center justify-center font-black text-white shadow-2xl border border-white/30 backdrop-blur-sm">
              SE
            </div>
            <span className="text-white font-black text-3xl tracking-wide bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
              ShopEase
            </span>
          </div>
          <div className="bg-white/20 backdrop-blur-xl border border-white/30 text-white text-sm font-semibold px-6 py-3 rounded-2xl shadow-xl hover:bg-white/30 transition-all duration-300">
            Already have an account?{' '}
            <a href="/signin" className="text-yellow-200 hover:text-yellow-100 font-bold transition-colors">Sign in</a>
          </div>
        </header>

        {/* Modern Main content */}
        <main className="flex flex-1 items-center justify-center px-6">
          <div className="flex max-w-5xl w-full rounded-3xl overflow-hidden shadow-2xl bg-white/90 backdrop-blur-2xl border border-white/30">
            {/* Modern Left side - Form */}
            <div className="w-full md:w-1/2 p-12 flex flex-col justify-center">
              <div className="text-center mb-10">
                <h2 className="text-5xl font-black mb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Join ShopEase
                </h2>
                <p className="text-slate-600 text-lg font-medium">Create your account and start shopping</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-slate-700 mb-3 font-bold text-sm uppercase tracking-wide">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter your full name"
                    className="w-full p-5 rounded-2xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200 bg-white/80 placeholder-slate-400 font-medium shadow-lg transition-all duration-300 hover:shadow-xl"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="block text-slate-700 mb-3 font-bold text-sm uppercase tracking-wide">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    className="w-full p-5 rounded-2xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200 bg-white/80 placeholder-slate-400 font-medium shadow-lg transition-all duration-300 hover:shadow-xl"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-slate-700 mb-3 font-bold text-sm uppercase tracking-wide">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="Enter your phone number"
                    className="w-full p-5 rounded-2xl border-2 border-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 bg-white/80 placeholder-slate-400 font-medium shadow-lg transition-all duration-300 hover:shadow-xl"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="relative space-y-2">
                  <label htmlFor="password" className="block text-slate-700 mb-3 font-bold text-sm uppercase tracking-wide">
                    Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="Enter at least 8+ characters"
                    className="w-full p-5 rounded-2xl border-2 border-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 bg-white/80 placeholder-slate-400 font-medium shadow-lg transition-all duration-300 hover:shadow-xl"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-5 top-12 text-slate-400 hover:text-purple-600 transition-colors"
                    onClick={() => setShowPassword((prev) => !prev)}
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FiEyeOff className="w-6 h-6" /> : <FiEye className="w-6 h-6" />}
                  </button>
                </div>

                <div className="relative space-y-2">
                  <label htmlFor="confirmPassword" className="block text-slate-700 mb-3 font-bold text-sm uppercase tracking-wide">
                    Confirm Password
                  </label>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    className="w-full p-5 rounded-2xl border-2 border-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 bg-white/80 placeholder-slate-400 font-medium shadow-lg transition-all duration-300 hover:shadow-xl"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-5 top-12 text-slate-400 hover:text-purple-600 transition-colors"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    tabIndex={-1}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <FiEyeOff className="w-6 h-6" /> : <FiEye className="w-6 h-6" />}
                  </button>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-3 text-slate-600 cursor-pointer">
                    <input type="checkbox" className="w-5 h-5 text-indigo-600 border-2 border-slate-300 rounded focus:ring-indigo-500" />
                    <span className="font-medium">I agree to the Terms & Conditions</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="group relative w-full py-5 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-black text-lg shadow-2xl hover:shadow-indigo-500/25 transition-all duration-300 transform hover:scale-105 overflow-hidden"
                >
                  <span className="relative z-10">Create Your Account</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </form>
            </div>

            {/* Modern Right side - Illustration */}
            <div className="hidden md:flex w-1/2 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 items-center justify-center relative overflow-hidden">
              {/* Floating Elements */}
              <div className="absolute inset-0">
                <div className="absolute top-10 right-10 w-20 h-20 bg-white/20 rounded-2xl rotate-45 animate-pulse"></div>
                <div className="absolute bottom-20 left-10 w-16 h-16 bg-yellow-300/30 rounded-full animate-bounce"></div>
                <div className="absolute top-1/2 left-10 w-12 h-12 bg-pink-300/40 rounded-xl rotate-12 animate-pulse delay-500"></div>
              </div>

              <div className="relative z-10 text-center text-white p-8">
                <div className="mb-8">
                  <img
                    src="/assets/image.png"
                    alt="Shopping Illustration"
                    className="w-80 h-80 object-contain mx-auto rounded-3xl shadow-2xl border-4 border-white/30 backdrop-blur-sm transform hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-3xl font-black mb-4 bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
                  Join Our Shopping Community
                </h3>
                <p className="text-lg text-indigo-100 font-medium">
                  Create your account today and unlock exclusive deals, personalized recommendations, and premium shopping experience.
                </p>
              </div>
            </div>
          </div>
        </main>

        {/* Toast Container */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </div>
  );
};

export default SignUp;