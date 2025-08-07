"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSearch } from "@/context/SearchContext";
import { useSession } from "next-auth/react";
import { getSubCategories } from "@/lib/categoryApi";

type Category = {
  name: string;
  category: string;
};

type GroupedCategory = {
  group: string;
  items: string[];
};

const CategoriesFilter = () => {
  const router = useRouter();

  const [groupedCategories, setGroupedCategories] = useState<GroupedCategory[]>([]);
  const [openGroup, setOpenGroup] = useState<string | null>(null); // <-- only one open

  const {
    selectedPlatform,
    selectedCategory,
    searchInput,
    searchPrice,
    favourited,
    userId,
    setSelectedCategory,
  } = useSearch();

  useEffect(() => {
    getSubCategories()
      .then((data: Category[]) => {
        const grouped = data.reduce((acc, curr) => {
          if (!acc[curr.category]) acc[curr.category] = [];
          acc[curr.category].push(curr.name);
          return acc;
        }, {} as Record<string, string[]>);

        const formatted: GroupedCategory[] = Object.entries(grouped).map(([group, items]) => ({
          group,
          items,
        }));

        setGroupedCategories(formatted);
      })
      .catch(console.error);
  }, []);

  const handleSubcategorySelect = (subcategory: string) => {
    setSelectedCategory(subcategory);

    const queryParams = new URLSearchParams();
    queryParams.set("category", subcategory);
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

  const toggleGroup = (group: string) => {
    setOpenGroup((prev) => (prev === group ? null : group));
  };

  return (
    <div className="ml-2 mt-1 space-y-4">
      {groupedCategories.map(({ group, items }) => (
        <div key={group}>
          {/* Toggleable Category Heading */}
          <button
            onClick={() => toggleGroup(group)}
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
                  key={item}
                  className="flex items-center gap-2 text-custom-light-textcolor dark:text-custom-dark-textcolor"
                >
                  <input
                    type="radio"
                    name="subCategory"
                    value={item}
                    checked={selectedCategory === item}
                    onChange={() => handleSubcategorySelect(item)}
                    className="w-4 h-4 accent-blue-600 dark:accent-blue-400"
                  />
                  <span>{item}</span>
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
