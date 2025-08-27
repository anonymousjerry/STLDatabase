"use client";

import React, { useEffect, useState } from "react";
import { BiFilterAlt, BiCategory } from "react-icons/bi";
import { GoTriangleRight, GoTriangleDown } from "react-icons/go";
import PlatformsFilter from "./PlatformsFilter";
import CategoriesFilter from "./CategoriesFilter";
import PriceFilter from "./PriceFilter";
import FavoriteFilter from "./FavoriteFilter";
import LikeFilter from "./LikeFilter";
import { CgWebsite } from "react-icons/cg";
import { AiFillLike, AiOutlineDollarCircle } from "react-icons/ai";
import { MdFavoriteBorder } from "react-icons/md";
import { useSession } from "next-auth/react";
import { useSearch } from "@/context/SearchContext";

const SideFilter = () => {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const userId = (session?.user as { id?: string })?.id;
  const isEnabled = status === "authenticated";

  const {liked} = useSearch();

  useEffect(() => {
    if (liked) {
      setOpenSection("Liked Models");
    }
  }, [liked]);

  const toggleSection = (title: string) => {
    setOpenSection((prev) => (prev === title ? null : title));
  };

  // build filters dynamically
  const filters: string[] = ["Platforms", "Categories", "Price"];
  if (isEnabled) {
    filters.push("Saved Models", "Liked Models");
  }

  return (
    <aside className="flex flex-col w-full bg-white dark:bg-custom-dark-containercolor border rounded-lg shadow p-4 h-screen overflow-y-auto">
      <div className="flex items-center justify-center text-custom-light-textcolor dark:text-custom-dark-textcolor text-lg font-medium relative pt-2 gap-2">
        <BiFilterAlt />
        Search Filter
        <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-[#C8C8C8] rounded" />
      </div>

      <div className="flex flex-col gap-4 mt-6">
        {filters.map((title) => (
          <div key={title}>
            <button
              className="flex justify-between items-center w-full text-left font-medium text-lg text-custom-light-textcolor dark:text-custom-dark-textcolor"
              onClick={() => toggleSection(title)}
            >
              <span className="flex justify-center items-center gap-2">
                {title === "Platforms" && <CgWebsite />}
                {title === "Categories" && <BiCategory />}
                {title === "Price" && <AiOutlineDollarCircle />}
                {title === "Saved Models" && <MdFavoriteBorder />}
                {title === "Liked Models" && <AiFillLike />}
                {title}
              </span>
              <span>
                {openSection === title ? <GoTriangleDown /> : <GoTriangleRight />}
              </span>
            </button>

            {openSection === title && (
              <div className="mt-2 ml-1">
                {title === "Platforms" && <PlatformsFilter />}
                {title === "Categories" && <CategoriesFilter />}
                {title === "Price" && <PriceFilter />}
                {userId && title === "Saved Models" && <FavoriteFilter />}
                {userId && title === "Liked Models" && <LikeFilter />}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SideFilter;
