"use client";

import { useGoogleAuth } from '@/hooks/useGoogleAuth';

/**
 * This component automatically handles Google OAuth welcome emails
 * It should be placed in your layout to work globally
 */
export const GoogleAuthHandler = () => {
  // Just use the hook - it handles everything automatically
  useGoogleAuth();
  
  // Don't render anything - this component just initializes the hook
  return null;
};

export default GoogleAuthHandler;
