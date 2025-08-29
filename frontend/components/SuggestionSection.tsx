'use client';

import React, { useEffect, useState } from 'react';
import { getSuggestionModels } from '@/lib/modelsApi';
import ModelItem from './ModelItem';
import { FaRegSmileWink } from 'react-icons/fa'; // fun icon

type SuggestionSectionProps = {
  modelId: string;
};

const SuggestionSection = ({ modelId }: SuggestionSectionProps) => {
  const [suggestionModels, setSuggestionModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getSuggestionModels(modelId)
      .then(setSuggestionModels)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [modelId]);

  return (
    <div className="py-10 bg-custom-light-secondcolor dark:bg-custom-dark-secondcolor min-h-[200px]">
      <div className="grid grid-cols-4 gap-x-4 gap-y-4 max-xl:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1">
        {loading ? (
          <p className="col-span-full text-center text-gray-400">Loading suggestions...</p>
        ) : suggestionModels.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center p-8 ">
            <FaRegSmileWink className="text-6xl text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
              No Suggestions Yet
            </h3>
            <p className="text-center text-gray-500 dark:text-gray-400 ">
              We couldn&apos;t find any suggestions for this model right now.<br /> Check back later or explore other models.
            </p>
          </div>
        ) : (
          suggestionModels.map((model: Model) => (
            <ModelItem key={model.id} model={model} color="white" />
          ))
        )}
      </div>
    </div>
  );
};

export default SuggestionSection;
