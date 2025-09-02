const axios = require('axios');

class RecaptchaService {
  constructor() {
    this.secretKey = process.env.RECAPTCHA_SECRET_KEY;
    this.verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';
    
    // Score thresholds for different actions
    this.scoreThresholds = {
      login: 0.5,
      register: 0.5,
      contact: 0.3,
      search: 0.1,
      download: 0.7,
      like: 0.5,
      view: 0.3,
      share: 0.3,
      filter: 0.1,
      submit: 0.5
    };
  }

  /**
   * Verify reCAPTCHA token with Google
   */
  async verifyToken(token, action) {
    try {
      const response = await axios.post(this.verifyUrl, null, {
        params: {
          secret: this.secretKey,
          response: token
        }
      });

      return response.data;
    } catch (error) {
      console.error('reCAPTCHA verification error:', error);
      throw new Error('Failed to verify reCAPTCHA token');
    }
  }

  /**
   * Verify reCAPTCHA token and check score
   */
  async verify(token, action) {
    if (!token) {
      throw new Error('reCAPTCHA token is required');
    }

    if (!this.secretKey) {
      console.warn('reCAPTCHA secret key not configured, skipping verification');
      return { success: true, score: 1.0 };
    }

    const result = await this.verifyToken(token, action);
    
    // Check if verification was successful
    if (!result.success) {
      throw new Error('reCAPTCHA verification failed');
    }

    // Check if action matches (for v3)
    if (action && result.action !== action) {
      throw new Error(`reCAPTCHA action mismatch: expected ${action}, got ${result.action}`);
    }

    // Check score threshold
    const threshold = this.scoreThresholds[action] || 0.5;
    if (result.score < threshold) {
      throw new Error(`reCAPTCHA score too low: ${result.score} (threshold: ${threshold})`);
    }

    return {
      success: true,
      score: result.score,
      action: result.action
    };
  }
}

module.exports = new RecaptchaService();
