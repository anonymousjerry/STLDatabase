'use client';

import React from 'react';

const allFilterOptions = [
  'New Release',
  'Ending',
  'Popular',
  'Pledge',
  'Trending',
  'Featured',
];

type NavFilterProps = {
  selectedFilters: string[];
  onFilterChange: (filters: string[]) => void;
};

const NavFilter: React.FC<NavFilterProps> = ({
  selectedFilters,
  onFilterChange,
}) => {
  const handleFilterChange = (clicked: string) => {
    // Always allow only one selection
    onFilterChange([clicked]);
  };

  const filtersToRender = ['All', ...allFilterOptions];

  return (
    <div className="flex flex-wrap gap-3 overflow-x-auto pt-6 px-4">
      {filtersToRender.map((filter) => {
        const isSelected = selectedFilters.includes(filter);

        return (
          <button
            key={filter}
            onClick={() => handleFilterChange(filter)}
            className={`px-4 py-2 rounded-2xl text-sm font-medium border transition-colors duration-200
              ${
                isSelected
                  ? 'bg-custom-light-maincolor text-white text-lg'
                  : 'bg-white text-custom-light-textcolor border-gray-300 hover:bg-gray-100'
              }
            `}
          >
            {filter}
          </button>
        );
      })}
    </div>
  );
};

export default NavFilter;
