'use client';

import React from 'react';
import ModelItem from './ModelItem';
import { FaBoxOpen } from 'react-icons/fa'; // or any other icon lib you use

const SearchResultPart = ({ models }: { models: Model[] }) => {
  if (!models || models.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500">
        <div className="bg-gray-100 rounded-full p-6 shadow-inner mb-6">
          <FaBoxOpen className="text-4xl text-gray-400" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Models Found</h2>
        <p className="text-base text-gray-500 max-w-md">
          We couldn’t find any models matching your filters.<br />
          Try adjusting your search terms or clearing some filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 justify-between gap-x-12 gap-y-8 max-xl:grid-cols-2 max-md:grid-cols-2 max-sm:grid-cols-1 pt-5">
      {models.map((model: Model) => (
        <ModelItem key={model.id} model={model} color="white" />
      ))}
    </div>
  );
};

export default SearchResultPart;
