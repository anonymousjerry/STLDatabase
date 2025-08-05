"use client"

import React from "react";
import { useSearch } from "@/context/SearchContext";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const FavoriteFilter = () => {
  const router = useRouter();
  const {
    searchInput,
    selectedPlatform,
    selectedCategory,
    searchPrice,
    favourited,
    setfavourited,
    setUserId
  } = useSearch();
  const { data: session, status } = useSession();
  const userId = (session?.user as { id?: string })?.id;
  const isDisabled = status !== "authenticated";

  const handleCheckboxChange = (checked: boolean) => {
    if (isDisabled || !userId) return;
    setfavourited(checked);
    setUserId(userId);

    const queryParams = new URLSearchParams();

    if (searchInput) queryParams.set("key", searchInput);
    if (selectedPlatform && selectedPlatform !== "All")
      queryParams.set("sourcesite", selectedPlatform);
    if (selectedCategory && selectedCategory !== "All")
      queryParams.set("category", selectedCategory);
    if (searchPrice && searchPrice !== "All")
      queryParams.set("price", searchPrice);
    if (checked) {
      queryParams.set("favourited", "true");
      queryParams.set("userId", userId)
    }

    setTimeout(() => {
      router.push(`/explore?${queryParams.toString()}`);
    }, 0);
  };

  return (
    <label className="flex items-center gap-2 mt-2 font-normal text-lg text-custom-light-textcolor dark:text-custom-dark-textcolor">
      <input
        type="checkbox"
        checked={favourited}
        onChange={(e) => handleCheckboxChange(e.target.checked)}
        disabled={isDisabled}
        className="w-4 h-4 accent-red-600 dark:accent-red-400"
      />
      <span>favourited</span>
    </label>

  );
};

export default FavoriteFilter;
