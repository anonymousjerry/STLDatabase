"use client";

import React from 'react';
import GoogleAd from '../GoogleAd';

interface BannerAdProps {
  position?: 'header' | 'footer' | 'content' | 'sidebar';
  className?: string;
  showFallback?: boolean;
  fallbackContent?: React.ReactNode;
}

const BannerAd: React.FC<BannerAdProps> = ({ 
  position = 'content', 
  className = '',
  showFallback = true,
  fallbackContent: propsFallbackContent 
}) => {
  const getAdSlot = () => {
    switch (position) {
      case 'header':
        return 'YOUR_HEADER_BANNER_SLOT';
      case 'footer':
        return 'YOUR_FOOTER_BANNER_SLOT';
      case 'sidebar':
        return 'YOUR_SIDEBAR_BANNER_SLOT';
      default:
        return 'YOUR_CONTENT_BANNER_SLOT';
    }
  };

  const getStyles = () => {
    switch (position) {
      case 'header':
        return {
          width: '100%',
          height: '90px'
        };
      case 'footer':
        return {
          width: '100%',
          height: '90px'
        };
      case 'sidebar':
        return {
          width: '100%',
          height: '250px'
        };
      default:
        return {
          width: '100%',
          height: '90px'
        };
    }
  };

  const getContainerClasses = () => {
    const baseClasses = "w-full bg-custom-light-containercolor dark:bg-custom-dark-containercolor border border-gray-200 dark:border-gray-700 shadow-lg";
    
    switch (position) {
      case 'header':
        return `${baseClasses} rounded-2xl `;
      case 'footer':
        return `${baseClasses} rounded-2xl`;
      case 'sidebar':
        return `${baseClasses} rounded-3xl`;
      default:
        return `${baseClasses} rounded-3xl`;
    }
  };

  const fallbackContent = showFallback ? (
    propsFallbackContent || (
      <div className='flex items-center h-full justify-center bg-gradient-to-r from-custom-light-maincolor to-purple-600 rounded-3xl text-center text-white shadow-lg'>
        <div className="text-xl font-bold">
          Advertise with 3D Model Pro
        </div>

      </div>
    )
  ) : null;

  return (
    <div className={`banner-ad ${getContainerClasses()} ${className}`}>
      <GoogleAd
        adSlot={getAdSlot()}
        adFormat="banner"
        style={getStyles()}
        fallbackContent={fallbackContent}
        className="mx-auto rounded-3xl overflow-hidden w-[38%] max-w-[728px] min-w-[320px] aspect-[728/90] bg-gray-200"
      />
    </div>
  );
};

export default BannerAd; 