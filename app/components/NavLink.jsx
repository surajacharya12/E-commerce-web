"use client";

import React from "react";
import { usePathname } from "next/navigation";

const NavLink = ({ href, children, className = "" }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <a
      href={href}
      className={`text-sm font-medium transition-colors duration-200 ${
        isActive ? "text-blue-600 font-bold" : "text-gray-600 hover:text-blue-600"
      } ${className}`}
    >
      {children}
    </a>
  );
};

export default NavLink;
