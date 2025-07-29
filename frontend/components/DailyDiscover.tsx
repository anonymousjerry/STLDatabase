// *********************
// Role of the component: products section intended to be on the home page
// Name of the component: ProductsSection.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <ProductsSection slug={slug} />
// Input parameters: no input parameters
// Output: products grid
// *********************

"use client"

import React, { useCallback, useRef } from "react";
import { getModels } from "@/lib/modelsApi";
import ModelItem from "./ModelItem";
import { useState, useEffect } from "react";

const DailyDiscover = () => {
  const [models, setModels] = useState<Model[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(false);

  const loadMoreModels = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const newModels: Model[] = await getModels(page); // Pass page param if needed

      if (Array.isArray(newModels) && newModels.length > 0) {
        setModels((prevModels) => {
          const seen = new Set(prevModels.map((m) => m.id));
          const filtered = newModels.filter((m) => !seen.has(m.id));
          return [...prevModels, ...filtered];
        });
        setPage((prevPage) => prevPage + 1);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading models:", error);
    } finally {
      setLoading(false);
    }
  }, [page, hasMore, loading]);

  useEffect(() => {
    loadMoreModels();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          loadMoreModels();
        }
      },
      { threshold: 1 }
    );

    if (observerRef.current) observer.observe(observerRef.current);

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [loadMoreModels]);

  return (
    <div className="py-10 px-52 max-xl:px-20 max-lg:px-10 max-md:px-6 flex flex-col bg-custom-light-secondcolor dark:bg-custom-dark-secondcolor">
      <div className="flex flex-col bg-custom-light-containercolor dark:bg-custom-dark-containercolor rounded-t-[24px]  border-b-4 border-custom-light-maincolor px-11 mt-10 max-md:px-6">
        <div className="flex text-custom-light-titlecolor dark:text-custom-dark-titlecolor  py-3  font-['Inter-Bold',_sans-serif] text-2xl font-bold">
          DAILY DISCOVER
        </div>
      </div>
      <div className=" pt-10 bg-custom-light-secondcolor dark:bg-custom-dark-secondcolor">
        <div className="grid grid-cols-4 justify-between gap-x-12 gap-y-8 max-xl:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1">
          {models.map((model: Model) => (
            <ModelItem key={model.id} model={model} color="white" />
          ))}

          {loading &&
            [...Array(4)].map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="animate-pulse rounded-md bg-white p-4 shadow-md"
              >
                <div className="h-40 bg-gray-300 rounded mb-4" />
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
        </div>

        {/* Loader trigger div */}
        {hasMore && (
          <div ref={observerRef} className="h-10 mt-10 flex justify-center items-center">
            {loading && <span>Loading more models...</span>}
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyDiscover;
