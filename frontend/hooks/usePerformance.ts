import { useEffect, useRef, useCallback } from 'react';

interface PerformanceMetrics {
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte
}

interface UsePerformanceOptions {
  onMetrics?: (metrics: PerformanceMetrics) => void;
  enabled?: boolean;
}

// Type definitions for Performance API
interface PerformanceEntry {
  name: string;
  startTime: number;
  processingStart?: number;
  value?: number;
  hadRecentInput?: boolean;
}

interface PerformanceNavigationTiming extends PerformanceEntry {
  responseStart: number;
  requestStart: number;
}

interface PerformanceObserver {
  observe(options: { entryTypes: string[] }): void;
  disconnect(): void;
}

interface PerformanceObserverCallback {
  (list: { getEntries(): PerformanceEntry[] }): void;
}

declare global {
  interface Window {
    PerformanceObserver: {
      new (callback: PerformanceObserverCallback): PerformanceObserver;
    };
    performance: {
      getEntriesByType(type: string): PerformanceEntry[];
      now(): number;
    };
  }
}

export function usePerformance(options: UsePerformanceOptions = {}) {
  const { onMetrics, enabled = true } = options;
  const metricsRef = useRef<PerformanceMetrics>({});

  const measureFCP = useCallback(() => {
    if (!enabled || typeof window === 'undefined' || !window.PerformanceObserver) return;

    try {
      const observer = new window.PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
        
        if (fcpEntry) {
          const fcp = fcpEntry.startTime;
          metricsRef.current = { ...metricsRef.current, fcp };
          onMetrics?.(metricsRef.current);
        }
      });

      observer.observe({ entryTypes: ['paint'] });
      return () => observer.disconnect();
    } catch (error) {
      console.warn('FCP measurement not supported:', error);
      return;
    }
  }, [enabled, onMetrics]);

  const measureLCP = useCallback(() => {
    if (!enabled || typeof window === 'undefined' || !window.PerformanceObserver) return;

    try {
      const observer = new window.PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lcpEntry = entries[entries.length - 1] as PerformanceEntry;
        
        if (lcpEntry) {
          const lcp = lcpEntry.startTime;
          metricsRef.current = { ...metricsRef.current, lcp };
          onMetrics?.(metricsRef.current);
        }
      });

      observer.observe({ entryTypes: ['largest-contentful-paint'] });
      return () => observer.disconnect();
    } catch (error) {
      console.warn('LCP measurement not supported:', error);
      return;
    }
  }, [enabled, onMetrics]);

  const measureFID = useCallback(() => {
    if (!enabled || typeof window === 'undefined' || !window.PerformanceObserver) return;

    try {
      const observer = new window.PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fidEntry = entries[0] as PerformanceEntry;
        
        if (fidEntry && fidEntry.processingStart) {
          const fid = fidEntry.processingStart - fidEntry.startTime;
          metricsRef.current = { ...metricsRef.current, fid };
          onMetrics?.(metricsRef.current);
        }
      });

      observer.observe({ entryTypes: ['first-input'] });
      return () => observer.disconnect();
    } catch (error) {
      console.warn('FID measurement not supported:', error);
      return;
    }
  }, [enabled, onMetrics]);

  const measureCLS = useCallback(() => {
    if (!enabled || typeof window === 'undefined' || !window.PerformanceObserver) return;

    try {
      let clsValue = 0;
      const observer = new window.PerformanceObserver((list) => {
        const entries = list.getEntries();
        
        entries.forEach((entry: PerformanceEntry) => {
          if (entry.value && !entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });

        metricsRef.current = { ...metricsRef.current, cls: clsValue };
        onMetrics?.(metricsRef.current);
      });

      observer.observe({ entryTypes: ['layout-shift'] });
      return () => observer.disconnect();
    } catch (error) {
      console.warn('CLS measurement not supported:', error);
      return;
    }
  }, [enabled, onMetrics]);

  const measureTTFB = useCallback(() => {
    if (!enabled || typeof window === 'undefined') return;

    try {
      const navigationEntries = window.performance.getEntriesByType('navigation');
      const navigationEntry = navigationEntries[0] as PerformanceNavigationTiming;
      
      if (navigationEntry) {
        const ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
        metricsRef.current = { ...metricsRef.current, ttfb };
        onMetrics?.(metricsRef.current);
      }
    } catch (error) {
      console.warn('TTFB measurement not supported:', error);
    }
  }, [enabled, onMetrics]);

  useEffect(() => {
    if (!enabled) return;

    const cleanupFCP = measureFCP();
    const cleanupLCP = measureLCP();
    const cleanupFID = measureFID();
    const cleanupCLS = measureCLS();
    
    // Measure TTFB immediately
    measureTTFB();

    return () => {
      cleanupFCP?.();
      cleanupLCP?.();
      cleanupFID?.();
      cleanupCLS?.();
    };
  }, [enabled, measureFCP, measureLCP, measureFID, measureCLS, measureTTFB]);

  const getMetrics = useCallback(() => metricsRef.current, []);

  const logMetrics = useCallback(() => {
    const metrics = metricsRef.current;
    if (metrics) {
      console.log('Performance Metrics:', {
        'First Contentful Paint': metrics.fcp ? `${metrics.fcp.toFixed(2)}ms` : 'Not measured',
        'Largest Contentful Paint': metrics.lcp ? `${metrics.lcp.toFixed(2)}ms` : 'Not measured',
        'First Input Delay': metrics.fid ? `${metrics.fid.toFixed(2)}ms` : 'Not measured',
        'Cumulative Layout Shift': metrics.cls ? metrics.cls.toFixed(3) : 'Not measured',
        'Time to First Byte': metrics.ttfb ? `${metrics.ttfb.toFixed(2)}ms` : 'Not measured',
      });
    }
  }, []);

  return {
    getMetrics,
    logMetrics,
  };
}

// Hook for measuring component render performance
export function useRenderPerformance(componentName: string) {
  const renderCountRef = useRef(0);
  const startTimeRef = useRef(0);

  useEffect(() => {
    renderCountRef.current += 1;
    const renderTime = typeof window !== 'undefined' ? window.performance.now() - startTimeRef.current : 0;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`${componentName} render #${renderCountRef.current}: ${renderTime.toFixed(2)}ms`);
    }

    startTimeRef.current = typeof window !== 'undefined' ? window.performance.now() : 0;
  });

  return {
    renderCount: renderCountRef.current,
  };
}

// Hook for measuring API call performance
export function useApiPerformance() {
  const apiCallsRef = useRef<Map<string, number[]>>(new Map());

  const trackApiCall = useCallback((endpoint: string, duration: number) => {
    if (!apiCallsRef.current.has(endpoint)) {
      apiCallsRef.current.set(endpoint, []);
    }
    
    const calls = apiCallsRef.current.get(endpoint)!;
    calls.push(duration);

    // Keep only last 10 calls for average calculation
    if (calls.length > 10) {
      calls.shift();
    }
  }, []);

  const getApiStats = useCallback(() => {
    const stats: Record<string, { avg: number; min: number; max: number; count: number }> = {};
    
    apiCallsRef.current.forEach((calls, endpoint) => {
      if (calls.length > 0) {
        const avg = calls.reduce((sum, call) => sum + call, 0) / calls.length;
        const min = Math.min(...calls);
        const max = Math.max(...calls);
        
        stats[endpoint] = {
          avg: Number(avg.toFixed(2)),
          min: Number(min.toFixed(2)),
          max: Number(max.toFixed(2)),
          count: calls.length,
        };
      }
    });

    return stats;
  }, []);

  return {
    trackApiCall,
    getApiStats,
  };
}
