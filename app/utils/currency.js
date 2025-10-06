/**
 * Format currency to NPR/Rs format
 * @param {number} amount - The amount to format
 * @param {boolean} showSymbol - Whether to show Rs. symbol (default: true)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, showSymbol = true) => {
  if (typeof amount !== "number" || isNaN(amount)) {
    return showSymbol ? "Rs. 0.00" : "0.00";
  }

  const formatted = amount.toFixed(2);
  return showSymbol ? `Rs. ${formatted}` : formatted;
};

/**
 * Format currency for display in components
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency with Rs. prefix
 */
export const displayPrice = (amount) => {
  return formatCurrency(amount, true);
};

/**
 * Parse currency string to number
 * @param {string} currencyString - Currency string like "Rs. 100.00" or "100.00"
 * @returns {number} Parsed number
 */
export const parseCurrency = (currencyString) => {
  if (typeof currencyString !== "string") {
    return 0;
  }

  // Remove Rs. prefix and any spaces, then parse
  const cleaned = currencyString.replace(/Rs\.?\s*/g, "").trim();
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Convert USD to NPR (approximate conversion rate)
 * @param {number} usdAmount - Amount in USD
 * @param {number} exchangeRate - Exchange rate (default: 133 NPR per USD)
 * @returns {number} Amount in NPR
 */
export const convertUsdToNpr = (usdAmount, exchangeRate = 133) => {
  if (typeof usdAmount !== "number" || isNaN(usdAmount)) {
    return 0;
  }
  return usdAmount * exchangeRate;
};

/**
 * Currency symbol constant
 */
export const CURRENCY_SYMBOL = "Rs.";
export const CURRENCY_NAME = "Nepalese Rupee";
export const CURRENCY_CODE = "NPR";
