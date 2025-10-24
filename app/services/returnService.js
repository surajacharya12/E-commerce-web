import API_URL from "../api/api";

const API_BASE_URL = API_URL;

class ReturnService {
  // Get authentication headers
  static getAuthHeaders() {
    const token = localStorage.getItem("authToken");
    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }

  // Create a new return request
  static async createReturn(returnData) {
    try {
      const response = await fetch(`${API_BASE_URL}/returns/create`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(returnData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create return request");
      }

      return data;
    } catch (error) {
      console.error("Error creating return:", error);
      throw error;
    }
  }

  // Get all returns for a user
  static async getUserReturns(userId, options = {}) {
    try {
      const { page = 1, limit = 10, status } = options;
      let url = `${API_BASE_URL}/returns/user/${userId}?page=${page}&limit=${limit}`;

      if (status) {
        url += `&status=${status}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch returns");
      }

      return data;
    } catch (error) {
      console.error("Error fetching returns:", error);
      throw error;
    }
  }

  // Get return details by ID
  static async getReturnDetails(returnId) {
    try {
      const response = await fetch(`${API_BASE_URL}/returns/${returnId}`, {
        method: "GET",
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch return details");
      }

      return data;
    } catch (error) {
      console.error("Error fetching return details:", error);
      throw error;
    }
  }

  // Cancel return request
  static async cancelReturn(returnId, userId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/returns/${returnId}/cancel`,
        {
          method: "PUT",
          headers: this.getAuthHeaders(),
          body: JSON.stringify({ userID: userId }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to cancel return");
      }

      return data;
    } catch (error) {
      console.error("Error cancelling return:", error);
      throw error;
    }
  }

  // Get return reasons
  static getReturnReasons() {
    return [
      { value: "defective_product", label: "Defective Product" },
      { value: "wrong_item_received", label: "Wrong Item Received" },
      { value: "size_issue", label: "Size Issue" },
      { value: "quality_issue", label: "Quality Issue" },
      { value: "not_as_described", label: "Not as Described" },
      { value: "damaged_in_shipping", label: "Damaged in Shipping" },
      { value: "changed_mind", label: "Changed Mind" },
      { value: "other", label: "Other" },
    ];
  }

  // Get delivered orders for return creation
  static async getDeliveredOrders(userId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/returns/user/${userId}/delivered-orders`,
        {
          method: "GET",
          headers: this.getAuthHeaders(),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch delivered orders");
      }

      return data;
    } catch (error) {
      console.error("Error fetching delivered orders:", error);
      throw error;
    }
  }

  // Get return status display text
  static getStatusDisplayText(status) {
    const statusMap = {
      requested: "Requested",
      approved: "Approved",
      rejected: "Rejected",
      picked_up: "Picked Up",
      processing: "Processing",
      refunded: "Refunded",
      cancelled: "Cancelled",
    };
    return statusMap[status] || status.toUpperCase();
  }

  // Get status color
  static getStatusColor(status) {
    const colorMap = {
      requested: "text-orange-600 bg-orange-50 border-orange-200",
      approved: "text-blue-600 bg-blue-50 border-blue-200",
      rejected: "text-red-600 bg-red-50 border-red-200",
      picked_up: "text-purple-600 bg-purple-50 border-purple-200",
      processing: "text-indigo-600 bg-indigo-50 border-indigo-200",
      refunded: "text-green-600 bg-green-50 border-green-200",
      cancelled: "text-gray-600 bg-gray-50 border-gray-200",
    };
    return colorMap[status] || "text-gray-600 bg-gray-50 border-gray-200";
  }
}

export default ReturnService;
