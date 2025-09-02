# Google OAuth Setup Guide

## 🚨 IMPORTANT: You need to set up Google OAuth credentials first!

### **Step 1: Create Google OAuth Credentials**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Google+ API** and **Google OAuth2 API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client IDs**
5. Choose **Web application**
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
7. Copy the **Client ID** and **Client Secret**

### **Step 2: Set Environment Variables**

Create/update `frontend/.env.local`:
```env
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret_here

# Backend
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

Create/update `backend/.env`:
```env
# JWT
JWT_SECRET=your_jwt_secret_here

# Database
DATABASE_URL=your_database_url_here

# Environment
NODE_ENV=development
```

### **Step 3: Update Database Schema**

Run the Prisma migration to allow optional passwords:
```bash
cd backend
npx prisma migrate dev --name allow_optional_passwords
npx prisma generate
```

### **Step 4: Test the Setup**

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

3. **Test Google login:**
   - Go to `/login` page
   - Click "Sign in with Google"
   - Complete Google OAuth flow

## 🔍 Troubleshooting

### **Common Issues:**

1. **"Invalid client" error**
   - Check your Google Client ID and Secret
   - Verify redirect URIs in Google Console

2. **"Redirect URI mismatch"**
   - Ensure redirect URI exactly matches what's in Google Console
   - Check for trailing slashes

3. **"OAuth consent screen not configured"**
   - Configure OAuth consent screen in Google Console
   - Add your email as test user

4. **Database errors**
   - Run Prisma migrations
   - Check database connection

### **Debug Mode:**

Enable debug mode in development:
```typescript
// frontend/lib/auth.ts
debug: process.env.NODE_ENV === 'development',
```

Check browser console and backend logs for detailed error messages.

## 📱 Testing the Setup

You can test the Google login using the existing Google icons in your login and register pages:

1. **Login Page** (`/login`) - Has Google login button
2. **Register Page** (`/register`) - Has Google login button
3. **Both pages** will show success toasts with usernames

## 🔒 Security Notes

1. **Never commit** `.env` files to version control
2. **Use HTTPS** in production
3. **Rotate secrets** regularly
4. **Monitor OAuth usage** in Google Console

## 📞 Support

If you still have issues:
1. Check Google Cloud Console for errors
2. Verify all environment variables are set
3. Check browser console for frontend errors
4. Check backend logs for server errors
5. Ensure database is running and accessible
