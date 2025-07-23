"use client"

import React from "react"
import { useState, useEffect } from "react"
import DropdownButton from "./Dropdown"
import SearchInput from "./SearchInput"
import { getSubCategories } from "@/lib/categoryApi"
import { getPlatforms } from "@/lib/platformApi"


const SearchBar = () => {
    const categories = [
        '🎮 Gaming',
        '🎨 Art',
        '🏠 Home & Living',
        '🛠️ Tools',
        '🐾 Pets',
    ];
    const platforms = [
        '🎮 Gaming',
        '🎨 Art',
        '🏠 Home & Living',
        '🛠️ Tools',
        '🐾 Pets',
    ];

    // const [platforms, setPlatforms] = useState([]);
    // const [categories, setCategories] = useState([]);

    // useEffect(() => {
 //         getPlatforms().then(setPlatforms).catch(console.error);
    //     getSubCategories().then(setCategories).catch(console.error);
    // }, [])
    // const platformArray = platforms.map(([platform]) => platform);
    // const categoryArray = categories.map(([category]) => category);
    const handleSelect = (item: string) => {
        console.log('Selected:', item);
    };


    return(
        <div className="flex w-full gap-2.5 bg-custom-light-containercolor  rounded-lg px-[47px] py-[39px]">
              <div className="basis-1/5">
                <DropdownButton
                  initialContent="All"
                  label="platform"
                  list={platforms}
                  onSelect={handleSelect}
                />
              </div>

              <div className="basis-1/5">
                <DropdownButton
                  initialContent="All"
                  label="categories"
                  list={categories}
                  onSelect={handleSelect}
                />
              </div>

              <div className="basis-3/5">
                <SearchInput />
              </div>
            </div>
    )
}

export default SearchBar;