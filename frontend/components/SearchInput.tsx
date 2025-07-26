"use client";

import React, { useRef } from 'react';

const SearchInput = ({ value, onChange }: { value: string; onChange: (val: string) => void }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col w-full ">
      <label className="text-custom-light-textcolor font-semibold text-lg text-left self-stretch">3D STL models</label>

      <div
        className="w-full h-12 flex justify-between items-center border-[#4e4d80] bg-white border rounded-xl px-4 py-3 text-gray-800 text-base font-medium shadow-sm hover:border-blue-500 focus:outline-none focus:ring-2  focus-within:ring-2 focus:ring-blue-300 transition-all duration-150"
        onClick={() => inputRef.current?.focus()}
      >
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search..."
          className="w-full bg-transparent border-none outline-none focus:ring-0 text-base"
        />
      </div>
    </div>
  );
};

export default SearchInput;
