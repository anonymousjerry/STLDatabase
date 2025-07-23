"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DropdownButton from "./Dropdown";
import SearchInput from "./SearchInput";
import { getSubCategories } from "@/lib/categoryApi";
import { getPlatforms } from "@/lib/platformApi";

const SearchBar = () => {
  const router = useRouter();

  const [platforms, setPlatforms] = useState<string[][]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  const [selectedPlatform, setSelectedPlatform] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    getPlatforms().then(setPlatforms).catch(console.error);
    getSubCategories().then(setCategories).catch(console.error);
  }, []);

  const platformArray = platforms.map(([platform]) => platform);

  // Build query string and navigate
  // const sendSearchRequest = (keyword: string, platform: string, category: string) => {
  //   const params = new URLSearchParams();
  //   if (keyword.trim() !== "") params.set("q", keyword.trim());
  //   if (platform !== "All") params.set("platform", platform);
  //   if (category !== "All") params.set("category", category);

  //   router.push(`/explore?${params.toString()}`);
  // };

  // On form submit (search button clicked)
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("click search button")
    // sendSearchRequest(searchInput, selectedPlatform, selectedCategory);
  };

  return (
    <form
      className="flex w-full gap-2.5 bg-custom-light-containercolor rounded-lg px-[47px] py-[39px]"
      onSubmit={handleSearch}
    >
      <div className="basis-1/5">
        <DropdownButton
          initialContent="All"
          label="platform"
          list={platformArray}
          onSelect={setSelectedPlatform}
        />
      </div>

      <div className="basis-1/5">
        <DropdownButton
          initialContent="All"
          label="categories"
          list={categories}
          onSelect={setSelectedCategory}
        />
      </div>

      <div className="basis-3/5">
        <SearchInput value={searchInput} onChange={setSearchInput} />
      </div>
    </form>
  );
};

export default SearchBar;
