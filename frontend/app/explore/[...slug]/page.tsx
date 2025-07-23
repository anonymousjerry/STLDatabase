export const dynamic = "force-dynamic";
export const revalidate = 0;

import {
  Breadcrumb,
} from "@/components";
import SearchBar from "@/components/SearchBar";
import { searchModelsByCategories } from "@/lib/modelsApi";
import React from "react";
import ModelItem from "@/components/ModelItem";

// improve readabillity of category text, for example category text "smart-watches" will be "smart watches"
const improveCategoryText = (text: string): string => {
  if (text.indexOf("-") !== -1) {
    let textArray = text.split("-");

    return textArray.join(" ");
  } else {
    return text;
  }
};

const ExplorePage = async (slug: any) => {
  const param = slug?.params?.slug[0]
  const results = await searchModelsByCategories(param);
  console.log(results)
  return (
    <div className="flex flex-col px-52 sm:px-10 xl:px-52 pb-60 bg-gray-100">
      {/* <div className=" max-w-screen-2xl mx-auto px-10 max-sm:px-5"> */}
        <Breadcrumb />
        <SearchBar />
        {/* <div className="grid grid-cols-[200px_1fr] gap-x-10 max-md:grid-cols-1 max-md:gap-y-5">
          <Filters />
          <div>
            <div className="flex justify-between items-center max-lg:flex-col max-lg:gap-y-5">
              <h2 className="text-2xl font-bold max-sm:text-xl max-[400px]:text-lg uppercase">
                {slug?.params?.slug && slug?.params?.slug[0]?.length > 0
                  ? improveCategoryText(slug?.params?.slug[0])
                  : "All products"}
              </h2>

              <SortBy />
            </div>
            <div className="divider"></div>
            <Products slug={slug} />
            <Pagination />
          </div>
        </div> */}
      {/* </div> */}
      <div className="pt-3">
        <h1 className="text-2xl mb-4">Results ({param}) - {results.length()} models</h1>
        {results.length === 0 ? (
            <p>No results found.</p>
        ) : (
            <div className="grid grid-cols-4 justify-between  gap-x-12  gap-y-8 max-xl:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1">
                {results.map((model: Model) => (
                    <ModelItem key={model.id} model={model} color="white" />
                ))}
            </div>
        )}
        </div>
    </div>
  );
};

export default ExplorePage;
