"use client"

import React from "react";
import { useSearch } from "@/context/SearchContext";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const LikeFilter = () => {
  const router = useRouter();
  const {
    searchInput,
    selectedPlatform,
    selectedCategory,
    selectedSubCategory,
    searchPrice,
    liked,
    setliked,
    setUserId
  } = useSearch();
  const { data: session, status } = useSession();
  const userId = (session?.user as { id?: string })?.id;
  const isDisabled = status !== "authenticated";

  const handleCheckboxChange = (checked: boolean) => {
    if (isDisabled || !userId) return;
    setliked(checked);
    setUserId(userId);

    const queryParams = new URLSearchParams();

    if (searchInput) queryParams.set("key", searchInput);
    if (selectedPlatform && selectedPlatform !== "All")
      queryParams.set("sourcesite", selectedPlatform);
    if (selectedCategory && selectedCategory !== "All")
      queryParams.set("category", selectedCategory);
    if (selectedSubCategory?.id)
      queryParams.set("subCategory", selectedSubCategory.id);
    if (searchPrice && searchPrice !== "All")
      queryParams.set("price", searchPrice);
    if (checked) {
      queryParams.set("liked", "true");
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
        checked={liked}
        onChange={(e) => handleCheckboxChange(e.target.checked)}
        className="w-4 h-4 accent-red-600 dark:accent-red-400"
      />
      <span>liked Models</span>
    </label>
  );
};

export default LikeFilter;
