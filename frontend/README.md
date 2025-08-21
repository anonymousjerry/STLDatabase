# Frontend - Next.js Application 🎨

The frontend application for 3D Model Pro built with Next.js 14, featuring a modern, responsive design with advanced search capabilities, user authentication, and a comprehensive advertisement system.

## 🌟 Features

### 🎨 **Modern UI/UX**
- **Responsive Design**: Mobile-first approach with tablet and desktop optimization
- **Dark Mode**: Complete dark/light theme support
- **Tailwind CSS**: Utility-first styling with custom design system
- **Smooth Animations**: CSS transitions and micro-interactions
- **Accessibility**: WCAG compliant with keyboard navigation

### 🔍 **Advanced Search System**
- **Real-time Search**: Instant search results with debouncing
- **Smart Filters**: Category, platform, price, and rating filters
- **Search Suggestions**: Autocomplete with recent searches
- **Advanced Filters**: Multiple filter combinations
- **Search History**: Track and display recent searches

### 👤 **User Authentication**
- **NextAuth.js**: Secure authentication with multiple providers
- **Session Management**: Persistent user sessions
- **Protected Routes**: Role-based access control
- **User Profiles**: Personal dashboard and settings
- **Social Login**: Google, GitHub, and email authentication

### 📱 **Model Management**
- **Model Browsing**: Grid and list view options
- **Favorites System**: Save and organize favorite models
- **Download Tracking**: Track download history
- **Rating System**: Rate and review models
- **Model Details**: Comprehensive model information pages

### 💰 **Advertisement System**
- **Multiple Ad Types**: Banner, sidebar, and sponsored model ads
- **Position Management**: 15+ predefined ad positions
- **Ad Blocker Detection**: Graceful fallback content
- **Performance Optimization**: Lazy loading and caching
- **Admin Integration**: Dynamic ad management

### 📱 **Responsive Components**
- **Mobile Navigation**: Hamburger menu with smooth animations
- **Touch-Friendly**: Optimized for mobile interactions
- **Progressive Enhancement**: Works on all device sizes
- **Performance**: Optimized images and lazy loading

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Installation

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Environment Setup**

Create `.env.local` file:
```env
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
SANITY_PROJECT_ID=your-sanity-project-id
SANITY_DATASET=production
SANITY_API_TOKEN=your-sanity-token
```

4. **Start development server**
```bash
npm run dev
# or
yarn dev
```

5. **Access application**
Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
frontend/
├── app/                     # Next.js 14 App Router
│   ├── _app.tsx            # App wrapper component
│   ├── _document.tsx       # Document wrapper
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Homepage
│   ├── loading.tsx         # Loading component
│   ├── not-found.tsx       # 404 page
│   ├── login/              # Authentication pages
│   ├── register/           # Registration pages
│   ├── contact/            # Contact page
│   ├── explore/            # Explore pages
│   └── api/                # API routes
├── components/              # React components
│   ├── ads/                # Advertisement components
│   │   ├── AdPositionManager.tsx
│   │   ├── BannerAd.tsx
│   │   ├── SidebarAd.tsx
│   │   ├── SponsoredModelAd.tsx
│   │   ├── GoogleAd.tsx
│   │   └── index.ts
│   ├── context/            # React context providers
│   │   ├── LoadingContext.tsx
│   │   ├── ModalContext.tsx
│   │   ├── SearchContext.tsx
│   │   └── ThemeContext.tsx
│   ├── Header.tsx          # Main header component
│   ├── Footer.tsx          # Footer component
│   ├── Navbar.tsx          # Mobile navigation
│   ├── SearchBar.tsx       # Search functionality
│   ├── ModelItem.tsx       # Model display component
│   └── ...                 # Other components
├── lib/                     # Utility libraries
│   ├── adPositionApi.ts    # Ad position API
│   ├── categoryApi.ts      # Category API
│   ├── modelsApi.ts        # Models API
│   ├── platformApi.ts      # Platform API
│   ├── axiosInstance.ts    # HTTP client
│   └── utils.ts            # Utility functions
├── types/                   # TypeScript definitions
│   ├── next-auth.d.ts      # NextAuth types
│   └── token.api.ts        # API token types
├── utils/                   # Helper functions
│   ├── platformFormat.ts   # Platform formatting
│   ├── schema.ts           # Validation schemas
│   └── SessionProvider.tsx # Session provider
├── public/                  # Static assets
│   ├── Logo.png            # Site logo
│   ├── Header_bg.png       # Header background
│   └── ...                 # Other assets
└── package.json            # Dependencies and scripts
```

## 🎯 Advertisement System

### Ad Components

1. **AdPositionManager**
   - Main component for managing ad placement
   - Fetches ad configurations from Sanity
   - Handles ad blocking detection
   - Renders appropriate ad components

2. **BannerAd**
   - Horizontal banner advertisements
   - Multiple sizes (728x90, 300x250)
   - Responsive design
   - Fallback content support

3. **SidebarAd**
   - Vertical sidebar advertisements
   - Multiple sizes (300x250, 300x600)
   - Sticky positioning options
   - Custom styling

4. **SponsoredModelAd**
   - Native model advertisements
   - Integrated with model grid
   - Sponsored badge
   - Model-like appearance

5. **GoogleAd**
   - Google AdSense integration
   - Ad blocker detection
   - Fallback content handling
   - Performance optimization

### Ad Positions

**Homepage Positions**
```typescript
const homepagePositions = [
  'homepage-header-banner',
  'homepage-mid-content-banner', 
  'homepage-sidebar-right',
  'homepage-sponsored-models',
  'homepage-footer-banner'
];
```

**Detail Page Positions**
```typescript
const detailPositions = [
  'detail-header-banner',
  'detail-mid-content-banner',
  'detail-sidebar-right',
  'detail-sponsored-similar'
];
```

**Explore Page Positions**
```typescript
const explorePositions = [
  'explore-header-banner',
  'explore-mid-content-banner',
  'explore-sidebar-right',
  'explore-sidebar-left',
  'explore-sponsored-listings'
];
```

### Usage Example

```tsx
import { AdPositionManager } from '@/components/ads';

// In your page component
<AdPositionManager 
  page="homepage" 
  positions={['homepage-header-banner']} 
  className="my-4"
/>
```

## 🎨 UI Components

### Core Components

1. **Header**
   - Main navigation with search
   - User authentication status
   - Theme toggle
   - Mobile menu trigger

2. **Footer**
   - Site links and information
   - Social media links
   - Newsletter signup
   - Contact information

3. **Navbar**
   - Mobile navigation menu
   - User account section
   - Search functionality
   - Category navigation

4. **SearchBar**
   - Real-time search input
   - Search suggestions
   - Filter options
   - Search history

5. **ModelItem**
   - Individual model display
   - Model information
   - Action buttons
   - Rating and downloads

### Context Providers

1. **LoadingContext**
   - Global loading state management
   - Loading indicators
   - Progress tracking

2. **ModalContext**
   - Modal state management
   - Dynamic modal content
   - Modal stacking

3. **SearchContext**
   - Search state management
   - Search history
   - Filter state

4. **ThemeContext**
   - Dark/light theme management
   - Theme persistence
   - Theme switching

## 🔧 API Integration

### Available API Functions

```typescript
// Ad Position APIs
getActiveAdPositions()
getAdPositionsByPositions(positions: string[])
getAllActiveAdPositions()

// Category APIs
getAllCategories()
getCategoryById(id: string)
getCategoriesByPlatform(platform: string)

// Model APIs
getAllModels()
getModelById(id: string)
searchModels(query: string, filters: FilterOptions)
getModelsByCategory(categoryId: string)

// Platform APIs
getAllPlatforms()
getPlatformById(id: string)
```

### API Configuration

```typescript
// lib/axiosInstance.ts
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking

# Testing
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage

# Code Quality
npm run format       # Format code with Prettier
npm run lint:fix     # Fix ESLint errors
```

### Development Tools

1. **TypeScript**
   - Strict type checking
   - Type definitions for all components
   - API type safety

2. **ESLint**
   - Code quality rules
   - React best practices
   - Accessibility guidelines

3. **Prettier**
   - Code formatting
   - Consistent style
   - Editor integration

4. **Tailwind CSS**
   - Utility-first styling
   - Custom design system
   - Responsive utilities

## 📱 Responsive Design

### Breakpoints

```css
/* Mobile First Approach */
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
2xl: 1536px /* 2X large devices */
```

### Mobile Navigation

```tsx
// Mobile menu with hamburger icon
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

// Responsive grid layouts
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
```

## 🔒 Security

- **NextAuth.js**: Secure authentication
- **CSRF Protection**: Built-in CSRF protection
- **Input Validation**: Client and server-side validation
- **XSS Prevention**: React's built-in XSS protection
- **Environment Variables**: Secure configuration management

## 🚀 Performance

### Optimization Features

1. **Image Optimization**
   - Next.js Image component
   - Automatic optimization
   - Lazy loading
   - WebP format support

2. **Code Splitting**
   - Automatic code splitting
   - Dynamic imports
   - Route-based splitting

3. **Caching**
   - Static generation
   - Incremental static regeneration
   - Browser caching
   - CDN optimization

4. **Bundle Optimization**
   - Tree shaking
   - Minification
   - Compression
   - Bundle analysis

## 🚀 Deployment

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel --prod
```

### Environment Variables

Set up environment variables in your deployment platform:

```env
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://your-domain.com
SANITY_PROJECT_ID=your-project-id
SANITY_DATASET=production
SANITY_API_TOKEN=your-api-token
```

### Build Optimization

```bash
# Analyze bundle size
npm run analyze

# Build for production
npm run build

# Start production server
npm run start
```

## 📊 Analytics & Monitoring

- **Google Analytics**: User behavior tracking
- **Performance Monitoring**: Core Web Vitals
- **Error Tracking**: Error boundary implementation
- **User Analytics**: Custom event tracking
- **Ad Performance**: Advertisement metrics

## 🆘 Support

For frontend support:
- Check Next.js documentation
- Review component documentation
- Contact development team
- Create GitHub issues

## 🔮 Future Enhancements

- [ ] Progressive Web App (PWA)
- [ ] Offline functionality
- [ ] Advanced search filters
- [ ] Social sharing features
- [ ] User-generated content
- [ ] Advanced animations
- [ ] Voice search
- [ ] AR/VR integration
- [ ] Advanced caching strategies
- [ ] Performance optimizations

---

**Built with Next.js 14 and React** 🚀
