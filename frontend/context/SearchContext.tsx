"use client"

import { createContext, useContext, useState } from "react";


type SearchContextType = {
  selectedPlatform: string;
  selectedCategory: string;
  searchInput: string;
  setSelectedPlatform: (value: string) => void;
  setSelectedCategory: (value: string) => void;
  setSearchInput: (value: string) => void;
};

const SearchContext = createContext<SearchContextType | null>(null);

export const SearchProvider = ({children}: {children: React.ReactNode}) => {
    const [selectedPlatform, setSelectedPlatform] = useState("All");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchInput, setSearchInput] = useState("");

    return (
        <SearchContext.Provider
            value={{
                selectedPlatform,
                selectedCategory,
                searchInput,
                setSelectedPlatform,
                setSelectedCategory,
                setSearchInput,
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