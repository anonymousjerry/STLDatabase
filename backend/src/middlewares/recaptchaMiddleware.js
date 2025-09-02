const recaptchaService = require('../utils/recaptcha');

/**
 * Create reCAPTCHA middleware for a specific action
 */
const createRecaptchaMiddleware = (action = 'submit', required = true) => {
  return async (req, res, next) => {
    try {
      // Skip reCAPTCHA in development for now
      if (process.env.NODE_ENV === 'development') {
        console.log('Skipping reCAPTCHA verification in development mode');
        return next();
      }

      const token = req.body.recaptchaToken || req.headers['x-recaptcha-token'];
      
      if (!token && required) {
        return res.status(400).json({
          success: false,
          message: 'reCAPTCHA token is required'
        });
      }

      if (token) {
        try {
          const result = await recaptchaService.verify(token, action);
          console.log(`reCAPTCHA verification successful for ${action}: score ${result.score}`);
          next();
        } catch (error) {
          console.error(`reCAPTCHA verification failed for ${action}:`, error.message);
          return res.status(400).json({
            success: false,
            message: 'reCAPTCHA verification failed',
            error: error.message
          });
        }
      } else {
        // Token not provided but not required
        next();
      }
    } catch (error) {
      console.error('reCAPTCHA middleware error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error during reCAPTCHA verification'
      });
    }
  };
};

// Pre-configured middleware for common actions
const login = createRecaptchaMiddleware('login', true);
const register = createRecaptchaMiddleware('register', true);
const contact = createRecaptchaMiddleware('contact', true);
const search = createRecaptchaMiddleware('search', false); // Optional for search
const download = createRecaptchaMiddleware('download', true);
const like = createRecaptchaMiddleware('like', true);
const view = createRecaptchaMiddleware('view', true);
const share = createRecaptchaMiddleware('share', true);
const filter = createRecaptchaMiddleware('filter', false); // Optional for filters
const submit = createRecaptchaMiddleware('submit', true);

module.exports = {
  createRecaptchaMiddleware,
  login,
  register,
  contact,
  search,
  download,
  like,
  view,
  share,
  filter,
  submit
};
