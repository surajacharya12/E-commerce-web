"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";
import API_URL from "../../api/api";
import { toast } from "react-toastify";
import OrderCancellation from "../../components/OrderCancellation";

// Import order slip components
import OrderSlipHeader from "../../components/order-slip/OrderSlipHeader";
import OrderStatusBanner from "../../components/order-slip/OrderStatusBanner";
import OrderProgress from "../../components/order-slip/OrderProgress";
import OrderInformation from "../../components/order-slip/OrderInformation";
import DeliveryInformation from "../../components/order-slip/DeliveryInformation";
import OrderItems from "../../components/order-slip/OrderItems";
import OrderSummary from "../../components/order-slip/OrderSummary";
import OrderTracking from "../../components/order-slip/OrderTracking";
import OrderSlipFooter from "../../components/order-slip/OrderSlipFooter";
import { LoadingSpinner, OrderNotFound, AccessDenied } from "../../components/order-slip/LoadingState";
import { canCancelOrder } from "../../components/order-slip/OrderSlipUtils";
import ContactBanner from "../../../components/ContactBanner";
import { contactInfo } from '@/lib/info';

export default function OrderSlipPage() {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showCancellation, setShowCancellation] = useState(false);
    const { isLoggedIn, userData, loading: authLoading } = useAuth();
    const router = useRouter();
    const params = useParams();

    useEffect(() => {
        // Wait for auth to finish loading before making decisions
        if (authLoading) return;

        if (!isLoggedIn) {
            router.push("/signin");
            return;
        }
        if (params.id) {
            fetchOrderDetails();
        }
    }, [isLoggedIn, params.id, authLoading]);

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/orders/${params.id}`);
            if (response.data.success) {
                setOrder(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching order details:", error);
            toast.error("Failed to load order slip");
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        generateThermalReceipt();
    };

    const handlePrint = () => {
        generateThermalReceipt();
    };

    const generateThermalReceipt = () => {
        const thermalContent = `
            <html>
            <head>
                <title>Order Slip - ${order.orderNumber || order._id?.slice(-8).toUpperCase()}</title>
                <style>
                    @page {
                        size: 80mm auto;
                        margin: 0;
                    }
                    body {
                        font-family: 'Courier New', monospace;
                        font-size: 12px;
                        line-height: 1.2;
                        margin: 0;
                        padding: 8px;
                        width: 80mm;
                        background: white;
                    }
                    .center { text-align: center; }
                    .bold { font-weight: bold; }
                    .line { border-bottom: 1px dashed #000; margin: 4px 0; }
                    .small { font-size: 10px; }
                    .item-row { display: flex; justify-content: space-between; margin: 2px 0; }
                    .total-row { border-top: 1px solid #000; padding-top: 4px; margin-top: 4px; }
                </style>
            </head>
            <body>
                <div class="center bold">ShopSwift</div>
                <div class="center small">Order Slip</div>
                <div class="line"></div>
                
                <div>Order #: ${order.orderNumber || order._id?.slice(-8).toUpperCase()}</div>
                <div>Date: ${new Date(order.orderDate).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })}</div>
                <div>Status: ${order.orderStatus.toUpperCase()}</div>
                <div class="line"></div>
                
                <div class="bold">CUSTOMER INFO:</div>
                <div>${order.userID?.name || userData?.name || 'N/A'}</div>
                <div class="small">${order.userID?.email || userData?.email || 'N/A'}</div>
                ${order.shippingAddress?.phone && order.shippingAddress.phone !== 'N/A' ?
                `<div class="small">Ph: ${order.shippingAddress.phone}</div>` : ''}
                <div class="line"></div>
                
                ${order.deliveryMethod === 'storeDelivery' ? `
                <div class="bold">PICKUP LOCATION:</div>
                <div class="small">${order.selectedStore?.storeName || 'ShopSwift Store - Main Branch'}</div>
                <div class="small">${order.selectedStore?.storeLocation || '123 Commerce Street'}</div>
                <div class="small">${order.selectedStore?.storeLocation ? '' : 'Kathmandu, '}Nepal</div>
                ${order.selectedStore?.storePhoneNumber ? `<div class="small">Ph: ${order.selectedStore.storePhoneNumber}</div>` : ''}
                <div class="small">Hours: 10:00 AM - 8:00 PM</div>
                <div class="small bold">* Bring ID & this slip *</div>
                ` : `
                <div class="bold">DELIVERY ADDRESS:</div>
                <div class="small">${order.shippingAddress?.street || 'N/A'}</div>
                <div class="small">${order.shippingAddress?.city || 'N/A'}, ${order.shippingAddress?.state || 'N/A'}</div>
                <div class="small">${order.shippingAddress?.postalCode || 'N/A'}, ${order.shippingAddress?.country || 'N/A'}</div>
                `}
                <div class="line"></div>
                
                <div class="bold">ITEMS:</div>
                ${order.items?.map(item => `
                <div class="item-row">
                    <div>${item.productName}</div>
                </div>
                <div class="item-row small">
                    <div>Qty: ${item.quantity} x ₹${item.price}</div>
                    <div>₹${(item.price * item.quantity).toFixed(2)}</div>
                </div>
                `).join('')}
                <div class="line"></div>
                
                <div class="item-row">
                    <div>Subtotal:</div>
                    <div>₹${order.orderTotal?.subtotal || order.totalPrice}</div>
                </div>
                <div class="item-row">
                    <div>${order.deliveryMethod === 'storeDelivery' ? 'Pickup Fee:' : 'Delivery Fee:'}</div>
                    <div>₹${order.orderTotal?.deliveryFee || (order.deliveryMethod === 'homeDelivery' ? '150' : order.deliveryMethod === 'storeDelivery' ? '100' : '50')}</div>
                </div>
                <!-- Tax removed per request -->
                ${order.orderTotal?.discount > 0 ? `
                <div class="item-row">
                    <div>Discount:</div>
                    <div>-₹${order.orderTotal.discount}</div>
                </div>
                ` : ''}
                <div class="item-row bold total-row">
                    <div>TOTAL:</div>
                    <div>₹${order.totalPrice}</div>
                </div>
                <div class="line"></div>
                
                <div class="small">Payment: ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</div>
                <div class="small">Method: ${order.deliveryMethod === 'homeDelivery' ? 'Home Delivery' : order.deliveryMethod === 'storeDelivery' ? 'Store Pickup' : 'Standard Delivery'}</div>
                <div class="line"></div>
                
                <div class="center small">Thank you for shopping!</div>
                <div class="center small">${contactInfo.email.display}</div>
                <div class="center small">${contactInfo.phone.display}</div>
            </body>
            </html>
        `;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(thermalContent);
        printWindow.document.close();
        printWindow.print();
    };

    const handleCancellationSuccess = (updatedOrder) => {
        setOrder(updatedOrder);
        setShowCancellation(false);
    };

    if (loading || authLoading) {
        return <LoadingSpinner />;
    }

    if (!order) {
        return <OrderNotFound onBackToOrders={() => router.push("/orders")} />;
    }

    // Check if user owns this order
    if (order.userID?._id !== userData?.id && order.userID !== userData?.id) {
        return <AccessDenied onBackToOrders={() => router.push("/orders")} />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 mt-10">
            <div className="max-w-4xl mx-auto px-4">


                {/* Order Slip */}
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    <OrderStatusBanner order={order} />
                    <OrderProgress orderStatus={order.orderStatus} />

                    <div className="p-8">
                        <OrderInformation order={order} userData={userData} />
                        <DeliveryInformation order={order} />
                        <OrderItems items={order.items} />
                        <OrderSummary order={order} />
                        <OrderTracking trackingUrl={order.trackingUrl} />
                        <OrderSlipFooter />
                    </div>
                </div>

                {/* Contact Banner */}
                <div className="mt-8">
                    <ContactBanner
                        variant="minimal"
                        message="Questions about your order?"
                        className="shadow-lg"
                    />
                </div>
            </div>

            {/* Order Cancellation Modal */}
            {showCancellation && order && (
                <OrderCancellation
                    order={order}
                    onClose={() => setShowCancellation(false)}
                    onCancellationSuccess={handleCancellationSuccess}
                />
            )}


        </div>
    );
}