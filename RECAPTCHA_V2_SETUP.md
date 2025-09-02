# reCAPTCHA v3 Implementation Guide

This guide explains how to set up and configure reCAPTCHA v3 protection for your 3D Model Pro project.

## 🚀 Quick Setup

### 1. Get reCAPTCHA Keys

1. Go to [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Click "Create" to add a new site
3. Choose **reCAPTCHA v3**
4. Add your domains:
   - `localhost` (for development)
   - Your production domain (e.g., `yourdomain.com`)
5. Accept the Terms of Service
6. Copy your **Site Key** and **Secret Key**

### 2. Environment Variables

#### Frontend (.env.local)
```bash
# reCAPTCHA v3 Configuration
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key_here

# API Configuration
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

#### Backend (.env)
```bash
# reCAPTCHA v3 Configuration
RECAPTCHA_SECRET_KEY=your_secret_key_here

# Database Configuration
DATABASE_URL="your_database_url_here"

# JWT Configuration
JWT_SECRET=your_jwt_secret_here
```

### 3. Install Dependencies

The implementation uses built-in browser APIs and axios, so no additional packages are required.

## 🛡️ Protected Endpoints

### Frontend Forms
- ✅ **Contact Form** - `/contact` page with invisible reCAPTCHA
- 🔄 **User Registration** - Ready for implementation
- 🔄 **User Login** - Ready for implementation
- 🔄 **Admin Forms** - Ready for implementation

### Backend API Endpoints
- ✅ **POST /api/contact** - Contact form submissions with reCAPTCHA verification
- 🔄 **POST /api/users/register** - Ready for protection
- 🔄 **POST /api/users/login** - Ready for protection

## 🔧 How reCAPTCHA v3 Works

### User Experience
1. **Completely Invisible**: No visible challenges or checkboxes ever appear
2. **Seamless Protection**: Users never see any reCAPTCHA interface
3. **Score-Based**: Google analyzes user behavior and assigns a score (0.0-1.0)

### Technical Flow
1. reCAPTCHA v3 script loads on page load
2. When form is submitted, reCAPTCHA executes with specific action
3. Google analyzes user behavior and returns a score
4. Backend verifies token and score with Google's API
5. Access granted/denied based on score thresholds

## 🧪 Testing

### Development Mode

For testing, you can use Google's test keys:

- **Site Key**: `6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI`
- **Secret Key**: `6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe`

⚠️ **Note**: Test keys always return a score of 0.9, so they're perfect for development.

### Test the Implementation

1. **Start your backend server:**
   ```bash
   cd backend
   npm start
   ```

2. **Start your frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Test the contact form:**
   - Go to `/contact` page
   - Fill out the form
   - Submit and check browser console for reCAPTCHA logs
   - Check backend logs for verification results

## 📊 Monitoring

### Frontend Logs
Check browser console for:
```javascript
// reCAPTCHA loaded successfully
reCAPTCHA v3 script loaded

// reCAPTCHA execution
reCAPTCHA token generated for action: contact
```

### Backend Logs
Check server logs for:
```javascript
// Successful verification with score
reCAPTCHA verification successful: score 0.8 for action contact

// Failed verification
reCAPTCHA score too low: 0.2 < 0.5 for action login
reCAPTCHA action mismatch: expected login, got register
```

## 🔍 Troubleshooting

### Common Issues

1. **"reCAPTCHA site key not configured"**
   - Check `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` in frontend `.env.local`
   - Ensure the key is prefixed with `NEXT_PUBLIC_`

2. **"reCAPTCHA secret key not configured"**
   - Check `RECAPTCHA_SECRET_KEY` in backend `.env`
   - Restart the backend server after adding the key

3. **"reCAPTCHA verification failed"**
   - Check domain configuration in reCAPTCHA admin console
   - Verify the secret key matches the site key
   - Check network connectivity to Google's servers

4. **"Security verification is loading"**
   - Check if reCAPTCHA script loaded successfully
   - Verify site key is correct
   - Check browser console for JavaScript errors

5. **Low scores for legitimate users**
   - This can happen with new domains or unusual traffic patterns
   - Consider lowering score thresholds temporarily
   - Monitor scores over time to find optimal thresholds

### Debug Mode

Enable debug logging by checking browser console and server logs. The implementation includes comprehensive error handling and logging.

## 🚀 Production Deployment

### 1. Update Domain Configuration

In reCAPTCHA admin console:
1. Add your production domain
2. Remove `localhost` if not needed
3. Update environment variables with production keys

### 2. Environment Variables

Set production environment variables:

```bash
# Production Frontend
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_production_site_key
NEXT_PUBLIC_BACKEND_URL=https://your-api-domain.com

# Production Backend
RECAPTCHA_SECRET_KEY=your_production_secret_key
NODE_ENV=production
```

### 3. Score Thresholds

Adjust score thresholds in `backend/src/utils/recaptcha.js`:

```javascript
this.scoreThresholds = {
  login: 0.5,      // Authentication actions
  register: 0.5,   // User registration
  contact: 0.3,    // Contact forms (more lenient)
  search: 0.1,     // Search operations (very lenient)
  download: 0.7,   // Download actions (strict)
  submit: 0.5,     // General submissions
  default: 0.5     // Fallback threshold
};
```

### 4. Security Considerations

- ✅ Never expose secret keys in frontend code
- ✅ Use HTTPS in production
- ✅ Monitor reCAPTCHA scores and adjust thresholds
- ✅ Implement rate limiting on top of reCAPTCHA
- ✅ Log suspicious activity for analysis
- ✅ Use different score thresholds for different actions

## 📈 Performance

### Optimization Tips

1. **Lazy Loading**: reCAPTCHA script loads only when needed
2. **Error Handling**: Graceful fallbacks for network issues
3. **User Feedback**: Clear loading states and error messages

### Monitoring Performance

Track these metrics:
- reCAPTCHA load time
- Verification success rate
- Score distribution by action
- Error rates
- False positive/negative rates

## 🔄 Adding reCAPTCHA to Other Forms

### For Registration Form

1. **Add reCAPTCHA hook:**
   ```typescript
   const { executeRecaptcha, isLoading, error, isReady } = useRecaptcha();
   ```

2. **Execute before submission:**
   ```typescript
   const recaptchaToken = await executeRecaptcha('register');
   ```

3. **Add to backend route:**
   ```javascript
   router.post('/register', recaptchaMiddleware.register, register);
   ```

### For Login Form

Same process as registration, but use `recaptchaMiddleware.login`.

## 📞 Support

For issues with this implementation:

1. Check the troubleshooting section above
2. Review Google's reCAPTCHA documentation
3. Check browser console and server logs
4. Verify environment variable configuration

---

**Note**: reCAPTCHA v3 provides excellent protection against spam and bots while maintaining a completely seamless user experience. No visible challenges ever appear, making it truly invisible to all users while providing robust security through behavioral analysis and scoring.
