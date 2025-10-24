"use client";

import React, { useState } from "react";
import API_URL from "../api/api";

export default function TestReturnsPage() {
    const [testResults, setTestResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const runTests = async () => {
        setLoading(true);
        const results = [];

        // Test 1: Health check
        try {
            const response = await fetch(`${API_URL}/health`);
            const data = await response.json();
            results.push({
                test: "Health Check",
                status: response.ok ? "✅ PASS" : "❌ FAIL",
                details: data
            });
        } catch (error) {
            results.push({
                test: "Health Check",
                status: "❌ FAIL",
                details: error.message
            });
        }

        // Test 2: Returns API info
        try {
            const response = await fetch(`${API_URL}/returns`);
            const data = await response.json();
            results.push({
                test: "Returns API Info",
                status: response.ok ? "✅ PASS" : "❌ FAIL",
                details: data
            });
        } catch (error) {
            results.push({
                test: "Returns API Info",
                status: "❌ FAIL",
                details: error.message
            });
        }

        // Test 3: Returns test endpoint
        try {
            const response = await fetch(`${API_URL}/returns/test`);
            const data = await response.json();
            results.push({
                test: "Returns Test Endpoint",
                status: response.ok ? "✅ PASS" : "❌ FAIL",
                details: data
            });
        } catch (error) {
            results.push({
                test: "Returns Test Endpoint",
                status: "❌ FAIL",
                details: error.message
            });
        }

        // Test 4: Admin returns (should work without auth for testing)
        try {
            const response = await fetch(`${API_URL}/returns/admin/all?limit=1`);
            const data = await response.json();
            results.push({
                test: "Admin Returns Endpoint",
                status: response.ok ? "✅ PASS" : "❌ FAIL",
                details: data
            });
        } catch (error) {
            results.push({
                test: "Admin Returns Endpoint",
                status: "❌ FAIL",
                details: error.message
            });
        }

        setTestResults(results);
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">
                        🧪 Returns API Test Page
                    </h1>

                    <div className="mb-6">
                        <p className="text-gray-600 mb-4">
                            This page tests the connection to the returns API endpoints.
                            Use this to debug connection issues.
                        </p>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                            <h3 className="font-semibold text-blue-900">API Configuration:</h3>
                            <p className="text-blue-800">Base URL: <code>{API_URL}</code></p>
                        </div>

                        <button
                            onClick={runTests}
                            disabled={loading}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? "Running Tests..." : "Run API Tests"}
                        </button>
                    </div>

                    {testResults.length > 0 && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-gray-900">Test Results:</h2>

                            {testResults.map((result, index) => (
                                <div key={index} className="border rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-semibold">{result.test}</h3>
                                        <span className="text-lg">{result.status}</span>
                                    </div>

                                    <div className="bg-gray-50 rounded p-3">
                                        <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                                            {typeof result.details === 'object'
                                                ? JSON.stringify(result.details, null, 2)
                                                : result.details
                                            }
                                        </pre>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <h3 className="font-semibold text-yellow-900 mb-2">Troubleshooting:</h3>
                        <ul className="text-yellow-800 space-y-1 text-sm">
                            <li>• If all tests fail: Backend server is not running</li>
                            <li>• If health check passes but returns fail: Check database connection</li>
                            <li>• If CORS errors: Check browser console for detailed error messages</li>
                            <li>• To start backend: Run <code>./start-backend.sh</code> from project root</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}