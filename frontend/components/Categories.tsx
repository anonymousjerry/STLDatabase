"use client";

import React, { useEffect, useState } from "react";
import CategoryItem from "./CategoryItem";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { getSubCategories } from "@/lib/categoryApi";

export interface subCategoryListItem {
  id: number;
  title: string;
  src: string;
}

const Categories = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [subcategories, setSubCategories] = useState<subCategoryListItem[]>([]);
  const [columns, setColumns] = useState(2);

  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;
      if (width >= 1280) setColumns(9); // xl
      else if (width >= 1024) setColumns(6); // lg
      else if (width >= 768) setColumns(6); // md
      else if (width >= 640) setColumns(3); // sm
      else setColumns(2);
    }

    handleResize(); // Initial run
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  useEffect(() => {
    getSubCategories()
      .then((data: SubCategory[]) => {
        // Assuming backend already returns the correct shape
        const formatted = data.map((item, index) => ({
          id: index + 1,
          title: item.name,   // map name → subcategoryTitle
          src: item.iconUrl              // map iconUrl → src
        }));
        console.log(formatted)
        setSubCategories(formatted);
      })
      .catch(console.error);
  }, []);

  const itemsPerPage = 18;
  const totalPages = Math.ceil(subcategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = subcategories.slice(startIndex, endIndex);

  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [fadeKey, setFadeKey] = useState(0);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === currentPage) return;
    setDirection(newPage > currentPage ? "next" : "prev");
    setFadeKey((prev) => prev + 1);
    setCurrentPage(newPage);
  };

  return (
    <section
      className="pt-10 px-52 max-xl:px-30 max-lg:px-20 max-md:px-10 bg-custom-light-secondcolor dark:bg-custom-dark-secondcolor"
      aria-label="Top categories"
    >
      <div className="relative bg-custom-light-containercolor dark:bg-custom-dark-containercolor rounded-[32px] max-md:px-6">
        <h2 className="px-11 py-5 font-bold text-xl sm:text-2xl text-custom-light-titlecolor dark:text-custom-dark-titlecolor">
          TOP CATEGORIES
        </h2>

        <div
          key={fadeKey}
          className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-6 xl:grid-cols-9 
                     transition-all duration-500 ease-in-out 
            ${
              direction === "next"
                ? "animate-slide-in-left"
                : "animate-slide-in-right"
            }`}
        >
          {paginatedItems.map((item, index) => {
            // const columns = useTailwindColumns();
            const total = paginatedItems.length;
            const itemsInLastRow = total % columns || columns;
            const startOfLastRow = total - itemsInLastRow;

            const isBottomLeft = index === startOfLastRow;
            const isBottomRight = index === total - 1;

            let extraClass = "";
            if (isBottomLeft) extraClass += " rounded-bl-[32px]";
            if (isBottomRight) extraClass += " rounded-br-[32px]";

            return (
              <CategoryItem
                key={item.id}
                title={item.title}
                className={extraClass}
              >
                <Image src={item.src} width={120} height={95} alt={item.title} unoptimized/>
              </CategoryItem>
            );
          })}
        </div>

        {/* Pagination Arrows */}
        <button
          aria-label="Previous page"
          className={`
            absolute left-[-1rem] top-[59%] -translate-y-1/2 z-10
            bg-white shadow p-2 rounded-full border border-custom-light-maincolor
            disabled:opacity-50 disabled:cursor-not-allowed
            transition
            dark:bg-gray-800
            dark:border-gray-600
            dark:shadow-md
          `}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <FaChevronLeft size={20} className="text-custom-light-maincolor dark:text-gray-300" />
        </button>

        <button
          aria-label="Next page"
          className={`
            absolute right-[-1rem] top-[59%] -translate-y-1/2 z-10
            bg-white shadow p-2 rounded-full border border-custom-light-maincolor
            disabled:opacity-50 disabled:cursor-not-allowed
            transition
            dark:bg-gray-800
            dark:border-gray-600
            dark:shadow-md
          `}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <FaChevronRight size={20} className="text-custom-light-maincolor dark:text-gray-300" />
        </button>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center py-3">
        <div className="flex items-center gap-3">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              aria-label={`Go to page ${index + 1}`}
              onClick={() => handlePageChange(index + 1)}
              className={`w-3 h-3 rounded-full transition-colors
                ${
                  currentPage === index + 1
                    ? "bg-gray-800 dark:bg-white"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
