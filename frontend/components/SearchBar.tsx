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
  const [categoryValue, setCategoryValue] = useState("All");
  // const { data: session, status } = useSession();
  // const userId = (session?.user as { id?: string })?.id;
  

  const {
    selectedPlatform,
    selectedCategory,
    selectedSubCategory,
    searchInput,
    searchTag,
    searchPrice,
    liked,
    userId,
    setSelectedPlatform,
    setSelectedCategory,
    setSelectedSubCategory,
    setSearchInput,
    setSearchTag,
    setSearchPrice,
    setliked,
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
    if (selectedSubCategory?.id) {
      setCategoryLabel("SubCategory");
      setCategoryValue(selectedSubCategory.name)
    } else if (selectedCategory && selectedCategory !== "All") {
      setCategoryLabel("Category");
      setCategoryValue(selectedCategory)
    } else {
      setCategoryLabel("Category");
      setCategoryValue("All") // fallback
    }
      
  }, []);

  useEffect(() => {
    if (selectedSubCategory?.id) {
      setCategoryLabel("SubCategory");
      // If we have the ID but not the name, try to find the name from groupedCategories
      if (selectedSubCategory.name === selectedSubCategory.id) {
        // This means we only have the ID, try to find the name
        for (const category of groupedCategories) {
          const foundSub = category.items.find(sub => sub.id === selectedSubCategory.id);
          if (foundSub) {
            setCategoryValue(foundSub.name);
            return;
          }
        }
      }
      setCategoryValue(selectedSubCategory.name)
    } else if (selectedCategory && selectedCategory !== "All") {
      setCategoryLabel("Category");
      setCategoryValue(selectedCategory)
    } else {
      setCategoryLabel("Category");
      setCategoryValue("All") // fallback
    }
  }, [selectedCategory, selectedSubCategory?.id, selectedSubCategory?.name, groupedCategories]);

  const platformArray = platforms?.map(([platform]) => platform) || [];

  const performSearch = () => {
    // Only search if input has minimum length or if clearing search
    if (searchInput.trim().length < 2 && searchInput.trim().length > 0) {
      return;
    }

    const queryParams = new URLSearchParams();

    if (selectedPlatform && selectedPlatform !== "All")
      queryParams.set("sourcesite", selectedPlatform);
    if (selectedCategory && selectedCategory !== "All")
      queryParams.set("category", selectedCategory);
    if (selectedSubCategory && selectedSubCategory.id)
      queryParams.set("subCategory", selectedSubCategory.id);
    if (searchInput.trim()) queryParams.set("key", searchInput.trim());
    if (searchPrice) queryParams.set("price", searchPrice);
    if (liked) queryParams.set("liked", 'true');
    if (userId) {
      queryParams.set("userId", userId)
    }
    queryParams.set("currentPage", '1');
    
    router.push(`/explore?${queryParams.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch();
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
      className="flex w-full flex-col md:flex-row gap-3 md:gap-2.5 bg-custom-light-containercolor dark:bg-gray-900 rounded-lg px-3 sm:px-4 md:px-[47px] py-3 md:py-[39px]"
      onSubmit={handleSearch}
    >
      <div className="w-full md:basis-1/5">
        <DropdownButton
          value={selectedPlatform}
          label="Platform"
          list={platformArray}
          onSelect={(value) => setSelectedPlatform(value)}
        />
      </div>

      <div className="w-full md:basis-1/5">
        <CategoryTreeDropdown
          value={categoryValue}
          label={categoryLable}
          categories={groupedCategories}
          onSelect={handleCategorySelect}
          onSubCategorySelect={handleSubCategorySelect}
        />
      </div>

             <div className="w-full md:basis-3/5 flex flex-col md:flex-row gap-2">
         <div className="w-full md:basis-4/5">
                       <SearchInput 
              value={searchInput} 
              onChange={setSearchInput}
              onSearch={performSearch}
              placeholder="Search 3D models..."
              showSearchButton={true}
            />
         </div>
         <button
           type="submit"
           aria-label="Search models"
           className="bg-[#4e4d80] dark:bg-[#3a3a60] rounded-xl w-full md:w-auto md:basis-1/5 pr-2.5 pl-2.5 md:mt-7 flex flex-row gap-2 items-center justify-center h-12 relative hover:bg-[#3d3c66] dark:hover:bg-[#2e2e4a] transition"
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
