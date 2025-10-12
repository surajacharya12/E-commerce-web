// src/config/api.js (or similar)
const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://e-commerce-backend-ochre-eight.vercel.app"
    : "http://localhost:3001");

export default API_URL;
