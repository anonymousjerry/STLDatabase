"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useSearch } from "@/context/SearchContext";

interface CategoryTreeDropdownProps {
  value: string;
  label: string;
  categories: GroupedCategory[];
  onSelect?: (category: string, subCategory?: string) => void;
  onSubCategorySelect?: (subCategory: SubCategory) => void;
}

const CategoryTreeDropdown = ({
  value,
  label,
  categories,
  onSelect,
  onSubCategorySelect,
}: CategoryTreeDropdownProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { selectedCategory, selectedSubCategory, setSelectedCategory } = useSearch();
  const [displayValue, setDisplayValue] = useState(value);
  const [submenuPosition, setSubmenuPosition] = useState<{ top: number; left: number; width: number } | null>(null);
  const [activeSubmenu, setActiveSubmenu] = useState<GroupedCategory | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const submenuRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  const filteredCategories = categories.filter(
    (category) =>
      category.group.toLowerCase().includes(search.toLowerCase()) ||
      category.items.some((sub) =>
        sub.name.toLowerCase().includes(search.toLowerCase())
      )
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const insideDropdown = !!dropdownRef.current?.contains(target);
      const insideSubmenu = !!submenuRef.current?.contains(target);
      if (!insideDropdown && !insideSubmenu) {
        setOpen(false);
        setActiveSubmenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCategoryHover = (category: GroupedCategory, e: React.MouseEvent<HTMLElement, MouseEvent>) => {
      if (category.items.length === 0) {
        setActiveSubmenu(null);
        return;
      }
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      setSubmenuPosition({ top: rect.top + window.scrollY, left: rect.right + 4, width: rect.width });
      setActiveSubmenu(category);
    };

  const handleSubCategorySelect = (subCategory: SubCategory) => {
    setOpen(false);
    setSearch("");
    setSelectedCategory("All");
    setDisplayValue(subCategory.name);
    setActiveSubmenu(null);
    onSubCategorySelect?.(subCategory);
  };

  const handleCategoryOnlySelect = (category: GroupedCategory) => {
    setOpen(false);
    setSearch("");
    setSelectedCategory(category.group);
    setDisplayValue(category.group);
    setActiveSubmenu(null);
    onSelect?.(category.group);
  };

  const handleAllSelect = () => {
    setOpen(false);
    setSearch("");
    setSelectedCategory("All");
    setDisplayValue("All");
    setActiveSubmenu(null);
    onSelect?.("All");
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
        onClick={() => {setOpen(!open); setActiveSubmenu(null)}}
        className="w-full flex justify-between items-center border-[#4e4d80] bg-white border rounded-xl px-4 py-3 text-gray-800 text-base font-medium shadow-sm hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-150 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:border-blue-400 dark:focus:ring-blue-600 truncate"
      >
        <span>{displayValue}</span>
        <span className={`transition-transform duration-300 ${open ? "rotate-180" : "rotate-0"}`} aria-hidden="true">
          ▼
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-2 w-full max-h-96 overflow-auto bg-white border border-gray-200 rounded-xl shadow-lg animate-fade-in transition-transform origin-top dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
          {/* Search */}
          <div className="px-4 pt-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search categories..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:focus:ring-blue-600"
              aria-label={`Search ${label}`}
              autoFocus
            />
          </div>

          {/* Categories */}
          <ul className="max-h-72 overflow-auto py-2 text-gray-700 dark:text-gray-300">
            <li
              onClick={handleAllSelect}
              role="option"
              tabIndex={0}
              aria-selected={selectedCategory === "All"}
              className="cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              All
            </li>

            {filteredCategories.length > 0 ? (
              filteredCategories.map((category, idx) => (
                <li
                  key={idx}
                  className="relative border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                  onMouseEnter={(e) => handleCategoryHover(category, e)}
                  // onMouseLeave={() => setActiveSubmenu(null)}
                >
                  <div
                    role="option"
                    tabIndex={0}
                    aria-selected={selectedCategory === category.group}
                    className="cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium flex justify-between items-center"
                    onClick={() => handleCategoryOnlySelect(category)}
                  >
                    <span>{category.group}</span>
                    {category.items.length > 0 && <span className="text-xs text-gray-500 ml-2">▶</span>}
                  </div>
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-gray-400 italic dark:text-gray-500">No matches found</li>
            )}
          </ul>
        </div>
      )}

      {/* Render submenu in portal */}
      {activeSubmenu && submenuPosition &&
        createPortal(
          <ul
            style={{
              position: "absolute",
              top: submenuPosition.top,
              left: submenuPosition.left,
              minWidth: 180,
              zIndex: 9999,
            }}
            className="bg-white border border-gray-200 rounded-xl shadow-lg py-2 dark:bg-gray-800 dark:border-gray-700 "
            onMouseDown={(e) => e.stopPropagation()}
            // onMouseLeave={() => setActiveSubmenu(null)}
          >
            
            {activeSubmenu.items.map((sub) => (
              <li
                key={sub.id}
                onClick={() => handleSubCategorySelect(sub)}
                role="option"
                tabIndex={0}
                aria-selected={selectedSubCategory?.id === sub.id}
                className=" cursor-pointer px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-md relative border-b border-gray-100 dark:border-gray-700 dark:text-gray-200 last:border-b-0"
              >
                {sub.name}
              </li>
            ))}
          </ul>,
          document.body
        )}
    </div>
  );
};

export default CategoryTreeDropdown;
