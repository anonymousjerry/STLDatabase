"use client";

import React from 'react';
import AdPositionManager, { AdPositionType } from './AdPositionManager';

// Example Homepage with ads
export const HomepageWithAds: React.FC = () => {
  const homepageAdPositions: AdPositionType[] = [
    'homepage-header-banner',
    'homepage-mid-content-banner',
    'homepage-sidebar-right'
  ];

  return (
    <div className="homepage-layout">
      {/* Header */}
      <header>
        {/* Your existing header content */}
      </header>

      {/* Header Banner Ad */}
      <AdPositionManager 
        page="homepage" 
        positions={['homepage-header-banner']} 
      />

      {/* Top Categories Section */}
      <section className="top-categories">
        {/* Your categories content */}
      </section>

      {/* Featured Sites Section */}
      <section className="featured-sites">
        {/* Your featured sites content */}
      </section>

      {/* Mid-Content Banner Ad */}
      <AdPositionManager 
        page="homepage" 
        positions={['homepage-mid-content-banner']} 
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Content */}
        <div className="lg:col-span-3">
          {/* Trending Models */}
          <section className="trending-models">
            {/* Your trending models content */}
          </section>

          {/* Daily Discover */}
          <section className="daily-discover">
            {/* Your daily discover content */}
          </section>
        </div>

        {/* Right Sidebar with Ad */}
        <div className="lg:col-span-1">
          <AdPositionManager 
            page="homepage" 
            positions={['homepage-sidebar-right']} 
          />
        </div>
      </div>

      {/* Footer Banner Ad */}
      <AdPositionManager 
        page="homepage" 
        positions={['homepage-footer-banner']} 
      />

      {/* Footer */}
      <footer>
        {/* Your existing footer content */}
      </footer>
    </div>
  );
};

// Example Detail Page with ads
export const DetailPageWithAds: React.FC = () => {
  return (
    <div className="detail-page-layout">
      {/* Header */}
      <header>
        {/* Your existing header content */}
      </header>

      {/* Header Banner Ad */}
      <AdPositionManager 
        page="detail" 
        positions={['detail-header-banner']} 
      />

      {/* Model Title and Details */}
      <section className="model-details">
        {/* Your model details content */}
      </section>

      {/* Mid-Content Banner Ad */}
      <AdPositionManager 
        page="detail" 
        positions={['detail-mid-content-banner']} 
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Content */}
        <div className="lg:col-span-3">
          {/* Similar Design Section */}
          <section className="similar-designs">
            {/* Your similar designs content */}
          </section>
        </div>

        {/* Right Sidebar with Ad */}
        <div className="lg:col-span-1">
          <AdPositionManager 
            page="detail" 
            positions={['detail-sidebar-right']} 
          />
        </div>
      </div>
    </div>
  );
};

// Example Explore Page with ads
export const ExplorePageWithAds: React.FC = () => {
  return (
    <div className="explore-page-layout">
      {/* Header */}
      <header>
        {/* Your existing header content */}
      </header>

      {/* Header Banner Ad */}
      <AdPositionManager 
        page="explore" 
        positions={['explore-header-banner']} 
      />

      {/* Search Filters */}
      <section className="search-filters">
        {/* Your search filters content */}
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar (if expanded) */}
        <div className="lg:col-span-1">
          <AdPositionManager 
            page="explore" 
            positions={['explore-sidebar-left']} 
          />
        </div>

        {/* Center Content */}
        <div className="lg:col-span-2">
          {/* First Row of Model Listings */}
          <section className="model-listings-row-1">
            {/* Your first row of model listings */}
          </section>

          {/* Mid-Content Banner Ad */}
          <AdPositionManager 
            page="explore" 
            positions={['explore-mid-content-banner']} 
          />

          {/* Second Row of Model Listings */}
          <section className="model-listings-row-2">
            {/* Your second row of model listings */}
          </section>
        </div>

        {/* Right Sidebar with Ad */}
        <div className="lg:col-span-1">
          <AdPositionManager 
            page="explore" 
            positions={['explore-sidebar-right']} 
          />
        </div>
      </div>
    </div>
  );
};

// Example of integrating sponsored models into existing model grids
export const ModelGridWithSponsoredAds: React.FC = () => {
  const models = [
    // Your regular models
    { id: '1', title: 'Model 1', /* ... */ },
    { id: '2', title: 'Model 2', /* ... */ },
    { id: '3', title: 'Model 3', /* ... */ },
    { id: '4', title: 'Model 4', /* ... */ },
    { id: '5', title: 'Model 5', /* ... */ },
    { id: '6', title: 'Model 6', /* ... */ },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {models.map((model, index) => (
        <React.Fragment key={model.id}>
          {/* Regular Model Item */}
          <ModelItem model={model} />
          
          {/* Insert sponsored ad every 5 models */}
          {index > 0 && (index + 1) % 5 === 0 && (
            <AdPositionManager 
              page="homepage" 
              positions={['homepage-sponsored-models']} 
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

// Example ModelItem component (placeholder)
const ModelItem: React.FC<{ model: any }> = ({ model }) => {
  return (
    <div className="model-item">
      {/* Your existing model item content */}
      <h3>{model.title}</h3>
    </div>
  );
}; 