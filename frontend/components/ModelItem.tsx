"use client";

import React, {useEffect} from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { HiDownload, HiOutlineFolderDownload } from "react-icons/hi";
import { useSession } from "next-auth/react";
import { likeModel, viewModel } from "@/lib/modelsApi";
import Image from "next/image";
import Link from "next/link";
import { useLikesStore } from "@/app/_zustand/useLikesStore";
import { useViewsStore } from "@/app/_zustand/useViewStore";
import { useSearch } from "@/context/SearchContext";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const ModelItem = ({ model, color }: { model: Model; color: string }) => {
  const { data: session, status } = useSession();
  const userId = (session?.user as { id?: string })?.id;
  const isDisabled = status !== "authenticated";

  const router = useRouter();


  const { likedModels, likesCount, toggleLike, reset } = useLikesStore();
  
  // Only use server-side like data to determine if current user has liked this model
  const likedModel = model.likes?.some((like: Like) => like.userId === userId) ?? false;
  const count = model.likes.length;

  const { addView, isView, ViewCounts } = useViewsStore();

  const sourceSiteName = model.sourceSite?.name ?? "";

  const {
      selectedPlatform,
      selectedCategory,
      searchTag,
      searchInput,
      searchPrice,
      liked,
      setSelectedPlatform,
      setSelectedCategory,
      setSelectedSubCategory,
      setSearchTag,
      setSearchInput,
      setSearchPrice,
      setliked
    } = useSearch();

  // Reset likes store when user changes (login/logout)
  useEffect(() => {
    reset();
  }, [userId, reset]);

  const slugify = (text: string): string =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-");

  const generateSlug = (category: string, subCategory: string, title: string) =>
    `${slugify(category)}/${slugify(subCategory)}/${slugify(title)}`;

  const handleModelOnClick = async (modelId: string) => {
    if (!userId) {
      toast.error("Please log in to like this model.");
      return;
    }

    try {
      await likeModel(modelId, userId, session?.accessToken || "");
      if(!likedModel) {
          toast.success("Model liked successfully!");
        } else {
          toast.success("Model disliked successfully!");
      }
    } catch (err) {
      console.error("Like failed:", err);
    }
  };

  const modelSlug = generateSlug(
    model.category.name,
    model.subCategory.name,
    model.title
  );

  const query = {
    id: model.id,
  };

  const handleToggleView = async (modelId: string) => {
    
    try {
      const data = await viewModel(modelId, session?.accessToken || "");
      addView(modelId, data.count);
      setSearchInput("");
      setSelectedCategory("All");
      setSelectedSubCategory({name: "", id: ""});
    } catch (error) {
      toast.error("Failed to view model.");
    }
  };

  const handleTagSearch = (tag: string) => {
    setSearchInput("");
    setSelectedCategory("All");
    setSearchTag(tag);

    const queryParams = new URLSearchParams();
    queryParams.set("tag", tag);
    queryParams.set("key", '');
    if (selectedPlatform && selectedPlatform !== "All")
      queryParams.set("sourcesite", selectedPlatform);
    if (searchPrice) queryParams.set("price", searchPrice);
    if (liked) queryParams.set("liked", 'true');
    queryParams.set("currentPage", '1');

    router.push(`/explore?${queryParams.toString()}`);
  };

  const handlePlatformSearchByImage = (platform: string) => {
    setSelectedPlatform(platform);

    const queryParams = new URLSearchParams();
    queryParams.set("sourcesite", platform);
    router.push(`/explore?${queryParams.toString()}`);
  }

  function formatPrice(priceStr: String) {
  // Extract the currency symbol (assume it's the first non-digit char)
  const match = priceStr.match(/[^0-9.]+/);
  const currency = match ? match[0] : "";

  // Extract the number part
  const num = parseFloat(priceStr.replace(/[^0-9.]/g, ""));

  if (isNaN(num)) return priceStr; // fallback if invalid input

  // Format with 1 decimal place
  return `${currency}${num.toFixed(1)}`;
}

  return (
    <div className="flex flex-col w-full bg-custom-light-containercolor dark:bg-custom-dark-containercolor shadow-lg rounded-3xl border border-gray-200 overflow-hidden relative">

      {/* Source icon */}
      <div className="absolute top-2 left-2 rounded-lg hover:bg-opacity-100 transition z-10">
        <div className="relative w-8 h-8 sm:w-10 sm:h-10">
          <Image
            src={model.sourceSite?.iconBigUrl}
            onClick={() => handlePlatformSearchByImage(model.sourceSite?.name)}
            alt={sourceSiteName}
            fill
            className="rounded-lg object-contain cursor-pointer transition-transform duration-200 hover:scale-105 hover:shadow-md"
            sizes="(max-width: 640px) 32px, 40px"
            unoptimized
          />
        </div>
      </div>

      {/* Image */}
      <Link
        href={{ pathname: `/explore/${modelSlug}`, query }}
        onClick={() => handleToggleView(model.id)}
        className="overflow-hidden rounded-t-3xl  h-36 sm:h-44 md:h-48 lg:h-52 relative"
      >
        <Image
          src={model.thumbnailUrl}
          alt={model.title}
          fill
          className="transition-transform duration-300 ease-in-out transform hover:scale-105 object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </Link>

      {/* Details */}
      <div className="flex flex-col px-3 py-2 text-custom-light-maincolor dark:text-custom-dark-titlecolor gap-2">

        {/* Title */}
        <Link
          href={{ pathname: `/explore/${modelSlug}`, query }}
          onClick={() => handleToggleView(model.id)}
          className="font-semibold text-lg sm:text-xl md:text-2xl truncate max-w-full hover:underline transition-colors duration-200"
        >
          {model.title}
        </Link>

        {/* Tags */}
        <div className="flex gap-2">
          {model.tags.slice(0, 2).map((tag: string, index: number) => (
            <div
              key={`${tag}-${index}`}
              onClick={() => handleTagSearch(tag)}
              className="max-w-[120px] truncate cursor-pointer rounded-md bg-custom-light-maincolor px-2 py-0.5 text-xs font-medium text-white sm:text-sm transition-colors hover:bg-custom-light-maincolor/90"
            >
              {tag}
            </div>
          ))}
        </div>

        {/* Meta Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm font-medium text-gray-700 dark:text-custom-dark-titlecolor">
          <div className="flex items-center gap-1">
            <HiOutlineFolderDownload className="text-base" size={20} />
            <span>{model.downloads} files</span>
          </div>
          <div className="flex items-center gap-1">
            <FaRegHeart className="text-base" size={18} />
            <span>{count} likes</span>
          </div>
          <div className="font-semibold text-lg sm:text-md text-custom-light-maincolor dark:text-custom-dark-maincolor">
            {model.price === "FREE" ? "Free" : formatPrice(model.price)}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pb-2">
          <button
            aria-label="Like"
            onClick={() => handleModelOnClick(model.id)}
            className={`
              flex items-center justify-center w-full sm:w-12 h-12 border rounded-xl transition-transform duration-200
              ${
                likedModel
                  ? "border-red-500 text-white bg-red-600 scale-105 dark:bg-red-700 dark:border-red-600 dark:text-red-300 dark:shadow-md dark:shadow-red-600"
                  : "border-custom-light-maincolor text-custom-light-maincolor hover:bg-[#f0f0f0] hover:scale-110 dark:border-gray-500 dark:text-gray-300 dark:hover:bg-gray-600"
              }
            `}
          >
            {likedModel ? (
              <FaHeart className="text-white" size={24} />
            ) : (
              <FaRegHeart size={24} />
            )}
          </button>

          <Link
            href={{ pathname: `/explore/${modelSlug}`, query }}
            onClick={() => handleToggleView(model.id)}
            className="flex-1 flex items-center justify-center gap-2 bg-custom-light-maincolor text-white rounded-xl py-2 font-medium text-base sm:text-lg md:text-xl lg:text-2xl transition-transform duration-200 hover:bg-[#3a3663] hover:scale-[1.03]"
          >
            <HiDownload />
            Download
          </Link>
        </div>
      </div>
    </div>

  );
};

export default ModelItem;
