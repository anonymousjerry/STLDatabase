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
import { useLikesStore } from '@/app/_zustand/useLikesStore';
import { useSession } from 'next-auth/react';
import { useDebounce } from '@/hooks/useDebounce';

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
  const { status } = useSession();
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
    liked,
    userId,
    setSelectedPlatform,
    setSelectedCategory,
    setSelectedSubCategory,
    setSearchInput,
    setSearchPrice,
    setliked,
    setSearchTag
  } = useSearch();
  
  // Debounce search input to prevent excessive API calls
  const debouncedSearchInput = useDebounce(searchInput, 500);

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
      // If subcategory is provided, preserve both id and name
      setSelectedCategory("All");
      // Set subcategory with id as name if not already set
      setSelectedSubCategory({ 
        id: initialSearchParams.subCategory, 
        name: initialSearchParams.subCategory 
      });
    } else if (initialSearchParams.category) {
      // If only category is provided (no subcategory)
      setSelectedCategory(initialSearchParams.category);
      setSelectedSubCategory({ id: "", name: "" });
    }
  }, [initialSearchParams, setSearchInput, setSelectedPlatform, setSelectedCategory, setSelectedSubCategory]);

  // Clear liked filter if user is not authenticated but URL has liked=true
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlLiked = urlParams.get('liked');
    
    if (urlLiked === 'true' && !userId) {
      // User is not authenticated but URL has liked=true, clear it
      setliked(false);
      
      // Remove liked parameter from URL
      urlParams.delete('liked');
      urlParams.delete('userId');
      const newUrl = `${window.location.pathname}${urlParams.toString() ? '?' + urlParams.toString() : ''}`;
      window.history.replaceState({}, '', newUrl);
    }
  }, [userId, setliked]);

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
      // Only search if debounced input has minimum length or if it's empty (to show all results)
      if (debouncedSearchInput.trim().length > 0 && debouncedSearchInput.trim().length < 2) {
        return;
      }

      setIsLoading(true);
      setPage(1);
      setHasMore(true);
      
      console.log('Fetching models with params:', {
        liked,
        userId,
        status: liked ? 'true' : 'false'
      });
      
      const { models: newModels, totalCount } = await searchModels({
        key: debouncedSearchInput.trim(),
        tag: searchTag,
        sourcesite: selectedPlatform,
        category: selectedCategory,
        subCategory: selectedSubCategory.id,
        price: searchPrice,
        liked: liked ? 'true' : 'false',
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
  }, [selectedFilters, selectedPlatform, selectedCategory, selectedSubCategory, searchPrice, liked, debouncedSearchInput, searchTag, userId]);

  // 1.5️⃣ Synchronize like states when models change
  useEffect(() => {
    if (models.length > 0 && userId && status === "authenticated") {
      // Sync like states for all models in the current list
      models.forEach(model => {
        if (model.likes) {
          const serverLiked = model.likes.some((like: Like) => like.userId === userId);
          const serverCount = model.likes.length;
          const currentStoreLiked = useLikesStore.getState().likedModels[model.id];
          
          // Update store if server data differs from store data
          if (currentStoreLiked === undefined || currentStoreLiked !== serverLiked) {
            useLikesStore.getState().setLikeStatus(model.id, serverLiked, serverCount);
            console.log(`Synced like state for model ${model.id}:`, { serverLiked, serverCount });
          }
        }
      });
    }
  }, [models, userId, status]);

  // 1.6️⃣ Real-time filter update when like states change (for liked filter)
  const { likedModels } = useLikesStore();
  
  useEffect(() => {
    if (liked && userId) {
      // When viewing liked models, remove models that are no longer liked
      const updatedModels = models.filter(model => likedModels[model.id] === true);
      
      if (updatedModels.length !== models.length) {
        setModels(updatedModels);
        setTotalModels(prev => Math.max(0, prev - (models.length - updatedModels.length)));
        console.log(`Removed ${models.length - updatedModels.length} unliked models from liked filter`);
      }
    }
  }, [likedModels, liked, userId, models]);

  // 2️⃣ When page increases (lazy load), fetch and append
  useEffect(() => {
    const fetchMore = async () => {
      setIsLoading(true);

      const { models: moreModels, totalCount } = await searchModels({
        key: debouncedSearchInput.trim(),
        tag: searchTag,
        sourcesite: selectedPlatform,
        category: selectedCategory,
        subCategory: selectedSubCategory.id,
        price: searchPrice,
        liked: liked ? 'true' : 'false',
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
  }, [page, debouncedSearchInput, searchTag, selectedPlatform, selectedCategory, selectedSubCategory.id, searchPrice, liked, userId]);

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
          
          {/* Hero Section with Category Title and Description */}
          {((selectedCategory && selectedCategory !== 'All') || selectedSubCategory?.id) && (
            <div className="w-full py-8 mt-8">
              <div className="mx-auto w-full max-w-[1300px] px-4 sm:px-6 md:px-8">
                <div className="text-center text-custom-light-textcolor dark:text-custom-dark-textcolor">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                    {selectedSubCategory?.id
                      ? `${selectedSubCategory.name.replace(/\b\w/g, (char) => char.toUpperCase())} 3D Files`
                      : `${selectedCategory.replace(/\b\w/g, (char) => char.toUpperCase())} 3D Files`}
                  </h1>
                  <h2 className="text-lg sm:text-xl text-custom-light-textcolor dark:text-custom-dark-textcolor max-w-4xl mx-auto leading-relaxed">
                    {selectedSubCategory?.id
                      ? `Discover free and premium 3D printable ${selectedSubCategory.name.replace(/\b\w/g, (char) => char.toUpperCase())} STL files. Download popular ${selectedSubCategory.name.replace(/\b\w/g, (char) => char.toUpperCase())} models, explore unique designs, and start printing today.`
                      : `Discover free and premium 3D printable ${selectedCategory.replace(/\b\w/g, (char) => char.toUpperCase())} STL files. Download popular ${selectedCategory.replace(/\b\w/g, (char) => char.toUpperCase())} models, explore unique designs, and start printing today.`}
                  </h2>
                </div>
              </div>
            </div>
          )}

          {searchTag && selectedCategory === "All" && !selectedSubCategory?.id && (
            <div className="w-full py-8 mt-8">
              <div className="mx-auto w-full max-w-[1300px] px-4 sm:px-6 md:px-8">
                <div className="text-center text-custom-light-textcolor dark:text-custom-dark-textcolor">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                    {`${searchTag.replace(/\b\w/g, (char) => char.toUpperCase())} 3D Files`}
                  </h1>
                  <h2 className="text-lg sm:text-xl text-custom-light-textcolor dark:text-custom-dark-textcolor max-w-4xl mx-auto leading-relaxed">
                    {`Discover free and premium 3D printable ${searchTag.replace(/\b\w/g, (char) => char.toUpperCase())} STL files. Download popular ${searchTag.replace(/\b\w/g, (char) => char.toUpperCase())} models, explore unique designs, and start printing today.`}
                  </h2>
                </div>
              </div>
            </div>
          )}
          
          {/* Homepage header banner ad */}
          <OptimizedAdPositionManager
            page="explore"
            positions={[
              'explore-header-banner',
            ]}
            className="w-full flex justify-center items-center pt-10"
          />
          <div className="flex flex-col md:flex-row gap-5 pt-10 w-full">
            <div className="flex w-full md:basis-1/5 min-w-0">
              <div className="flex flex-col gap-4 w-full">
                <SideFilter />
              </div>
            </div>
            <div className="flex flex-col w-full md:basis-4/5 min-w-0">
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
                  <span>
                    {selectedSubCategory?.id
                      ? `Result (Subcategory: ${selectedSubCategory.name || selectedSubCategory.id}) - ${totalModels} models`
                      : selectedCategory && selectedCategory !== 'All'
                        ? `Result (Category: ${selectedCategory}) - ${totalModels} models`
                        : `Result - ${totalModels} models`}
                  </span>
                )}
                <span className="absolute left-0 -bottom-2 w-full h-0.5 bg-custom-light-maincolor dark:bg-custom-light-containercolor rounded" />
              </div>
              {/* Active filter summary */}
              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                {selectedPlatform && selectedPlatform !== 'All' && (
                  <button
                    onClick={() => {
                      setSelectedPlatform('All');
                      const queryParams = new URLSearchParams();
                      if (selectedCategory && selectedCategory !== 'All') queryParams.set("category", selectedCategory);
                      if (selectedSubCategory?.id) queryParams.set("subCategory", selectedSubCategory.id);
                      if (searchInput) queryParams.set("key", searchInput);
                      if (searchPrice) queryParams.set("price", searchPrice);
                      if (liked) queryParams.set("liked", 'true');
                      if (userId) queryParams.set("userId", userId);
                      queryParams.set("currentPage", '1');
                      router.push(`/explore?${queryParams.toString()}`);
                    }}
                    className="px-2 py-1 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-600 transition-colors cursor-pointer"
                  >
                    Platform: {selectedPlatform} ✕
                  </button>
                )}
                {selectedCategory && selectedCategory !== 'All' && !selectedSubCategory?.id && (
                  <button
                    onClick={() => {
                      setSelectedCategory('All');
                      const queryParams = new URLSearchParams();
                      if (selectedPlatform && selectedPlatform !== 'All') queryParams.set("sourcesite", selectedPlatform);
                      if (selectedSubCategory?.id) queryParams.set("subCategory", selectedSubCategory.id);
                      if (searchInput) queryParams.set("key", searchInput);
                      if (searchPrice) queryParams.set("price", searchPrice);
                      if (liked) queryParams.set("liked", 'true');
                      if (userId) queryParams.set("userId", userId);
                      queryParams.set("currentPage", '1');
                      router.push(`/explore?${queryParams.toString()}`);
                    }}
                    className="px-2 py-1 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-600 transition-colors cursor-pointer"
                  >
                    Category: {selectedCategory} ✕
                  </button>
                )}
                {selectedSubCategory?.id && (
                  <button
                    onClick={() => {
                      setSelectedSubCategory({ id: "", name: "" });
                      const queryParams = new URLSearchParams();
                      if (selectedPlatform && selectedPlatform !== 'All') queryParams.set("sourcesite", selectedPlatform);
                      if (selectedCategory && selectedCategory !== 'All') queryParams.set("category", selectedCategory);
                      if (searchInput) queryParams.set("key", searchInput);
                      if (searchPrice) queryParams.set("price", searchPrice);
                      if (liked) queryParams.set("liked", 'true');
                      if (userId) queryParams.set("userId", userId);
                      queryParams.set("currentPage", '1');
                      router.push(`/explore?${queryParams.toString()}`);
                    }}
                    className="px-2 py-1 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-600 transition-colors cursor-pointer"
                  >
                    Subcategory: {selectedSubCategory.name || selectedSubCategory.id} ✕
                  </button>
                )}
                {searchPrice && (
                  <button
                    onClick={() => {
                      setSearchPrice("");
                      const queryParams = new URLSearchParams();
                      if (selectedPlatform && selectedPlatform !== 'All') queryParams.set("sourcesite", selectedPlatform);
                      if (selectedCategory && selectedCategory !== 'All') queryParams.set("category", selectedCategory);
                      if (selectedSubCategory?.id) queryParams.set("subCategory", selectedSubCategory.id);
                      if (searchInput) queryParams.set("key", searchInput);
                      if (liked) queryParams.set("liked", 'true');
                      if (userId) queryParams.set("userId", userId);
                      queryParams.set("currentPage", '1');
                      router.push(`/explore?${queryParams.toString()}`);
                    }}
                    className="px-2 py-1 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-600 transition-colors cursor-pointer"
                  >
                    Price: {searchPrice} ✕
                  </button>
                )}
                {liked && (
                  <button
                    onClick={() => {
                      setliked(false);
                      const queryParams = new URLSearchParams();
                      if (selectedPlatform && selectedPlatform !== 'All') queryParams.set("sourcesite", selectedPlatform);
                      if (selectedCategory && selectedCategory !== 'All') queryParams.set("category", selectedCategory);
                      if (selectedSubCategory?.id) queryParams.set("subCategory", selectedSubCategory.id);
                      if (searchInput) queryParams.set("key", searchInput);
                      if (searchPrice) queryParams.set("price", searchPrice);
                      if (userId) queryParams.set("userId", userId);
                      queryParams.set("currentPage", '1');
                      router.push(`/explore?${queryParams.toString()}`);
                    }}
                    className="px-2 py-1 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-600 transition-colors cursor-pointer"
                  >
                    Liked ✕
                  </button>
                )}
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
      <ScrollToTopButton />
    </div>
  );
};

export default ExploreMainPageClient;
