"use client";

import React from 'react';
import GoogleAd from '../GoogleAd';

interface SidebarAdProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
  showFallback?: boolean;
  fallbackContent?: React.ReactNode;
}

const SidebarAd: React.FC<SidebarAdProps> = ({ 
  size = 'medium', 
  className = '',
  showFallback = true,
  fallbackContent: propFallbackContent 
}) => {
  const getAdSlot = () => {
    switch (size) {
      case 'small':
        return 'YOUR_SIDEBAR_SMALL_SLOT';
      case 'large':
        return 'YOUR_SIDEBAR_LARGE_SLOT';
      default:
        return 'YOUR_SIDEBAR_MEDIUM_SLOT';
    }
  };

  const getStyles = () => {
    switch (size) {
      case 'small':
        return {
          width: '300px',
          height: '250px',
          margin: '10px 0'
        };
      case 'large':
        return {
          width: '300px',
          height: '600px',
          margin: '10px 0'
        };
      default:
        return {
          width: '300px',
          height: '250px',
          margin: '15px 0'
        };
    }
  };

  const fallbackContent = showFallback ? (
    propFallbackContent || (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center border border-gray-200 dark:border-gray-700">
        <div className="text-custom-light-maincolor font-bold text-lg mb-2">Sponsored</div>
        <div className="text-gray-600 dark:text-gray-400 text-sm mb-3">
          Premium 3D Model Marketplace
        </div>
        <div className="bg-custom-light-maincolor text-white px-3 py-1 rounded text-xs font-medium">
          Ad Space
        </div>
      </div>
    )
  ) : null;

  return (
    <div className={`sidebar-ad ${className}`}>
      <GoogleAd
        adSlot={getAdSlot()}
        adFormat="rectangle"
        style={getStyles()}
        fallbackContent={fallbackContent}
        className="w-full"
      />
    </div>
  );
};

export default SidebarAd; 