'use client';

import React from 'react';
import ModelItem from './ModelItem';
import { FaBoxOpen } from 'react-icons/fa'; // or any other icon lib you use

const SearchResultPart = ({ models }: { models: Model[] }) => {
  if (!models || models.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center text-gray-500 py-20">
        <div className="bg-gray-100 rounded-full p-8 shadow-inner mb-8">
          <FaBoxOpen className="text-5xl text-gray-400" />
        </div>
        <h2 className="text-3xl font-semibold text-gray-700 mb-4">No Models Found</h2>
        <p className="text-lg text-gray-500 max-w-lg leading-relaxed">
          We couldn't find any models matching your filters.<br />
          Try adjusting your search terms or clearing some filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 xl:gap-8 pt-5">
      {models.map((model: Model) => (
        <ModelItem key={model.id} model={model} color="white" />
      ))}
    </div>
  );
};

export default SearchResultPart;
