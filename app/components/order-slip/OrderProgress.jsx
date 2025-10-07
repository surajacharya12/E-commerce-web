"use client";
import { FiClock, FiPackage, FiTruck, FiHome } from "react-icons/fi";

export default function OrderProgress({ orderStatus }) {
    const statuses = ['pending', 'processing', 'shipped', 'delivered'];
    const currentIndex = statuses.indexOf(orderStatus);

    const getProgressWidth = () => {
        switch (orderStatus) {
            case 'pending': return 'w-1/4 bg-yellow-500';
            case 'processing': return 'w-2/4 bg-blue-500';
            case 'shipped': return 'w-3/4 bg-purple-500';
            case 'delivered': return 'w-full bg-green-500';
            default: return 'w-0 bg-gray-400';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <FiClock className="w-5 h-5" />;
            case 'processing': return <FiPackage className="w-5 h-5" />;
            case 'shipped': return <FiTruck className="w-5 h-5" />;
            case 'delivered': return <FiHome className="w-5 h-5" />;
            default: return <FiPackage className="w-5 h-5" />;
        }
    };

    return (
        <div className="p-6 bg-white">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Order Progress</h3>
            <div className="flex items-center justify-between relative">
                <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 rounded-full">
                    <div className={`h-full rounded-full transition-all duration-500 ${getProgressWidth()}`} />
                </div>

                {statuses.map((status, index) => (
                    <div key={status} className="flex flex-col items-center relative z-10">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 ${orderStatus === status
                                ? 'bg-indigo-600 border-indigo-600 text-white'
                                : currentIndex > index
                                    ? 'bg-green-500 border-green-500 text-white'
                                    : 'bg-white border-gray-300 text-gray-400'
                            }`}>
                            {getStatusIcon(status)}
                        </div>
                        <p className={`mt-2 text-sm font-medium capitalize ${orderStatus === status
                                ? 'text-indigo-600'
                                : currentIndex > index
                                    ? 'text-green-600'
                                    : 'text-gray-400'
                            }`}>
                            {status}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}