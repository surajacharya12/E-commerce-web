"use client";

import React from "react";
import MobilePrivacyView from "./components/MobilePrivacyView";
import DesktopPrivacyView from "./components/DesktopPrivacyView";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen md:mt-8">
      <MobilePrivacyView />
      <DesktopPrivacyView />
    </div>
  );
};

export default PrivacyPolicy;
