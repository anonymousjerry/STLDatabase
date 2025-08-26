"use client";

import React, { useState } from "react";
import Image from "next/image";
import Breadcrumb from "./Breadcrumb";
import SearchBar from "./SearchBar";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { HiDownload } from "react-icons/hi";
import { CiBookmark, CiBookmarkCheck, CiFlag1, CiHeart, CiShare2, CiStar, } from "react-icons/ci";
import { IoEyeOutline } from "react-icons/io5";
import { useSession } from "next-auth/react";
import { downloadModel, likeModel, saveModel } from "@/lib/modelsApi";
import SuggestionSection from "./SuggestionSection";
import { useLikesStore } from "@/app/_zustand/useLikesStore";
import toast from "react-hot-toast";
import { useFavoritesStore } from "@/app/_zustand/useFavoritesStore";
import { useDownloadsStore } from "@/app/_zustand/useDonwloadStore";
import { useSearch } from "@/context/SearchContext";
import { useRouter } from "next/navigation";
import AdPositionManager from "./ads/AdPositionManager";
import Head from "next/head";

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
  const liked = likedModels[id] ?? false;
  const count = likesCount[id] ?? result.likes.length;

  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();
  const [saved, setSaved] = useState(isFavorite(id));

  const { addDownload, isDownload, DownloadCounts } = useDownloadsStore();

  const {
    selectedPlatform,
    selectedCategory,
    searchTag,
    searchInput,
    searchPrice,
    favourited,
    setSelectedPlatform,
    setSelectedCategory,
    setSearchTag,
    setSearchInput,
    setSearchPrice,
    setfavourited,
  } = useSearch();

  const router = useRouter();

  const isDisabled = status !== "authenticated";

  const sentences =
    result.description.match(/[^.!?]+[.!?]/g) || [result.description];
  const shortText = sentences.slice(0, 2).join(" ");

  const bigImagesUrl = result.imagesUrl.map((pair) => pair[0]);
  const smallImagesUrl = result.imagesUrl.map((pair) => pair[1]);

  const itemsPerPage = 5;
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

  const handleModelOnClick = async (modelId: string) => {
      if (!userId) return;

      try {
        toggleLike(modelId);
        await likeModel(modelId, userId, session?.accessToken || "");
        if(!liked) {
          toast.success("Model liked successfully!");
        } else {
          toast.success("Model disliked successfully!");
        }
      } catch (err) {
        console.error("Like failed:", err);
        toast.error(err instanceof Error ? err.message : "Failed to like model");
      }
  };

  const handleToggleFavorite = async (modelId: string) => {
      try {
        if (saved) {
            removeFavorite(id);
            await saveModel(modelId, userId || "", session?.accessToken || "");
            toast.success("Remove this model successfully!")
        } else {
            addFavorite(id);
            await saveModel(modelId, userId || "", session?.accessToken || "");
            toast.success("Add this model successfully!")
        }
        setSaved(!saved);
      } catch (err) {
        console.error("Toggle favorite failed:", err);
        toast.error(err instanceof Error ? err.message : "Failed to update favorite status");
      }
  };

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
    if (favourited) queryParams.set("favourited", 'true');
    queryParams.set("currentPage", '1');

    router.push(`/explore?${queryParams.toString()}`);
  };

  const pageTitle = `${result.title} - Free 3D STL Model Download`;
  const pageDescription =
    result.description?.slice(0, 160) ||
    "Download free 3D STL models for printing.";
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

      <div className="flex flex-col pb-10">
        <Breadcrumb category={category} subCategory={subCategory} title={title} />
        <SearchBar />
        {/* Detail header banner ad */}
        <AdPositionManager
          page="detail"
          positions={['detail-header-banner']}
          className="w-full flex justify-center items-center pt-10"
        />
        <div className="flex pt-7 gap-10">
          {/* Left Side Image and Thumbnails */}
          <div className="flex flex-col basis-3/5 gap-5 w-full">
            <div className="w-full relative h-[422px] bg-white rounded-md">
              <Image
                src={bigImagesUrl[(currentPage - 1) * 5 + selectedIndex]}
                alt={`Model preview ${selectedIndex}`}
                className="rounded-md object-cover"
                fill
                unoptimized
                priority
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
                className={`grid grid-cols-5 transition-all duration-500 ease-in-out gap-2 basis-11/12 ${
                  direction === "next"
                    ? "animate-slide-in-left"
                    : "animate-slide-in-right"
                }`}
              >
                {paginatedItems.map((url: string, index: number) => (
                  <div
                    key={index}
                    className={`relative h-[90px] rounded-md bg-white overflow-hidden border-2 ${
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
                      unoptimized
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
            <div className="font-bold text-custom-light-textcolor dark:text-custom-dark-titlecolor text-[40px]">
              {title.replace(/-/g, " ")}
            </div>
            <div className="flex gap-2 flex-wrap">
              {result.tags.map((tag: string, index: number) => (
                <div
                  key={`${tag}-${index}`}
                  onClick={() => handleTagSearch(tag)}
                  className="
                    bg-gray-300 dark:bg-gray-700 
                    font-medium text-sm
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
              <a
                href={result.sourceSite?.url}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  flex items-center gap-2
                  cursor-pointer
                  transition duration-200 ease-in-out
                  hover:scale-105 active:scale-95
                  hover:text-[#008bb0]
                "
              >
                <Image
                  src={result.sourceSite?.iconBigUrl}
                  alt={sourceSiteName}
                  width={30}
                  height={30}
                  className="
                    rounded-lg
                    transition duration-200 ease-in-out
                    hover:shadow-md
                    h-auto
                  "
                  unoptimized
                />
                <span className="text-[#00ABD6] font-bold text-lg">
                  {slugify(sourceSiteName)}.com
                </span>
              </a>
            </div>
            <div className="flex gap-4 font-normal text-lg text-custom-light-textcolor dark:text-custom-dark-textcolor">
              <div className="flex items-center gap-1 ">
                <HiDownload size={24} />
                <span>{DownloadCounts[id] ?? 0}</span>
              </div>
              <div className="flex items-center gap-1 ">
                <IoEyeOutline size={24} />
                <span>{result.views}</span>
              </div>
              <div className="flex items-center gap-1 ">
                <CiHeart size={24} />
                <span>{count}</span>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <a
                href={result.sourceUrl}
                target="_blank"
                onClick={() => {handleToggleDownload(id)}}
                className="flex-1 flex basis-3/4 items-center justify-center gap-2 bg-custom-light-maincolor text-white rounded-xl py-2 font-medium text-2xl transition-transform duration-200 hover:bg-[#3a3663] hover:scale-[1.03]"
              >
                <HiDownload />
                Download
              </a>
              <div className="font-semibold flex items-center justify-center basis-1/4 text-2xl text-custom-light-maincolor dark:text-custom-dark-maincolor">
                {result.price === "FREE" ? "Free" : result.price}
              </div>
            </div>
            <div className="grid grid-cols-2 justify-between gap-4">
              <button
                  className="
                  flex-1 flex items-center justify-center gap-2 rounded-xl py-2 font-normal text-lg
                  bg-[#A1A1A1] text-white
                  hover:bg-[#5c5c7d] hover:scale-[1.03]
                  transition-transform duration-200
                  dark:bg-gray-700 dark:text-gray-200
                  dark:hover:bg-gray-600
                  "
                  onClick={handleShare}
              >
                  Share
                  <CiShare2 />
              </button>

              <button
                  onClick={() => {handleToggleFavorite(id)}}
                  className={`
                      flex-1 flex items-center justify-center gap-2 rounded-xl py-2 font-normal text-lg
                      transition-transform duration-200
                      ${saved
                      ? "bg-[#3a3663] text-white hover:bg-[#2c294f]"
                      : "bg-[#A1A1A1] text-white hover:bg-[#5c5c7d]"}
                      dark:${saved ? "bg-violet-700 hover:bg-violet-600" : "bg-gray-700 hover:bg-gray-600"}
                      dark:text-gray-200
                      hover:scale-[1.03]
                  `}
                  >
                  Save
                  {saved ? <CiBookmarkCheck /> : <CiBookmark />}
              </button>

              <button
              disabled={isDisabled}
              onClick={() => handleModelOnClick(id)}
              className={`
                  flex-1 flex items-center justify-center gap-2 rounded-xl py-2 font-normal text-lg transition-transform duration-200
                  ${
                  isDisabled
                      ? "bg-[#E0E0E0] text-gray-400 cursor-not-allowed hover:scale-100 dark:bg-gray-800 dark:text-gray-500"
                      : liked
                      ? "bg-red-500 border border-red-600 text-white hover:bg-red-600 hover:scale-105"
                      : "bg-[#A1A1A1] text-white hover:bg-[#5c5c7d] hover:scale-[1.03] dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                  }
              `}
              >
                  Like
                  <CiHeart
                      size={30}
                      className={`${
                      isDisabled
                          ? "text-gray-300 dark:text-gray-600"
                          : liked
                          ? "text-white"
                          : ""
                      }`}
                  />
              </button>

              <button
                  className="
                  flex-1 flex items-center justify-center gap-2 rounded-xl py-2 font-normal text-lg
                  bg-[#A1A1A1] text-white
                  hover:bg-[#5c5c7d] hover:scale-[1.03]
                  transition-transform duration-200
                  dark:bg-gray-700 dark:text-gray-200
                  dark:hover:bg-gray-600
                  "
              >
                  Report
                  <CiFlag1 />
              </button>
          </div>
          <div className="text-lg text-custom-light-textcolor dark:text-custom-dark-textcolor font-normal">
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
          </div>
        </div>
        {/* Detail mid-content banner ad */}
        <AdPositionManager
          page="detail"
          positions={['detail-mid-content-banner']}
          className="w-full flex justify-center items-center pt-10"
        />
        <div className="flex flex-col bg-custom-light-containercolor dark:bg-custom-dark-containercolor rounded-t-[24px] border-b-4 border-custom-light-maincolor px-11 mt-10 max-md:px-6">
          <div className="flex text-custom-light-titlecolor dark:text-custom-dark-titlecolor py-3 font-bold text-2xl">
            SIMILAR DESIGN YOU MAY LIKE
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
    </>
  );
}
