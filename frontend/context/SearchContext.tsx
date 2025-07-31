"use client"

import { createContext, useContext, useState } from "react";


type SearchContextType = {
  selectedPlatform: string;
  selectedCategory: string;
  searchInput: string;
  searchPrice: string;
  favorited: boolean;
  setSelectedPlatform: (value: string) => void;
  setSelectedCategory: (value: string) => void;
  setSearchInput: (value: string) => void;
  setSearchPrice: (value: string) => void;
  setFavorited: (value: boolean) => void;
};

const SearchContext = createContext<SearchContextType | null>(null);

export const SearchProvider = ({children}: {children: React.ReactNode}) => {
    const [selectedPlatform, setSelectedPlatform] = useState("All");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchInput, setSearchInput] = useState("");
    const [searchPrice, setSearchPrice] = useState("");
    const [favorited, setFavorited] = useState(false);

    return (
        <SearchContext.Provider
            value={{
                selectedPlatform,
                selectedCategory,
                searchInput,
                searchPrice,
                favorited,
                setSelectedPlatform,
                setSelectedCategory,
                setSearchInput,
                setSearchPrice,
                setFavorited
            }}
        >
            {children}
        </SearchContext.Provider>
    );
};

export const useSearch = () => {
    const context = useContext(SearchContext);
    if (!context) throw new Error('useSearch must be used within SearchProvider');
    return context;
};