"use client";

import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import { FiMail, FiArrowLeft, FiCheck, FiKey, FiEye, FiEyeOff } from "react-icons/fi";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API_URL from "../api/api";

const ForgotPassword = () => {
    const [step, setStep] = useState(1); // 1: Email, 2: Verification Code, 3: New Password
    const [email, setEmail] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSendCode = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            console.log("Sending verification code to:", email);
            const response = await fetch(`${API_URL}/forgot-password/send-code`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            console.log("Response:", data);

            if (response.ok && data.success) {
                toast.success(data.message || "Verification code sent to your email!");
                setStep(2);
            } else {
                toast.error(data.message || "Failed to send verification code");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Failed to connect to server. Make sure the backend is running on port 3001.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCode = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            console.log("Verifying code:", verificationCode, "for email:", email);
            const response = await fetch(`${API_URL}/forgot-password/verify-code`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, code: verificationCode }),
            });

            const data = await response.json();
            console.log("Verification response:", data);

            if (response.ok && data.success) {
                toast.success("Code verified successfully!");
                setStep(3);
            } else {
                toast.error(data.message || "Invalid verification code");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Failed to verify code");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        setLoading(true);

        try {
            console.log("Resetting password for:", email);
            const response = await fetch(`${API_URL}/forgot-password/reset-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    code: verificationCode,
                    newPassword
                }),
            });

            const data = await response.json();
            console.log("Reset password response:", data);

            if (response.ok && data.success) {
                toast.success("Password reset successfully!");
                setTimeout(() => router.push("/signin"), 2000);
            } else {
                toast.error(data.message || "Failed to reset password");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Failed to reset password. Make sure the backend is running.");
        } finally {
            setLoading(false);
        }
    };

    const renderStep1 = () => (
        <form onSubmit={handleSendCode} className="space-y-6">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiMail className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-2">Forgot Password?</h2>
                <p className="text-gray-600">Enter your email address and we'll send you a verification code</p>
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                </label>
                <input
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? "Sending..." : "Send Verification Code"}
            </button>
        </form>
    );

    const renderStep2 = () => (
        <form onSubmit={handleVerifyCode} className="space-y-6">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiCheck className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-2">Check Your Email</h2>
                <p className="text-gray-600">We sent a verification code to <span className="font-medium text-indigo-600">{email}</span></p>
            </div>

            <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                    Verification Code
                </label>
                <input
                    type="text"
                    id="code"
                    placeholder="Enter 6-digit code"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 text-center text-xl md:text-2xl font-mono tracking-widest"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    maxLength={6}
                    required
                />
            </div>

            <div className="flex space-x-3">
                <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all duration-200"
                >
                    Back
                </button>
                <button
                    type="submit"
                    disabled={loading || verificationCode.length !== 6}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "Verifying..." : "Verify Code"}
                </button>
            </div>

            <button
                type="button"
                onClick={handleSendCode}
                disabled={loading}
                className="w-full text-sm text-indigo-600 hover:text-indigo-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? "Sending..." : "Didn't receive the code? Resend"}
            </button>
        </form>
    );

    const renderStep3 = () => (
        <form onSubmit={handleResetPassword} className="space-y-6">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiKey className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-2">Reset Password</h2>
                <p className="text-gray-600">Enter your new password</p>
            </div>

            <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                </label>
                <div className="relative">
                    <input
                        type={showNewPassword ? "text" : "password"}
                        id="newPassword"
                        placeholder="Enter new password"
                        className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                    <button
                        type="button"
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                        {showNewPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                </label>
                <div className="relative">
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        placeholder="Confirm new password"
                        className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <button
                        type="button"
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                        {showConfirmPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? "Resetting..." : "Reset Password"}
            </button>
        </form>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-3 md:p-4 mt-16 md:mt-0">
            <div className="max-w-md w-full">
                {/* Back to Login */}
                <button
                    onClick={() => router.push("/signin")}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
                >
                    <FiArrowLeft className="w-4 h-4" />
                    <span>Back to Login</span>
                </button>

                {/* Main Card */}
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-2xl border border-white/20">
                    {/* Progress Indicator */}
                    <div className="flex items-center justify-center mb-6 md:mb-8">
                        <div className="flex items-center space-x-2 md:space-x-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-500'
                                }`}>
                                1
                            </div>
                            <div className={`w-8 h-1 ${step >= 2 ? 'bg-indigo-500' : 'bg-gray-200'}`}></div>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-500'
                                }`}>
                                2
                            </div>
                            <div className={`w-8 h-1 ${step >= 3 ? 'bg-indigo-500' : 'bg-gray-200'}`}></div>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 3 ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-500'
                                }`}>
                                3
                            </div>
                        </div>
                    </div>

                    {/* Step Content */}
                    {step === 1 && renderStep1()}
                    {step === 2 && renderStep2()}
                    {step === 3 && renderStep3()}
                </div>
            </div>

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

export default ForgotPassword;