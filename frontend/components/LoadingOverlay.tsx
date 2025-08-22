"use client";

import React from "react";

interface LoadingOverlayProps {
  show: boolean;
  size: number;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ show, size }) => {
  if (!show) return null;

  return (
    <div className="absolute inset-0  z-50 flex items-center justify-center">
        <div 
            className="border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin"
            style={{ width: size, height: size }}
        />
    </div>
  );
};

export default LoadingOverlay;
