import React from "react";
import { useSearch } from "@/context/SearchContext";
import { useRouter } from "next/navigation";


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
    <div className="ml-2 mt-1 space-y-2">
      {PriceArray.map(({ title, value }) => (
        <label
          key={value}
          className="flex items-center gap-2 text-sm text-gray-800 dark:text-gray-200"
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
