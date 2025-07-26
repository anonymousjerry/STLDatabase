"use client";

import React, { useEffect, useState } from "react";
import CategoryItem from "./CategoryItem";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { getSubCategories } from "@/lib/categoryApi";
import { subCategoryList } from "@/utils/categoryFormat";

const Categories = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [subcategories, setSubCategories] = useState([]);
  
  useEffect(() => {
    getSubCategories()
      .then(setSubCategories)
      .catch(console.error);
  }, []);

  const categoryMenuList = subCategoryList(subcategories);

  const itemsPerPage = 18;
  const totalPages = Math.ceil(categoryMenuList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = categoryMenuList.slice(startIndex, endIndex);

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
      className="pt-10 px-6 sm:px-10 xl:px-52 bg-custom-light-secondcolor dark:bg-custom-dark-secondcolor"
      aria-label="Top categories"
    >
      <div className="relative bg-custom-light-containercolor rounded-[32px] max-md:px-6">
        <h2 className="px-11 py-5 text-center font-bold text-xl sm:text-2xl text-custom-light-titlecolor font-['Inter-Bold',_sans-serif]">
          TOP CATEGORIES
        </h2>

        <div
          key={fadeKey}
          className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-6 xl:grid-cols-9 grid-rounded-bottom
                     transition-all duration-500 ease-in-out
            ${
              direction === "next"
                ? "animate-slide-in-left"
                : "animate-slide-in-right"
            }`}
        >
          {paginatedItems.map((item, index) => (
            <CategoryItem
              key={item.id}
              title={item.title}
            >
              <Image src={item.src} width={120} height={95} alt={item.title} />
            </CategoryItem>
          ))}
        </div>

        {/* Pagination Arrows */}
        <button
          aria-label="Previous page"
          className={`absolute left-[-1rem] top-[59%] -translate-y-1/2 z-10
            bg-white shadow p-2 rounded-full border border-custom-light-maincolor
            disabled:opacity-50 disabled:cursor-not-allowed
            transition`}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <FaChevronLeft size={20} className="text-custom-light-maincolor" />
        </button>

        <button
          aria-label="Next page"
          className={`absolute right-[-1rem] top-[59%] -translate-y-1/2 z-10
            bg-white shadow p-2 rounded-full border border-custom-light-maincolor
            disabled:opacity-50 disabled:cursor-not-allowed
            transition`}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <FaChevronRight size={20} className="text-custom-light-maincolor" />
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
