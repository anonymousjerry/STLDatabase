"use client";

import React from 'react';
import Image from 'next/image';
import { FaStar, FaDownload, FaHeart } from 'react-icons/fa';

interface SponsoredModelAdProps {
  model: {
    id: string;
    title: string;
    description: string;
    thumbnailUrl: string;
    sourceUrl: string;
    price: string;
    downloads: number;
    rating: number;
    platform: string;
  };
  className?: string;
  showBadge?: boolean;
}

const SponsoredModelAd: React.FC<SponsoredModelAdProps> = ({ 
  model, 
  className = '',
  showBadge = true 
}) => {
  return (
    <div className={`sponsored-model-ad bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-orange-200 dark:border-orange-800 ${className}`}>
      {showBadge && (
        <div className="bg-orange-500 text-white text-xs font-bold px-2 py-1 text-center">
          SPONSORED
        </div>
      )}
      
      <div className="relative">
        <Image
          src={model.thumbnailUrl}
          alt={model.title}
          width={300}
          height={200}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          {model.platform}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-2 line-clamp-2">
          {model.title}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
          {model.description}
        </p>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1">
            <FaStar className="text-yellow-400 text-sm" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {model.rating.toFixed(1)}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <FaDownload className="text-gray-400 text-sm" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {model.downloads.toLocaleString()}
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-lg font-bold text-custom-light-maincolor">
            {model.price === 'Free' ? 'Free' : `$${model.price}`}
          </div>
          <div className="flex gap-2">
            <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
              <FaHeart size={16} />
            </button>
            <a
              href={model.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-custom-light-maincolor hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              Download
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SponsoredModelAd; 