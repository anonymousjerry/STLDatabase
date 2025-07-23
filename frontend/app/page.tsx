import Categories from "@/components/Categories";
import FeaturedSite from "@/components/FeaturedSite";
import HeaderMain from "@/components/HeaderMain";
import TrendingModels from "@/components/TrendingModels";
import DailyDiscover from "@/components/DailyDiscover";
import ProductsSection from "@/components/ProductsSection";

export default function Home() {
  return (
    <>
      <HeaderMain />
      <Categories />
      <FeaturedSite />
      <TrendingModels />
      <DailyDiscover />
      <ProductsSection />
    </>
  );
}
