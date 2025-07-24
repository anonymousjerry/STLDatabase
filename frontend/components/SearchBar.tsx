"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DropdownButton from "./Dropdown";
import SearchInput from "./SearchInput";
import { getSubCategories } from "@/lib/categoryApi";
import { getPlatforms } from "@/lib/platformApi";
import { useSearch } from "@/context/SearchContext";

const SearchBar = () => {
  const router = useRouter();

  const [platforms, setPlatforms] = useState<string[][]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  const {
    selectedPlatform,
    selectedCategory,
    searchInput,
    setSelectedPlatform,
    setSelectedCategory,
    setSearchInput,
  } = useSearch();

  useEffect(() => {
    getPlatforms().then(setPlatforms).catch(console.error);
    getSubCategories().then(setCategories).catch(console.error);
  }, []);

  const platformArray = platforms.map(([platform]) => platform);

  // On form submit (search button clicked)
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search triggered:', {
      platform: selectedPlatform,
      category: selectedCategory,
      keyword: searchInput,
    });

    const queryParams = new URLSearchParams();

    if (selectedPlatform && selectedPlatform !== 'All')
      queryParams.set('sourcesite', selectedPlatform);
    if (selectedCategory && selectedCategory !== 'All')
      queryParams.set('category', selectedCategory);
    if (searchInput) queryParams.set('key', searchInput);

    router.push(`/explore?${queryParams.toString()}`);
  };

  return (
    <form
      className="flex w-full gap-2.5 bg-custom-light-containercolor rounded-lg px-[47px] py-[39px]"
      onSubmit={handleSearch}
    >
      <div className="basis-1/5">
        <DropdownButton
          initialContent={selectedPlatform}
          label="platform"
          list={platformArray}
          onSelect={(value) => setSelectedPlatform(value)}
        />
      </div>

      <div className="basis-1/5">
        <DropdownButton
          initialContent={selectedCategory}
          label="categories"
          list={categories}
          onSelect={setSelectedCategory}
        />
      </div>

      <div className="basis-3/5 flex  gap-2">
        <div className="basis-4/5">
          <SearchInput value={searchInput} onChange={setSearchInput} />
        </div>
        <button
          type="submit"
          // onClick={handleSearch}
          className="bg-[#4e4d80] rounded-xl basis-1/5 pr-2.5 pl-2.5 mt-7 flex flex-row gap-2 items-center justify-center shrink-0 h-12 relative hover:bg-[#3d3c66] transition"
        >
          <div className="text-white font-[Inter-Medium] text-lg font-medium text-left relative select-none">
            Search
          </div>
          <img
            className="shrink-0 w-6 h-6 relative overflow-visible"
            src="/search.png"
            alt="search icon"
            draggable={false}
          />
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
