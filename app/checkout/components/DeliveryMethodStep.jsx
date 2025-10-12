// components/checkout/steps/DeliveryMethodStep.js
import React, { useState, useEffect } from 'react';
import { DELIVERY_METHODS } from '@/app/checkout/page'; // Import constants from main checkout

export default function DeliveryMethodStep({
    selectedDelivery,
    storeLocations,
    loadingStores,
    selectedStore,
    onDeliveryMethodSelect,
    onStoreSelect
}) {
    const [filteredStores, setFilteredStores] = useState([]);
    const [storeSearchTerm, setStoreSearchTerm] = useState("");
    const [showStoreDropdown, setShowStoreDropdown] = useState(false);

    useEffect(() => {
        setFilteredStores(storeLocations);
    }, [storeLocations]);

    useEffect(() => {
        // Show dropdown if store delivery is selected and stores are loaded
        if (selectedDelivery === DELIVERY_METHODS.STORE && storeLocations.length > 0) {
            setShowStoreDropdown(true);
        } else if (selectedDelivery !== DELIVERY_METHODS.STORE) {
            setShowStoreDropdown(false);
            setStoreSearchTerm(''); // Clear search if delivery method changes
        }
    }, [selectedDelivery, storeLocations]);


    const handleStoreSearch = (searchTerm) => {
        setStoreSearchTerm(searchTerm);
        if (!searchTerm.trim()) {
            setFilteredStores(storeLocations);
            return;
        }

        const filtered = storeLocations.filter(store =>
            store.storeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            store.storeLocation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            store.storeManagerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            store.storeEmail?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredStores(filtered);
    };

    const handleSelectAndCloseDropdown = (store) => {
        onStoreSelect(store);
        setShowStoreDropdown(false);
    }

    return (
        <div className="bg-white rounded-2xl shadow-lg" style={{ padding: '40px' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h2 style={{
                    fontSize: '32px',
                    fontWeight: '700',
                    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    margin: '0 0 10px 0'
                }}>🚚 Choose Delivery Method</h2>
                <p style={{ color: '#64748b', fontSize: '16px', margin: '0' }}>
                    Select how you'd like to receive your order
                </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Home Delivery Option */}
                <div
                    onClick={() => onDeliveryMethodSelect(DELIVERY_METHODS.HOME)}
                    className="cursor-pointer transition-all duration-300 hover:shadow-xl"
                    style={{
                        padding: '25px',
                        borderRadius: '16px',
                        border: selectedDelivery === DELIVERY_METHODS.HOME ? '2px solid #10b981' : '2px solid #e2e8f0',
                        backgroundColor: selectedDelivery === DELIVERY_METHODS.HOME ? '#ecfdf5' : 'white',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px'
                    }}
                    onMouseOver={(e) => {
                        if (selectedDelivery !== DELIVERY_METHODS.HOME) {
                            e.currentTarget.style.borderColor = '#10b981';
                            e.currentTarget.style.backgroundColor = '#ecfdf5';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                        }
                    }}
                    onMouseOut={(e) => {
                        if (selectedDelivery !== DELIVERY_METHODS.HOME) {
                            e.currentTarget.style.borderColor = '#e2e8f0';
                            e.currentTarget.style.backgroundColor = 'white';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }
                    }}
                >
                    <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '12px',
                        backgroundColor: '#ecfdf5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px'
                    }}>🏠</div>
                    <div style={{ flex: 1 }}>
                        <h3 style={{
                            fontSize: '20px',
                            fontWeight: '600',
                            color: '#1e293b',
                            margin: '0 0 8px 0'
                        }}>Home Delivery</h3>
                        <p style={{
                            color: '#64748b',
                            fontSize: '14px',
                            margin: '0 0 8px 0'
                        }}>Get your order delivered directly to your doorstep. Convenient and safe.</p>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '15px',
                            fontSize: '12px',
                            color: '#10b981'
                        }}>
                            <span>✓ Door-to-door service</span>
                            <span>✓ 3-5 business days</span>
                            <span style={{ fontWeight: '600', color: '#ef4444' }}>₹150 delivery charge</span>
                        </div>
                    </div>
                    <div style={{ fontSize: '20px', color: '#10b981' }}>
                        {selectedDelivery === DELIVERY_METHODS.HOME ? '✓' : '→'}
                    </div>
                </div>

                {/* Store Pickup Option */}
                <div
                    onClick={() => onDeliveryMethodSelect(DELIVERY_METHODS.STORE)}
                    className="cursor-pointer transition-all duration-300 hover:shadow-xl"
                    style={{
                        padding: '25px',
                        borderRadius: '16px',
                        border: selectedDelivery === DELIVERY_METHODS.STORE ? '2px solid #3b82f6' : '2px solid #e2e8f0',
                        backgroundColor: selectedDelivery === DELIVERY_METHODS.STORE ? '#eff6ff' : 'white',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px'
                    }}
                    onMouseOver={(e) => {
                        if (selectedDelivery !== DELIVERY_METHODS.STORE) {
                            e.currentTarget.style.borderColor = '#3b82f6';
                            e.currentTarget.style.backgroundColor = '#eff6ff';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                        }
                    }}
                    onMouseOut={(e) => {
                        if (selectedDelivery !== DELIVERY_METHODS.STORE) {
                            e.currentTarget.style.borderColor = '#e2e8f0';
                            e.currentTarget.style.backgroundColor = 'white';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }
                    }}
                >
                    <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '12px',
                        backgroundColor: '#eff6ff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px'
                    }}>🏪</div>
                    <div style={{ flex: 1 }}>
                        <h3 style={{
                            fontSize: '20px',
                            fontWeight: '600',
                            color: '#1e293b',
                            margin: '0 0 8px 0'
                        }}>Store Pickup</h3>
                        <p style={{
                            color: '#64748b',
                            fontSize: '14px',
                            margin: '0 0 8px 0'
                        }}>Pick up your order from our store. Save on delivery charges.</p>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '15px',
                            fontSize: '12px',
                            color: '#3b82f6'
                        }}>
                            <span>✓ Ready in 2-3 days</span>
                            <span>✓ No waiting at home</span>
                            <span style={{ fontWeight: '600', color: '#ef4444' }}>₹100 pickup charge</span>
                        </div>
                    </div>
                    <div style={{ fontSize: '20px', color: '#3b82f6' }}>
                        {selectedDelivery === DELIVERY_METHODS.STORE ? '✓' : '→'}
                    </div>
                </div>

                {/* Store Selection Dropdown */}
                {showStoreDropdown && selectedDelivery === DELIVERY_METHODS.STORE && (
                    <div style={{
                        marginTop: '20px',
                        padding: '25px',
                        borderRadius: '16px',
                        border: '2px solid #3b82f6',
                        backgroundColor: '#f8fafc',
                        animation: 'slideDown 0.3s ease-out'
                    }}>
                        <h4 style={{
                            fontSize: '18px',
                            fontWeight: '600',
                            color: '#1e293b',
                            marginBottom: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            📍 Select Store Location
                        </h4>

                        {/* Search Bar */}
                        <div style={{
                            position: 'relative',
                            marginBottom: '16px'
                        }}>
                            <div style={{
                                position: 'absolute',
                                left: '12px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#64748b',
                                fontSize: '16px'
                            }}>
                                🔍
                            </div>
                            <input
                                type="text"
                                placeholder="Search by store name, location, or manager..."
                                value={storeSearchTerm}
                                onChange={(e) => handleStoreSearch(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px 12px 12px 40px',
                                    border: '2px solid #e2e8f0',
                                    borderRadius: '12px',
                                    fontSize: '14px',
                                    outline: 'none',
                                    backgroundColor: 'white',
                                    transition: 'border-color 0.2s'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#3b82f6';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#e2e8f0';
                                }}
                            />
                        </div>

                        {loadingStores ? (
                            <div style={{ textAlign: 'center', padding: '20px' }}>
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                                <p style={{ color: '#64748b' }}>Loading store locations...</p>
                            </div>
                        ) : filteredStores.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '20px' }}>
                                <p style={{ color: '#ef4444', fontWeight: '500' }}>
                                    {storeSearchTerm ? 'No stores found matching your search' : 'No store locations available'}
                                </p>
                                {storeSearchTerm && (
                                    <button
                                        onClick={() => handleStoreSearch('')}
                                        style={{
                                            marginTop: '8px',
                                            padding: '6px 12px',
                                            backgroundColor: '#3b82f6',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '6px',
                                            fontSize: '12px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Clear Search
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px',
                                maxHeight: '300px',
                                overflowY: 'auto'
                            }}>
                                {filteredStores.map((store) => (
                                    <div
                                        key={store._id}
                                        onClick={() => handleSelectAndCloseDropdown(store)}
                                        className="cursor-pointer transition-all duration-200 hover:shadow-md"
                                        style={{
                                            padding: '16px',
                                            borderRadius: '12px',
                                            border: selectedStore?._id === store._id ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                                            backgroundColor: selectedStore?._id === store._id ? '#eff6ff' : 'white',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px'
                                        }}
                                        onMouseOver={(e) => {
                                            if (selectedStore?._id !== store._id) {
                                                e.currentTarget.style.borderColor = '#3b82f6';
                                                e.currentTarget.style.backgroundColor = '#eff6ff';
                                            }
                                        }}
                                        onMouseOut={(e) => {
                                            if (selectedStore?._id !== store._id) {
                                                e.currentTarget.style.borderColor = '#e2e8f0';
                                                e.currentTarget.style.backgroundColor = 'white';
                                            }
                                        }}
                                    >
                                        <div style={{
                                            width: '50px',
                                            height: '50px',
                                            borderRadius: '12px',
                                            background: store.gradientColor ? `linear-gradient(135deg, var(--${store.gradientColor.replace('from-', '').replace(' to-', ', var(--').replace('-500', '').replace('-400', '')}))` : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '18px',
                                            color: 'white',
                                            fontWeight: 'bold'
                                        }}>
                                            {store.storeBadge || '🏪'}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <h5 style={{
                                                fontSize: '16px',
                                                fontWeight: '600',
                                                color: '#1e293b',
                                                margin: '0 0 4px 0'
                                            }}>{store.storeName}</h5>
                                            <p style={{
                                                fontSize: '14px',
                                                color: '#64748b',
                                                margin: '0'
                                            }}>
                                                📍 {store.storeLocation}
                                            </p>
                                            <p style={{
                                                fontSize: '12px',
                                                color: '#64748b',
                                                margin: '2px 0 0 0'
                                            }}>
                                                👤 Manager: {store.storeManagerName}
                                            </p>
                                            {store.storePhoneNumber && (
                                                <p style={{
                                                    fontSize: '12px',
                                                    color: '#64748b',
                                                    margin: '2px 0 0 0'
                                                }}>
                                                    📞 {store.storePhoneNumber}
                                                </p>
                                            )}
                                        </div>
                                        <div style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: '4px'
                                        }}>
                                            {store.isActive && (
                                                <span style={{
                                                    fontSize: '10px',
                                                    backgroundColor: '#10b981',
                                                    color: 'white',
                                                    padding: '2px 6px',
                                                    borderRadius: '4px',
                                                    fontWeight: '500'
                                                }}>
                                                    ACTIVE
                                                </span>
                                            )}
                                            <div style={{ fontSize: '16px', color: '#3b82f6' }}>{selectedStore?._id === store._id ? '✓' : '→'}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}