"use client";

import React, {useEffect, useState} from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { HiDownload, HiOutlineFolderDownload } from "react-icons/hi";
import { useSession } from "next-auth/react";
import { likeModel, viewModel } from "@/lib/modelsApi";
import Image from "next/image";
import Link from "next/link";
import { useLikesStore } from "@/app/_zustand/useLikesStore";
import { useViewsStore } from "@/app/_zustand/useViewStore";
import { useSearch } from "@/context/SearchContext";
import { useRecaptcha } from "@/hooks/useRecaptcha";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const ModelItem = ({ model, color }: { model: Model; color: string }) => {
  const { data: session, status } = useSession();
  const userId = (session?.user as { id?: string })?.id;
  const isDisabled = status !== "authenticated";
  const { executeRecaptcha, isReady: recaptchaReady } = useRecaptcha();

  const router = useRouter();


  const { likedModels, likesCount, toggleLike } = useLikesStore();
  
  // Use store state, fallback to server data
  // If user is not authenticated, always show as unliked
  const likedModel = userId ? (likedModels[model.id] ?? model.likes?.some((like: Like) => like.userId === userId) ?? false) : false;
  const count = likesCount[model.id] ?? model.likes.length;

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



  const slugify = (text: string): string =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-");

  const generateSlug = (category: string, subCategory: string, title: string) =>
    `${slugify(category)}/${slugify(subCategory)}/${slugify(title)}`;

  const [isLiking, setIsLiking] = useState(false);

  // Initialize store with server data if not already set
  useEffect(() => {
    if (model.likes && userId && status === "authenticated") {
      const serverLiked = model.likes.some((like: Like) => like.userId === userId);
      const serverCount = model.likes.length;
      
      // Always update if server data is different from store data
      const currentStoreLiked = likedModels[model.id];
      if (currentStoreLiked === undefined || currentStoreLiked !== serverLiked) {
        useLikesStore.getState().setLikeStatus(model.id, serverLiked, serverCount);
      }
    }
  }, [model.id, model.likes, userId, status, likedModels]);

  // Global initialization when user logs in
  useEffect(() => {
    if (status === "authenticated" && userId && model.likes) {
      const serverLiked = model.likes.some((like: Like) => like.userId === userId);
      const serverCount = model.likes.length;
      
      // Force update store when user first logs in
      useLikesStore.getState().setLikeStatus(model.id, serverLiked, serverCount);
    }
  }, [status, userId, model.id, model.likes]);

  const handleModelOnClick = async (modelId: string) => {
    if (!userId) {
      toast.error("Please log in to like this model.");
      return;
    }

    if (isLiking) {
      return; // Prevent rapid clicking
    }

    try {
      setIsLiking(true);
      
      // Execute reCAPTCHA for like action
      if (recaptchaReady) {
        await executeRecaptcha('like');
      }
      
      // Check current state before toggling
      const wasLiked = likedModel;
      
      // Optimistically update UI
      toggleLike(modelId);
      
      // Call API
      const response = await likeModel(modelId, userId, session?.accessToken || "");
      
      // Update server data to reflect the new state
      if (response.success) {
        // Update the model's likes array to reflect the new state
        const newLikes = wasLiked 
          ? (model.likes || []).filter((like: Like) => like.userId !== userId)
          : [...(model.likes || []), { userId, modelId }];
        
        // Update the model object (this will trigger re-render with correct server data)
        Object.assign(model, { likes: newLikes });
        
        // Update store with the new server data
        useLikesStore.getState().setLikeStatus(modelId, !wasLiked, newLikes.length);
      }
      
      // Show appropriate message based on the action
      if (!wasLiked) {
        toast.success("Model liked successfully!");
      } else {
        toast.success("Model disliked successfully!");
      }
    } catch (err) {
      // Revert on error
      toggleLike(modelId); // Toggle back to original state
      console.error("Like failed:", err);
      if (err instanceof Error && err.message.includes('reCAPTCHA')) {
        toast.error("Security verification failed. Please try again.");
      } else {
        toast.error("Failed to update like status. Please try again.");
      }
    } finally {
      setIsLiking(false);
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
      // Execute reCAPTCHA for view action
      if (recaptchaReady) {
        await executeRecaptcha('view');
      }
      
      const data = await viewModel(modelId, session?.accessToken || "");
      addView(modelId, data.count);
      setSearchInput("");
      setSelectedCategory("All");
      setSelectedSubCategory({name: "", id: ""});
    } catch (error) {
      console.error(error)
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

  const [width, setWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1000
  );

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Function to render the meta section
  // const renderMeta = () => {
  //   // Use the count variable that's already calculated with store data

  //   // >=900px: single div with all three items
  //   if (width >= 620) {
  //     return (
  //       <div className="flex items-center text-xs sm:text-sm font-medium text-gray-700 dark:text-custom-dark-titlecolor justify-between">
  //         {/* Downloads */}
  //         <div className="flex items-center gap-1">
  //           <HiOutlineFolderDownload className="text-base" size={20} />
  //           <span>{model.downloads} downloads</span>
  //         </div>

  //         {/* Likes */}
  //         <div className="flex items-center gap-1">
  //           {likedModel ? (
  //             <FaHeart className="text-base text-red-500" size={18} />
  //           ) : (
  //             <FaRegHeart className="text-base" size={18} />
  //           )}
  //           <span>{count} likes</span>
  //         </div>

  //         {/* Price */}
  //         <div className="font-semibold text-lg sm:text-md text-custom-light-maincolor dark:text-custom-dark-maincolor ">
  //           {model.price === "FREE" ? "Free" : formatPrice(model.price)}
  //         </div>
  //       </div>
  //     );
  //   }

  //   // 480px <= width < 620px: two divs
  //   if (width >= 480) {
  //     return (
  //       <div className="flex w-full items-center justify-between text-xs sm:text-sm font-medium text-gray-700 dark:text-custom-dark-titlecolor">
  //         {/* Downloads + Likes */}
  //         <div className="flex items-center gap-3">
  //           <div className="flex items-center gap-1">
  //             <HiOutlineFolderDownload className="text-base" size={20} />
  //             <span>{model.downloads}</span>
  //             <span className="hidden md:inline"> downloads</span>
  //           </div>
  //           <div className="flex items-center gap-1">
  //             {likedModel ? (
  //               <FaHeart className="text-base text-red-500" size={18} />
  //             ) : (
  //               <FaRegHeart className="text-base" size={18} />
  //             )}
  //             <span>{count}</span>
  //             <span className="hidden md:inline"> likes</span>
  //           </div>
  //         </div>

  //         {/* Price */}
  //         <div className="font-semibold text-lg sm:text-md text-custom-light-maincolor dark:text-custom-dark-maincolor">
  //           {model.price === "FREE" ? "Free" : formatPrice(model.price)}
  //         </div>
  //       </div>
  //     );
  //   }

  //   if (width >= 350) {
  //     return (
  //       <div className="flex items-center text-xs sm:text-sm font-medium text-gray-700 dark:text-custom-dark-titlecolor justify-between">
  //         {/* Downloads */}
  //         <div className="flex items-center gap-1">
  //           <HiOutlineFolderDownload className="text-base" size={20} />
  //           <span>{model.downloads} downloads</span>
  //         </div>

  //         {/* Likes */}
  //         <div className="flex items-center gap-1">
  //           {likedModel ? (
  //             <FaHeart className="text-base text-red-500" size={18} />
  //           ) : (
  //             <FaRegHeart className="text-base" size={18} />
  //           )}
  //           <span>{count} likes</span>
  //         </div>

  //         {/* Price */}
  //         <div className="font-semibold text-lg sm:text-md text-custom-light-maincolor dark:text-custom-dark-maincolor ">
  //           {model.price === "FREE" ? "Free" : formatPrice(model.price)}
  //         </div>
  //       </div>
  //     );
  //   }

  //   // <350px: single div, justify-between
  //   return (
  //     <div className="flex w-full items-center justify-between text-xs sm:text-sm font-medium text-gray-700 dark:text-custom-dark-titlecolor">
  //       <div className="flex items-center gap-3">
  //         <div className="flex items-center gap-1">
  //           <HiOutlineFolderDownload className="text-base" size={20} />
  //           <span>{model.downloads}</span>
  //           <span className="hidden md:inline"> downloads</span>

  //         </div>
  //         <div className="flex items-center gap-1">
  //           {likedModel ? (
  //             <FaHeart className="text-base text-red-500" size={18} />
  //           ) : (
  //             <FaRegHeart className="text-base" size={18} />
  //           )}
  //           <span>{count}</span>
  //           <span className="hidden md:inline"> likes</span>
  //         </div>
  //       </div>

  //       <div className="font-semibold text-lg sm:text-md text-custom-light-maincolor dark:text-custom-dark-maincolor">
  //         {model.price === "FREE" ? "Free" : formatPrice(model.price)}
  //       </div>
  //     </div>
  //   );
  // };

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
          className="font-semibold text-base sm:text-lg md:text-xl truncate max-w-full hover:underline transition-colors duration-200"
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
        <div className="flex w-full items-center justify-between text-lg sm:text-md font-medium text-gray-700 dark:text-custom-dark-titlecolor">
          {/* Downloads + Likes */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <HiDownload className="text-base" size={22} />
              <span>{model.downloads}</span>
              {/* <span className="hidden md:inline"> downloads</span> */}
            </div>
            <div className="flex items-center gap-1">
              {likedModel ? (
                <FaHeart className="text-base text-red-500" size={18} />
              ) : (
                <FaRegHeart className="text-base" size={18} />
              )}
              <span>{count}</span>
              {/* <span className="hidden md:inline"> likes</span> */}
            </div>
          </div>

          {/* Price */}
          <div className="font-semibold text-2xl sm:text-xl text-custom-light-maincolor dark:text-custom-dark-maincolor">
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
