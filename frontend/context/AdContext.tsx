"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react';
import { getAllActiveAdPositions } from '@/lib/adPositionApi';

export interface AdPosition {
  _id?: string;
  id?: string;
  _type?: 'adPosition';
  title: string;
  page: 'homepage' | 'detail' | 'explore';
  position: string;
  adType: 'banner' | 'sidebar' | 'sponsored-model';
  size: '728x90' | '300x250' | '300x600' | 'native';
  enabled: boolean;
  priority: number;
  adSlot?: string;
  clientName?: string;
  clientEmail?: string;
  startDate?: string;
  endDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AdContextType {
  ads: AdPosition[];
  loading: boolean;
  error: string | null;
  getAdsByPage: (page: string) => AdPosition[];
  getAdsByPositions: (positions: string[]) => AdPosition[];
  refreshAds: () => Promise<void>;
}

const AdContext = createContext<AdContextType | undefined>(undefined);

export const useAdContext = () => {
  const context = useContext(AdContext);
  if (context === undefined) {
    throw new Error('useAdContext must be used within an AdProvider');
  }
  return context;
};

interface AdProviderProps {
  children: ReactNode;
}

export const AdProvider: React.FC<AdProviderProps> = ({ children }) => {
  const [ads, setAds] = useState<AdPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const warnedPositions = useRef<Set<string>>(new Set());

  const loadAds = async () => {
    try {
      setLoading(true);
      setError(null);
      const allAds = await getAllActiveAdPositions();
      setAds(allAds);
    } catch (err) {
      console.error('[AdContext] Failed to load ads:', err);
      setError('Failed to load advertisements');
      setAds([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshAds = async () => {
    await loadAds();
  };

  const getAdsByPage = (page: string): AdPosition[] => {
    return ads.filter(ad => ad.page === page);
  };

  const getAdsByPositions = (positions: string[]): AdPosition[] => {
    if (!positions || positions.length === 0) return [];
    
    const normalizedTargets = new Set(positions.map(pos => pos.toLowerCase().trim()));
    const matched = ads.filter(ad => 
      normalizedTargets.has(ad.position.toLowerCase().trim())
    );

    // Only warn once per position to reduce console noise
    if (matched.length === 0 && typeof window !== 'undefined') {
      positions.forEach(position => {
        const normalizedPosition = position.toLowerCase().trim();
        if (!warnedPositions.current.has(normalizedPosition)) {
          console.warn(`[AdContext] No ad found for position: ${position}`);
          warnedPositions.current.add(normalizedPosition);
        }
      });
    }
    
    return matched;
  };

  useEffect(() => {
    loadAds();
  }, []);

  const value: AdContextType = {
    ads,
    loading,
    error,
    getAdsByPage,
    getAdsByPositions,
    refreshAds,
  };

  return (
    <AdContext.Provider value={value}>
      {children}
    </AdContext.Provider>
  );
};
