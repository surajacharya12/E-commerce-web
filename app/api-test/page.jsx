"use client";
import { useState, useEffect } from "react";
import API_URL from "../api/api";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import { displayPrice } from "../utils/currency";

const ApiTest = () => {
    const [status, setStatus] = useState("Testing...");
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const { isLoggedIn, userData, loading } = useAuth();

    useEffect(() => {
        const testApi = async () => {
            try {
                console.log("Testing API URL:", API_URL);

                // Test basic connection
                const healthResponse = await axios.get(`${API_URL}/`);
                console.log("Health check:", healthResponse.data);

                // Test products endpoint
                const productsResponse = await axios.get(`${API_URL}/products`);
                console.log("Products response:", productsResponse.data);

                if (productsResponse.data.success) {
                    setProducts(productsResponse.data.data.slice(0, 3));
                    setStatus("✅ API Connection Successful!");
                } else {
                    setStatus("❌ API returned error");
                    setError(productsResponse.data.message);
                }
            } catch (err) {
                console.error("API Test Error:", err);
                setStatus("❌ API Connection Failed");
                setError(err.message);
            }
        };

        testApi();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">API Connection Test</h1>

                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
                    <p className="text-lg mb-2">{status}</p>
                    <p className="text-gray-600">API URL: {API_URL}</p>
                    {error && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
                            <p className="text-red-700">Error: {error}</p>
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
                    <div className="space-y-2">
                        <p><strong>Loading:</strong> {loading ? "Yes" : "No"}</p>
                        <p><strong>Is Logged In:</strong> {isLoggedIn ? "✅ Yes" : "❌ No"}</p>
                        <p><strong>User Data:</strong> {userData ? "✅ Available" : "❌ Not Available"}</p>
                        {userData && (
                            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
                                <p><strong>User ID (_id):</strong> {userData._id || "Not found"}</p>
                                <p><strong>User ID (id):</strong> {userData.id || "Not found"}</p>
                                <p><strong>Name:</strong> {userData.name}</p>
                                <p><strong>Email:</strong> {userData.email}</p>
                                <p><strong>All Keys:</strong> {Object.keys(userData).join(", ")}</p>
                            </div>
                        )}
                        <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded">
                            <p className="text-sm text-gray-600">
                                <strong>localStorage values:</strong>
                            </p>
                            <p className="text-xs">isLoggedIn: {typeof window !== 'undefined' ? localStorage.getItem("isLoggedIn") : 'N/A'}</p>
                            <p className="text-xs">userEmail: {typeof window !== 'undefined' ? localStorage.getItem("userEmail") : 'N/A'}</p>
                            <p className="text-xs">userData: {typeof window !== 'undefined' ? (localStorage.getItem("userData") ? "Present" : "Missing") : 'N/A'}</p>
                            {typeof window !== 'undefined' && localStorage.getItem("userData") && (
                                <p className="text-xs mt-2">userData content: {localStorage.getItem("userData")}</p>
                            )}
                        </div>
                    </div>
                </div>

                {products.length > 0 && (
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-4">Sample Products ({products.length})</h2>
                        <div className="grid gap-4">
                            {products.map((product) => (
                                <div key={product._id} className="border rounded p-4">
                                    <h3 className="font-semibold">{product.name}</h3>
                                    <p className="text-gray-600">{product.description}</p>
                                    <p className="text-blue-600 font-bold">{displayPrice(product.price)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ApiTest;