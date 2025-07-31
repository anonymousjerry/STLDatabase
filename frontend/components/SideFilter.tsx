"use client";

import React, { useState } from "react";
import { BiFilterAlt } from "react-icons/bi";
import { GoTriangleRight, GoTriangleDown } from "react-icons/go";
import PlatformsFilter from "./PlatformsFilter";
import CategoriesFilter from "./CategoriesFilter";
import PriceFilter from "./PriceFilter";
import FavoriteFilter from "./FavoriteFilter";

const filters: string[] = ["Platforms", "Categories", "Price", "Favorited"];

// type SideFilterProps = {
//   searchParams: {
//     key?: string;
//     sourcesite?: string;
//     category?: string;
//     price?: string;
//     favorited?: boolean;
//   };
//   setSearchParams: React.Dispatch<
//     React.SetStateAction<{
//       key?: string;
//       sourcesite?: string;
//       category?: string;
//       price?: string;
//       favorited?: boolean;
//     }>
//   >;
// };

const SideFilter = () => {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({});

  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <aside className="flex flex-col w-full bg-white border rounded-lg shadow p-4">
      <div className="flex items-center justify-center text-custom-light-textcolor text-lg font-medium relative pt-2 gap-2">
        <BiFilterAlt />
        Search Filter
        <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-[#C8C8C8] rounded" />
      </div>

      <div className="flex flex-col gap-4 mt-6">
        {filters.map((title) => (
          <div key={title}>
            <button
              className="flex justify-between items-center w-full text-left font-medium text-lg text-custom-light-textcolor"
              onClick={() => toggleSection(title)}
            >
              <span>{title}</span>
              <span>
                {openSections[title] ? <GoTriangleDown /> : <GoTriangleRight />}
              </span>
            </button>

            {openSections[title] && (
              <div className="mt-2 ml-1">
                {title === "Platforms" && (
                  <PlatformsFilter />
                )}
                {title === "Categories" && (
                  <CategoriesFilter />
                )}
                {title === "Price" && (
                  <PriceFilter />
                )}
                {title === "Favorited" && (
                  <FavoriteFilter />
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SideFilter;

