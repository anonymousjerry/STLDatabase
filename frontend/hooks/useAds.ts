import { useAdContext } from '@/context/AdContext';

export const useAds = () => {
  const context = useAdContext();
  
  return {
    ...context,
    // Convenience methods
    getHomepageAds: () => context.getAdsByPage('homepage'),
    getDetailPageAds: () => context.getAdsByPage('detail'),
    getExplorePageAds: () => context.getAdsByPage('explore'),
    
    // Check if specific ad position exists
    hasAdAtPosition: (position: string) => {
      const ads = context.getAdsByPositions([position]);
      return ads.length > 0;
    },
    
    // Get ads for specific positions with fallback
    getAdsWithFallback: (primaryPositions: string[], fallbackPositions: string[] = []) => {
      const primaryAds = context.getAdsByPositions(primaryPositions);
      if (primaryAds.length > 0) return primaryAds;
      
      return context.getAdsByPositions(fallbackPositions);
    }
  };
};
