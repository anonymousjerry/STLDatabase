import { useState, useEffect, useCallback, useRef } from 'react';
import { apiClient } from '@/lib/apiClient';

interface UseApiOptions<T> {
  cache?: boolean;
  ttl?: number;
  deduplicate?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  enabled?: boolean;
  dependencies?: any[];
}

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useApi<T = any>(
  url: string,
  params?: any,
  options: UseApiOptions<T> = {}
): UseApiState<T> {
  const {
    cache = false,
    ttl,
    deduplicate = true,
    onSuccess,
    onError,
    enabled = true,
    dependencies = []
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      const response = await apiClient.get<T>(url, params, {
        cache,
        ttl,
        deduplicate
      });
      
      setData(response);
      onSuccess?.(response);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return; // Request was cancelled
      }
      
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [url, params, cache, ttl, deduplicate, onSuccess, onError, enabled]);

  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData, ...dependencies]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return { data, loading, error, refetch };
}

export function useMutation<T = any, R = any>(
  mutationFn: (data: T) => Promise<R>,
  options: {
    onSuccess?: (data: R) => void;
    onError?: (error: Error) => void;
    onSettled?: () => void;
  } = {}
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<R | null>(null);

  const mutate = useCallback(async (variables: T) => {
    setLoading(true);
    setError(null);

    try {
      const result = await mutationFn(variables);
      setData(result);
      options.onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      options.onError?.(error);
      throw error;
    } finally {
      setLoading(false);
      options.onSettled?.();
    }
  }, [mutationFn, options]);

  return {
    mutate,
    loading,
    error,
    data,
  };
}

// Hook for optimistic updates
export function useOptimisticMutation<T = any, R = any>(
  mutationFn: (data: T) => Promise<R>,
  options: {
    onSuccess?: (data: R) => void;
    onError?: (error: Error) => void;
    onSettled?: () => void;
    optimisticUpdate?: (data: T) => void;
    rollback?: () => void;
  } = {}
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(async (variables: T) => {
    setLoading(true);
    setError(null);

    // Apply optimistic update
    options.optimisticUpdate?.(variables);

    try {
      const result = await mutationFn(variables);
      options.onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      
      // Rollback optimistic update
      options.rollback?.();
      options.onError?.(error);
      throw error;
    } finally {
      setLoading(false);
      options.onSettled?.();
    }
  }, [mutationFn, options]);

  return {
    mutate,
    loading,
    error,
  };
}
