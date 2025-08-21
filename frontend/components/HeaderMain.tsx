"use client";

import React from "react";
import SearchBar from "./SearchBar";

const HeaderMain = () => {

    return (
        <div className="bg-[url('/Header_bg.png')] bg-cover bg-center flex flex-col gap-4 sm:gap-6 lg:gap-8 items-start justify-start shrink-0 h-auto min-h-[300px] sm:min-h-[350px] lg:min-h-[441px] relative px-4 sm:px-8 md:px-16 lg:px-32 xl:px-52 py-6 sm:py-8">
            <div className="flex flex-col gap-2 sm:gap-3 items-start justify-start shrink-0 relative w-full">
                <div className="text-white text-left font-['Inter-Bold',_sans-serif] text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold relative w-full max-w-[539px] leading-tight">
                    Find 3D Printable Models in One Place{" "}
                </div>
                <div className="text-white text-left font-['-',_sans-serif] text-lg sm:text-xl lg:text-2xl font-normal relative w-full max-w-[474px] leading-relaxed">
                    <span>
                        <span className="explore-10-000-of-3-d-stl-files-from-top-platforms-in-one-place-span">
                        Explore{" "}
                        </span>
                        <span className="explore-10-000-of-3-d-stl-files-from-top-platforms-in-one-place-span2 font-semibold">
                        10.000+{" "}
                        </span>
                        <span className="explore-10-000-of-3-d-stl-files-from-top-platforms-in-one-place-span">
                        of 3D STL files from top platforms in one place.
                        </span>
                    </span>{" "}
                </div>
            </div>
            <div className="w-full">
                <SearchBar />
            </div>
        </div>
    );
};

export default HeaderMain;
