"use client"

import React, { useRef } from 'react';

const SearchInput = ({ value, onChange }: { value: string; onChange: (val: string) => void }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col basis-full items-start justify-start shrink-0 relative">
      <div className="text-custom-light-textcolor font-semibold text-lg text-left self-stretch">
        3D STL models
      </div>
      <div
        className="bg-white rounded-xl border border-[#4e4d80] pt-3 pr-2.5 pb-3 pl-2.5 flex items-center h-12 w-full cursor-text
                   focus-within:border-green-600 focus-within:ring-1 focus-within:ring-green-600 transition"
        onClick={() => inputRef.current?.focus()}
      >
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search by keyword or tag"
          className="flex-grow bg-transparent border-none outline-none text-lg font-medium text-gray-700 dark:text-gray-200"
        />
      </div>
    </div>
  );
};

export default SearchInput;
