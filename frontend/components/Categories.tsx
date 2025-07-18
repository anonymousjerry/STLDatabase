// *********************
// Role of the component: Category wrapper that will contain title and category items
// Name of the component: CategoryMenu.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <CategoryMenu />
// Input parameters: no input parameters
// Output: section title and category items
// *********************
"use client"
import React from "react";
import CategoryItem from "./CategoryItem";
import Image from "next/image";
import { categoryMenuList } from "@/lib/utils";
import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

const Categories = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const itemsPerPage = 18;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = categoryMenuList.slice(startIndex, endIndex);
  const totalPages = Math.ceil(categoryMenuList.length / itemsPerPage);

  const [fadekey, setFadeKey] = useState(0);

  const handlePageChange = (newPage: number) => {
    setDirection(newPage > currentPage ? "next" : "prev");
    setFadeKey((prev) => prev + 1);
    setCurrentPage(newPage);
  }
  
  return (
    <div className="pt-10 px-32 sm:px-10 xl:px-32 bg-gray-100">
      <div className="flex flex-col relative bg-white rounded-[32px] overflow-visible pb-5">
        <div className="flex text-[#0e162e] px-11 py-5 text-center font-['Inter-Bold',_sans-serif] text-xl sm:text-2xl font-bold">
          TOP CATEGORIES
        </div>
          <div
            key={fadekey}
            // className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 xl:grid-cols-9
            //   transition-all duration-500 ease-in-out
            //   ${
            //     direction === "next"
            //       ? "animate-slide-in-left"
            //       : "animate-slide-in-right"
            //   }
            // `}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 xl:grid-cols-9"
          >
              {paginatedItems.map((item) => (
                <CategoryItem title={item.title} key={item.id} href={item.href}>
                  <Image src={item.src} width={120} height={95} alt={item.title} />
                </CategoryItem>
              ))}
          </div>
        <button
          className="absolute -right-4 right- top-[57%] -translate-y-1/2 z-10 bg-white shadow p-2 rounded-full"
          onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          <FaChevronRight size={20} className="text-gray-700" />
        </button>
        <button
          className="absolute -left-4 top-[57%] -translate-y-1/2 z-10 bg-white shadow p-2 rounded-full"
          onClick={() => handlePageChange(Math.min(currentPage - 1, totalPages))}
          disabled={currentPage === 1}
        >
          <FaChevronLeft size={20} className="text-gray-700" />
        </button>
      </div>
      <div className="flex justify-center py-3">
        <div className="flex items-center gap-3">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`w-3 h-3 rounded-full transition ${
                currentPage === index + 1 ? "bg-gray-800" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;
