'use client';

import React, { useState, useEffect, useRef } from 'react';
import SearchBar from './SearchBar';
import SearchResultPart from './SearchResultPart';
import NavFilter from './NavFilter';
import { searchModels } from '@/lib/modelsApi';
import { FiBox } from 'react-icons/fi';
import SideFilter from './SideFilter';
import { useSearch } from '@/context/SearchContext';
import { useRouter } from 'next/navigation';
import OptimizedAdPositionManager from './ads/OptimizedAdPositionManager';
import ScrollToTopButton from './ScrollToTopButton';

type ExploreMainPageClientProps = {
  initialModels: Model[];
  totalPage: number;
  currentPage: number;
  initialSearchParams: {
    key?: string;
    sourcesite?: string;
    category?: string;
    subCategory?: string;
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
  const [totalModels, setTotalModels] = useState(0);
  const [page, setPage] = useState(currentPage);
  const [hasMore, setHasMore] = useState(currentPage < totalPage);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const [showUpButton, setShowUpButton] = useState(false); // <-- for UP button

  const {
    selectedPlatform,
    selectedCategory,
    selectedSubCategory,
    searchInput,
    searchTag,
    searchPrice,
    favourited,
    liked,
    userId,
    setSelectedPlatform,
    setSelectedCategory,
    setSelectedSubCategory,
    setSearchInput,
    setSearchTag
  } = useSearch();

  // Initialize search context with URL parameters
  useEffect(() => {
    if (initialSearchParams.key) {
      setSearchInput(initialSearchParams.key);
    }
    if (initialSearchParams.sourcesite) {
      setSelectedPlatform(initialSearchParams.sourcesite);
    }
    
    // Handle category and subcategory initialization
    if (initialSearchParams.subCategory) {
      // If subcategory is provided, we need to find the parent category
      // For now, we'll set category to "All" and let the SearchBar handle the display
      setSelectedCategory("All");
      setSelectedSubCategory({ id: initialSearchParams.subCategory, name: '' });
    } else if (initialSearchParams.category) {
      // If only category is provided (no subcategory)
      setSelectedCategory(initialSearchParams.category);
      setSelectedSubCategory({ id: "", name: "" });
    }
  }, [initialSearchParams, setSearchInput, setSelectedPlatform, setSelectedCategory, setSelectedSubCategory]);

  // Show/hide UP button on scroll
  // useEffect(() => {
  //   const handleScroll = () => {
  //     setShowUpButton(window.scrollY > 300);
  //   };
  //   window.addEventListener('scroll', handleScroll);
  //   return () => window.removeEventListener('scroll', handleScroll);
  // }, []);

  // const scrollToTop = () => {
  //   window.scrollTo({ top: 0, behavior: 'smooth' });
  // };

  // 1️⃣ When filters change, reset page & fetch new models
  useEffect(() => {
    const fetchFilteredModels = async () => {
      setIsLoading(true);
      setPage(1);
      setHasMore(true);
      const { models: newModels, totalCount } = await searchModels({
        key: searchInput,
        tag: searchTag,
        sourcesite: selectedPlatform,
        category: selectedCategory,
        subCategory: selectedSubCategory.id,
        price: searchPrice,
        favourited: favourited ? 'true' : undefined,
        liked: liked ? 'true' : undefined,
        userId: userId,
        filters: selectedFilters,
        page: 1,
        limit: 12,
      });

      setModels(newModels);
      setHasMore(newModels.length < totalCount);
      setIsLoading(false);
      setTotalModels(totalCount);
    };

    fetchFilteredModels();
  }, [selectedFilters, selectedPlatform, selectedCategory, selectedSubCategory, searchPrice, favourited, liked, searchInput, searchTag]);

  // 2️⃣ When page increases (lazy load), fetch and append
  useEffect(() => {
    const fetchMore = async () => {
      setIsLoading(true);

      const { models: moreModels, totalCount } = await searchModels({
        key: searchInput,
        tag: searchTag,
        sourcesite: selectedPlatform,
        category: selectedCategory,
        subCategory: selectedSubCategory.id,
        price: searchPrice,
        favourited: favourited ? 'true' : undefined,
        liked: liked ? 'true' : undefined,
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
      setTotalModels(totalCount);
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
    <div className="flex flex-col min-h-screen">
      <div className="flex-1">
        <div className="pt-5">
          <SearchBar />
          {/* Homepage header banner ad */}
          <OptimizedAdPositionManager
            page="explore"
            positions={[
              'explore-header-banner',
            ]}
            className="w-full flex justify-center items-center pt-10"
          />
          <div className="flex gap-5 pt-10">
            <div className="flex basis-1/5">
              <div className="flex flex-col gap-4 w-full">
                <SideFilter />
              </div>
            </div>
            <div className="flex flex-col basis-4/5">
              <div className="flex items-center w-full text-lg font-medium text-custom-light-textcolor dark:text-custom-dark-textcolor relative pt-1">
                <FiBox className="mr-2" />
                {searchTag ? (
                  <div className="flex items-center gap-2">
                    <span>{`Result (Tag: ${searchTag}) - ${totalModels} models`}</span>
                    <button
                      onClick={() => {
                        setSearchTag("");
                        const params = new URLSearchParams();
                        if (searchInput) params.set('key', searchInput);
                        if (selectedPlatform && selectedPlatform !== 'All') params.set('sourcesite', selectedPlatform);
                        if (selectedCategory && selectedCategory !== 'All') params.set('category', selectedCategory);
                        if (selectedSubCategory?.id) params.set('subCategory', selectedSubCategory.id);
                        if (searchPrice) params.set('price', searchPrice);
                        if (favourited) params.set('favourited', 'true');
                        if (liked) params.set('liked', 'true');
                        params.set('currentPage', '1');
                        router.push(`/explore?${params.toString()}`);
                      }}
                      className="ml-2 text-sm px-2 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                      aria-label="Clear tag filter"
                    >
                      Clear
                    </button>
                  </div>
                ) : (
                  <span>{`Result - ${totalModels} models`}</span>
                )}
                <span className="absolute left-0 -bottom-2 w-full h-0.5 bg-custom-light-maincolor dark:bg-custom-light-containercolor rounded" />
              </div>
              <NavFilter selectedFilters={selectedFilters} onFilterChange={setSelectedFilters} />
                {/* Explore mid-content banner ad */}
              <OptimizedAdPositionManager
                page="explore"
                positions={[
                  'explore-mid-content-banner',
                ]}
                className="w-full flex justify-center items-center pt-10"
              />
              <div className="flex-1 min-h-[calc(100vh-400px)]">
                <SearchResultPart models={models} />
              </div>
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
      </div>

      {/* UP Button */}
      {/* {showUpButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-10 right-10 z-50 p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transition-all"
          aria-label="Scroll to top"
        >
          <FaArrowUp size={20} />
        </button>
      )} */}
      <ScrollToTopButton />
    </div>
  );
};

export default ExploreMainPageClient;
