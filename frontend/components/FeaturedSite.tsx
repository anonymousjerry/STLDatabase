"use client";

import React, { useEffect, useState } from "react";
import PlatformItem from "./PlatformItem";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { getPlatforms } from "@/lib/platformApi";
import { platformList } from "@/utils/platformFormat";
import LoadingOverlay from "./LoadingOverlay";

const FeaturedSite = () => {
  const [showAll, setShowAll] = useState(false);
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(true); // <-- loading state

  useEffect(() => {
    setLoading(true);
    getPlatforms()
      .then(setPlatforms)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const PlatformMenuList = platformList(platforms);
  const visibleItems = showAll ? PlatformMenuList : PlatformMenuList.slice(0, 9);

  return (
    <div className="pt-6 px-52 max-xl:px-30 max-lg:px-20 max-md:px-10 mx-auto bg-custom-light-secondcolor dark:bg-custom-dark-secondcolor relative">
      {/* Loading Overlay */}
      <LoadingOverlay show={loading} size={50}/>

      <div className="flex flex-col bg-custom-light-containercolor dark:bg-custom-dark-containercolor rounded-[32px] px-11 max-md:px-6">
        <div className="grid grid-cols-2">
          <div className="flex text-custom-light-titlecolor dark:text-custom-dark-titlecolor py-5 text-2xl font-bold">
            FEATURED SITE
          </div>
          {PlatformMenuList.length > 9 && (
            <div className="flex items-center justify-end">
              <button
                onClick={() => setShowAll((prev) => !prev)}
                className="flex items-center gap-2 px-3 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {showAll ? (
                  <>
                    <div className="text-custom-light-maincolor font-semibold text-lg">
                      Show less
                    </div>
                    <FaChevronLeft className="text-gray-700 text-xs" />
                  </>
                ) : (
                  <>
                    <div className="text-custom-light-maincolor font-semibold text-lg">
                      See all
                    </div>
                    <FaChevronRight className="text-gray-700 text-xs" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        <div
          key={showAll ? "all" : "partial"}
          className="grid grid-cols-9 max-xl:grid-cols-6 max-lg:grid-cols-4 max-md:grid-cols-3 max-sm:grid-cols-2 gap-x-6 gap-y-8 pb-7 transition-opacity duration-300 ease-in-out"
          style={{ opacity: showAll ? 1 : 0.95 }}
        >
          {visibleItems.map((item) => (
            <PlatformItem title={item.title} key={item.id}>
              <Image
                src={item.src}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, 20vw"
                className="object-contain"
                unoptimized
              />
            </PlatformItem>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedSite;
