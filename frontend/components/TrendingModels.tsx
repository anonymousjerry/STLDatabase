// *********************
// Role: Featured site grid wrapper
// Name: FeaturedSite.tsx
// *********************

"use client";

import React from "react";
import { useState } from "react";
import PlatformItem from "./PlatformItem";
import Image from "next/image";
import { PlatformMenuList } from "@/lib/utils";
import { FaChevronLeft } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa6";
import ProductItem from "./ProductItem";

const TrendingModels = async () => {
    const [showAll, setShowAll] = useState(false);
    const data = await fetch(`${process.env.NEXT_PUBLIC_BACKENDPART_URL}/models`);
    const products = await data.json();
    const visibleProducts = showAll ? products : products.slice(0, 4);
    return (
        <div className="pt-10 px-32 max-xl:px-20 max-lg:px-10 max-md:px-6 bg-gray-100">
        <div className="flex flex-col bg-white rounded-[32px] px-11 max-md:px-6">
            <div className="grid grid-cols-2">
                <div className="flex text-[#0e162e] py-5  font-['Inter-Bold',_sans-serif] text-2xl font-bold">
                    TRENDING MODELS
                </div>
                {products.length > 4 && (
                    <div className="flex flex-row items-center justify-end">
                        <button
                            onClick={() => setShowAll((prev) => !prev)}
                            className="flex  relative"
                        >
                            {showAll ? 
                                <div className="flex items-center">
                                    <div className="text-[#4e4d80] text-center font-['Inter-SemiBold',_sans-serif] text-lg font-semibold">Show less</div>
                                    
                                    <FaChevronLeft className="text-gray-700 text-sx  ml-2" />
                                </div>
                            :
                                <div className="flex items-center">
                                    <div className="text-[#4e4d80] text-center font-['Inter-SemiBold',_sans-serif] text-lg font-semibold">See all</div>
                                    
                                    <FaChevronRight className="text-gray-700 text-sx  ml-2" />
                                </div>
                            }
                            
                        </button>
                    </div>
                    )}
            </div>

            <div className="grid grid-cols-4 max-xl:grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1 max-sm:grid-cols-1 gap-6 pb-7">
            {visibleProducts.map((product: Product) => (
            <ProductItem key={product.id} product={product} color="white" />
          ))}
            </div>
            
        </div>
        </div>
    );
};

export default TrendingModels;