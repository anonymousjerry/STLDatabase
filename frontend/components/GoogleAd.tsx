"use client";

import React, { useEffect, useState } from 'react';

interface AdProps {
  adSlot: string;
  adFormat?: 'auto' | 'rectangle' | 'banner' | 'sidebar';
  className?: string;
  style?: React.CSSProperties;
  fallbackContent?: React.ReactNode;
}

const GoogleAd: React.FC<AdProps> = ({ 
  adSlot, 
  adFormat = 'auto', 
  className = '', 
  style = {},
  fallbackContent 
}) => {
  const [adLoaded, setAdLoaded] = useState(false);
  const [adError, setAdError] = useState(false);

  useEffect(() => {
    // Check if Google AdSense is available
    if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
      try {
        (window as any).adsbygoogle = (window as any).adsbygoogle || [];
        (window as any).adsbygoogle.push({});
        setAdLoaded(true);
      } catch (error) {
        console.error('AdSense error:', error);
        setAdError(true);
      }
    } else {
      setAdError(true);
    }
  }, [adSlot]);

  // Default fallback content
  const defaultFallback = (
    <div className="rounded-3xl border border-gray-200 bg-custom-light-containercolor  text-center shadow-lg dark:border-gray-700 dark:bg-custom-dark-containercolor">
      <div className="text-sm font-semibold text-custom-light-textcolor dark:text-custom-dark-textcolor mb-2">Advertisement</div>
      <div className="text-xs text-custom-light-textcolor dark:text-custom-dark-textcolor opacity-70">Reach 3D printing enthusiasts</div>
    </div>
  );

  if (adError && fallbackContent) {
    return <div className={className} style={style}>{fallbackContent}</div>;
  }

  if (adError) {
    return <div className={className} style={style}>{defaultFallback}</div>;
  }

  return (
    <div className={`ad-container flex items-center justify-center w-full rounded-3xl border border-gray-200 bg-custom-light-containercolor shadow-lg dark:border-gray-700 dark:bg-custom-dark-containercolor ${className}`} style={style}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-YOUR_PUBLISHER_ID"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default GoogleAd;
