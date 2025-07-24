
import SearchBar from '@/components/SearchBar';
import React, { useEffect, useState } from 'react';
import ModelItem from '@/components/ModelItem';
import { searchModels } from '@/lib/modelsApi';

interface ExplorePageProps {
  searchParams: {
    key?: string;
    sourcesite?: string;
    category?: string;
  };
}

const ExploreMainPage = async ({ searchParams }: ExplorePageProps) => {
   const { key, sourcesite, category } = await searchParams;

    const models = await searchModels({
        key: key || "",
        sourcesite: sourcesite || "",
        category: category || "",
    });

  return (
    <div className="flex flex-col pt-5 pb-60">
      <SearchBar />
      <div className="grid grid-cols-4 justify-between gap-x-12 gap-y-8 max-xl:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1">
        {models.map((model: Model) => (
          <ModelItem key={model.id} model={model} color="white" />
        ))}
      </div>
    </div>
  );
};

export default ExploreMainPage;