# reCAPTCHA v3 Setup Guide

## Overview
This guide covers the complete setup of Google reCAPTCHA v3 for both frontend and backend protection against bots and spam.

## 🎯 What's Protected

### Frontend Actions (with reCAPTCHA v3):
- ✅ **Login** - User authentication
- ✅ **Register** - User registration  
- ✅ **Contact Form** - Contact submissions
- ✅ **Search** - Search queries
- ✅ **Platform Filters** - Filter changes
- ✅ **Category Filters** - Category selection
- ✅ **Price Filters** - Price filtering
- ✅ **Like/Unlike** - Model interactions
- ✅ **View Tracking** - Model views
- ✅ **Download Tracking** - Model downloads
- ✅ **Share** - Content sharing

### Backend Endpoints (with reCAPTCHA middleware):
- ✅ `/api/users/login` - Login endpoint
- ✅ `/api/users/register` - Registration endpoint
- ✅ `/api/contact` - Contact form endpoint
- ✅ `/api/models/like` - Model like endpoint
- ✅ `/api/models/view` - Model view endpoint
- ✅ `/api/models/download` - Model download endpoint

## 🔧 Setup Instructions

### 1. Get reCAPTCHA v3 Keys

1. Go to [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Click "Create" to add a new site
3. Choose **reCAPTCHA v3**
4. Add your domains:
   - `localhost` (for development)
   - Your production domain
5. Copy the **Site Key** and **Secret Key**

### 2. Frontend Environment Variables

Create/update `frontend/.env.local`:
```env
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key_here
```

### 3. Backend Environment Variables

Create/update `backend/.env`:
```env
RECAPTCHA_SECRET_KEY=your_secret_key_here
JWT_SECRET=your_jwt_secret_here
NODE_ENV=development
```

## 🚀 How reCAPTCHA v3 Works

### Frontend Implementation:
- **Invisible**: No user interaction required
- **Score-based**: Returns a score from 0.0 to 1.0
- **Action-specific**: Different actions have different thresholds
- **Automatic**: Executes on user actions

### Backend Verification:
- **Token validation**: Verifies tokens with Google
- **Score checking**: Ensures score meets threshold
- **Action matching**: Confirms action matches expected
- **Middleware protection**: Applied to sensitive endpoints

## 📊 Score Thresholds

| Action | Threshold | Description |
|--------|-----------|-------------|
| `login` | 0.5 | User authentication |
| `register` | 0.5 | User registration |
| `contact` | 0.3 | Contact form submission |
| `search` | 0.1 | Search queries (optional) |
| `download` | 0.7 | Model downloads |
| `like` | 0.5 | Model likes |
| `view` | 0.3 | Model views |
| `share` | 0.3 | Content sharing |
| `filter` | 0.1 | Filter operations (optional) |
| `submit` | 0.5 | General form submissions |

## 🧪 Testing

### Development Mode:
- reCAPTCHA verification is **skipped** in development
- All endpoints work without valid tokens
- Use test tokens for development

### Production Testing:
1. Get real reCAPTCHA tokens from frontend
2. Test each protected endpoint
3. Monitor scores in Google Console
4. Adjust thresholds as needed

### Test Script:
```bash
# Test backend endpoints
node test-recaptcha-v3-backend.js

# Test frontend integration
# Use browser console to test reCAPTCHA execution
```

## 🔍 Monitoring

### Google reCAPTCHA Console:
- Monitor score distributions
- Check for suspicious activity
- Adjust thresholds based on data

### Backend Logs:
- reCAPTCHA verification results
- Score logging for analysis
- Error tracking

## 🛠️ Troubleshooting

### Common Issues:

1. **"reCAPTCHA token is required"**
   - Check if token is being sent from frontend
   - Verify environment variables

2. **"reCAPTCHA verification failed"**
   - Check secret key configuration
   - Verify token format

3. **"Score too low"**
   - Adjust threshold for the action
   - Check user behavior patterns

4. **Frontend errors**
   - Verify site key configuration
   - Check script loading

### Development Tips:
- Use test keys for development
- Monitor console logs
- Test with different user behaviors
- Gradually increase thresholds

## 🚀 Production Deployment

### 1. Environment Setup:
```env
NODE_ENV=production
RECAPTCHA_SECRET_KEY=your_production_secret_key
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_production_site_key
```

### 2. Domain Configuration:
- Add production domain to reCAPTCHA console
- Remove localhost from allowed domains

### 3. Threshold Adjustment:
- Start with conservative thresholds
- Monitor user experience
- Adjust based on legitimate user scores

### 4. Monitoring:
- Set up score monitoring
- Track verification success rates
- Monitor for false positives

## 📁 File Structure

```
frontend/
├── lib/recaptcha.ts          # reCAPTCHA service
├── hooks/useRecaptcha.ts     # React hook
└── components/               # Protected components

backend/
├── src/utils/recaptcha.js    # Verification service
├── src/middlewares/recaptchaMiddleware.js  # Route protection
└── src/controllers/          # Protected controllers
```

## 🔒 Security Best Practices

1. **Never expose secret keys** in frontend code
2. **Use HTTPS** in production
3. **Validate all inputs** on backend
4. **Monitor scores** regularly
5. **Adjust thresholds** based on legitimate user behavior
6. **Keep dependencies** updated

## 📞 Support

For issues with:
- **reCAPTCHA setup**: Check Google documentation
- **Frontend integration**: Review component implementations
- **Backend verification**: Check middleware and service logs
- **Score thresholds**: Monitor Google Console data
