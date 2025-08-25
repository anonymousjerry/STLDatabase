# Advertisement Components

This directory contains advertisement components designed to integrate seamlessly with the 3D Model Pro project's design system.

## Components Overview

### 1. BannerAd
A horizontal banner advertisement component with responsive sizing.

**Sizes:**
- **Header/Footer**: 90px height, rounded-2xl, mx-4 my-2
- **Content**: 90px height, rounded-3xl, mx-4 my-4  
- **Sidebar**: 250px height, rounded-3xl, mx-2 my-3

**Usage:**
```tsx
<BannerAd 
  position="content" 
  className="my-6"
  showFallback={true}
/>
```

### 2. SidebarAd
A vertical sidebar advertisement component with three size options.

**Sizes:**
- **Small**: 180px height, rounded-2xl, mx-2 my-2
- **Medium**: 250px height, rounded-3xl, mx-2 my-3 (default)
- **Large**: 400px height, rounded-3xl, mx-2 my-4

**Usage:**
```tsx
<SidebarAd 
  size="medium" 
  className="my-4"
  showFallback={true}
/>
```

### 3. SponsoredModelAd
A sponsored model card that matches the project's ModelItem styling.

**Features:**
- Matches ModelItem component styling
- Responsive design with proper spacing
- Orange sponsored badge
- Consistent with project's color scheme

**Usage:**
```tsx
<SponsoredModelAd 
  model={modelData}
  className="my-4"
  showBadge={true}
/>
```

### 4. GoogleAd
Base Google AdSense component with fallback support.

**Features:**
- Google AdSense integration
- Fallback content support
- Consistent styling with project theme
- Dark mode support

### 5. AdManager
Centralized ad management component for different pages.

**Supported Pages:**
- `home`: Header banner, sidebar, content banner
- `explore`: Sidebar, content banner
- `modelDetail`: Sidebar, sponsored model

**Usage:**
```tsx
<AdManager page="home" className="my-8" />
```

## Design System Integration

All ad components now use the project's custom color scheme:

- **Background**: `bg-custom-light-containercolor dark:bg-custom-dark-containercolor`
- **Text**: `text-custom-light-textcolor dark:text-custom-dark-textcolor`
- **Primary**: `text-custom-light-maincolor dark:text-custom-dark-maincolor`
- **Borders**: `border-gray-200 dark:border-gray-700`
- **Shadows**: `shadow-lg`

## Responsive Design

All components are fully responsive and adapt to different screen sizes:

- **Mobile**: Optimized spacing and sizing
- **Tablet**: Medium-sized components
- **Desktop**: Full-sized components with proper margins

## Ad Blocking Support

All components include fallback content when ad blockers are detected:

- Graceful degradation
- User-friendly messages
- Consistent styling with fallback content

## Best Practices

1. **Spacing**: Use consistent margins (`my-4`, `my-6`) for proper spacing
2. **Sizing**: Choose appropriate ad sizes for different positions
3. **Fallbacks**: Always provide fallback content for better UX
4. **Responsive**: Test on different screen sizes
5. **Performance**: Monitor ad loading performance

## File Structure

```
ads/
├── BannerAd.tsx          # Horizontal banner ads
├── SidebarAd.tsx         # Vertical sidebar ads  
├── SponsoredModelAd.tsx  # Sponsored model cards
├── GoogleAd.tsx          # Base Google AdSense component
├── AdManager.tsx         # Centralized ad management
├── AdPositionManager.tsx # Admin ad position management
├── index.ts             # Component exports
└── README.md            # This documentation
```

## Configuration

Update the following in your ad components:
- Replace `YOUR_PUBLISHER_ID` with your actual Google AdSense publisher ID
- Replace `YOUR_*_SLOT` placeholders with actual ad slot IDs
- Configure ad positions and sizes based on your layout needs 