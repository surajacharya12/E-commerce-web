"use client";

import { FiTwitter, FiFacebook, FiLinkedin, FiYoutube } from "react-icons/fi";
import Image from "next/image";

const Footer = () => (
  <footer className="w-full bg-gray-50 border-t border-gray-300 py-8 mt-16 shadow-inner">
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex flex-col items-center mb-8">
        <div className="flex items-center -space-x-2 mb-3"> 

         
            {/* Logo */}
             <Image src="/assets/logo.png" alt="Logo" width={106} height={106} className="rounded-lg" />
        
          <span className="font-extrabold text-3xl text-gray-800 tracking-wide">
            ShopEase
          </span>
        </div>
        <p className="text-gray-600 max-w-md text-center leading-relaxed text-sm">
          Your one-stop shop for everything you love. Quality products, secure
          payment, and fast shipping.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8 text-gray-700">
        {/* Customer Service */}
        <div>
          <h3 className="font-semibold text-lg mb-5 border-b border-blue-500 pb-2">
            Customer Service
          </h3>
          <ul className="space-y-3 text-sm">
            {[
              "Help Centre",
              "How To Buy",
              "Payment",
              "Shipping",
              "Return & Refund",
            ].map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="hover:text-blue-600 transition-colors duration-200"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* About */}
        <div>
          <h3 className="font-semibold text-lg mb-5 border-b border-blue-500 pb-2">
            About
          </h3>
          <ul className="space-y-3 text-sm">
            {[
              { label: "Browse", href: "/browse" },
              { label: "Categories", href: "/categories" },
              { label: "Wishlist", href: "/wishlist" },
              { label: "Privacy Policy", href: "/privacyPolicy" },
              { label: "Seller Centre", href: "#" },
              {label:"Profile", href: "/profile"}
            ].map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  className="hover:text-blue-600 transition-colors duration-200"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Payment */}
        <div>
          <h3 className="font-semibold text-lg mb-5 border-b border-blue-500 pb-2">
            Payment Methods
          </h3>
          <div className="flex flex-wrap gap-4 items-center">
            <img
              src="/assets/visa.png"
              alt="Visa"
              className="h-8 filter grayscale hover:grayscale-0 transition duration-300 cursor-pointer"
            />
            <img
              src="/assets/mastercard.png"
              alt="Mastercard"
              className="h-8 filter grayscale hover:grayscale-0 transition duration-300 cursor-pointer"
            />
            <img
              src="/assets/amex.png"
              alt="Amex"
              className="h-8 filter grayscale hover:grayscale-0 transition duration-300 cursor-pointer"
            />
            <img
              src="/assets/paypal.png"
              alt="Paypal"
              className="h-8 filter grayscale hover:grayscale-0 transition duration-300 cursor-pointer"
            />
          </div>
        </div>

        {/* Download App */}
        <div>
          <h3 className="font-semibold text-lg mb-5 border-b border-blue-500 pb-2">
            Download App
          </h3>
          <div className="mb-5 flex justify-center">
            <img
              src="/qr.png"
              alt="QR Code"
              className="w-28 h-28 rounded-lg border-2 border-blue-300 shadow-lg"
            />
          </div>
          <div className="flex justify-center gap-6 text-2xl text-gray-500">
            {[FiTwitter, FiFacebook, FiLinkedin, FiYoutube].map((Icon, idx) => {
              const colors = [
                "hover:text-[#1DA1F2]", // Twitter blue
                "hover:text-[#1877F2]", // Facebook blue
                "hover:text-[#0A66C2]", // LinkedIn blue
                "hover:text-[#FF0000]", // YouTube red
              ];
              return (
                <a
                  key={idx}
                  href="#"
                  aria-label="Social media"
                  className={`transition-transform transform hover:scale-125 duration-300 ${colors[idx]} cursor-pointer`}
                >
                  <Icon />
                </a>
              );
            })}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-300 pt-4 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500">
        <span>
          © {new Date().getFullYear()} Brand, Inc. &bull; Privacy &bull; Terms
          &bull; Sitemap
        </span>
        <span className="mt-2 md:mt-0 flex items-center gap-2 text-gray-600 font-medium">
          Made with{" "}
          <img src="/vercel.svg" alt="Vercel" className="h-4 filter grayscale" />{" "}
          Next.js & Tailwind CSS
        </span>
      </div>
    </div>
  </footer>
);

export default Footer;
