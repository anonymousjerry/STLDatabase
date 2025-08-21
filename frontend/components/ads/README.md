# Advertisement System for 3D Model Pro

This directory contains a comprehensive advertisement system for your 3D model marketplace frontend.

## 📁 Components Overview

### 1. **GoogleAd.tsx** - Base Google AdSense Component
- Handles Google AdSense integration
- Provides fallback content when ads are blocked
- Supports different ad formats and sizes

### 2. **BannerAd.tsx** - Banner Advertisement Component
- Horizontal banner ads for header, footer, and content areas
- Responsive design with different sizes
- Custom fallback content

### 3. **SidebarAd.tsx** - Sidebar Advertisement Component
- Vertical ads for sidebar placement
- Multiple size options (small, medium, large)
- Professional fallback design

### 4. **SponsoredModelAd.tsx** - Sponsored Model Component
- Native ad format that looks like regular model listings
- Includes model information, ratings, and download buttons
- "Sponsored" badge for transparency

### 5. **AdManager.tsx** - Central Ad Management
- Manages ad placement across different pages
- Handles ad blocking detection
- Configurable ad priorities and positions

## 🚀 Quick Start

### 1. Setup Google AdSense

First, add your Google AdSense code to your `_app.tsx` or `layout.tsx`:

```tsx
// app/layout.tsx or pages/_app.tsx
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUBLISHER_ID"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
```

### 2. Update Ad Slots

Replace the placeholder ad slots in each component with your actual Google AdSense ad unit IDs:

```tsx
// In BannerAd.tsx, SidebarAd.tsx, etc.
const getAdSlot = () => {
  return 'YOUR_ACTUAL_AD_SLOT_ID'; // Replace with real ad slot
};
```

### 3. Basic Usage

#### Simple Banner Ad:
```tsx
import { BannerAd } from '@/components/ads';

function HomePage() {
  return (
    <div>
      <BannerAd position="header" />
      {/* Your content */}
      <BannerAd position="content" />
    </div>
  );
}
```

#### Sidebar Ad:
```tsx
import { SidebarAd } from '@/components/ads';

function ExplorePage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        {/* Main content */}
      </div>
      <div className="lg:col-span-1">
        <SidebarAd size="medium" />
      </div>
    </div>
  );
}
```

#### Sponsored Model:
```tsx
import { SponsoredModelAd } from '@/components/ads';

const sponsoredModel = {
  id: 'sponsored-1',
  title: 'Premium 3D Model',
  description: 'High-quality model for professional use',
  thumbnailUrl: '/model-thumbnail.jpg',
  sourceUrl: 'https://example.com/model',
  price: 'Free',
  downloads: 1500,
  rating: 4.8,
  platform: 'Sponsored'
};

function ModelList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Regular models */}
      <ModelItem model={model1} />
      <ModelItem model={model2} />
      
      {/* Sponsored model */}
      <SponsoredModelAd model={sponsoredModel} />
      
      {/* More regular models */}
      <ModelItem model={model3} />
    </div>
  );
}
```

#### Using AdManager:
```tsx
import { AdManager } from '@/components/ads';

function HomePage() {
  return (
    <div>
      <AdManager page="home" />
      {/* Your page content */}
    </div>
  );
}
```

## 📍 Ad Placement Strategies

### 1. **Header Banner** (728x90)
- Place at the top of pages
- High visibility but don't overuse

### 2. **Content Banner** (728x90)
- Place between content sections
- Good for engagement without being intrusive

### 3. **Sidebar Ads** (300x250, 300x600)
- Perfect for explore and detail pages
- Multiple sizes available

### 4. **Sponsored Models**
- Integrate naturally into model listings
- Every 5-10 models for optimal balance

### 5. **Footer Banner** (728x90)
- Less intrusive placement
- Good for additional revenue

## ⚙️ Configuration

### Ad Slots Configuration:
```tsx
// Update these in each component
const AD_SLOTS = {
  HEADER_BANNER: 'ca-pub-1234567890123456/1234567890',
  CONTENT_BANNER: 'ca-pub-1234567890123456/0987654321',
  SIDEBAR_MEDIUM: 'ca-pub-1234567890123456/1122334455',
  SIDEBAR_LARGE: 'ca-pub-1234567890123456/5566778899',
};
```

### Page-Specific Ad Management:
```tsx
// In AdManager.tsx
const adConfigs = {
  home: [
    { id: 'home-header', type: 'banner', position: 'header', enabled: true, priority: 1 },
    { id: 'home-sidebar', type: 'sidebar', position: 'sidebar', enabled: true, priority: 2 },
  ],
  explore: [
    { id: 'explore-sidebar', type: 'sidebar', position: 'sidebar', enabled: true, priority: 1 },
  ],
  // Add more pages as needed
};
```

## 🎨 Customization

### Custom Fallback Content:
```tsx
<BannerAd 
  position="header"
  fallbackContent={
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-lg text-white text-center">
      <h3 className="font-bold">Advertise with Us</h3>
      <p className="text-sm">Reach thousands of 3D printing enthusiasts</p>
      <button className="bg-white text-blue-600 px-4 py-2 rounded mt-2">
        Get Started
      </button>
    </div>
  }
/>
```

### Responsive Design:
All ad components are responsive and will adapt to different screen sizes automatically.

## 🔧 Advanced Features

### 1. **Ad Blocking Detection**
The system automatically detects if ads are blocked and shows appropriate fallback content.

### 2. **Performance Optimization**
- Lazy loading for better performance
- Minimal impact on page load times
- Efficient re-rendering

### 3. **Analytics Integration**
You can easily add analytics tracking to monitor ad performance:

```tsx
const handleAdClick = (adType: string, position: string) => {
  // Track ad clicks
  analytics.track('ad_click', { adType, position });
};
```

## 📊 Best Practices

1. **Don't Overload**: Limit ads to 2-3 per page
2. **Strategic Placement**: Place ads where users naturally look
3. **Mobile Optimization**: Ensure ads work well on mobile devices
4. **User Experience**: Don't let ads interfere with content
5. **Transparency**: Clearly mark sponsored content
6. **Performance**: Monitor page load times

## 🚨 Important Notes

1. **Replace Ad Slots**: Update all placeholder ad slot IDs with your actual Google AdSense ad unit IDs
2. **Publisher ID**: Replace `YOUR_PUBLISHER_ID` with your actual Google AdSense publisher ID
3. **Testing**: Test ads in development mode before going live
4. **Compliance**: Ensure ads comply with Google AdSense policies
5. **User Experience**: Monitor user feedback and adjust ad placement accordingly

## 📞 Support

For questions about the ad system or customization needs, refer to:
- Google AdSense documentation
- Your ad network's guidelines
- User experience best practices 