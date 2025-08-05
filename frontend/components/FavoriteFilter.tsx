"use client"

import React from "react";
import { useSearch } from "@/context/SearchContext";
import { useRouter } from "next/navigation";

const FavoriteFilter = () => {
  const router = useRouter();
  const {
    searchInput,
    selectedPlatform,
    selectedCategory,
    searchPrice,
    favorited,
    setFavorited,
  } = useSearch();

  const handleCheckboxChange = (checked: boolean) => {
    setFavorited(checked);

    const queryParams = new URLSearchParams();

    if (searchInput) queryParams.set("key", searchInput);
    if (selectedPlatform && selectedPlatform !== "All")
      queryParams.set("sourcesite", selectedPlatform);
    if (selectedCategory && selectedCategory !== "All")
      queryParams.set("category", selectedCategory);
    if (searchPrice && searchPrice !== "All")
      queryParams.set("price", searchPrice);
    if (checked) queryParams.set("favorited", "true");

    router.push(`/explore?${queryParams.toString()}`);
  };

  return (
    <label className="flex items-center gap-2 mt-2 font-normal text-lg text-custom-light-textcolor dark:text-custom-dark-textcolor">
      <input
        type="checkbox"
        checked={favorited}
        onChange={(e) => handleCheckboxChange(e.target.checked)}
        className="w-4 h-4 accent-red-600 dark:accent-red-400"
      />
      <span>Favorited</span>
    </label>

  );
};

export default FavoriteFilter;
