// *********************
// Role: Featured site grid wrapper
// Name: FeaturedSite.tsx
// *********************

"use client";

import React from "react";
import { useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa6";
import ProductItem from "./ProductItem";
import { modelLists } from "@/lib/utils";
import { useEffect } from "react";
import { getModels, getTrendingModels } from "@/lib/modelsApi";
import ModelItem from "./ModelItem";

const TrendingModels = () => {
    const [showAll, setShowAll] = useState(false);
    const [trendingModels, setTrendingModels] = useState([]);

    useEffect(() => {
        getModels().then(setTrendingModels).catch(console.error);
    }, [])

    const visibleProducts = showAll ? trendingModels : trendingModels.slice(0, 4);
    // const visibleProducts = showAll ? modelLists : modelLists.slice(0, 4);
    return (
        <div className="pt-10 px-52 max-xl:px-20 max-lg:px-10 max-md:px-6 bg-custom-light-secondcolor dark:bg-custom-dark-secondcolor">
        <div className="flex flex-col bg-custom-light-containercolor rounded-[32px] px-11 max-md:px-6">
            <div className="grid grid-cols-2">
                <div className="flex text-custom-light-titlecolor  py-5  font-['Inter-Bold',_sans-serif] text-2xl font-bold">
                    TRENDING MODELS
                </div>
                {modelLists.length > 4 && (
                    <div className="flex flex-row items-center justify-end">
                        <button
                            onClick={() => setShowAll((prev) => !prev)}
                            className="flex  relative"
                        >
                            {showAll ? 
                                <div className="flex items-center">
                                    <div className="text-custom-light-maincolor  text-center font-['Inter-SemiBold',_sans-serif] text-lg font-semibold">Show less</div>
                                    
                                    <FaChevronLeft className="text-gray-700  text-sx  ml-2" />
                                </div>
                            :
                                <div className="flex items-center">
                                    <div className="text-custom-light-maincolor  text-center font-['Inter-SemiBold',_sans-serif] text-lg font-semibold">See all</div>
                                    
                                    <FaChevronRight className="text-gray-700  text-sx  ml-2" />
                                </div>
                            }
                            
                        </button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-4 max-xl:grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1 max-sm:grid-cols-1 gap-6 pb-7">
                {visibleProducts.map((model: Model) => (
                    <ModelItem key={model.id} model={model} color="white" />
                ))}
            </div>
            
        </div>
        </div>
    );
};

export default TrendingModels;