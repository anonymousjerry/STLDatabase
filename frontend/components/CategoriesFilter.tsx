"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSearch } from "@/context/SearchContext";
import { useSession } from "next-auth/react";
import { getAllCategories } from "@/lib/categoryApi";
import LoadingOverlay from "./LoadingOverlay";


const CategoriesFilter = () => {
  const router = useRouter();

  const [groupedCategories, setGroupedCategories] = useState<GroupedCategory[]>([]);
  const [openGroup, setOpenGroup] = useState<string | null>(null); // <-- only one open
  const [loading, setLoading] = useState(true); // <-- loading state

  const {
    selectedPlatform,
    selectedCategory,
    selectedSubCategory,
    searchInput,
    searchPrice,
    favourited,
    userId,
    setSelectedCategory,
    setSelectedSubCategory
  } = useSearch();

  useEffect(() => {
    setLoading(true);
    getAllCategories()
      .then((data: any[]) => {
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
      .finally(() => setLoading(false));
  }, []);

  const handleCategorySelect = (category: string) => {
    setOpenGroup((prev) => (prev === category ? null : category));
    setSelectedCategory(category);
    setSelectedSubCategory({id: "", name: ""});

    const queryParams = new URLSearchParams();
    queryParams.set("category", category);
    if (selectedPlatform && selectedPlatform !== "All")
      queryParams.set("sourcesite", selectedPlatform);
    if (searchInput) queryParams.set("key", searchInput);
    if (searchPrice) queryParams.set("price", searchPrice);
    if (favourited) {
        queryParams.set("favourited", "true");    
    }
    if (userId) {
        queryParams.set("userId", userId)
    }

    router.push(`/explore?${queryParams.toString()}`);
  };

  const handleSubcategorySelect = (subcategory: {id: string, name: string}) => {
    setSelectedSubCategory(subcategory);
    setSelectedCategory("All");

    const queryParams = new URLSearchParams();
    queryParams.set("subCategory", subcategory.id);
    if (selectedPlatform && selectedPlatform !== "All")
      queryParams.set("sourcesite", selectedPlatform);
    if (searchInput) queryParams.set("key", searchInput);
    if (searchPrice) queryParams.set("price", searchPrice);
    if (favourited) {
        queryParams.set("favourited", "true");    
    }
    if (userId) {
        queryParams.set("userId", userId)
    }

    router.push(`/explore?${queryParams.toString()}`);
  };

  return (
    <div className="ml-2 mt-1 space-y-4 relative">
      <LoadingOverlay show = {loading} size = {18} />
      {groupedCategories.map(({ group, items }) => (
        <div key={group}>
          {/* Toggleable Category Heading */}
          <button
            onClick={() => handleCategorySelect(group)}
            className="flex items-center justify-between w-full text-left text-base font-semibold text-custom-light-textcolor dark:text-custom-dark-textcolor hover:opacity-80 transition"
          >
            <span>{group}</span>
            <span>{openGroup === group }</span>
          </button>

          {/* Conditionally Render Subcategories */}
          {openGroup === group && (
            <div className="space-y-2 ml-3 mt-2">
              {items.map((item) => (
                <label
                  key={item.id}
                  className="flex items-center gap-2 text-custom-light-textcolor dark:text-custom-dark-textcolor"
                >
                  <input
                    type="radio"
                    name="subCategory"
                    value={item.id}
                    checked={selectedSubCategory === item}
                    onChange={() => handleSubcategorySelect(item)}
                    className="w-4 h-4 accent-blue-600 dark:accent-blue-400"
                  />
                  <span>{item.name}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CategoriesFilter;
