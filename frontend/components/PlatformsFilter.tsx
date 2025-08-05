"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getPlatforms } from "@/lib/platformApi";
import { useSearch } from "@/context/SearchContext";


const PlatformsFilter = () => {
  const router = useRouter();
  const [platforms, setPlatforms] = useState<string[][]>([]);

  useEffect(() => {
    getPlatforms().then(setPlatforms).catch(console.error);
  }, []);

  const {
        selectedPlatform,
        selectedCategory,
        searchInput,
        searchPrice,
        favorited,
        setSelectedPlatform,
    } = useSearch();


  const platformArray = platforms?.map(([platform]) => platform) || [];

    const handleRadioChange = (option: string) => {


        setSelectedPlatform(option);

        const queryParams = new URLSearchParams();


        queryParams.set("sourcesite", option);
        if (selectedCategory && selectedCategory !== "All")
        queryParams.set("category", selectedCategory);
        if (searchInput) queryParams.set("key", searchInput);
        if (searchPrice) queryParams.set("price", searchPrice);
        if (favorited) queryParams.set("favorited", 'true');
        queryParams.set("currentPage", "1")

        router.push(`/explore?${queryParams.toString()}`);
    };

  return (
    <div className="ml-2 mt-1 space-y-2">
      {platformArray.map((option) => (
        <label
          key={option}
          className="flex items-center gap-2 font-normal text-lg text-custom-light-textcolor dark:text-custom-dark-textcolor"
        >
          <input
            type="radio"
            name="Platforms"
            value={option}
            checked={selectedPlatform === option}
            onChange={() => handleRadioChange(option)}
            className="accent-blue-600 dark:accent-blue-400 w-4 h-4"
          />
          <span>{option}</span>
        </label>
      ))}
    </div>
  );
};

export default PlatformsFilter;
