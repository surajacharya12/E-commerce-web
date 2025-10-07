"use client";

import { Phone, Mail, Clock, MapPin } from "lucide-react";
import { contactInfo } from "@/lib/info";

export default function ContactBanner({
  variant = "default",
  showHours = true,
  className = "",
  message = "Need help? We're here for you!",
}) {
  if (variant === "minimal") {
    return (
      <div
        className={`bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 ${className}`}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <Phone className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm text-gray-700">{message}</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <a
              href={contactInfo.phone.link}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium"
            >
              <Phone className="w-4 h-4" />
              {contactInfo.phone.display}
            </a>
            <a
              href={contactInfo.email.link}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium"
            >
              <Mail className="w-4 h-4" />
              Email Us
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl p-6 shadow-lg ${className}`}
    >
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold mb-2">{message}</h3>
        <p className="text-indigo-100">Get in touch with our support team</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Phone */}
        <a
          href={contactInfo.phone.link}
          className="bg-white/20 backdrop-blur-sm rounded-lg p-4 hover:bg-white/30 transition-all duration-300 group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold">Call Us</div>
              <div className="text-sm text-indigo-100">
                {contactInfo.phone.display}
              </div>
            </div>
          </div>
        </a>

        {/* Email */}
        <a
          href={contactInfo.email.link}
          className="bg-white/20 backdrop-blur-sm rounded-lg p-4 hover:bg-white/30 transition-all duration-300 group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold">Email Us</div>
              <div className="text-sm text-indigo-100">
                {contactInfo.email.display}
              </div>
            </div>
          </div>
        </a>

        {/* Hours or Address */}
        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              {showHours ? (
                <Clock className="w-5 h-5" />
              ) : (
                <MapPin className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="font-semibold">
                {showHours ? "Business Hours" : "Visit Us"}
              </div>
              <div className="text-sm text-indigo-100">
                {showHours
                  ? contactInfo.businessHours.weekdays
                  : contactInfo.address.city}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
