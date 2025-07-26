"use"

import Categories from "@/components/Categories";
import FeaturedSite from "@/components/FeaturedSite";
import HeaderMain from "@/components/HeaderMain";
import TrendingModels from "@/components/TrendingModels";
import DailyDiscover from "@/components/DailyDiscover";
import ProductsSection from "@/components/ProductsSection";
import { Header } from "@/components";
import { Footer } from "@/components";

export default function Home() {
  
  return (
    <>
      <Header />
      <HeaderMain />
      <Categories />
      <FeaturedSite />
      <TrendingModels />
      <DailyDiscover />
      <ProductsSection />
      <Footer />
    </>
  );
}
