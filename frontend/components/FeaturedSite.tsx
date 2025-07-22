// *********************
// Role: Featured site grid wrapper
// Name: FeaturedSite.tsx
// *********************

"use client";

import React, { useEffect } from "react";
import { useState } from "react";
import PlatformItem from "./PlatformItem";
import Image from "next/image";
import { PlatformMenuList } from "@/lib/utils";
import { FaChevronLeft } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa6";
import { getPlatforms } from "@/lib/platformApi";
import { platformList } from "@/utils/platformFormat";

const FeaturedSite = () => {
    const [showAll, setShowAll] = useState(false);
    const [platforms, setPlatforms] = useState([]);

    // useEffect(() => {
    //     getPlatforms().then(setPlatforms).catch(console.error);
    // }, [])

    // const PlatformMenuList = platformList(platforms);

    const visibleItems = showAll ? PlatformMenuList : PlatformMenuList.slice(0, 9);
    return (
        <div className="pt-10 px-52 max-xl:px-20 max-lg:px-10 max-md:px-6 bg-custom-light-secondcolor dark:bg-custom-dark-secondcolor">
        <div className="flex flex-col bg-custom-light-containercolor rounded-[32px] px-11 max-md:px-6">
            <div className="grid grid-cols-2">
                <div className="flex text-custom-light-titlecolor py-5  font-['Inter-Bold',_sans-serif] text-2xl font-bold">
                    FEATURED SITE
                </div>
                {PlatformMenuList.length > 9 && (
                    <div className="flex flex-row items-center justify-end">
                        <button
                            onClick={() => setShowAll((prev) => !prev)}
                            className="flex  relative"
                        >
                            {showAll ? 
                                <div className="flex items-center">
                                    <div className="text-custom-light-maincolor text-center font-['Inter-SemiBold',_sans-serif] text-lg font-semibold">Show less</div>
                                    
                                    <FaChevronLeft className="text-gray-700 text-sx  ml-2" />
                                </div>
                            :
                                <div className="flex items-center">
                                    <div className="text-custom-light-maincolor text-center font-['Inter-SemiBold',_sans-serif] text-lg font-semibold">See all</div>
                                    
                                    <FaChevronRight className="text-gray-700 text-sx  ml-2" />
                                </div>
                            }
                            
                        </button>
                    </div>
                    )}
            </div>

            <div className="grid grid-cols-9 max-xl:grid-cols-6 max-lg:grid-cols-4 max-md:grid-cols-3 max-sm:grid-cols-2 gap-6 pb-7">
            {visibleItems.map((item) => (
                <PlatformItem title={item.title} key={item.id} href={item.href}>
                <Image
                    src={item.src}
                    alt={item.title}
                    fill
                    sizes="20"
                    className="object-contain"
                />
                </PlatformItem>
            ))}
            </div>
            
        </div>
        </div>
    );
};

export default FeaturedSite;