'use client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const SearchInput = () => {
  const [searchInput, setSearchInput] = useState<string>('');
  const router = useRouter();

  const searchProducts = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchInput.trim() !== '') {
      router.push(`/search?search=${encodeURIComponent(searchInput)}`);
      setSearchInput('');
    }
  };

  return (
    <form
      onSubmit={searchProducts}
      className=" flex-row flex gap-2 items-center justify-start shrink-0"
      // style={{ maxWidth: '735px' }} // sum of 598 + 137 + gaps approx
    >
      {/* Left box with label and input placeholder */}
      <div className="flex flex-col basis-4/5 items-start justify-start shrink-0  relative ">
        <div
          className="text-custom-light-textcolor  font-semibold font-[Inter-SemiBold] text-lg text-left relative self-stretch "
        >
          3D STL models
        </div>
        <div
          className="bg-white  rounded-xl border border-[#4e4d80] pt-3 pr-2.5 pb-3 pl-2.5 flex items-center justify-start self-stretch shrink-0 h-12 relative cursor-text
                    focus-within:border-green-600 focus-within:ring-1 focus-within:ring-green-600 transition"
          onClick={() => {
            const input = document.getElementById('search-input');
            if (input) input.focus();
          }}
        >
          <input
            id="search-input"
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by keyword or tag"
            className="flex-grow bg-transparent border-none outline-none focus:border-none focus:ring-0 focus:outline-none text-lg font-medium font-[Inter-Medium] text-gray-700 dark:text-gray-200"
          />
        </div>
      </div>

      {/* Right box as submit button */}

      <button
        type="submit"
        className="bg-[#4e4d80] rounded-xl basis-1/5 pr-2.5 pl-2.5 mt-6 flex flex-row gap-2 items-center justify-center shrink-0  h-12 relative hover:bg-[#3d3c66] transition"
      >
        <div className="text-white font-[Inter-Medium] text-lg font-medium text-left relative select-none">
          Search
        </div>
        <img
          className="shrink-0 w-6 h-6 relative overflow-visible"
          src="/search.png"
          alt="search icon"
          draggable={false}
        />
      </button>
    </form>
  );
};

export default SearchInput;
