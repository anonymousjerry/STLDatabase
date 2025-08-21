"use client";

import React, { useState, useEffect } from 'react';
import BannerAd from './BannerAd';
import SidebarAd from './SidebarAd';
import SponsoredModelAd from './SponsoredModelAd';

interface AdConfig {
  id: string;
  type: 'banner' | 'sidebar' | 'sponsored-model';
  position: string;
  enabled: boolean;
  priority: number;
  fallbackContent?: React.ReactNode;
}

interface AdManagerProps {
  page: string;
  className?: string;
}

const AdManager: React.FC<AdManagerProps> = ({ page, className = '' }) => {
  const [ads, setAds] = useState<AdConfig[]>([]);
  const [isAdBlocked, setIsAdBlocked] = useState(false);

  // Ad configurations for different pages
  const adConfigs: Record<string, AdConfig[]> = {
    home: [
      {
        id: 'home-header-banner',
        type: 'banner',
        position: 'header',
        enabled: true,
        priority: 1
      },
      {
        id: 'home-sidebar-top',
        type: 'sidebar',
        position: 'sidebar-top',
        enabled: true,
        priority: 2
      },
      {
        id: 'home-content-banner',
        type: 'banner',
        position: 'content',
        enabled: true,
        priority: 3
      }
    ],
    explore: [
      {
        id: 'explore-sidebar',
        type: 'sidebar',
        position: 'sidebar',
        enabled: true,
        priority: 1
      },
      {
        id: 'explore-content-banner',
        type: 'banner',
        position: 'content',
        enabled: true,
        priority: 2
      }
    ],
    modelDetail: [
      {
        id: 'model-detail-sidebar',
        type: 'sidebar',
        position: 'sidebar',
        enabled: true,
        priority: 1
      },
      {
        id: 'model-detail-related',
        type: 'sponsored-model',
        position: 'related-models',
        enabled: true,
        priority: 2
      }
    ]
  };

  useEffect(() => {
    // Check if ads are blocked
    const checkAdBlock = () => {
      const testAd = document.createElement('div');
      testAd.innerHTML = '&nbsp;';
      testAd.className = 'adsbox';
      document.body.appendChild(testAd);
      
      const isBlocked = testAd.offsetHeight === 0;
      document.body.removeChild(testAd);
      
      setIsAdBlocked(isBlocked);
    };

    checkAdBlock();
    
    // Set ads for current page
    const pageAds = adConfigs[page] || [];
    setAds(pageAds.filter(ad => ad.enabled).sort((a, b) => a.priority - b.priority));
  }, [page]);

  const renderAd = (ad: AdConfig) => {
    if (isAdBlocked) {
      return ad.fallbackContent || (
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Please disable your ad blocker to support our site
          </div>
        </div>
      );
    }

    switch (ad.type) {
      case 'banner':
        return (
          <BannerAd
            position={ad.position as any}
            className="my-4"
            showFallback={true}
          />
        );
      case 'sidebar':
        return (
          <SidebarAd
            size="medium"
            className="my-4"
            showFallback={true}
          />
        );
      case 'sponsored-model':
        // Example sponsored model data
        const sponsoredModel = {
          id: 'sponsored-1',
          title: 'Premium 3D Model Collection',
          description: 'High-quality 3D models for professional use',
          thumbnailUrl: '/placeholder-model.jpg',
          sourceUrl: '#',
          price: 'Free',
          downloads: 1500,
          rating: 4.8,
          platform: 'Sponsored'
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
    <div className={`ad-manager ${className}`}>
      {ads.map(ad => (
        <div key={ad.id} className="ad-container">
          {renderAd(ad)}
        </div>
      ))}
    </div>
  );
};

export default AdManager; 