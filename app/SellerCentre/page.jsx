"use client"
import React, { useState, useEffect } from 'react';
import { FiSearch, FiMail, FiPhone, FiUser, FiMapPin, FiX, FiStar, FiTrendingUp, FiAward } from 'react-icons/fi';
import Head from 'next/head';

const storesData = [
    {
        id: 1,
        name: "Globetrotter Goods",
        category: "Outdoor & Adventure",
        rating: 4.9,
        sales: "2.3M",
        badge: "Top Seller",
        description: "Your ultimate destination for outdoor adventures and exploration gear. We specialize in high-quality equipment for hiking, camping, and extreme sports, ensuring you're prepared for any adventure life throws your way.",
        manager: {
            name: "Alex Johnson",
            photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
            experience: "10+ years"
        },
        contact: {
            email: "alex.johnson@globetrottergoods.com",
            phone: "+1 (555) 987-6543",
            address: "456 Expedition Way, Adventure City, CA 90210",
        },
        gradient: "from-emerald-400 to-cyan-400"
    },
    {
        id: 2,
        name: "Urban Outfitters",
        category: "Fashion & Lifestyle",
        badge: "Trending",
        description: "A trendy fashion and lifestyle store that captures the essence of urban living. We curate the latest fashion trends, unique home decor, and lifestyle products that reflect modern city culture and contemporary style.",
        manager: {
            name: "Sarah Chen",
            photo: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
        },
        contact: {
            email: "sarah.chen@urbanoutfitters.com",
            phone: "+1 (555) 234-5678",
            address: "789 Downtown Blvd, Metroville, NY 10010",
        },
        gradient: "from-purple-400 to-pink-400"
    },
    {
        id: 3,
        name: "Tech Hub",
        category: "Electronics & Gadgets",
        badge: "Best Seller",
        description: "The premier destination for cutting-edge technology and innovative gadgets. From the latest smartphones to smart home devices, we offer comprehensive tech solutions with expert guidance and exceptional customer support.",
        manager: {
            name: "Mike Rodriguez",
            photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
        },
        contact: {
            email: "mike.rodriguez@techhub.com",
            phone: "+1 (555) 876-5432",
            address: "101 Silicon Valley, Tech City, TX 73301",
        },
        gradient: "from-blue-400 to-indigo-400"
    },
    {
        id: 4,
        name: "Book Nook",
        category: "Books & Literature",
        badge: "Community Favorite",
        description: "A cozy literary haven for book lovers and knowledge seekers. Our carefully curated collection spans all genres, from bestselling novels to rare finds, creating the perfect atmosphere for discovering your next great read.",
        manager: {
            name: "Emily White",
            photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",

        },
        contact: {
            email: "emily.white@booknook.com",
            phone: "+1 (555) 345-6789",
            address: "202 Elm Street, Quiet Town, OR 97204",
        },
        gradient: "from-amber-400 to-orange-400"
    },
];

const MultipleStoreInfo = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStore, setSelectedStore] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    const filteredStores = storesData.filter(store =>
        store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.manager.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.contact.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8 mt-2.5">
            <Head>
                <title>Our Stores</title>
                <meta name="description" content="Find our e-commerce store locations and contact information." />
            </Head>

            <div className="max-w-6xl mx-auto">
                {/* Header and Search Bar */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-extrabold text-gray-900">
                        Our <span className="text-indigo-600">Store Network</span>
                    </h1>
                    <p className="mt-4 text-xl text-gray-600">Discover our premium stores and their unique specialties across different categories.</p>
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
                            placeholder="Search by store name, category, or location..."
                        />
                    </div>
                </div>

                {/* Store Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredStores.length > 0 ? (
                        filteredStores.map((store) => (
                            <div
                                key={store.id}
                                onClick={() => setSelectedStore(store)}
                                className="bg-white rounded-3xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
                            >
                                <div className="relative overflow-hidden">
                                    {/* Gradient Header */}
                                    <div className={`h-24 bg-gradient-to-r ${store.gradient} relative`}>
                                        <div className="absolute top-4 right-4">
                                            <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full font-medium">
                                                {store.badge}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-6 -mt-12 relative">
                                        <div className="flex justify-center mb-4">
                                            <div className="w-24 h-24 bg-white rounded-full p-1 shadow-lg">
                                                <img
                                                    className="w-full h-full rounded-full object-cover"
                                                    src={store.manager.photo}
                                                    alt={`${store.name} representative`}
                                                />
                                            </div>
                                        </div>

                                        <div className="text-center mb-4">
                                            <h2 className="text-xl font-bold text-gray-900">{store.name}</h2>
                                            <p className="text-sm text-gray-600 font-medium">{store.category}</p>
                                            <div className="flex items-center justify-center mt-2 space-x-4">
                                                <div className="flex items-center space-x-1">
                                                    <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
                                                    <span className="text-sm font-medium">{store.rating}</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <FiTrendingUp className="w-4 h-4 text-green-500" />
                                                    <span className="text-sm font-medium">${store.sales}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2 text-sm text-gray-600">
                                            <div className="flex items-center space-x-2">
                                                <FiUser className="flex-shrink-0 w-4 h-4 text-indigo-500" />
                                                <span className="truncate">{store.manager.name}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <FiMapPin className="flex-shrink-0 w-4 h-4 text-indigo-500" />
                                                <span className="truncate">{store.contact.address.split(',')[0]}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <p className="text-xl text-gray-500">No stores found matching your search. Please try a different query.</p>
                        </div>
                    )}
                </div>

                {/* Store Details Modal/Panel */}
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
                            <div className={`h-32 bg-gradient-to-r ${selectedStore.gradient} relative rounded-t-3xl`}>
                                <div className="absolute top-6 left-6">
                                    <span className="bg-white/20 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-full font-medium">
                                        {selectedStore.badge}
                                    </span>
                                </div>
                            </div>

                            <div className="p-8 -mt-16 relative">
                                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                                    <div className="flex-shrink-0">
                                        <div className="w-32 h-32 bg-white rounded-full p-2 shadow-xl">
                                            <img
                                                className="w-full h-full rounded-full object-cover"
                                                src={selectedStore.manager.photo}
                                                alt={`${selectedStore.name} representative`}
                                            />
                                        </div>
                                    </div>

                                    <div className="text-center lg:text-left flex-grow">
                                        <h2 className="text-4xl font-bold text-gray-900 mb-2">{selectedStore.name}</h2>
                                        <p className="text-lg font-semibold text-indigo-600 mb-1">{selectedStore.category}</p>
                                        <p className="text-gray-600 mb-4">Store Representative: {selectedStore.manager.name}</p>

                                        <p className="text-gray-600 leading-relaxed mb-6">{selectedStore.description}</p>


                                        {/* Contact Information */}
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="flex items-center space-x-3 text-gray-700 bg-gray-50 p-3 rounded-lg">
                                                    <FiMail className="flex-shrink-0 h-5 w-5 text-indigo-500" />
                                                    <span className="break-all">{selectedStore.contact.email}</span>
                                                </div>
                                                <div className="flex items-center space-x-3 text-gray-700 bg-gray-50 p-3 rounded-lg">
                                                    <FiPhone className="flex-shrink-0 h-5 w-5 text-indigo-500" />
                                                    <span>{selectedStore.contact.phone}</span>
                                                </div>
                                                <div className="flex items-center space-x-3 text-gray-700 bg-gray-50 p-3 rounded-lg md:col-span-2">
                                                    <FiMapPin className="flex-shrink-0 h-5 w-5 text-indigo-500" />
                                                    <span>{selectedStore.contact.address}</span>
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