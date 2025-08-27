'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiGrid, FiSearch, FiArrowRight } from 'react-icons/fi';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import Image from 'next/image';
import LoadingOverlay from './LoadingOverlay';
import OptimizedAdPositionManager from './ads/OptimizedAdPositionManager';
import { useSearch } from '@/context/SearchContext';

interface CategoriesPageClientProps {
  categories: any[];
  selectedCategory?: string;
}

const CategoriesPageClient = ({ categories, selectedCategory }: CategoriesPageClientProps) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState<any[]>([]);

  // Filter categories based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.subCategories.some((sub: any) =>
          sub.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setFilteredCategories(filtered);
    }
    setCurrentPage(1);
  }, [categories, searchTerm]);

  // Pagination
  const itemsPerPage = 12;
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCategories = filteredCategories.slice(startIndex, endIndex);

  const {searchInput, selectedPlatform, searchTag, favourited, liked, searchPrice, setSelectedCategory, setSelectedSubCategory} = useSearch();

  const handleCategory = (category: string) => {
    setSelectedCategory(category);
    setSelectedSubCategory({name: "", id: ""});

    const queryParams = new URLSearchParams();
    
    if (searchInput) queryParams.set("key", '');
    if (selectedPlatform && selectedPlatform !== "All")
      queryParams.set("sourcesite", selectedPlatform);
    if (searchPrice) queryParams.set("price", searchPrice);
    if (favourited) queryParams.set("favourited", 'true');
    if (liked) queryParams.set("liked", 'true');
    if (searchTag) queryParams.set("tag", searchTag);
    queryParams.set("currentPage", '1');

    router.push(`/explore?${queryParams.toString()}`);
  }

  const handleSubCategory = (subCategory: SubCategory) => {
    setSelectedSubCategory(subCategory);
    setSelectedCategory("All");

    const queryParams = new URLSearchParams();
    
    if (searchInput) queryParams.set("key", '');
    if (selectedPlatform && selectedPlatform !== "All")
      queryParams.set("sourcesite", selectedPlatform);
    if (searchPrice) queryParams.set("price", searchPrice);
    if (favourited) queryParams.set("favourited", 'true');
    if (liked) queryParams.set("liked", "true");
    if (searchTag) queryParams.set("tag", searchTag);
    queryParams.set("currentPage", '1');

    router.push(`/explore?${queryParams.toString()}`);
  }
  // const handleCategoryClick = (categoryName: string) => {
  //   setLoading(true);
  //   router.push(`/explore?category=${encodeURIComponent(categoryName)}`);
  // };

  // const handleSubcategoryClick = (subcategoryId: string) => {
  //   setLoading(true);
  //   router.push(`/explore?subCategory=${encodeURIComponent(subcategoryId)}`);
  // };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-custom-light-maincolor to-purple-800 text-white py-16 px-4 sm:px-8 lg:px-16 xl:px-20 2xl:px-32">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-white/20 rounded-full p-4">
              <FiGrid className="text-4xl" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Browse 3D Models by Category
          </h1>
          <p className="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Discover thousands of 3D printable models organized by category. 
            Find exactly what you need for your next 3D printing project.
          </p>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white dark:bg-gray-900 py-8 px-4 sm:px-8 lg:px-16 xl:px-20 2xl:px-32">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="text"
              placeholder="Search categories and subcategories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-custom-light-maincolor dark:focus:border-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="bg-custom-light-secondcolor dark:bg-custom-dark-secondcolor py-12 px-4 sm:px-8 lg:px-16 xl:px-20 2xl:px-32">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-custom-light-titlecolor dark:text-custom-dark-titlecolor mb-2">
                All Categories
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {filteredCategories.length} categories found
                {searchTerm && ` for "${searchTerm}"`}
              </p>
            </div>
            
            {/* Pagination Info */}
            {totalPages > 1 && (
              <div className="mt-4 sm:mt-0 text-sm text-gray-600 dark:text-gray-400">
                Page {currentPage} of {totalPages}
              </div>
            )}
          </div>

          {/* Categories Grid */}
          <LoadingOverlay show={loading} size={50} />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedCategories.map((category) => (
              <div
                key={category.name}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700 overflow-hidden group cursor-pointer"
                onClick={() => handleCategory(category.name)}
              >
                {/* Category Header */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-4 mb-4">
                    {category.SVGUrl && (
                      <div className="relative w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <Image
                          src={category.SVGUrl}
                          alt={category.name}
                          width={32}
                          height={32}
                          className="object-contain"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-custom-light-titlecolor dark:text-custom-dark-titlecolor group-hover:text-custom-light-maincolor dark:group-hover:text-purple-400 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {category.subCategories?.length || 0} subcategories
                      </p>
                    </div>
                    <FiArrowRight className="text-gray-400 group-hover:text-custom-light-maincolor dark:group-hover:text-purple-400 transition-colors" />
                  </div>
                </div>

                {/* Subcategories List */}
                <div className="p-6">
                  <div className="space-y-2">
                    {category.subCategories?.slice(0, 4).map((subcategory: any) => (
                      <div
                        key={subcategory.id}
                        className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSubCategory(subcategory);
                        }}
                      >
                        <span className="text-sm text-gray-700 dark:text-gray-300 hover:text-custom-light-maincolor dark:hover:text-purple-400 transition-colors">
                          {subcategory.name}
                        </span>
                        <FiArrowRight className="text-xs text-gray-400" />
                      </div>
                    ))}
                    
                    {category.subCategories?.length > 4 && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 text-center pt-2">
                        +{category.subCategories.length - 4} more subcategories
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredCategories.length === 0 && (
            <div className="text-center py-16">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-8 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <FiSearch className="text-3xl text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No categories found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search terms or browse all categories.
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-12">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FaChevronLeft size={16} />
                Previous
              </button>

              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-10 h-10 rounded-lg border transition-colors ${
                        currentPage === pageNum
                          ? 'bg-custom-light-maincolor dark:bg-purple-600 text-white border-custom-light-maincolor dark:border-purple-600'
                          : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
                <FaChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Ad Section */}
      {/* <OptimizedAdPositionManager
        page="categories"
        positions={['categories-mid-content-banner']}
        className="w-full flex justify-center items-center py-12"
      /> */}

    </>
  );
};

export default CategoriesPageClient;
