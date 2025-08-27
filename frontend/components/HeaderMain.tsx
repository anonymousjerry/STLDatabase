"use client";

import React from "react";
import SearchBar from "./SearchBar";

const HeaderMain = () => {

    return (
        <div className="bg-[url('/Header_bg.png')] bg-cover bg-center flex flex-col gap-4 sm:gap-6 lg:gap-8 items-start justify-start shrink-0 h-auto min-h-[300px] sm:min-h-[350px] lg:min-h-[441px] relative px-52 max-xl:px-30 max-lg:px-20 max-md:px-10 py-6 sm:py-8">
            <div className="flex flex-col gap-2 sm:gap-3 items-start justify-start shrink-0 relative w-full">
                <div className="text-white text-left font-['Inter-Bold',_sans-serif] text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold relative w-full max-w-[539px] leading-tight">
                    All Your 3D Print Files in One Place{" "}
                </div>
                <p className="text-white/90 text-left text-lg sm:text-xl lg:text-2xl font-normal leading-relaxed max-w-2xl">
                    Explore{" "}
                    <span className="font-semibold text-white">
                        10,000+
                    </span>{" "}
                    3D models from top platforms — searchable, sortable, ready to print.
                </p>
            </div>
            <div className="w-full">
                <SearchBar />
            </div>
        </div>
    );
};

export default HeaderMain;
