"use client"

import { useState, useRef, useEffect } from 'react';

interface DropdownButtonProps {
  value: string;
  label: string;
  list: string[];
  onSelect?: (item: string) => void;
}
const DropdownButton = ({ value, label, list, onSelect}: DropdownButtonProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredList = list.filter((item) =>
    item.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (item: string) => {
    setOpen(false);
    setSearch('');
    onSelect?.(item);
  };

  return (
    <div className="relative w-full text-left" ref={dropdownRef}>
      {/* Label */}
      <div className="text-custom-light-textcolor font-semibold text-lg text-left self-stretch dark:text-custom-dark-textcolor">
        {label}
      </div>

      {/* Button */}
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="
          w-full flex justify-between items-center
          border-[#4e4d80] bg-white border rounded-xl px-4 py-3
          text-gray-800 text-base font-medium shadow-sm
          hover:border-blue-500
          focus:outline-none focus:ring-2 focus:ring-blue-300
          transition-all duration-150
          dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:border-blue-400 dark:focus:ring-blue-600
        "
      >
        <span>{value}</span>
        <span
          className={`transition-transform duration-300 ${
            open ? 'rotate-180' : 'rotate-0'
          }`}
          aria-hidden="true"
        >
          ▼
        </span>
      </button>

      {/* Dropdown list */}
      {open && (
        <div
          className="
            absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg animate-fade-in transition-transform origin-top
            dark:bg-gray-800 dark:border-gray-700
          "
          role="listbox"
          tabIndex={-1}
        >
          {/* Search box */}
          <div className="px-4 pt-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="
                w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-300
                dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:focus:ring-blue-600
              "
              aria-label={`Search ${label}`}
              autoFocus
            />
          </div>

          {/* Filtered List */}
          <ul className="max-h-60 overflow-auto py-2 text-gray-700 dark:text-gray-300">
            <li
              onClick={() => handleSelect('All')}
              role="option"
              tabIndex={0}
              className="cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              All
            </li>
            {filteredList.length > 0 ? (
              filteredList.map((item) => (
                <li
                  key={item}
                  onClick={() => handleSelect(item)}
                  role="option"
                  tabIndex={0}
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {item}
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-gray-400 italic dark:text-gray-500">
                No matches found
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DropdownButton;
