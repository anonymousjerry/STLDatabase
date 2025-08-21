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
          height: '90px',
          margin: '10px 0'
        };
      case 'footer':
        return {
          width: '100%',
          height: '90px',
          margin: '10px 0'
        };
      case 'sidebar':
        return {
          width: '300px',
          height: '250px',
          margin: '10px 0'
        };
      default:
        return {
          width: '100%',
          height: '90px',
          margin: '20px 0'
        };
    }
  };

  const fallbackContent = showFallback ? (
    propsFallbackContent || (
      <div className="bg-gradient-to-r from-custom-light-maincolor to-purple-600 rounded-lg p-4 text-center text-white">
        <div className="text-lg font-bold mb-2">Advertise with 3D Model Pro</div>
        <div className="text-sm mb-3">Reach thousands of 3D printing enthusiasts</div>
        <button className="bg-white text-custom-light-maincolor px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
          Get Started
        </button>
      </div>
    )
  ) : null;

  return (
    <div className={`banner-ad ${className}`}>
      <GoogleAd
        adSlot={getAdSlot()}
        adFormat="banner"
        style={getStyles()}
        fallbackContent={fallbackContent}
        className="w-full"
      />
    </div>
  );
};

export default BannerAd; 