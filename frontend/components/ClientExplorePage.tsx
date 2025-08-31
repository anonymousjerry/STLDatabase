"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Breadcrumb from "./Breadcrumb";
import SearchBar from "./SearchBar";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { HiDownload } from "react-icons/hi";
import { CiBookmark, CiBookmarkCheck, CiFlag1, CiHeart, CiShare2, CiStar, } from "react-icons/ci";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";
import { useSession } from "next-auth/react";
import { downloadModel, likeModel, saveModel } from "@/lib/modelsApi";
import SuggestionSection from "./SuggestionSection";
import { useLikesStore } from "@/app/_zustand/useLikesStore";
import toast from "react-hot-toast";
import { useDownloadsStore } from "@/app/_zustand/useDonwloadStore";
import { useSearch } from "@/context/SearchContext";
import { useRouter } from "next/navigation";
import OptimizedAdPositionManager from "./ads/OptimizedAdPositionManager";
import Head from "next/head";
import Container from "./Container";

interface ClientExplorePageProps {
  category: string;
  subCategory: string;
  title: string;
  id: string;
  result: Model;
}

export default function ClientExplorePage({
  category,
  subCategory,
  title,
  id,
  result,
}: ClientExplorePageProps) {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [fadeKey, setFadeKey] = useState(0);
  const [showMore, setShowMore] = useState(false);
  const { data: session, status } = useSession();
  const userId = (session?.user as { id?: string })?.id;

  const { likedModels, likesCount, toggleLike } = useLikesStore();
  // Use store state, fallback to server data
  const likedmodel = likedModels[id] ?? result.likes?.some((like: Like) => like.userId === userId) ?? false;
  const count = likesCount[id] ?? result.likes.length;

  // Initialize store with server data if not already set
  useEffect(() => {
    if (result.likes && userId) {
      const serverLiked = result.likes.some((like: Like) => like.userId === userId);
      const serverCount = result.likes.length;
      
      // Always update if server data is different from store data
      const currentStoreLiked = likedModels[id];
      if (currentStoreLiked === undefined || currentStoreLiked !== serverLiked) {
        useLikesStore.getState().setLikeStatus(id, serverLiked, serverCount);
      }
    }
  }, [id, result.likes, userId, likedModels]);

  // Global initialization when user logs in
  useEffect(() => {
    if (result.likes && userId) {
      const serverLiked = result.likes.some((like: Like) => like.userId === userId);
      const serverCount = result.likes.length;
      
      // Force update store when user first logs in
      useLikesStore.getState().setLikeStatus(id, serverLiked, serverCount);
    }
  }, [userId, id, result.likes]);

  const { addDownload, isDownload, DownloadCounts } = useDownloadsStore();

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

  const router = useRouter();

  const sentences =
    result.description.match(/[^.!?]+[.!?]/g) || [result.description];
  const shortText = sentences.slice(0, 2).join(" ");

  const bigImagesUrl = result.imagesUrl.map((pair) => pair[0]);
  const smallImagesUrl = result.imagesUrl.map((pair) => pair[1]);

  // Responsive items per page: 4 on mobile, 5 on larger screens
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  useEffect(() => {
    const updateItemsPerPage = () => {
      if (typeof window !== 'undefined') {
        const isMobile = window.matchMedia('(max-width: 640px)').matches;
        setItemsPerPage(isMobile ? 4 : 5);
      }
    };
    updateItemsPerPage();
    window.addEventListener('resize', updateItemsPerPage);
    return () => window.removeEventListener('resize', updateItemsPerPage);
  }, []);

  const totalPages = Math.ceil(smallImagesUrl.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = smallImagesUrl.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === currentPage) return;
    setDirection(newPage > currentPage ? "next" : "prev");
    setFadeKey((prev) => prev + 1);
    setCurrentPage(newPage);
    setSelectedIndex(0);
  };

  const slugify = (text: string): string =>
    text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "")
      .replace(/--+/g, "-")
      .replace(/^-+|-+$/g, "");

  const sourceSiteName = result.sourceSite?.name ?? "";

  const handleToggleDownload = async (modelId: string) => {

    try {
      const data = await downloadModel(modelId, session?.accessToken || "");
      addDownload(modelId, data.downloads);
      toast.success("Model downloaded successfully!")
    } catch (error) {
      console.error("Download failed:", error);
      toast.error(error instanceof Error ? error.message : "Failed to download model.");
    }
  };

  const handleShare = async () => {
      try {
          await navigator.clipboard.writeText(window.location.href);
          toast.success("Page URL copied to clipboard!");
      } catch (err) {
          console.error("Failed to copy:", err);
          toast.error("Failed to copy URL.");
      }
  };

  const handleLike = async () => {
    if (!userId) {
      toast.error("Please log in to like this model.");
      return;
    }

    try {
      // Check current state before toggling
      const wasLiked = likedmodel;
      
      // Optimistically update UI
      toggleLike(id);
      
      // Call API
      const response = await likeModel(id, userId, session?.accessToken || "");
      
      // Update server data to reflect the new state
      if (response.success) {
        // Update the result's likes array to reflect the new state
        const newLikes = wasLiked 
          ? (result.likes || []).filter((like: Like) => like.userId !== userId)
          : [...(result.likes || []), { userId, modelId: id }];
        
        // Update the result object (this will trigger re-render with correct server data)
        Object.assign(result, { likes: newLikes });
        
        // Update store with the new server data
        useLikesStore.getState().setLikeStatus(id, !wasLiked, newLikes.length);
      }
      
      // Show appropriate message based on the action
      if (!wasLiked) {
        toast.success("Model liked successfully!");
      } else {
        toast.success("Model disliked successfully!");
      }
    } catch (err) {
      // Revert on error
      toggleLike(id); // Toggle back to original state
      console.error("Like failed:", err);
      toast.error("Failed to update like status. Please try again.");
    }
  };

  const handleReport = () => {
  if (!userId) {
    toast.error("Please log in to report an issue.");
    return;
  }

  const subject = encodeURIComponent(`Report: ${result.title}`);
  const body = encodeURIComponent(
    `I would like to report an issue with the model: ${result.title}\n\n` +
    `Model ID: ${id}\n` +
    `Model URL: ${window.location.href}\n\n` +
    `Please provide details about the issue:`
  );

  const mailtoLink = `mailto:hello@3ddb?subject=${subject}&body=${body}`;

  // Try forcing it
  window.open(mailtoLink, "_self");
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

  const handlePlatformSearch = (platform: string) => {
    setSelectedPlatform(platform);

    const queryParams = new URLSearchParams();
    queryParams.set("sourcesite", platform);
    router.push(`/explore?${queryParams.toString()}`);
  }

  const pageTitle = `${result.title.replace(/\b\w/g, (char) => char.toUpperCase())} STL File | 3D Printable ${result.title.replace(/\b\w/g, (char) => char.toUpperCase())} Model - 3DDatabase`;
  const pageDescription =`Download a 3D printable ${result.title.replace(/\b\w/g, (char) => char.toUpperCase())} STL file. Explore details, view related tags, and start printing your own ${result.title.replace(/\b\w/g, (char) => char.toUpperCase())} today.`
  const pageUrl = result.sourceUrl;
  const pageImage =
    result.thumbnailUrl || result.imagesUrl?.[0];

  return (
    <>
      <Head>
        {/* Basic SEO */}
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={result.tags.join(", ")} />

        {/* Open Graph (Facebook, LinkedIn) */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:image" content={pageImage} />
        <meta property="og:site_name" content="STLDatabase" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={pageImage} />

        {/* Canonical */}
        <link rel="canonical" href={pageUrl} />

        {/* Structured Data (JSON-LD) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CreativeWork",
              name: result.title,
              description: result.description,
              image: pageImage,
              url: pageUrl,
              author: {
                "@type": "Organization",
                name: result.sourceSite?.name || "3DDatabase",
                url: result.sourceSite?.url || process.env.NEXT_PUBLIC_BASE_URL,
              },
              offers: {
                "@type": "Offer",
                price: result.price === "FREE" ? "0" : result.price,
                priceCurrency: "USD",
                availability: "https://schema.org/InStock",
                url: result.sourceUrl,
              },
              datePublished: result.createdAt,
              dateModified: result.updatedAt,
            }),
          }}
        />
      </Head>
        <Container>
          <div className="flex flex-col pb-10">
            <Breadcrumb category={category} subCategory={result.subCategory} title={title} />
            <SearchBar />
            {/* <div className="w-full py-8 mt-8">
              <div className="mx-auto w-full max-w-[1300px] px-4 sm:px-6 md:px-8">
                <div className="text-center text-custom-light-textcolor dark:text-custom-dark-textcolor">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                    {`${title.replace(/\b\w/g, (char) => char.toUpperCase())} STL File | 3D Printable ${title.replace(/\b\w/g, (char) => char.toUpperCase())} Model - 3DDatabase`}
                  </h1>
                  <p className="text-lg sm:text-xl text-custom-light-textcolor dark:text-custom-dark-textcolor max-w-4xl mx-auto leading-relaxed">
                    {`Download a 3D printable ${title.replace(/\b\w/g, (char) => char.toUpperCase())} STL file. Explore details, view related tags, and start printing your own ${title.replace(/\b\w/g, (char) => char.toUpperCase())} today.`}
                  </p>
                </div>
              </div>
            </div> */}
            {/* Detail header banner ad */}
            <OptimizedAdPositionManager
              page="detail"
              positions={['detail-header-banner']}
              className="w-full flex justify-center items-center pt-10"
            />
            <div className="flex pt-7 gap-10 max-lg:flex-col">
              {/* Left Side Image and Thumbnails */}
              <div className="flex flex-col basis-3/5 gap-5 w-full">
                <div className="w-full relative h-[260px] sm:h-[320px] md:h-[380px] lg:h-[422px] bg-white rounded-md">
                  <Image
                    src={bigImagesUrl[(currentPage - 1) * 5 + selectedIndex]}
                    // alt={`Model preview ${selectedIndex}`}
                    alt = {result.title}
                    className="rounded-md object-cover"
                    fill
                    priority
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 60vw"
                  />
                </div>
                <div className="flex relative items-center gap-2">
                  <button
                      aria-label="Previous page"
                      className="
                          w-9 h-9 p-2 rounded-full border shadow
                          bg-white border-custom-light-maincolor
                          text-custom-light-maincolor
                          disabled:opacity-50 disabled:cursor-not-allowed
                          transition
                          dark:bg-gray-800
                          dark:border-gray-600
                          dark:shadow-md
                          dark:text-gray-300
                      "
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      >
                      <FaChevronLeft size={20} />
                  </button>
                  <div
                    key={fadeKey}
                    className={`grid grid-cols-4 sm:grid-cols-5 transition-all duration-500 ease-in-out gap-2 basis-11/12 ${
                      direction === "next"
                        ? "animate-slide-in-left"
                        : "animate-slide-in-right"
                    }`}
                  >
                    {paginatedItems.map((url: string, index: number) => (
                      <div
                        key={index}
                        className={`relative h-[70px] sm:h-[82px] md:h-[90px] rounded-md bg-white overflow-hidden border-2 ${
                          selectedIndex === index
                            ? "border-blue-500"
                            : "border-transparent"
                        } cursor-pointer`}
                        onClick={() => setSelectedIndex(index)}
                      >
                        <Image
                          src={url}
                          alt={`Thumbnail ${index}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 70px, 90px"
                        />
                      </div>
                    ))}
                  </div>
                  <button
                      aria-label="Next page"
                      className="
                          w-9 h-9 p-2 rounded-full border shadow flex justify-end
                          bg-white border-custom-light-maincolor
                          text-custom-light-maincolor
                          disabled:opacity-50 disabled:cursor-not-allowed
                          transition
                          dark:bg-gray-800
                          dark:border-gray-600
                          dark:shadow-md
                          dark:text-gray-300
                      "
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      >
                      <FaChevronRight size={20} />
                  </button>
                </div>
              </div>

              {/* Right Side Details */}
              <div className="flex flex-col basis-2/5 w-full gap-4">
                <div className="font-bold text-custom-light-textcolor dark:text-custom-dark-titlecolor text-2xl sm:text-3xl md:text-[32px] lg:text-[40px] leading-tight">
                  {title
                    .replace(/-/g, " ")
                    .replace(/\b\w/g, (char) => char.toUpperCase())}
                </div>
                <div className="flex gap-2 flex-wrap">
                  {result.tags.map((tag: string, index: number) => (
                    <div
                      key={`${tag}-${index}`}
                      onClick={() => handleTagSearch(tag)}
                      className="
                        bg-gray-300 dark:bg-gray-700 
                        font-medium text-xs sm:text-sm
                        text-custom-light-textcolor dark:text-custom-dark-textcolor 
                        py-[1px] px-2 rounded-md cursor-pointer
                        transition duration-200 ease-in-out
                        hover:bg-gray-400 dark:hover:bg-gray-600
                        hover:scale-105
                        active:scale-95
                      "
                    >
                      {tag}
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 items-center">
                  <div
                    className="
                      flex items-center gap-2
                      cursor-pointer
                      transition duration-200 ease-in-out
                      hover:scale-105 active:scale-95
                      hover:text-[#008bb0]
                    "
                    onClick={() => {handlePlatformSearch(sourceSiteName)}}
                  >
                      <div className="relative w-[26px] h-[26px] sm:w-[30px] sm:h-[30px]">
                      <Image
                        src={result.sourceSite?.iconBigUrl}
                        alt={sourceSiteName}
                        fill
                        className="
                          rounded-lg
                          transition duration-200 ease-in-out
                          hover:shadow-md
                          object-contain
                        "
                        sizes="(max-width: 640px) 26px, 30px"
                        unoptimized
                      />
                    </div>
                    <span className="text-[#00ABD6] font-bold text-base sm:text-lg">
                      {slugify(sourceSiteName)}.com
                    </span>
                  </div>
                </div>
                <div className="flex gap-4 font-normal text-base sm:text-lg text-custom-light-textcolor dark:text-custom-dark-textcolor">
                  <div className="flex items-center gap-1 ">
                    <HiDownload size={22} />
                    <span>{DownloadCounts[id] ?? 0}</span>
                  </div>
                  <div className="flex items-center gap-1 ">
                    <IoEyeOutline size={22} />
                    <span>{result.views}</span>
                  </div>
                  <button
                    onClick={handleLike}
                    className="flex items-center gap-1 cursor-pointer hover:scale-105 transition-transform duration-200"
                    title={likedmodel ? "Unlike this model" : "Like this model"}
                  >
                    {likedmodel ? (
                      <FaHeart size={22} className="text-red-500" />
                    ) : (
                      <FaRegHeart size={22} className="text-gray-600 dark:text-gray-300" />
                    )}
                    <span className="text-custom-light-textcolor dark:text-custom-dark-textcolor">{count}</span>
                  </button>
                </div>
                <div className="flex items-stretch gap-3 max-sm:flex-col">
                  <a
                    href={result.sourceUrl}
                    target="_blank"
                    onClick={() => {handleToggleDownload(id)}}
                    className="flex-1 flex items-center justify-center gap-2 bg-custom-light-maincolor text-white rounded-xl py-2 font-medium text-lg sm:text-2xl transition-transform duration-200 hover:bg-[#3a3663] hover:scale-[1.03]"
                  >
                    <HiDownload />
                    Download
                  </a>
                  <div className="font-semibold flex items-center justify-center sm:basis-1/4 text-lg sm:text-2xl text-custom-light-maincolor dark:text-custom-dark-maincolor">
                    {result.price === "FREE" ? "Free" : result.price}
                  </div>
                </div>
                <div className="text-base sm:text-lg text-custom-light-textcolor dark:text-custom-dark-textcolor font-normal">
                  {showMore ? result.description : shortText}
                  {sentences.length > 2 && (
                    <button
                      onClick={() => setShowMore(!showMore)}
                      className="text-blue-500 hover:underline ml-1"
                    >
                      {showMore ? "See less" : "See more"}
                    </button>
                  )}
                </div>
                {/* Small Share and Report Icons */}
                <div className="flex items-center gap-4 ">
                  <button
                    onClick={handleShare}
                    className="
                      p-2 rounded-full
                      text-gray-600
                      hover:text-gray-700
                      active:scale-95
                      transition-all duration-200 ease-in-out
                      dark:text-gray-300
                      dark:hover:text-gray-200
                    "
                    title="Share this model"
                  >
                    {/* <CiShare2 size={20} /> */}
                    <Image
                      src="/share.svg"   // no need for "public/"
                      alt="Share icon"
                      width={24}
                      height={24}
                      className="pointer-events-none"
                    />
                  </button>
                  
                  <button
                    onClick={handleReport}
                    className="
                      p-2 rounded-full
                      text-gray-600
                      hover:text-gray-700
                      active:scale-95
                      transition-all duration-200 ease-in-out
                      dark:text-gray-300
                      dark:hover:text-gray-200
                    "
                    title="Report this model"
                  >
                    {/* <CiFlag1 size={20} /> */}
                    <Image
                      src="/report.svg"   // no need for "public/"
                      alt="Report icon"
                      width={24}
                      height={24}
                      className="pointer-events-none"
                    />
                  </button>
                </div>
              </div>
            </div>
            {/* Detail mid-content banner ad */}
            <OptimizedAdPositionManager
              page="detail"
              positions={['detail-mid-content-banner']}
              className="w-full flex justify-center items-center pt-10"
            />
            <div className="flex flex-col bg-custom-light-containercolor dark:bg-custom-dark-containercolor rounded-t-[24px] border-b-4 border-custom-light-maincolor px-11 mt-10 max-md:px-6">
              <div className="flex text-custom-light-titlecolor dark:text-custom-dark-titlecolor py-3 font-bold text-2xl">
                Similar Models You May Like
              </div>
            </div>
            {/* Sponsored models within similar section */}
            {/* <AdPositionManager
              page="detail"
              positions={['detail-sponsored-similar']}
              className="container mx-auto px-4 mt-4"
            /> */}
                    <SuggestionSection modelId={id} />
          </div>
        </Container>
      </>
    );
}
