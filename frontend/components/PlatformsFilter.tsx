"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getPlatforms } from "@/lib/platformApi";
import { useSearch } from "@/context/SearchContext";
import { useSession } from "next-auth/react";
import LoadingOverlay from "./LoadingOverlay";


const PlatformsFilter = () => {
    const router = useRouter();
    const [platforms, setPlatforms] = useState<string[][]>([]);
    const [loading, setLoading] = useState(true); // <-- loading state
    // const { data: session, status } = useSession();
    // const userId = (session?.user as { id?: string })?.id;

    useEffect(() => {
      setLoading(true);
      getPlatforms().then(setPlatforms).catch(console.error).finally(() => setLoading(false));
    }, []);

    const {
          selectedPlatform,
          selectedCategory,
          selectedSubCategory,
          searchInput,
          searchPrice,
          liked,
          userId,
          setSelectedPlatform,
      } = useSearch();


    const platformArray = platforms?.map(([platform]) => platform) || [];

    const handleRadioChange = (option: string) => {


        setSelectedPlatform(option);

        const queryParams = new URLSearchParams();


        queryParams.set("sourcesite", option);
        if (selectedCategory && selectedCategory !== "All")
          queryParams.set("category", selectedCategory);
        if (selectedSubCategory?.id)
          queryParams.set("subCategory", selectedSubCategory.id);
        if (searchInput) queryParams.set("key", searchInput);
        if (searchPrice) queryParams.set("price", searchPrice);
        if (liked) queryParams.set("liked", 'true');
        if (userId) {
          queryParams.set("userId", userId)
        }
        queryParams.set("currentPage", "1")


        router.push(`/explore?${queryParams.toString()}`);
    };

  return (
    <div className="ml-2 mt-1 space-y-2 relative">
      <LoadingOverlay show = {loading} size = {18} />
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
