"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navBar";
import Footer from "./components/Footer";
import { usePathname } from "next/navigation";
import { CartProvider } from "./context/CartContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OrderSlipAccess from "./components/OrderSlipAccess";
import FloatingContact from "../components/FloatingContact";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const hideFooter =
    pathname.startsWith("/signin") || pathname.startsWith("/signup");

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-white text-black font-sans antialiased`}
        style={{ backgroundColor: "#fff", color: "#000", minHeight: "100vh" }}
      >
        <CartProvider>
          <Navbar />
          <div className="pt-20">{children}</div>
          {!hideFooter && <Footer />}
          <OrderSlipAccess />
          {pathname && pathname.startsWith('/browse') && <FloatingContact />}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </CartProvider>
      </body>
    </html>
  );
}
