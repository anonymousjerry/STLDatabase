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
    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-center text-gray-500 dark:text-gray-400">
      <div className="text-sm font-medium mb-2">Advertisement</div>
      <div className="text-xs">Ad space available</div>
    </div>
  );

  if (adError && fallbackContent) {
    return <div className={className} style={style}>{fallbackContent}</div>;
  }

  if (adError) {
    return <div className={className} style={style}>{defaultFallback}</div>;
  }

  return (
    <div className={`ad-container ${className}`} style={style}>
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
