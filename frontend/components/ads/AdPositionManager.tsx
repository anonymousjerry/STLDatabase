"use client";

import React, { useState, useEffect } from 'react';
import BannerAd from './BannerAd';
import SidebarAd from './SidebarAd';
import SponsoredModelAd from './SponsoredModelAd';
import { getAdPositionsByPositions } from '@/lib/adPositionApi';

// Ad position types based on Figma mockups
export type AdPositionType = 
  // Homepage positions
  | 'homepage-header-banner'      // Below search bar, above "Top Categories"
  | 'homepage-mid-content-banner' // Below "Featured Sites", above "Trending Models"
  | 'homepage-sidebar-right'      // Right side of "Daily Discover" section
  | 'homepage-sponsored-models'   // Within "Trending Models" or "Daily Discover" grids
  // | 'homepage-footer-banner'      // Above footer section
  
  // Detail page positions
  | 'detail-header-banner'        // Below search bar, above model title
  | 'detail-mid-content-banner'   // Below model description, above "Similar Design"
  // | 'detail-sidebar-right'        // Right side of main model image/description
  | 'detail-sponsored-similar'    // Within "Similar Design You May Like" section
  
  // Explore page positions
  | 'explore-header-banner'       // Below search bar, above filters
  | 'explore-mid-content-banner'  // Below first row of model listings
  | 'explore-sidebar-right'       // Right side, below filters, above second row
  | 'explore-sponsored-listings'  // Interspersed within main grid
  // | 'explore-sidebar-left';       // Left sidebar (if expanded)

interface AdPositionManagerProps {
  page: 'homepage' | 'detail' | 'explore';
  positions: AdPositionType[];
  className?: string;
}

const AdPositionManager: React.FC<AdPositionManagerProps> = ({ 
  page, 
  positions, 
  className = '' 
}) => {
  const [activeAds, setActiveAds] = useState<AdPosition[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAdPositions = async () => {
      if (positions.length === 0) {
        setActiveAds([]);
        return;
      }

      setLoading(true);
      try {
        // Convert AdPositionType to string array for the API call
        const positionStrings = positions.map(pos => pos.toString());
        const ads = await getAdPositionsByPositions(positionStrings);
        setActiveAds(ads);
      } catch (error) {
        console.error('Failed to fetch ad positions:', error);
        setActiveAds([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAdPositions();
  }, [positions]);

  const renderAd = (ad: AdPosition) => {
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
          id: ad.id ?? '',
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

  if (loading) {
    return (
      <div className={`ad-position-manager ${className}`}>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-custom-light-maincolor"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`ad-position-manager bg-custom-light-secondcolor dark:bg-custom-dark-secondcolor ${className}`}>
      {activeAds.map(ad => (
        <div key={ad.id} className="ad-container">
          {renderAd(ad)}
        </div>
      ))}
    </div>
  );
};

export default AdPositionManager; 