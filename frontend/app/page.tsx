
import Categories from "@/components/TopCategories";
import FeaturedSite from "@/components/FeaturedSite";
import HeaderMain from "@/components/HeaderMain";
import TrendingModels from "@/components/TrendingModels";
import DailyDiscover from "@/components/DailyDiscover";
import { Header } from "@/components";
import { Footer } from "@/components";
import AdPositionManager from "@/components/ads/AdPositionManager";

export default function Home() {
  
  return (
    <>
      <Header />
      <HeaderMain />
      {/* Homepage header banner ad */}
      <AdPositionManager
        page="homepage"
        positions={[
          'homepage-header-banner',
        ]}
        className="w-full flex justify-center items-center pt-10"
      />
      <Categories />
      <FeaturedSite />
      {/* Mid-content banner ad */}
      <AdPositionManager
        page="homepage"
        positions={[
          'homepage-mid-content-banner',
        ]}
        className="w-full flex justify-center items-center pt-10"
      />
      <TrendingModels />
      <DailyDiscover />
      {/* Footer banner ad (above footer) */}
      {/* <AdPositionManager
        page="homepage"
        positions={[
          'homepage-footer-banner',
        ]}
        className="container mx-auto px-4"
      /> */}
      <Footer />
    </>
  );
}
