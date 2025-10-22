import API_URL from "../api/api";

class CouponService {
  static async getActiveCoupons() {
    try {
      const response = await fetch(`${API_URL}/couponCodes/active/list`);
      const data = await response.json();

      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || "Failed to fetch coupons");
      }
    } catch (error) {
      console.error("Error fetching active coupons:", error);
      return [];
    }
  }

  static async checkCoupon({ couponCode, purchaseAmount, productIds = [] }) {
    try {
      const response = await fetch(`${API_URL}/couponCodes/check-coupon`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          couponCode,
          purchaseAmount,
          productIds,
        }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error checking coupon:", error);
      return {
        success: false,
        message: "Failed to check coupon. Please try again.",
      };
    }
  }

  static async applyCoupon({ couponCode, purchaseAmount, productIds = [] }) {
    try {
      const response = await fetch(`${API_URL}/couponCodes/apply-coupon`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          couponCode,
          purchaseAmount,
          productIds,
        }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error applying coupon:", error);
      return {
        success: false,
        message: "Failed to apply coupon. Please try again.",
      };
    }
  }

  static calculateDiscount(coupon, purchaseAmount) {
    const { discountType, discountAmount } = coupon;

    if (discountType === "fixed") {
      return Math.min(discountAmount, purchaseAmount);
    } else if (discountType === "percentage") {
      return Math.min((purchaseAmount * discountAmount) / 100, purchaseAmount);
    }

    return 0;
  }

  static formatCouponDiscount(coupon) {
    const { discountType, discountAmount } = coupon;

    if (discountType === "fixed") {
      return `₹${discountAmount} OFF`;
    } else if (discountType === "percentage") {
      return `${discountAmount}% OFF`;
    }

    return "DISCOUNT";
  }

  static getDaysUntilExpiry(endDate) {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }
}

export default CouponService;
