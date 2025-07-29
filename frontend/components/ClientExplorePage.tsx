"use client";

import React, { useState } from "react";
import Image from "next/image";
import Breadcrumb from "./Breadcrumb";
import SearchBar from "./SearchBar";
import { FaChevronLeft, FaChevronRight, FaHeart, FaRegHeart } from "react-icons/fa6";
import { HiDownload } from "react-icons/hi";
import { CiBookmark, CiFlag1, CiHeart, CiShare2, CiStar } from "react-icons/ci"
import { IoEyeOutline } from "react-icons/io5"
import Link from "next/link";
import { useSession } from "next-auth/react";
import { likeModel } from "@/lib/modelsApi";


interface ClientExplorePageProps {
  category: string;
  subCategory: string;
  title: string;
  id: string;
  result: Model;
  like: Boolean;
}

export default function ClientExplorePage({
  category,
  subCategory,
  title,
  id,
  result,
  like,
}: ClientExplorePageProps) {

    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [direction, setDirection] = useState<"next" | "prev">("next");
    const [fadeKey, setFadeKey] = useState(0);
    const [showMore, setShowMore] = useState(false);
    const { data: session, status } = useSession();
    const userId = (session?.user as { id?: string })?.id;

    const [liked, setLiked] = useState(like);

    const [likesCount, setLikesCount] = useState(result.likes?.length ?? 0);
    const isDisabled = status !== "authenticated";

    const sentences = result.description.match(/[^.!?]+[.!?]/g) || [result.description]; // split into sentences
    const shortText = sentences.slice(0, 2).join(' ');

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
      .replace(/[\s&]+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-")
      .replace(/^-+|-+$/g, "");

    const sourceSiteName = result.sourceSite?.name ?? "";

    
    const handleModelOnClick = async (modelId: string) => {
        if (!userId) return;

        try {
        if (!liked) {
            setLiked(true);
            setLikesCount((prev) => prev + 1);
        } else {
            setLiked(false);
            setLikesCount((prev) => Math.max(prev - 1, 0));
        }

        await likeModel(modelId, userId, session?.accessToken || "");
        } catch (err) {
        console.error("Like failed:", err);
        setLiked((prev) => !prev);
        setLikesCount((prev) => (liked ? prev + 1 : Math.max(prev - 1, 0)));
        }
    };
    console.log(result)

  return (
    <div className="flex flex-col bg-gray-100 pb-10">
      <Breadcrumb category={category} subCategory={subCategory} title={title} />
      <SearchBar />
      <div className="flex pt-7 gap-10">
        <div className="flex flex-col basis-3/5 gap-5 w-full">
          <div className="w-full relative h-[422px] bg-white rounded-md">
            <img
              src={bigImagesUrl[(currentPage-1) * 5 + selectedIndex]}
              alt={`Model preview ${selectedIndex}`}
              className="w-full h-full object-cover rounded-md"
            />
          </div>
          <div className="flex relative items-center gap-2">
            <button
                aria-label="Previous page"
                className={`w-9 h-9 bg-white shadow p-2 rounded-full border border-custom-light-maincolor
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition`}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                >
                <FaChevronLeft size={20} className="text-custom-light-maincolor" />
            </button>
            <div
                key={fadeKey}
                className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5
                        transition-all duration-500 ease-in-out gap-2 basis-11/12
                ${
                direction === "next"
                    ? "animate-slide-in-left"
                    : "animate-slide-in-right"
                }`}
            >
                {paginatedItems.map((url: string, index: number) => (
                <div
                    key={index}
                    className={`relative h-[90px] rounded-md bg-white overflow-hidden border-2 ${
                    selectedIndex === index ? "border-blue-500" : "border-transparent"
                    } cursor-pointer`}
                    onClick={() => setSelectedIndex(index)}
                >
                    <img
                    src={url}
                    alt={`Thumbnail ${index}`}
                    className="w-full h-full object-cover"
                    />
                </div>
                ))}
            </div>
            <button
                aria-label="Next page"
                className={`w-9 h-9 justify-end bg-white shadow p-2 rounded-full border border-custom-light-maincolor
                disabled:opacity-50 disabled:cursor-not-allowed
                transition`}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                <FaChevronRight size={20} className="text-custom-light-maincolor" />
            </button>
          </div>
        </div>
        <div className="flex flex-col basis-2/5 w-full gap-4">
            <div className="font-bold text-custom-light-textcolor text-[40px] truncate overflow-hidden whitespace-nowrap max-w-full">
                {title}
            </div>
            <div className="flex gap-2 flex-wrap">
                {result.tags.map((tag: string, index: number) => (
                    <span
                    key={`${tag}-${index}`}
                    className="bg-[#C8C8C8] font-medium text-sm text-custom-light-textcolor py-[1px] px-2 rounded-md"
                    >
                    {tag}
                    </span>
                ))}
            </div>
            <div className="flex gap-2 items-center">
                <Image
                    src={`/Platforms/${slugify(sourceSiteName)}.png`}
                    alt={sourceSiteName}
                    width={30}
                    height={30}
                    className="rounded-lg"
                />
                <div className="text-[#00ABD6] font-bold text-lg">
                    {slugify(sourceSiteName)}.com
                </div>
            </div>
            <div className="flex gap-4">
                <div className="flex items-center gap-1 font-normal text-lg text-custom-light-textcolor">
                    <HiDownload className="text-base" size={24} />
                    <span>{result.downloads} </span>
                </div>
                <div className="flex items-center gap-1 font-normal text-lg text-custom-light-textcolor">
                    <IoEyeOutline className="text-base" size={24} />
                    <span>{result.views} </span>
                </div>
                <div className="flex items-center gap-1 font-normal text-lg text-custom-light-textcolor">
                    <CiStar className="text-base" size={24} />
                    <span>{likesCount} </span>
                </div>
            </div>
            <div className="flex items-center justify-center">
                <a
                    href={result.sourceUrl}
                    className="flex-1 flex basis-3/4 items-center justify-center gap-2 bg-custom-light-maincolor text-white rounded-xl py-2 font-medium text-2xl transition-transform duration-200 hover:bg-[#3a3663] hover:scale-[1.03]"
                    
                >
                    <HiDownload />
                    Download
                </a>
                <div className="font-semibold flex items-center justify-center basis-1/4 text-2xl text-custom-light-maincolor">
                    {result.price === "FREE" ? "Free" : result.price}
                </div>
            </div>
            <div className="grid grid-cols-2 justify-between gap-4">
                <button
                    className="flex-1 flex items-center justify-center gap-2 bg-[#A1A1A1] text-white rounded-xl py-2 font-normal text-lg transition-transform duration-200 hover:bg-[#3a3663] hover:scale-[1.03]"
                >
                    Share
                    <CiShare2 />
                </button>
                <button
                    className="flex-1 flex items-center justify-center gap-2 bg-[#A1A1A1] text-white rounded-xl py-2 font-normal text-lg transition-transform duration-200 hover:bg-[#3a3663] hover:scale-[1.03]"
                >
                    Save
                    <CiBookmark />
                </button>
                <button
                    className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2 font-normal text-lg transition-transform duration-200
                        ${isDisabled
                        ? "bg-[#E0E0E0] text-gray-400 cursor-not-allowed hover:scale-100" // disabled style
                        : liked
                            ? "bg-red-100 border border-red-500 text-red-500 hover:scale-105"
                            : "bg-[#A1A1A1] text-white hover:bg-[#3a3663] hover:scale-[1.03]"
                        }
                    `}
                    disabled={isDisabled}
                    onClick={() => handleModelOnClick(id)}
                    >
                    Like
                    {liked ? (
                        <CiHeart className={`${isDisabled ? "text-gray-300" : "text-red-500"}`} size={30} />
                    ) : (
                        <CiHeart className={`${isDisabled ? "text-gray-300" : ""}`} size={30} />
                    )}
                </button>
                <button
                    className="flex-1 flex items-center justify-center gap-2 bg-[#A1A1A1] text-white rounded-xl py-2 font-normal text-lg transition-transform duration-200 hover:bg-[#3a3663] hover:scale-[1.03]"
                >
                    Report
                    <CiFlag1 />
                </button>               
            </div>
            <div className="text-lg text-custom-light-textcolor font-normal">
                {showMore ? result.description : shortText}
                {sentences.length > 2 && (
                    <button
                        onClick={() => setShowMore(!showMore)}
                        className="text-blue-500 hover:underline ml-1"
                    >
                        {showMore ? 'See less' : 'See more'}
                    </button>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
