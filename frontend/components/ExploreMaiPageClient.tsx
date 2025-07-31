'use client';

import React, { useState, useEffect } from 'react';
import SearchBar from '@/components/SearchBar';
import SearchResultPart from '@/components/SearchResultPart';
import NavFilter from '@/components/NavFilter';
import { searchModels } from '@/lib/modelsApi';
import { FiBox } from 'react-icons/fi';
import SideFilter from './SideFilter';

type ExploreMainPageClientProps = {
  initialModels: Model[];
  initialSearchParams: {
    key?: string;
    sourcesite?: string;
    category?: string;
    price?: string;
    // favorited?: boolean;
  };
};

const ExploreMainPageClient: React.FC<ExploreMainPageClientProps> = ({
  initialModels,
  initialSearchParams,
}) => {
  const [models, setModels] = useState<Model[]>(initialModels);
  useEffect(() => {
    setModels(initialModels)
  }, [initialModels])
  const [selectedFilters, setSelectedFilters] = useState<string[]>(['All']);
  const [searchParams, setSearchParams] = useState(initialSearchParams);

  useEffect(() => {
    const fetchData = async () => {
      const filtersToSend = selectedFilters.includes('All')
        ? []
        : selectedFilters;

      const newModels = await searchModels({
        ...initialSearchParams,
        filters: filtersToSend,
      });

      setModels(newModels);
    };

    fetchData();
  }, [selectedFilters]);

  return (
    <div className="flex flex-col pt-5 pb-60">
        <SearchBar />
        <div className='flex gap-5 pt-10'>
            <div className='flex basis-1/5'>
                <SideFilter
                  // searchParams={searchParams}
                  // setSearchParams={setSearchParams}
                />
            </div>
            <div className="flex flex-col basis-4/5">
                <div className="flex items-center w-full text-lg font-medium text-custom-light-textcolor relative pt-1">
                    <FiBox className="mr-2" />
                    <span>Result(All) - {models.length} models</span>
                    <span className="absolute left-0 -bottom-2 w-full h-0.5 bg-custom-light-maincolor rounded" />
                </div>
                <NavFilter
                    selectedFilters={selectedFilters}
                    onFilterChange={setSelectedFilters}
                />
                <SearchResultPart models={models} />
            </div>
        </div>
    </div>
  );
};

export default ExploreMainPageClient;
