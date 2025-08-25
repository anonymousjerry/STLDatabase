"use client"

import { createContext, useContext, useState } from "react";


type SearchContextType = {
  selectedPlatform: string;
  selectedCategory: string;
  selectedSubCategory: SubCategory;
  searchInput: string;
  searchPrice: string;
  searchTag: string;
  favourited: boolean;
  userId: string;
  setSelectedPlatform: (value: string) => void;
  setSelectedCategory: (value: string) => void;
  setSelectedSubCategory: (value: SubCategory) => void;
  setSearchInput: (value: string) => void;
  setSearchPrice: (value: string) => void;
  setSearchTag: (value: string) => void;
  setfavourited: (value: boolean) => void;
  setUserId: (value: string) => void;
};

const SearchContext = createContext<SearchContextType | null>(null);

export const SearchProvider = ({children}: {children: React.ReactNode}) => {
    const [selectedPlatform, setSelectedPlatform] = useState("All");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory>({ id: "", name: "" });
    const [searchInput, setSearchInput] = useState("");
    const [searchPrice, setSearchPrice] = useState("");
    const [searchTag, setSearchTag] = useState("");
    const [favourited, setfavourited] = useState(false);
    const [userId, setUserId] = useState("");

    return (
        <SearchContext.Provider
            value={{
                selectedPlatform,
                selectedCategory,
                selectedSubCategory,
                searchInput,
                searchPrice,
                searchTag,
                favourited,
                userId,
                setSelectedPlatform,
                setSelectedCategory,
                setSelectedSubCategory,
                setSearchInput,
                setSearchPrice,
                setSearchTag,
                setfavourited,
                setUserId
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