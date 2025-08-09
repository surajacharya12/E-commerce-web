"use client";

import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useAuth } from "../hooks/useAuth";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const { login } = useAuth();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch("http://localhost:3001/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Use the login function from useAuth hook
                login(data.data.user.email, null, data.data.user);
                toast.success(data.message || "Login successful!", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
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
            console.error("Login failed:", error);
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
                    Don't have an account?{' '}
                    <a href="/signup" className="underline hover:text-blue-300 font-semibold">Sign up</a>
                </div>
            </header>

            {/* Main content */}
            <main className="flex flex-1 items-center justify-center px-6">
                <div className="flex max-w-4xl w-full rounded-2xl overflow-hidden shadow-2xl bg-white/80 backdrop-blur-xl border border-gray-200">
                    {/* Left side - Form */}
                    <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
                        <h2 className="text-4xl font-extrabold mb-8 text-gray-900 text-center tracking-tight">Sign in to ShopEase</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-gray-700 mb-2 font-semibold">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="example@email.com"
                                    className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 bg-white/70 placeholder-gray-400 font-medium shadow"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="relative">
                                <label htmlFor="password" className="block text-gray-700 mb-2 font-semibold">
                                    Password
                                </label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    placeholder="Enter at least 8+ characters"
                                    className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-400 bg-white/70 placeholder-gray-400 font-medium shadow"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
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
                            <div className="flex items-center justify-between mb-6 text-sm">
                                <label className="flex items-center gap-2 text-gray-600">
                                    <input type="checkbox" className="form-checkbox h-4 w-4" /> Remember me
                                </label>
                                <a href="#" className="text-blue-600 hover:underline font-semibold">
                                    Forgot password?
                                </a>
                            </div>
                            <button
                                type="submit"
                                className="w-full py-4 rounded-xl bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 text-white font-bold shadow-lg hover:from-green-600 hover:to-purple-600 transition-all duration-300 text-lg"
                            >
                                Sign in
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

export default Login;