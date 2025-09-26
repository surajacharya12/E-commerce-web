"use client";
import React, { useState, useEffect } from "react";
import {
  FiSearch,
  FiMail,
  FiPhone,
  FiUser,
  FiMapPin,
  FiX,
} from "react-icons/fi";
import { Star, Award, CheckCircle } from "lucide-react"; // badge icons
import Head from "next/head";
import API_URL from "../api/api";

const url = API_URL;

// Badge icon mapping
const badgeIcons = {
  star: <Star className="w-4 h-4 text-yellow-500" />,
  award: <Award className="w-4 h-4 text-blue-500" />,
  check: <CheckCircle className="w-4 h-4 text-green-500" />,
};

const MultipleStoreInfo = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStore, setSelectedStore] = useState(null);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const res = await fetch(`${url}/stores`);
      const data = await res.json();
      if (data.success) {
        setStores(data.data);
      }
    } catch (error) {
      console.error("Error fetching stores:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStores = stores.filter((store) => {
    const search = searchTerm.toLowerCase();
    return (
      store.storeName?.toLowerCase().includes(search) ||
      store.storeManagerName?.toLowerCase().includes(search) ||
      store.storeLocation?.toLowerCase().includes(search)
    );
  });

  return (
    <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8 mt-2.5">
      <Head>
        <title>Our Stores</title>
        <meta
          name="description"
          content="Find our e-commerce store locations and contact information."
        />
      </Head>

      <div className="max-w-6xl mx-auto">
        {/* Header and Search Bar */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-gray-900">
            Our <span className="text-indigo-600">Store Network</span>
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Discover our premium stores and their unique specialties across
            different locations.
          </p>
        </div>

        <div className="mb-8">
          <div className="relative max-w-lg mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm shadow-md transition-all"
              placeholder="Search by store name, manager, or location..."
            />
          </div>
        </div>

        {/* Store Cards Grid */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading stores...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredStores.length > 0 ? (
              filteredStores.map((store) => (
                <div
                  key={store._id}
                  onClick={() => setSelectedStore(store)}
                  className="bg-white rounded-3xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
                >
                  <div className="relative overflow-hidden">
                    {/* Gradient Header */}
                    <div className="h-24 bg-gradient-to-r from-indigo-400 to-blue-400 relative">
                      <div className="absolute top-4 right-4">
                        <span className="flex items-center gap-1 bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full font-medium">
                          {badgeIcons[store.storeBadge] ||
                            store.storeBadge ||
                            "Featured"}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 -mt-12 relative">
                      <div className="flex justify-center mb-4">
                        <div className="w-24 h-24 bg-white rounded-full p-1 shadow-lg">
                          <img
                            className="w-full h-full rounded-full object-cover"
                            src={
                              store.storeManagerPhoto ||
                              "https://via.placeholder.com/150"
                            }
                            alt={`${store.storeName} representative`}
                          />
                        </div>
                      </div>

                      <div className="text-center mb-4">
                        <h2 className="text-xl font-bold text-gray-900">
                          {store.storeName}
                        </h2>
                      </div>

                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <FiUser className="flex-shrink-0 w-4 h-4 text-indigo-500" />
                          <span className="truncate">
                            {store.storeManagerName}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FiPhone className="flex-shrink-0 w-4 h-4 text-indigo-500" />
                          <span className="truncate">
                            {store.storePhoneNumber}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FiMapPin className="flex-shrink-0 w-4 h-4 text-indigo-500" />
                          <span className="truncate">{store.storeLocation}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-xl text-gray-500">
                  No stores found matching your search. Please try a different
                  query.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Store Details Modal */}
        {selectedStore && (
          <div
            className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedStore(null)}
          >
            <div
              className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative border border-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedStore(null)}
                className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors z-10 bg-white rounded-full p-2 shadow-md"
                aria-label="Close"
              >
                <FiX className="h-5 w-5" />
              </button>

              {/* Header with gradient */}
              <div className="h-32 bg-gradient-to-r from-indigo-400 to-blue-400 relative rounded-t-3xl">
                <div className="absolute top-6 left-6">
                  <span className="flex items-center gap-1 bg-white/20 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-full font-medium">
                    {badgeIcons[selectedStore.storeBadge] ||
                      selectedStore.storeBadge ||
                      "Featured"}
                  </span>
                </div>
              </div>

              <div className="p-8 -mt-16 relative">
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                  <div className="flex-shrink-0">
                    <div className="w-32 h-32 bg-white rounded-full p-2 shadow-xl">
                      <img
                        className="w-full h-full rounded-full object-cover"
                        src={
                          selectedStore.storeManagerPhoto ||
                          "https://via.placeholder.com/150"
                        }
                        alt={`${selectedStore.storeName} representative`}
                      />
                    </div>
                  </div>

                  <div className="text-center lg:text-left flex-grow">
                    <h2 className="text-4xl font-bold text-gray-900 mb-2">
                      {selectedStore.storeName}
                    </h2>
                    <p className="text-gray-600 mb-4">
                      Store Representative: {selectedStore.storeManagerName}
                    </p>

                    <p className="text-gray-600 leading-relaxed mb-6">
                      {selectedStore.storeDescription}
                    </p>

                    {/* Contact Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Contact Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-3 text-gray-700 bg-gray-50 p-3 rounded-lg">
                          <FiMail className="flex-shrink-0 h-5 w-5 text-indigo-500" />
                          <span className="break-all">
                            {selectedStore.storeEmail}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3 text-gray-700 bg-gray-50 p-3 rounded-lg">
                          <FiPhone className="flex-shrink-0 h-5 w-5 text-indigo-500" />
                          <span>{selectedStore.storePhoneNumber}</span>
                        </div>
                        <div className="flex items-center space-x-3 text-gray-700 bg-gray-50 p-3 rounded-lg md:col-span-2">
                          <FiMapPin className="flex-shrink-0 h-5 w-5 text-indigo-500" />
                          <span>{selectedStore.storeLocation}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultipleStoreInfo;
