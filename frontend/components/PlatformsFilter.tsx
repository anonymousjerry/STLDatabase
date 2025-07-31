"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getPlatforms } from "@/lib/platformApi";
import { useSearch } from "@/context/SearchContext";

// type PlatformsFilterProps = {
//   searchParams: {
//     sourcesite?: string;
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
        setSelectedCategory,
        setSearchInput,
        setSearchPrice,
        setFavorited,
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

        router.push(`/explore?${queryParams.toString()}`);
    };

  return (
    <div className="ml-2 mt-1 space-y-1">
      {platformArray.map((option) => (
        <label key={option} className="flex items-center text-sm">
          <input
            type="radio"
            name="Platforms"
            value={option}
            checked={selectedPlatform === option}
            onChange={() => handleRadioChange(option)}
            className="mr-2 accent-blue-600"
          />
          {option}
        </label>
      ))}
    </div>
  );
};

export default PlatformsFilter;
