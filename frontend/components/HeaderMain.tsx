"use client";

import React from "react";
import SearchBar from "./SearchBar";

const HeaderMain = () => {

    return (
        <div className="bg-[url('/Header_bg.png')] bg-cover bg-center flex flex-col gap-8 items-start justify-start shrink-0 h-[441px]  relative px-52 py-8 ">
            <div className="flex flex-col gap-2 items-start justify-start shrink-0 relative">
                <div className="text-white text-left font-['Inter-Bold',_sans-serif] text-5xl font-bold relative w-[539px] ">
                    Find 3D Printable Models in One Place{" "}
                </div>
                <div className="text-white text-left font-['-',_sans-serif] text-2xl font-normal relative w-[474px]">
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
            <SearchBar />
        </div>
    );
};

export default HeaderMain;
