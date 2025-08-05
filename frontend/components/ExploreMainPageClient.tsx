'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import SearchBar from './SearchBar';
import SearchResultPart from './SearchResultPart';
import NavFilter from './NavFilter';
import { searchModels } from '@/lib/modelsApi';
import { FiBox } from 'react-icons/fi';
import SideFilter from './SideFilter';
import { useSearch } from '@/context/SearchContext';
import { useRouter } from 'next/navigation';

type ExploreMainPageClientProps = {
  initialModels: Model[];
  totalPage: number;
  currentPage: number;
  initialSearchParams: {
    key?: string;
    sourcesite?: string;
    category?: string;
    price?: string;
  };
};

const ExploreMainPageClient = ({
  initialModels,
  totalPage,
  currentPage,
  initialSearchParams,
}: ExploreMainPageClientProps) => {
  const router = useRouter();
  const [models, setModels] = useState<Model[]>(initialModels);
  const [selectedFilters, setSelectedFilters] = useState<string[]>(['All']);
  const [page, setPage] = useState(currentPage);
  const [hasMore, setHasMore] = useState(currentPage < totalPage);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const {
    selectedPlatform,
    selectedCategory,
    searchInput,
    searchPrice,
    favourited,
    userId
  } = useSearch();


  // 1️⃣ When filters change, reset page & fetch new models
  useEffect(() => {
    const fetchFilteredModels = async () => {
      setIsLoading(true);
      setPage(1);
      setHasMore(true);

      const { models: newModels, totalCount } = await searchModels({
        key: searchInput,
        sourcesite: selectedPlatform,
        category: selectedCategory,
        price: searchPrice,
        favourited: favourited ? 'true' : undefined,
        userId: userId,
        page: 1,
        limit: 12,
      });

      setModels(newModels);
      setHasMore(newModels.length < totalCount);
      setIsLoading(false);
    };

    fetchFilteredModels();
  }, [selectedFilters, selectedPlatform, selectedCategory, searchPrice, favourited, searchInput]);

  

  // 2️⃣ When page increases (lazy load), fetch and append
  useEffect(() => {

    const fetchMore = async () => {
      setIsLoading(true);

      const { models: moreModels, totalCount } = await searchModels({
        key: searchInput,
        sourcesite: selectedPlatform,
        category: selectedCategory,
        price: searchPrice,
        favourited: favourited ? 'true' : undefined,
        userId: userId,
        page,
        limit: 12,
      });


      setModels((prev) => {
        const existingIds = new Set(prev.map((m) => m.id));
        const uniqueModels = moreModels.filter((m: Model) => !existingIds.has(m.id));
        return [...prev, ...uniqueModels];
      });

      setHasMore((prev) => page < Math.ceil(totalCount / 12));
      setIsLoading(false);
    };

    fetchMore();
  }, [page]);

   // 3️⃣ Lazy loading on scroll (Intersection Observer)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1.0, rootMargin: '100px' }
    );

    const current = loaderRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [hasMore, isLoading]);

  return (
    <div className="flex flex-col pt-5 ">
      <SearchBar />
      <div className="flex gap-5 pt-10">
        <div className="flex basis-1/5">
          <SideFilter />
        </div>
        <div className="flex flex-col basis-4/5">
          <div className="flex items-center w-full text-lg font-medium text-custom-light-textcolor dark:text-custom-dark-textcolor relative pt-1">
            <FiBox className="mr-2" />
            <span>Result - {models.length} models</span>
            <span className="absolute left-0 -bottom-2 w-full h-0.5 bg-custom-light-maincolor dark:bg-custom-light-containercolor rounded" />
          </div>
          <NavFilter selectedFilters={selectedFilters} onFilterChange={setSelectedFilters} />
          <SearchResultPart models={models} />
          <div ref={loaderRef} className="flex flex-col items-center justify-center py-10">
            {isLoading && (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Loading more models...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExploreMainPageClient;
