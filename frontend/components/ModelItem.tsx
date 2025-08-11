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
import toast from "react-hot-toast";

const ModelItem = ({ model, color }: { model: Model; color: string }) => {
  const { data: session, status } = useSession();
  const userId = (session?.user as { id?: string })?.id;
  const isDisabled = status !== "authenticated";

  const { likedModels, likesCount, toggleLike } = useLikesStore();
  const liked = likedModels[model.id] ?? model.likes?.some((like: Like) => like.userId === userId) ?? false;
  const count = likesCount[model.id] ?? model.likes.length;

  const { addView, isView, ViewCounts } = useViewsStore();

  const sourceSiteName = model.sourceSite?.name ?? "";

  useEffect(() => {
    if (!model || !userId) return;

    const alreadySet = likedModels.hasOwnProperty(model.id);
    const hasLiked = model.likes?.some((like: Like) => like.userId === userId);

    if (!alreadySet && hasLiked) {
      useLikesStore.setState((prev) => ({
        likedModels: {
          ...prev.likedModels,
          [model.id]: true,
        },
        likesCount: {
          ...prev.likesCount,
          [model.id]: model.likes.length,
        },
      }));
    }
  }, [userId, model, likedModels]);

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
    if (!userId) return;

    try {
      toggleLike(model.id);
      await likeModel(modelId, userId, session?.accessToken || "");
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
    liked: liked.toString()
  };

  const handleToggleView = async (modelId: string) => {
    try {
      const data = await viewModel(modelId, session?.accessToken || "");
      addView(modelId, data.count);
    } catch (error) {
      toast.error("Failed to view model.");
    }
  };

  return (
    <div className="flex flex-col w-full bg-custom-light-containercolor dark:bg-custom-dark-containercolor shadow-lg rounded-3xl border border-gray-200 overflow-hidden relative">

      {/* Source icon */}
      <div className="absolute top-2 left-2 rounded-lg hover:bg-opacity-100 transition">
        <Image
          src={`/Platforms/${slugify(sourceSiteName)}.png`}
          alt={sourceSiteName}
          width={32}
          height={32}
          className="sm:w-10 sm:h-10 w-8 h-8"
        />
      </div>

      {/* Image */}
      <Link
        href={{ pathname: `/explore/${modelSlug}`, query }}
        onClick={() => handleToggleView(model.id)}
        className="overflow-hidden rounded-t-3xl"
      >
        <img
          src={model.thumbnailUrl}
          alt={model.title}
          className="w-full h-36 sm:h-44 md:h-48 object-cover transition-transform duration-300 ease-in-out hover:scale-105"
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
        <div className="flex gap-2 flex-wrap">
          {model.tags.slice(0, 2).map((tag: string, index: number) => (
            <span
              key={`${tag}-${index}`}
              className="bg-custom-light-maincolor font-medium text-xs sm:text-sm text-white py-[1px] px-2 rounded-md"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Meta Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-custom-dark-titlecolor">
          <div className="flex items-center gap-1">
            <HiOutlineFolderDownload className="text-base" size={20} />
            <span>{model.downloads} files</span>
          </div>
          <div className="flex items-center gap-1">
            <FaRegHeart className="text-base" size={18} />
            <span>{count} likes</span>
          </div>
          <div className="font-semibold text-lg sm:text-xl text-custom-light-maincolor dark:text-custom-dark-maincolor">
            {model.price === "FREE" ? "Free" : model.price}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pb-2">
          <button
            aria-label="Like"
            disabled={isDisabled}
            onClick={() => handleModelOnClick(model.id)}
            className={`
              flex items-center justify-center w-full sm:w-12 h-12 border rounded-xl transition-transform duration-200
              ${
                isDisabled
                  ? "border-gray-300 text-gray-300 cursor-not-allowed dark:border-gray-600 dark:text-gray-500"
                  : liked
                  ? "border-red-500 text-white bg-red-600 scale-105 dark:bg-red-700 dark:border-red-600 dark:text-red-300 dark:shadow-md dark:shadow-red-600"
                  : "border-custom-light-maincolor text-custom-light-maincolor hover:bg-[#f0f0f0] hover:scale-110 dark:border-gray-500 dark:text-gray-300 dark:hover:bg-gray-600"
              }
            `}
          >
            {liked ? (
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
