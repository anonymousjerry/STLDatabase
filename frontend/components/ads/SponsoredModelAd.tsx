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
    <div className={`sponsored-model-ad flex flex-col w-full bg-custom-light-containercolor dark:bg-custom-dark-containercolor shadow-lg rounded-3xl border border-orange-200 dark:border-orange-800 overflow-hidden relative ${className}`}>
      {showBadge && (
        <div className="bg-orange-500 text-white text-xs font-bold px-3 py-1 text-center">
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
        <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-lg">
          {model.platform}
        </div>
      </div>
      
      <div className="flex flex-col px-4 py-3 text-custom-light-maincolor dark:text-custom-dark-titlecolor gap-2">
        <h3 className="font-semibold text-lg sm:text-xl md:text-2xl truncate max-w-full hover:underline transition-colors duration-200">
          {model.title}
        </h3>
        
        <p className="text-custom-light-textcolor dark:text-custom-dark-textcolor text-sm mb-3 line-clamp-2">
          {model.description}
        </p>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm font-medium text-custom-light-textcolor dark:text-custom-dark-textcolor">
          <div className="flex items-center gap-1">
            <FaStar className="text-yellow-400 text-sm" />
            <span>{model.rating.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-1">
            <FaDownload className="text-base" size={20} />
            <span>{model.downloads.toLocaleString()} files</span>
          </div>
          <div className="font-semibold text-lg sm:text-md text-custom-light-maincolor dark:text-custom-dark-maincolor">
            {model.price === 'Free' ? 'Free' : `$${model.price}`}
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pb-2">
          <button className="flex items-center justify-center w-full sm:w-12 h-12 border border-custom-light-maincolor text-custom-light-maincolor rounded-xl hover:bg-[#f0f0f0] hover:scale-110 transition-transform duration-200 dark:border-gray-500 dark:text-gray-300 dark:hover:bg-gray-600">
            <FaHeart size={20} />
          </button>
          <a
            href={model.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-custom-light-maincolor hover:bg-purple-700 text-white px-4 py-3 rounded-xl text-sm font-semibold transition-colors duration-200 text-center"
          >
            Download
          </a>
        </div>
      </div>
    </div>
  );
};

export default SponsoredModelAd; 