"use client";

import React, { useRef, useState, useEffect } from 'react';
import { IoIosSearch } from "react-icons/io";

interface SearchInputProps {
  value: string;
  onChange: (val: string) => void;
  onSearch?: () => void;
  placeholder?: string;
  showSearchButton?: boolean;
}

const SearchInput = ({ 
  value, 
  onChange, 
  onSearch,
  placeholder = "Search 3D models...",
  showSearchButton = false
}: SearchInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && onSearch && value.trim().length >= 2) {
      onSearch();
    }
  };

  return (
    <div className="flex flex-col w-full"> 
      
      <label className="text-custom-light-textcolor font-semibold text-lg text-left self-stretch dark:text-custom-dark-textcolor">
        3D STL models
      </label>

      <div
        className={`
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
          ${isFocused ? 'ring-2 ring-blue-300 border-blue-500' : ''}
        `}
        onClick={() => inputRef.current?.focus()}
      >
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="w-full bg-transparent border-none outline-none focus:ring-0 text-base dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500"
        />
        
        {showSearchButton && (
          <button
            type="button"
            onClick={() => onSearch && value.trim().length >= 2 && onSearch()}
            className={`ml-2 p-1 transition-colors ${
              value.trim().length >= 2 
                ? 'text-blue-500 hover:text-blue-600' 
                : 'text-gray-400 cursor-not-allowed'
            }`}
            aria-label="Search"
            disabled={value.trim().length < 2}
          >
            <IoIosSearch size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchInput;
