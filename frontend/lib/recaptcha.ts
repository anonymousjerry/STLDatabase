/**
 * reCAPTCHA v3 utility functions for frontend
 */

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

export interface RecaptchaConfig {
  siteKey: string;
  action: string;
}

export const RECAPTCHA_ACTIONS = {
  LOGIN: 'login',
  REGISTER: 'register',
  CONTACT: 'contact',
  SEARCH: 'search',
  DOWNLOAD: 'download',
  LIKE: 'like',
  VIEW: 'view',
  SHARE: 'share',
  FILTER: 'filter',
  SUBMIT: 'submit'
} as const;

export class RecaptchaService {
  private static instance: RecaptchaService;
  private isLoaded = false;
  private isLoading = false;
  private siteKey: string;

  private constructor() {
    this.siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '';
  }

  public static getInstance(): RecaptchaService {
    if (!RecaptchaService.instance) {
      RecaptchaService.instance = new RecaptchaService();
    }
    return RecaptchaService.instance;
  }

  /**
   * Load reCAPTCHA v3 script if not already loaded
   */
  public async loadRecaptcha(): Promise<void> {
    if (this.isLoaded) return;
    if (this.isLoading) {
      // Wait for existing load to complete
      return new Promise((resolve) => {
        const checkLoaded = () => {
          if (this.isLoaded) {
            resolve();
          } else {
            setTimeout(checkLoaded, 100);
          }
        };
        checkLoaded();
      });
    }

    this.isLoading = true;

    return new Promise((resolve, reject) => {
      // Check if script already exists
      if (document.querySelector('script[src*="recaptcha"]')) {
        this.isLoaded = true;
        this.isLoading = false;
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=${this.siteKey}`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        this.isLoaded = true;
        this.isLoading = false;
        resolve();
      };
      
      script.onerror = () => {
        this.isLoading = false;
        reject(new Error('Failed to load reCAPTCHA script'));
      };

      document.head.appendChild(script);
    });
  }

  /**
   * Execute reCAPTCHA v3 and get token
   */
  public async executeRecaptcha(action: string): Promise<string> {
    if (!this.isLoaded) {
      await this.loadRecaptcha();
    }

    if (!this.siteKey) {
      throw new Error('reCAPTCHA site key not configured');
    }

    return new Promise((resolve, reject) => {
      window.grecaptcha.ready(async () => {
        try {
          const token = await window.grecaptcha.execute(this.siteKey, { action });
          resolve(token);
        } catch (error) {
          reject(new Error(`reCAPTCHA execution failed: ${error}`));
        }
      });
    });
  }

  /**
   * Check if reCAPTCHA is ready
   */
  public isReady(): boolean {
    return this.isLoaded;
  }
}

// Export singleton instance
export const recaptchaService = RecaptchaService.getInstance();
