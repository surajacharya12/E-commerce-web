"use client";

import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useAuth } from "../hooks/useAuth";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
      const response = await fetch("http://localhost:3001/users/register", {
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
        toast.success(data.message || "Registration successful!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        // Redirect to login page after successful registration
        setTimeout(() => router.push("/signin"), 1000);
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
    <div
      className="min-h-screen flex flex-col bg-cover bg-center"
      style={{
        backgroundImage: "url('/assets/bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#7ea49d"
      }}
    >
      {/* Header */}
      <header className="flex justify-between items-center p-6 mt-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-tr from-green-400 via-blue-400 to-purple-400 rounded-full flex items-center justify-center font-extrabold text-white shadow-lg border-2 border-white">SE</div>
          <span className="text-white font-extrabold text-2xl tracking-wide drop-shadow-lg">ShopEase</span>
        </div>
        <div className="text-white text-sm font-medium bg-white/10 px-4 py-2 rounded-full shadow">
          Already have an account?{' '}
          <a href="/signin" className="underline hover:text-blue-300 font-semibold">Sign in</a>
        </div>
      </header>

      {/* Main content */}
      <main className="flex flex-1 items-center justify-center px-6">
        <div className="flex max-w-4xl w-full rounded-2xl overflow-hidden shadow-2xl bg-white/80 backdrop-blur-xl border border-gray-200">
          {/* Left side - Form */}
          <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
            <h2 className="text-4xl font-extrabold mb-8 text-gray-900 text-center tracking-tight">Join ShopEase</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-gray-700 mb-2 font-semibold">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your full name"
                  className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 bg-white/70 placeholder-gray-400 font-medium shadow"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-gray-700 mb-2 font-semibold">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="example@email.com"
                  className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 bg-white/70 placeholder-gray-400 font-medium shadow"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-gray-700 mb-2 font-semibold">
                  Phone Number 
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="Enter your phone number"
                  className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 bg-white/70 placeholder-gray-400 font-medium shadow"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="relative">
                <label htmlFor="password" className="block text-gray-700 mb-2 font-semibold">
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Enter at least 8+ characters"
                  className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-400 bg-white/70 placeholder-gray-400 font-medium shadow"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="absolute right-4 top-10 text-pink-400 hover:text-pink-600"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                </button>
              </div>

              <div className="relative">
                <label htmlFor="confirmPassword" className="block text-gray-700 mb-2 font-semibold">
                  Confirm Password
                </label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-400 bg-white/70 placeholder-gray-400 font-medium shadow"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="absolute right-4 top-10 text-pink-400 hover:text-pink-600"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  tabIndex={-1}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 text-white font-bold shadow-lg hover:from-green-600 hover:to-purple-600 transition-all duration-300 text-lg"
              >
                Create Account
              </button>
            </form>
          </div>

          {/* Right side - Illustration */}
          <div className="hidden md:flex w-1/2 bg-gradient-to-br from-green-400 via-blue-400 to-purple-400 items-center justify-center relative">
            <img
              src="/assets/image.png"
              alt="Illustration"
              className="object-cover w-4/5 h-4/5 rounded-2xl shadow-2xl border-4 border-white"
            />
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
  );
};

export default SignUp;