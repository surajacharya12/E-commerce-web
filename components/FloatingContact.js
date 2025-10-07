"use client";

import { useState } from "react";
import { Phone, Mail, MessageCircle, X, ChevronUp } from "lucide-react";
import { contactInfo } from "@/lib/info";

export default function FloatingContact() {
  const [isOpen, setIsOpen] = useState(false);

  const contactOptions = [
    {
      icon: Phone,
      label: "Call Us",
      value: contactInfo.phone.display,
      href: contactInfo.phone.link,
      color: "bg-blue-500 hover:bg-blue-600",
      description: "Speak with our team",
    },
    {
      icon: Mail,
      label: "Email Us",
      value: contactInfo.email.display,
      href: contactInfo.email.link,
      color: "bg-purple-500 hover:bg-purple-600",
      description: "Send us a message",
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: "Chat Now",
      href:
        contactInfo.phone.whatsapp +
        "?text=" +
        encodeURIComponent("Hi! I need help with your website."),
      color: "bg-green-500 hover:bg-green-600",
      description: "Quick chat support",
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Contact Options */}
      {isOpen && (
        <div className="mb-4 space-y-3 animate-in slide-in-from-bottom-2 duration-300">
          {contactOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <div key={index} className="flex items-center justify-end group">
                {/* Tooltip */}
                <div className="mr-3 bg-white rounded-lg shadow-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  <div className="text-sm font-medium text-gray-900">
                    {option.label}
                  </div>
                  <div className="text-xs text-gray-600">
                    {option.description}
                  </div>
                </div>

                {/* Contact Button */}
                <a
                  href={option.href}
                  target={option.label === "WhatsApp" ? "_blank" : "_self"}
                  rel={option.label === "WhatsApp" ? "noopener noreferrer" : ""}
                  className={`${option.color} text-white p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 flex items-center justify-center`}
                >
                  <Icon className="w-5 h-5" />
                </a>
              </div>
            );
          })}
        </div>
      )}

      {/* Main Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${
          isOpen
            ? "bg-red-500 hover:bg-red-600"
            : "bg-indigo-500 hover:bg-indigo-600"
        } text-white p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 flex items-center justify-center`}
        aria-label={isOpen ? "Close contact options" : "Open contact options"}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>

      {/* Help Text */}
      {!isOpen && (
        <div className="absolute bottom-full right-0 mb-2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
          Need Help? Click here!
        </div>
      )}
    </div>
  );
}
