"use client";

import React, { useEffect, useState } from "react";
import { getAllCategories } from "@/lib/categoryApi";
import { useSearch } from "@/context/SearchContext";
import { useRouter } from "next/navigation";
import LoadingOverlay from "./LoadingOverlay";

interface CategoryMenuProps {
  setCategoryOpen: (open: boolean) => void;
}

const CategoryMenu = ({ setCategoryOpen }: CategoryMenuProps) => {
  const [groupedCategories, setGroupedCategories] = useState<GroupedCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
      .finally(() => setLoading(false));
  }, []);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setSelectedSubCategory({id: "", name: ""});
    setCategoryOpen(false);

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
    setCategoryOpen(false);

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
    <div
      className="absolute left-1/2 top-full mt-2 transform -translate-x-1/2
        bg-white dark:bg-gray-900 
        border dark:border-gray-700 
        rounded shadow-lg z-50 
        min-w-[700px] max-h-[300px] overflow-y-auto"
    >
      <LoadingOverlay show={loading} size={20} />
      <div className="grid grid-cols-3 gap-6 p-6">
        {groupedCategories.map(({ group, items, icon }) => (
          <div key={group}>
            <h3
              className="flex items-center gap-2 font-bold text-lg mb-3 
                text-custom-light-maincolor dark:text-white cursor-pointer hover:underline"
              onClick={() => handleCategorySelect(group)}
            >
              {icon && (
                <img
                  src={icon}
                  alt={group}
                  className="w-6 h-6 object-contain"
                />
              )}
              {group}
            </h3>
            <ul
              className="space-y-1 text-base font-normal 
                text-custom-light-maincolor dark:text-custom-dark-textcolor"
            >
              {items.map((item) => (
                <li
                  key={item.id}
                  className="hover:text-green-600 dark:hover:text-green-400 
                    cursor-pointer transition-colors"
                  onClick={() => handleSubcategorySelect(item)}
                >
                  {item.name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryMenu;
