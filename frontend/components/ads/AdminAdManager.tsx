"use client";

import React, { useState, useEffect } from 'react';
import { AdPositionType } from './AdPositionManager';

interface AdminAdManagerProps {
  onSave: (config: AdPositionConfig) => void;
  initialConfig?: AdPositionConfig;
}

interface AdPositionConfig {
  page: 'homepage' | 'detail' | 'explore';
  enabledPositions: AdPositionType[];
  adSlots: Record<AdPositionType, string>;
  fallbackContent: Record<AdPositionType, string>;
}

const AdminAdManager: React.FC<AdminAdManagerProps> = ({ 
  onSave, 
  initialConfig 
}) => {
  const [config, setConfig] = useState<AdPositionConfig>({
    page: 'homepage',
    enabledPositions: [],
    adSlots: {} as Record<AdPositionType, string>,
    fallbackContent: {} as Record<AdPositionType, string>
  });

  // Ad position definitions based on Figma mockups
  const adPositions = {
    homepage: [
      {
        id: 'homepage-header-banner' as AdPositionType,
        name: 'Header Banner (728x90)',
        description: 'Below search bar, above "Top Categories"',
        type: 'banner',
        size: '728x90'
      },
      {
        id: 'homepage-mid-content-banner' as AdPositionType,
        name: 'Mid-Content Banner (728x90)',
        description: 'Below "Featured Sites", above "Trending Models"',
        type: 'banner',
        size: '728x90'
      },
      {
        id: 'homepage-sidebar-right' as AdPositionType,
        name: 'Right Sidebar (300x250)',
        description: 'Right side of "Daily Discover" section',
        type: 'sidebar',
        size: '300x250'
      },
      {
        id: 'homepage-sponsored-models' as AdPositionType,
        name: 'Sponsored Models (Native)',
        description: 'Within "Trending Models" or "Daily Discover" grids',
        type: 'sponsored-model',
        size: 'native'
      },
      {
        id: 'homepage-footer-banner' as AdPositionType,
        name: 'Footer Banner (728x90)',
        description: 'Above footer section',
        type: 'banner',
        size: '728x90'
      }
    ],
    detail: [
      {
        id: 'detail-header-banner' as AdPositionType,
        name: 'Header Banner (728x90)',
        description: 'Below search bar, above model title',
        type: 'banner',
        size: '728x90'
      },
      {
        id: 'detail-mid-content-banner' as AdPositionType,
        name: 'Mid-Content Banner (728x90)',
        description: 'Below model description, above "Similar Design"',
        type: 'banner',
        size: '728x90'
      },
      {
        id: 'detail-sidebar-right' as AdPositionType,
        name: 'Right Sidebar (300x250)',
        description: 'Right side of main model image/description',
        type: 'sidebar',
        size: '300x250'
      },
      {
        id: 'detail-sponsored-similar' as AdPositionType,
        name: 'Sponsored Similar Models (Native)',
        description: 'Within "Similar Design You May Like" section',
        type: 'sponsored-model',
        size: 'native'
      }
    ],
    explore: [
      {
        id: 'explore-header-banner' as AdPositionType,
        name: 'Header Banner (728x90)',
        description: 'Below search bar, above filters',
        type: 'banner',
        size: '728x90'
      },
      {
        id: 'explore-mid-content-banner' as AdPositionType,
        name: 'Mid-Content Banner (728x90)',
        description: 'Below first row of model listings',
        type: 'banner',
        size: '728x90'
      },
      {
        id: 'explore-sidebar-right' as AdPositionType,
        name: 'Right Sidebar (300x250)',
        description: 'Right side, below filters, above second row',
        type: 'sidebar',
        size: '300x250'
      },
      {
        id: 'explore-sponsored-listings' as AdPositionType,
        name: 'Sponsored Listings (Native)',
        description: 'Interspersed within main grid',
        type: 'sponsored-model',
        size: 'native'
      },
      {
        id: 'explore-sidebar-left' as AdPositionType,
        name: 'Left Sidebar (300x250)',
        description: 'Left sidebar (if expanded)',
        type: 'sidebar',
        size: '300x250'
      }
    ]
  };

  useEffect(() => {
    if (initialConfig) {
      setConfig(initialConfig);
    }
  }, [initialConfig]);

  const handlePageChange = (page: 'homepage' | 'detail' | 'explore') => {
    setConfig(prev => ({
      ...prev,
      page,
      enabledPositions: []
    }));
  };

  const handlePositionToggle = (position: AdPositionType) => {
    setConfig(prev => ({
      ...prev,
      enabledPositions: prev.enabledPositions.includes(position)
        ? prev.enabledPositions.filter(p => p !== position)
        : [...prev.enabledPositions, position]
    }));
  };

  const handleAdSlotChange = (position: AdPositionType, adSlot: string) => {
    setConfig(prev => ({
      ...prev,
      adSlots: {
        ...prev.adSlots,
        [position]: adSlot
      }
    }));
  };

  const handleFallbackContentChange = (position: AdPositionType, content: string) => {
    setConfig(prev => ({
      ...prev,
      fallbackContent: {
        ...prev.fallbackContent,
        [position]: content
      }
    }));
  };

  const handleSave = () => {
    onSave(config);
  };

  const currentPagePositions = adPositions[config.page];

  return (
    <div className="admin-ad-manager bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Advertisement Position Manager
      </h2>

      {/* Page Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Select Page
        </label>
        <div className="flex gap-4">
          {(['homepage', 'detail', 'explore'] as const).map(page => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                config.page === page
                  ? 'bg-custom-light-maincolor text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {page.charAt(0).toUpperCase() + page.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Ad Positions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Available Ad Positions
        </h3>
        
        {currentPagePositions.map(position => (
          <div key={position.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <input
                    type="checkbox"
                    id={position.id}
                    checked={config.enabledPositions.includes(position.id)}
                    onChange={() => handlePositionToggle(position.id)}
                    className="w-4 h-4 text-custom-light-maincolor border-gray-300 rounded focus:ring-custom-light-maincolor"
                  />
                  <label htmlFor={position.id} className="font-medium text-gray-900 dark:text-white">
                    {position.name}
                  </label>
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded">
                    {position.size}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 ml-7">
                  {position.description}
                </p>
              </div>
            </div>

            {config.enabledPositions.includes(position.id) && (
              <div className="ml-7 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Google AdSense Ad Slot ID
                  </label>
                  <input
                    type="text"
                    value={config.adSlots[position.id] || ''}
                    onChange={(e) => handleAdSlotChange(position.id, e.target.value)}
                    placeholder="ca-pub-1234567890123456/1234567890"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-custom-light-maincolor focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Fallback Content (Optional)
                  </label>
                  <textarea
                    value={config.fallbackContent[position.id] || ''}
                    onChange={(e) => handleFallbackContentChange(position.id, e.target.value)}
                    placeholder="Custom fallback content when ads are blocked..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-custom-light-maincolor focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Save Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          className="bg-custom-light-maincolor hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
        >
          Save Configuration
        </button>
      </div>

      {/* Preview */}
      {config.enabledPositions.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">
            Preview - Enabled Positions for {config.page}:
          </h4>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            {config.enabledPositions.map(position => {
              const posConfig = currentPagePositions.find(p => p.id === position);
              return (
                <li key={position} className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  {posConfig?.name} - {posConfig?.size}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdminAdManager; 