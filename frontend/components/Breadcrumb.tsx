"use client"
import Link from "next/link";
import React from "react";
import { useSearch } from "@/context/SearchContext";
import { useRouter } from "next/navigation";

type BreadcrumbProps = {
  category: string;
  subCategory: SubCategory;
  title: string;
};

const Breadcrumb = ({ category, subCategory, title }: BreadcrumbProps) => {
  const {searchInput, selectedPlatform, searchTag, liked, searchPrice, setSelectedCategory, setSelectedSubCategory} = useSearch();
  const router = useRouter();

  const handleCategory = (category: string) => {
    setSelectedCategory(category);
    setSelectedSubCategory({name: "", id: ""});

    const queryParams = new URLSearchParams();
    
    if (searchInput) queryParams.set("key", '');
    if (selectedPlatform && selectedPlatform !== "All")
      queryParams.set("sourcesite", selectedPlatform);
    if (searchPrice) queryParams.set("price", searchPrice);
    if (liked) queryParams.set("liked", 'true');
    if (searchTag) queryParams.set("tag", searchTag);
    queryParams.set("currentPage", '1');

    router.push(`/explore?${queryParams.toString()}`);
  }

  const handleSubCategory = (subCategory: SubCategory) => {
    setSelectedSubCategory(subCategory);
    setSelectedCategory("All");

    const queryParams = new URLSearchParams();
    
    if (searchInput) queryParams.set("key", '');
    if (selectedPlatform && selectedPlatform !== "All")
      queryParams.set("sourcesite", selectedPlatform);
    if (searchPrice) queryParams.set("price", searchPrice);
    if (liked) queryParams.set("liked", "true");
    if (searchTag) queryParams.set("tag", searchTag);
    queryParams.set("currentPage", '1');

    router.push(`/explore?${queryParams.toString()}`);
  }
  return (
    <div className="text-lg font-normal max-sm:text-base text-custom-light-textcolor dark:text-custom-dark-textcolor overflow-hidden p-4 border-b border-gray-200 dark:border-gray-700">
      <ul className="flex items-center gap-2 whitespace-nowrap overflow-hidden text-ellipsis">
        <li className="flex items-center gap-2">
          <Link
            href="/"
            className="hover:underline hover:text-blue-600 dark:hover:text-blue-400"
          >
            STLDatase.com
          </Link>
          {(category || subCategory.name || title) && (
            <span className="text-gray-400">›</span>
          )}
        </li>

        {category && (
          <li className="flex items-center gap-2">
            <div
              onClick={() => {handleCategory(category)}}
              className="hover:underline hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
            >
              {category.replace(/-/g, " ")}
            </div>
            {(subCategory.name || title) && <span className="text-gray-400">›</span>}
          </li>
        )}

        {subCategory.name && (
          <li className="flex items-center gap-2">
            <div
              onClick={() => handleSubCategory(subCategory)}
              className="hover:underline hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
            >
              {subCategory.name.replace(/-/g, " ")}
            </div>
            {title && <span className="text-gray-400">›</span>}
          </li>
        )}

        {title && (
          <li
            className="truncate overflow-hidden text-ellipsis"
            title={title.replace(/-/g, " ")}
          >
            {title.replace(/-/g, " ")}
          </li>
        )}
      </ul>
    </div>
  );
};

export default Breadcrumb;
