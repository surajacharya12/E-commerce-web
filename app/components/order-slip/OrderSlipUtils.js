import { FiClock, FiPackage, FiTruck, FiHome } from "react-icons/fi";

export const getStatusIcon = (status) => {
  switch (status) {
    case "pending":
      return <FiClock className="w-6 h-6 text-yellow-500" />;
    case "processing":
      return <FiPackage className="w-6 h-6 text-blue-500" />;
    case "shipped":
      return <FiTruck className="w-6 h-6 text-purple-500" />;
    case "delivered":
      return <FiHome className="w-6 h-6 text-green-500" />;
    default:
      return <FiPackage className="w-6 h-6 text-gray-500" />;
  }
};

export const getStatusColor = (status) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "processing":
      return "bg-blue-100 text-blue-800 border-blue-300";
    case "shipped":
      return "bg-purple-100 text-purple-800 border-purple-300";
    case "delivered":
      return "bg-green-100 text-green-800 border-green-300";
    case "cancelled":
      return "bg-red-100 text-red-800 border-red-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

export const getStatusMessage = (status) => {
  switch (status) {
    case "pending":
      return "Your order has been placed and is being processed.";
    case "processing":
      return "Your order is being prepared for shipment.";
    case "shipped":
      return "Your order is on the way to your delivery address.";
    case "delivered":
      return "Your order has been successfully delivered.";
    case "cancelled":
      return "Your order has been cancelled.";
    default:
      return "Order status is being updated.";
  }
};

export const getDeliveryEstimate = (orderDate, status, paymentMethod) => {
  if (status === "delivered") return "Delivered";
  if (status === "cancelled") return "Cancelled";

  const orderDateObj = new Date(orderDate);
  const deliveryDays = paymentMethod === "cod" ? 5 : 4;
  const estimatedDelivery = new Date(orderDateObj);
  estimatedDelivery.setDate(orderDateObj.getDate() + deliveryDays);

  return estimatedDelivery.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const canCancelOrder = (orderStatus) => {
  return ["pending", "processing"].includes(orderStatus.toLowerCase());
};
