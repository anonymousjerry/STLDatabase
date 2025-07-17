"use client";

import React, { useState, useRef, useEffect } from "react";
import SearchInput from "./SearchInput";
import DropdownButton from "./Dropdown";

const HeaderMain = () => {

    const [accountMenuOpen, setAccountMenuOpen] = useState<boolean>(false);
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
    const handleSelect = (item: string) => {
        console.log('Selected:', item);
    };
    return (
        <div className="bg-[url('/Header_bg.png')] bg-cover bg-center flex flex-col gap-8 items-start justify-start shrink-0 h-[441px]  relative px-32 py-8 ">
            <div className="flex flex-col gap-2 items-start justify-start shrink-0 relative">
                <div className="text-[#ffffff] text-left font-['Inter-Bold',_sans-serif] text-5xl font-bold relative w-[539px] ">
                    Find 3D Printable Models in One Place{" "}
                </div>
                <div className="text-[#ffffff] text-left font-['-',_sans-serif] text-2xl font-normal relative w-[474px]">
                    <span>
                        <span className="explore-10-000-of-3-d-stl-files-from-top-platforms-in-one-place-span">
                        Explore{" "}
                        </span>
                        <span className="explore-10-000-of-3-d-stl-files-from-top-platforms-in-one-place-span2">
                        10.000+{" "}
                        </span>
                        <span className="explore-10-000-of-3-d-stl-files-from-top-platforms-in-one-place-span">
                        of 3D STL files from top platforms in one place.
                        </span>
                    </span>{" "}
                </div>
            </div>
            <div className="flex w-full gap-2.5 bg-white rounded-lg px-[47px] py-[39px]">
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
        </div>
    );
};

export default HeaderMain;
