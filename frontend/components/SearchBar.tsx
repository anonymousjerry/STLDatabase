"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DropdownButton from "./DropdownButton";
import CategoryTreeDropdown from "./CategoryTreeDropdown";
import SearchInput from "./SearchInput";
import { getAllCategories } from "@/lib/categoryApi";
import { getPlatforms } from "@/lib/platformApi";
import { useSearch } from "@/context/SearchContext";
import { IoIosSearch } from "react-icons/io";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { set } from "zod";

const SearchBar = () => {
  const router = useRouter();

  const [platforms, setPlatforms] = useState<string[][]>([]);
  const [groupedCategories, setGroupedCategories] = useState<GroupedCategory[]>([]);
  const [categoryLable, setCategoryLabel] = useState('Category');
  // const { data: session, status } = useSession();
  // const userId = (session?.user as { id?: string })?.id;
  

  const {
    selectedPlatform,
    selectedCategory,
    selectedSubCategory,
    searchInput,
    searchTag,
    searchPrice,
    favourited,
    userId,
    setSelectedPlatform,
    setSelectedCategory,
    setSelectedSubCategory,
    setSearchInput,
    setSearchTag,
    setSearchPrice,
    setfavourited,
    setUserId
  } = useSearch();

  useEffect(() => {
    getPlatforms().then(setPlatforms).catch(console.error);
    getAllCategories()
      .then((data: any[]) => {
        // Map API response to GroupedCategory format
        const formatted: GroupedCategory[] = data.map((category) => ({
            group: category.name,
            items: category.subCategories.map((sub: any) => ({
                id: sub.id,
                name: sub.name,
            })),
            icon: category.SVGUrl,
        }));

        setGroupedCategories(formatted);
      })
      .catch(console.error)
    setSelectedSubCategory({id: "", name: ""})
  }, []);

  const platformArray = platforms?.map(([platform]) => platform) || [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const queryParams = new URLSearchParams();

    if (selectedPlatform && selectedPlatform !== "All")
      queryParams.set("sourcesite", selectedPlatform);
    if (selectedCategory && selectedCategory !== "All")
      queryParams.set("category", selectedCategory);
    if (selectedSubCategory && selectedSubCategory.id)
      queryParams.set("subCategory", selectedSubCategory.id);
    if (searchInput) queryParams.set("key", searchInput);
    if (searchPrice) queryParams.set("price", searchPrice);
    if (favourited) queryParams.set("favourited", 'true');
    if (userId) {
      queryParams.set("userId", userId)
    }
    queryParams.set("currentPage", '1');
    

    router.push(`/explore?${queryParams.toString()}`);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setSelectedSubCategory({id: "", name: ""}); 
    setCategoryLabel('Category');
  };

  const handleSubCategorySelect = (subCategory: SubCategory) => {
    setSelectedSubCategory(subCategory);
    setSelectedCategory("All");
    setCategoryLabel('SubCategory');
  };

  const getDisplayValue = () => {
    if (selectedSubCategory.id !== "") {
      return selectedSubCategory.name;
    }
    return selectedCategory;
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
        <CategoryTreeDropdown
          value={getDisplayValue()}
          label={categoryLable}
          categories={groupedCategories}
          onSelect={handleCategorySelect}
          onSubCategorySelect={handleSubCategorySelect}
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
          <div className="text-white text-lg font-medium text-left relative select-none">
            Search
          </div>
          <IoIosSearch size={24} color="white"/>
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
