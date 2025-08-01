"use client"

import React, {useState, useEffect} from "react";
import { useRouter } from "next/navigation";
import { useSearch } from "@/context/SearchContext";
import { getSubCategories } from "@/lib/categoryApi";

const CategoriesFilter = () => {
    const router = useRouter();

    const [categories, setCategories] = useState<string[]>([]);
    
    const {
        selectedPlatform,
        selectedCategory,
        searchInput,
        searchPrice,
        favorited,
        setSelectedPlatform,
        setSelectedCategory,
        setSearchInput,
        setSearchPrice,
        setFavorited,
    } = useSearch();
    
    useEffect(() => {
        getSubCategories().then(setCategories).catch(console.error);
    }, []);

    const handleRadioChange = (option: string) => {
        setSelectedCategory(option);

        const queryParams = new URLSearchParams();

        queryParams.set("category", option);
        if (selectedPlatform && selectedPlatform !== "All")
        queryParams.set("sourcesite", selectedPlatform);
        if (searchInput) queryParams.set("key", searchInput);
        if (searchPrice) queryParams.set("price", searchPrice);
        if (favorited) queryParams.set("favorited", 'true');

        router.push(`/explore?${queryParams.toString()}`);
};
    
    return(
        <div className="ml-2 mt-1 space-y-2">
            {categories.map((option) => (
                <label
                key={option}
                className="flex items-center gap-2 text-sm text-gray-800 dark:text-gray-200"
                >
                <input
                    type="radio"
                    name="Categories"
                    value={option}
                    checked={selectedCategory === option}
                    onChange={() => handleRadioChange(option)}
                    className="w-4 h-4 accent-blue-600 dark:accent-blue-400"
                />
                <span>{option}</span>
                </label>
            ))}
        </div>

    )
}

export default CategoriesFilter;