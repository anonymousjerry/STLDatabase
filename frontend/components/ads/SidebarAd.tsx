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
          width: '100%',
          height: '180px'
        };
      case 'large':
        return {
          width: '100%',
          height: '400px'
        };
      default:
        return {
          width: '100%',
          height: '250px'
        };
    }
  };

  const getContainerClasses = () => {
    const baseClasses = "w-full bg-custom-light-containercolor dark:bg-custom-dark-containercolor border border-gray-200 dark:border-gray-700 shadow-lg";
    
    switch (size) {
      case 'small':
        return `${baseClasses} rounded-2xl mx-2 my-2`;
      case 'large':
        return `${baseClasses} rounded-3xl mx-2 my-4`;
      default:
        return `${baseClasses} rounded-3xl mx-2 my-3`;
    }
  };

  const getMinHeight = () => {
    switch (size) {
      case 'small':
        return 'min-h-[180px]';
      case 'large':
        return 'min-h-[400px]';
      default:
        return 'min-h-[250px]';
    }
  };

  const fallbackContent = showFallback ? (
    propFallbackContent || (
      <div className="bg-custom-light-containercolor dark:bg-custom-dark-containercolor rounded-3xl p-6 text-center border border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="text-custom-light-maincolor dark:text-custom-dark-maincolor font-bold text-xl mb-3">Sponsored</div>
        <div className="text-custom-light-textcolor dark:text-custom-dark-textcolor text-sm mb-4">
          Premium 3D Model Marketplace
        </div>
        <div className="bg-custom-light-maincolor text-white px-4 py-2 rounded-xl text-sm font-medium shadow-md">
          Ad Space
        </div>
      </div>
    )
  ) : null;

  return (
    <div className={`sidebar-ad ${getContainerClasses()} ${className}`}>
      <GoogleAd
        adSlot={getAdSlot()}
        adFormat="rectangle"
        style={getStyles()}
        fallbackContent={fallbackContent}
        className={`w-full rounded-3xl ${getMinHeight()} overflow-hidden`}
      />
    </div>
  );
};

export default SidebarAd; 