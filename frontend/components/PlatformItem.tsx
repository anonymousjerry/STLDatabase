"use client"

import React, { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useSearch } from "@/context/SearchContext";

interface PlatformItemProps {
  children: ReactNode;
  title: string;
}

const PlatformItem = ({ title, children }: PlatformItemProps) => {
  const { setSelectedPlatform } = useSearch();
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSelectedPlatform(title);

    const queryParams = new URLSearchParams();
    if (title && title !== "All") {
      queryParams.set("sourcesite", title);
    }
    router.push(`/explore?${queryParams.toString()}`);
  };

  return (
  <div
    onClick={handleSearch}
    className="flex flex-col items-center gap-3 cursor-pointer select-none"
    role="button"
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        handleSearch(e);
      }
    }}
    aria-label={`Select platform ${title}`}
  >
    <div
      className="
        relative w-full aspect-square
        overflow-hidden rounded-xl
        transition-transform duration-300 ease-in-out
        hover:scale-105
      "
    >
      {children}
    </div>
    <div
      className="
        font-semibold text-lg text-center text-black truncate dark:text-custom-dark-textcolor
        transition-transform duration-200 ease-in-out
        hover:text-blue-600 dark:hover:text-blue-400 hover:scale-105
      "
    >
      {title}
    </div>
  </div>
);

};

export default PlatformItem;
