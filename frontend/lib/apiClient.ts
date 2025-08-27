import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Cache interface
interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number;
}

// Request deduplication
interface PendingRequest {
  promise: Promise<any>;
  timestamp: number;
}

class ApiClient {
  private axiosInstance: AxiosInstance;
  private cache: Map<string, CacheEntry> = new Map();
  private pendingRequests: Map<string, PendingRequest> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  private readonly REQUEST_TIMEOUT = 30000; // 30 seconds
  private readonly DEDUPLICATION_WINDOW = 1000; // 1 second

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
      timeout: this.REQUEST_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            window.location.href = '/login';
          }
        }
        return Promise.reject(this.normalizeError(error));
      }
    );
  }

  private normalizeError(error: any): Error {
    if (error.response) {
      return new Error(error.response.data?.message || `HTTP ${error.response.status}: ${error.response.statusText}`);
    } else if (error.request) {
      return new Error('Network error: Unable to connect to server');
    } else {
      return new Error(error.message || 'An unexpected error occurred');
    }
  }

  private generateCacheKey(config: AxiosRequestConfig): string {
    const { method, url, params, data } = config;
    return `${method?.toUpperCase()}:${url}:${JSON.stringify(params)}:${JSON.stringify(data)}`;
  }

  private isCacheValid(entry: CacheEntry): boolean {
    return Date.now() - entry.timestamp < entry.ttl;
  }

  private getCachedResponse(cacheKey: string): any | null {
    const entry = this.cache.get(cacheKey);
    if (entry && this.isCacheValid(entry)) {
      return entry.data;
    }
    if (entry) {
      this.cache.delete(cacheKey);
    }
    return null;
  }

  private setCachedResponse(cacheKey: string, data: any, ttl: number = this.CACHE_TTL): void {
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  private getPendingRequest(cacheKey: string): Promise<any> | null {
    const pending = this.pendingRequests.get(cacheKey);
    if (pending && Date.now() - pending.timestamp < this.DEDUPLICATION_WINDOW) {
      return pending.promise;
    }
    if (pending) {
      this.pendingRequests.delete(cacheKey);
    }
    return null;
  }

  private setPendingRequest(cacheKey: string, promise: Promise<any>): void {
    this.pendingRequests.set(cacheKey, {
      promise,
      timestamp: Date.now(),
    });
  }

  async request<T = any>(config: AxiosRequestConfig, options: {
    cache?: boolean;
    ttl?: number;
    deduplicate?: boolean;
  } = {}): Promise<T> {
    const { cache = false, ttl, deduplicate = true } = options;
    const cacheKey = this.generateCacheKey(config);

    // Check cache first
    if (cache) {
      const cachedData = this.getCachedResponse(cacheKey);
      if (cachedData) {
        return cachedData;
      }
    }

    // Check for pending requests (deduplication)
    if (deduplicate) {
      const pendingRequest = this.getPendingRequest(cacheKey);
      if (pendingRequest) {
        return pendingRequest;
      }
    }

    // Make the request
    const promise = this.axiosInstance.request(config).then((response: AxiosResponse<T>) => {
      const data = response.data;
      
      // Cache the response if requested
      if (cache) {
        this.setCachedResponse(cacheKey, data, ttl);
      }

      // Remove from pending requests
      this.pendingRequests.delete(cacheKey);
      
      return data;
    }).catch((error) => {
      // Remove from pending requests on error
      this.pendingRequests.delete(cacheKey);
      throw error;
    });

    // Store pending request for deduplication
    if (deduplicate) {
      this.setPendingRequest(cacheKey, promise);
    }

    return promise;
  }

  async get<T = any>(url: string, params?: any, options?: {
    cache?: boolean;
    ttl?: number;
    deduplicate?: boolean;
  }): Promise<T> {
    return this.request<T>({
      method: 'GET',
      url,
      params,
    }, options);
  }

  async post<T = any>(url: string, data?: any, options?: {
    cache?: boolean;
    ttl?: number;
    deduplicate?: boolean;
  }): Promise<T> {
    return this.request<T>({
      method: 'POST',
      url,
      data,
    }, options);
  }

  async put<T = any>(url: string, data?: any, options?: {
    cache?: boolean;
    ttl?: number;
    deduplicate?: boolean;
  }): Promise<T> {
    return this.request<T>({
      method: 'PUT',
      url,
      data,
    }, options);
  }

  async delete<T = any>(url: string, options?: {
    cache?: boolean;
    ttl?: number;
    deduplicate?: boolean;
  }): Promise<T> {
    return this.request<T>({
      method: 'DELETE',
      url,
    }, options);
  }

  // Cache management
  clearCache(): void {
    this.cache.clear();
  }

  clearCacheByPattern(pattern: string): void {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }

  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export for backward compatibility
export const axiosInstance = apiClient['axiosInstance'];
