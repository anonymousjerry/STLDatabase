"use client";

import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from "react";

type SearchContextType = {
  selectedPlatform: string;
  selectedCategory: string;
  selectedSubCategory: SubCategory;
  searchInput: string;
  searchPrice: string;
  searchTag: string;
  favourited: boolean;
  liked: boolean;
  userId: string;
  setSelectedPlatform: (value: string) => void;
  setSelectedCategory: (value: string) => void;
  setSelectedSubCategory: (value: SubCategory) => void;
  setSearchInput: (value: string) => void;
  setSearchPrice: (value: string) => void;
  setSearchTag: (value: string) => void;
  setfavourited: (value: boolean) => void;
  setliked: (value: boolean) => void;
  setUserId: (value: string) => void;
  resetSearch: () => void;
  getSearchParams: () => Record<string, any>;
};

const SearchContext = createContext<SearchContextType | null>(null);

const initialSubCategory: SubCategory = { id: "", name: "" };

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [selectedPlatform, setSelectedPlatform] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory>(initialSubCategory);
  const [searchInput, setSearchInput] = useState("");
  const [searchPrice, setSearchPrice] = useState("");
  const [searchTag, setSearchTag] = useState("");
  const [favourited, setfavourited] = useState(false);
  const [liked, setliked] = useState(false);
  const [userId, setUserId] = useState("");

  // Memoized setters to prevent unnecessary re-renders
  const memoizedSetSelectedPlatform = useCallback((value: string) => {
    setSelectedPlatform(value);
  }, []);

  const memoizedSetSelectedCategory = useCallback((value: string) => {
    setSelectedCategory(value);
  }, []);

  const memoizedSetSelectedSubCategory = useCallback((value: SubCategory) => {
    setSelectedSubCategory(value);
  }, []);

  const memoizedSetSearchInput = useCallback((value: string) => {
    setSearchInput(value);
  }, []);

  const memoizedSetSearchPrice = useCallback((value: string) => {
    setSearchPrice(value);
  }, []);

  const memoizedSetSearchTag = useCallback((value: string) => {
    setSearchTag(value);
  }, []);

  const memoizedSetFavourited = useCallback((value: boolean) => {
    setfavourited(value);
  }, []);

  const memoizedSetLiked = useCallback((value: boolean) => {
    setliked(value);
  }, []);

  const memoizedSetUserId = useCallback((value: string) => {
    setUserId(value);
  }, []);

  const resetSearch = useCallback(() => {
    setSelectedPlatform("All");
    setSelectedCategory("All");
    setSelectedSubCategory(initialSubCategory);
    setSearchInput("");
    setSearchPrice("");
    setSearchTag("");
    setfavourited(false);
    setliked(false);
  }, []);

  const getSearchParams = useCallback(() => {
    return {
      selectedPlatform,
      selectedCategory,
      selectedSubCategory,
      searchInput,
      searchPrice,
      searchTag,
      favourited,
      liked,
      userId,
    };
  }, [selectedPlatform, selectedCategory, selectedSubCategory, searchInput, searchPrice, searchTag, favourited, liked, userId]);

  // Memoized context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    selectedPlatform,
    selectedCategory,
    selectedSubCategory,
    searchInput,
    searchPrice,
    searchTag,
    favourited,
    liked,
    userId,
    setSelectedPlatform: memoizedSetSelectedPlatform,
    setSelectedCategory: memoizedSetSelectedCategory,
    setSelectedSubCategory: memoizedSetSelectedSubCategory,
    setSearchInput: memoizedSetSearchInput,
    setSearchPrice: memoizedSetSearchPrice,
    setSearchTag: memoizedSetSearchTag,
    setfavourited: memoizedSetFavourited,
    setliked: memoizedSetLiked,
    setUserId: memoizedSetUserId,
    resetSearch,
    getSearchParams,
  }), [
    selectedPlatform,
    selectedCategory,
    selectedSubCategory,
    searchInput,
    searchPrice,
    searchTag,
    favourited,
    liked,
    userId,
    memoizedSetSelectedPlatform,
    memoizedSetSelectedCategory,
    memoizedSetSelectedSubCategory,
    memoizedSetSearchInput,
    memoizedSetSearchPrice,
    memoizedSetSearchTag,
    memoizedSetFavourited,
    memoizedSetLiked,
    memoizedSetUserId,
    resetSearch,
    getSearchParams,
  ]);

  return (
    <SearchContext.Provider value={contextValue}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) throw new Error('useSearch must be used within SearchProvider');
  return context;
};