"use client";

import React from 'react';
import { useAds } from '@/hooks/useAds';
import BannerAd from './BannerAd';
import SidebarAd from './SidebarAd';
import SponsoredModelAd from './SponsoredModelAd';

interface AdRendererProps {
  positions: string[];
  className?: string;
  fallbackPositions?: string[];
  showLoading?: boolean;
}

const AdRenderer: React.FC<AdRendererProps> = ({ 
  positions, 
  className = '', 
  fallbackPositions = [],
  showLoading = false 
}) => {
  const { getAdsWithFallback, loading, hasAdAtPosition } = useAds();
  
  // Get ads for the specified positions with fallback
  const ads = getAdsWithFallback(positions, fallbackPositions);
  
  // If no ads found and no loading, don't render anything
  if (ads.length === 0 && !loading) {
    return null;
  }
  
  // Show loading if requested and context is loading
  if (loading && showLoading) {
    return (
      <div className={`ad-renderer ${className}`}>
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-custom-light-maincolor"></div>
        </div>
      </div>
    );
  }
  
  const renderAd = (ad: any) => {
    switch (ad.adType) {
      case 'banner':
        return (
          <BannerAd
            position="content"
            className=""
            showFallback={true}
          />
        );
      case 'sidebar':
        return (
          <SidebarAd
            size="medium"
            className=""
            showFallback={true}
          />
        );
      case 'sponsored-model':
        const sponsoredModel = {
          id: ad.id || ad._id || `ad-${Math.random()}`,
          title: ad.title,
          description: 'High-quality 3D models for professional use',
          thumbnailUrl: '/placeholder-model.jpg',
          sourceUrl: '#',
          price: 'Free',
          downloads: 1500,
          rating: 4.8,
          platform: ad.clientName || 'Sponsored'
        };
        return (
          <SponsoredModelAd
            model={sponsoredModel}
            className="my-4"
            showBadge={true}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={`ad-renderer ${className}`}>
      {ads.map((ad, index) => (
        <div key={ad.id || ad._id || `ad-${index}`} className="ad-container">
          {renderAd(ad)}
        </div>
      ))}
    </div>
  );
};

export default AdRenderer;
