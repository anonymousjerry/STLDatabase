"use client";

import { useSearch } from "@/context/SearchContext";
import { useRouter } from "next/navigation";
import React, { type ReactNode } from "react";

interface CategoryItemProps {
  children: ReactNode;
  title: string;
  className?: string;
}

const CategoryItem = ({ title, children, className = "" }: CategoryItemProps) => {
  const { setSelectedCategory } = useSearch();
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSelectedCategory(title);

    const queryParams = new URLSearchParams();
    if (title && title !== "All") {
      queryParams.set("category", title);
    }

    router.push(`/explore?${queryParams.toString()}`);
  };

  return (
    <div
      onClick={handleSearch}
      role="button"
      title={title}
      className={`
        group cursor-pointer transition-all duration-200 ease-in-out
        flex flex-col items-center justify-center text-center
        aspect-square w-full h-[140px] sm:h-[160px] px-2 py-3 gap-2
        border border-[#C8C8C833] bg-custom-light-containercolor dark:bg-custom-dark-containercolor text-black
        hover:rounded-2xl hover:border-[#b6e400] hover:shadow-[0_0_16px_rgba(0,0,0,0.32)]
        ${className}
      `}
    >
      <div className="flex items-center justify-center">{children}</div>
      <div
        className="text-xs sm:text-xs font-medium leading-tight
          text-custom-light-textcolor dark:text-custom-dark-textcolor
          line-clamp-2"
      >
        {title}
      </div>
    </div>
  );
};

export default CategoryItem;