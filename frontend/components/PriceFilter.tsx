import React, { useState, useEffect } from "react";
import { searchModels } from "@/lib/modelsApi";
import { useSearch } from "@/context/SearchContext";
import { useRouter } from "next/navigation";


const PriceArray = [
  { title: "Free", value: "Free" },
  { title: "Under $10", value: "10" },
  { title: "$10 - $25", value: "25" },
  { title: "$25 - $50", value: "50" },
  { title: "$50 - $100", value: "100" },
  { title: "Over $100", value: "Over100" },
];

const PriceFilter = () => {
    const router = useRouter();

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

  const handleRadioChange = (value: string) => {
        setSearchPrice(value);
        console.log(value)

        const queryParams = new URLSearchParams();

        if (selectedPlatform && selectedPlatform !== "All")
        queryParams.set("sourcesite", selectedPlatform);
        if (selectedCategory && selectedCategory !== "All")
        queryParams.set("category", selectedCategory);
        if (searchInput) queryParams.set("key", searchInput);
        if (value) queryParams.set("price", value);
        if (favorited) queryParams.set("favorited", 'true');
        

        router.push(`/explore?${queryParams.toString()}`);
};

  return (
    <div className="ml-2 mt-1 space-y-1">
      {PriceArray.map(({title, value}) => (
        <label key={value} className="flex items-center text-sm">
          <input
            type="radio"
            name="priceFilter"
            value={value}
            checked={searchPrice === value}
            onChange={() => handleRadioChange(value)}
            className="mr-2 accent-blue-600"
          />
          {title}
        </label>
      ))}
    </div>
  );
};

export default PriceFilter;
