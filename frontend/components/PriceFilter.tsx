"use client"

import React from "react";
import { useSearch } from "@/context/SearchContext";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";


const PriceArray = [
  { title: "Free", value: "free" },
  { title: "Premium", value: "premium"},
  { title: "Under $10", value: "under-10" },
  { title: "$10 - $25", value: "10-25" },
  { title: "$25 - $50", value: "25-50" },
  { title: "$50 - $100", value: "50-100" },
  { title: "Over $100", value: "over-100" },
];

const PriceFilter = () => {
    const router = useRouter();
    // const { data: session, status } = useSession();
    // const userId = (session?.user as { id?: string })?.id;

  const {
      selectedPlatform,
      selectedCategory,
      selectedSubCategory,
      searchInput,
      searchPrice,
      favourited,
      liked,
      userId,
      setSelectedPlatform,
      setSelectedCategory,
      setSearchInput,
      setSearchPrice,
      setfavourited,
      setliked
    } = useSearch();

  const handleRadioChange = (value: string) => {
        setSearchPrice(value);

        const queryParams = new URLSearchParams();

        if (selectedPlatform && selectedPlatform !== "All")
        queryParams.set("sourcesite", selectedPlatform);
        if (selectedCategory && selectedCategory !== "All")
          queryParams.set("category", selectedCategory);
        if (selectedSubCategory) queryParams.set("subCategory", selectedSubCategory.id);
        if (searchInput) queryParams.set("key", searchInput);
        if (value) queryParams.set("price", value);
        if (favourited) queryParams.set("favourited", 'true');
        if (liked) queryParams.set("liked", 'true');
        if (userId) {
          queryParams.set("userId", userId)
        }
        

        router.push(`/explore?${queryParams.toString()}`);
};

  return (
    <div className="ml-2 mt-1 space-y-2">
      {PriceArray.map(({ title, value }) => (
        <label
          key={value}
          className="flex items-center gap-2 font-normal text-lg text-custom-light-textcolor dark:text-custom-dark-textcolor"
        >
          <input
            type="radio"
            name="priceFilter"
            value={value}
            checked={searchPrice === value}
            onChange={() => handleRadioChange(value)}
            className="w-4 h-4 accent-blue-600 dark:accent-blue-400"
          />
          <span>{title}</span>
        </label>
      ))}
    </div>

  );
};

export default PriceFilter;
