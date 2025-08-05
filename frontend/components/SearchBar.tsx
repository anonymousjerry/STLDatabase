"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DropdownButton from "./DropdownButton";
import SearchInput from "./SearchInput";
import { getSubCategories } from "@/lib/categoryApi";
import { getPlatforms } from "@/lib/platformApi";
import { useSearch } from "@/context/SearchContext";
import { useSession } from "next-auth/react";
import Image from "next/image";

type Category = {
  name: string;
  category: string;
};

const SearchBar = () => {
  const router = useRouter();

  const [platforms, setPlatforms] = useState<string[][]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  // const { data: session, status } = useSession();
  // const userId = (session?.user as { id?: string })?.id;
  

  const {
    selectedPlatform,
    selectedCategory,
    searchInput,
    searchPrice,
    favourited,
    userId,
    setSelectedPlatform,
    setSelectedCategory,
    setSearchInput,
    setSearchPrice,
    setfavourited,
    setUserId
  } = useSearch();

  useEffect(() => {
    getPlatforms().then(setPlatforms).catch(console.error);
    getSubCategories()
    .then((data) => {
      const namesOnly = data.map((item: Category) => item.name);
      setCategories(namesOnly);
    })
    .catch(console.error);
  }, []);

  const platformArray = platforms?.map(([platform]) => platform) || [];
  const categoriesArray = categories || [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const queryParams = new URLSearchParams();

    if (selectedPlatform && selectedPlatform !== "All")
      queryParams.set("sourcesite", selectedPlatform);
    if (selectedCategory && selectedCategory !== "All")
      queryParams.set("category", selectedCategory);
    if (searchInput) queryParams.set("key", searchInput);
    if (searchPrice) queryParams.set("price", searchPrice);
    if (favourited) queryParams.set("favourited", 'true');
    if (userId) {
      queryParams.set("userId", userId)
    }
    queryParams.set("currentPage", '1');
    

    router.push(`/explore?${queryParams.toString()}`);
  };

  return (
    <form
      className="flex w-full gap-2.5 bg-custom-light-containercolor dark:bg-gray-900 rounded-lg px-[47px] py-[39px]"
      onSubmit={handleSearch}
    >
      <div className="basis-1/5">
        <DropdownButton
          value={selectedPlatform}
          label="Platform"
          list={platformArray}
          onSelect={(value) => setSelectedPlatform(value)}
        />
      </div>

      <div className="basis-1/5">
        <DropdownButton
          value={selectedCategory}
          label="Categories"
          list={categoriesArray}
          onSelect={setSelectedCategory}
        />
      </div>

      <div className="basis-3/5 flex gap-2">
        <div className="basis-4/5">
          <SearchInput value={searchInput} onChange={setSearchInput} />
        </div>
        <button
          type="submit"
          aria-label="Search models"
          className="bg-[#4e4d80] dark:bg-[#3a3a60] rounded-xl basis-1/5 pr-2.5 pl-2.5 mt-7 flex flex-row gap-2 items-center justify-center shrink-0 h-12 relative hover:bg-[#3d3c66] dark:hover:bg-[#2e2e4a] transition"
        >
          <div className="text-white font-[Inter-Medium] text-lg font-medium text-left relative select-none">
            Search
          </div>
          <Image
            className="shrink-0 relative overflow-visible"
            src="/search.png"
            alt="search icon"
            width={24}
            height={24}
            draggable={false}
          />
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
