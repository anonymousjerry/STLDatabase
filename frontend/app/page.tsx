import Categories from "@/components/Categories";
import FeaturedSite from "@/components/FeaturedSite";
import HeaderMain from "@/components/HeaderMain";
import TrendingModels from "@/components/TrendingModels";
// import { ProductsSection } from "@/components";

export default function Home() {
  return (
    <>
      <HeaderMain />
      <Categories />
      <FeaturedSite />
      <TrendingModels />
      {/* <ProductsSection /> */}
    </>
  );
}
