"use client";

// import { useSearch } from '@/context/SearchContext';
import React, { useRef, useState } from 'react';

const SearchInput = ({ value, onChange }: { value: string; onChange: (val: string) => void;}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col w-full"> 
      
      <label className="text-custom-light-textcolor font-semibold text-lg text-left self-stretch dark:text-custom-dark-textcolor">
        3D STL models
      </label>

      <div
        className="
          w-full h-12 flex justify-between items-center
          border-[#4e4d80] bg-white border rounded-xl px-4 py-3
          text-gray-800 text-base font-medium shadow-sm
          hover:border-blue-500
          focus:outline-none focus:ring-2 focus-within:ring-2 focus:ring-blue-300
          transition-all duration-150

          dark:bg-gray-800 dark:text-gray-200
          dark:border-gray-600
          dark:hover:border-blue-400
          dark:focus:ring-blue-600
        "
        onClick={() => inputRef.current?.focus()}
      >
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search..."
          className="w-full bg-transparent border-none outline-none focus:ring-0 text-base dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500"
        />
      </div>
    </div>

  );
};

export default SearchInput;
