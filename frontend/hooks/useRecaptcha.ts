/**
 * Custom hook for reCAPTCHA v3 integration
 */

import { useCallback, useEffect, useState } from 'react';
import { recaptchaService, RECAPTCHA_ACTIONS } from '@/lib/recaptcha';

export interface UseRecaptchaReturn {
  executeRecaptcha: (action?: string) => Promise<string>;
  isLoading: boolean;
  error: string | null;
  isReady: boolean;
}

export const useRecaptcha = (): UseRecaptchaReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initializeRecaptcha = async () => {
      try {
        setIsLoading(true);
        setError(null);
        await recaptchaService.loadRecaptcha();
        setIsReady(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize reCAPTCHA');
        console.error('reCAPTCHA initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeRecaptcha();
  }, []);

  const executeRecaptcha = useCallback(async (action: string = RECAPTCHA_ACTIONS.SUBMIT): Promise<string> => {
    if (!isReady) {
      throw new Error('reCAPTCHA is not ready yet');
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const token = await recaptchaService.executeRecaptcha(action);
      return token;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'reCAPTCHA execution failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [isReady]);

  return {
    executeRecaptcha,
    isLoading,
    error,
    isReady,
  };
};
