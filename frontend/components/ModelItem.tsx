"use client";

import React, { useState } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { HiDownload, HiOutlineFolderDownload } from "react-icons/hi";
import { useSession } from "next-auth/react";
import { likeModel } from "@/lib/modelsApi";
import Image from "next/image";
import Link from "next/link";

const ModelItem = ({
  model,
  color,
}: {
  model: Model;
  color: string;
}) => {
  const { data: session, status } = useSession();
  const userId = (session?.user as { id?: string })?.id;
  const [liked, setLiked] = useState(
    model.likes?.some((like: Like) => like.id === userId) ?? false
  );
  const [likesCount, setLikesCount] = useState(model.likes?.length ?? 0);
  const isDisabled = status !== "authenticated";
  const sourceSiteName = model.sourceSite?.name ?? "";

  const slugify = (text: string): string =>
    text
      .toLowerCase()
      .trim()
      .replace(/[\s&]+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-")
      .replace(/^-+|-+$/g, "");

  const generateSlug = (category: string, subCategory: string, title: string) =>
    `${slugify(category)}/${slugify(subCategory)}/${slugify(title)}`;

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

  return (
    <div className="flex flex-col w-full bg-custom-light-containercolor shadow-lg rounded-3xl border border-gray-200 overflow-hidden relative">
      {/* Source icon */}
      <div className="absolute top-2 left-2 rounded-lg hover:bg-opacity-100 transition">
        <Image
          src={`/Platforms/${slugify(sourceSiteName)}.png`}
          alt={sourceSiteName}
          width={40}
          height={40}
        />
      </div>

      {/* Image */}
      <Link
        href={`/explore/${generateSlug(
          model.category.name,
          model.subCategory.name,
          model.title
        )}`}
        className="overflow-hidden rounded-t-3xl"
      >
        <img
          src={model.thumbnailUrl}
          alt={model.title}
          className="w-full h-48 object-cover transition-transform duration-300 ease-in-out hover:scale-105"
        />
      </Link>

      {/* Details */}
      <div className="flex flex-col px-3 py-2 text-custom-light-maincolor gap-1">
        {/* Title */}
        <Link
          href={`/explore/${generateSlug(
            model.category.name,
            model.subCategory.name,
            model.title
          )}`}
          className="font-semibold text-2xl truncate max-w-full hover:underline transition-colors duration-200"
        >
          {model.title}
        </Link>

        {/* Tags */}
        <div className="flex gap-2 flex-wrap">
          {model.tags.slice(0, 2).map((tag: string, index: number) => (
            <span
              key={`${tag}-${index}`}
              className="bg-custom-light-maincolor font-medium text-sm text-white py-[1px] px-2 rounded-md"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Meta Info */}
        <div className="flex text-sm font-medium justify-between text-gray-700">
          <div className="flex items-center gap-1">
            <HiOutlineFolderDownload className="text-base" size={24} />
            <span>{model.downloads} files</span>
          </div>
          <div className="flex items-center gap-1">
            <FaRegHeart className="text-base" size={20} />
            <span>{likesCount} likes</span>
          </div>
          <div className="font-semibold text-2xl text-custom-light-maincolor">
            {model.price === "FREE" ? "Free" : model.price}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2 pb-2">
          <button
            aria-label="Like"
            disabled={isDisabled}
            onClick={() => handleModelOnClick(model.id)}
            className={`flex items-center justify-center w-12 h-12 border rounded-xl transition-transform duration-200 ${
              isDisabled
                ? "border-gray-300 text-gray-300 cursor-not-allowed"
                : liked
                ? "border-red-500 text-red-500 bg-red-100 scale-105"
                : "border-custom-light-maincolor text-custom-light-maincolor hover:bg-[#f0f0f0] hover:scale-110"
            }`}
          >
            {liked ? (
              <FaHeart className="text-red-500" size={30} />
            ) : (
              <FaRegHeart size={30} />
            )}
          </button>

          <Link
            href={`/explore/${generateSlug(
              model.category.name,
              model.subCategory.name,
              model.title
            )}`}
            className="flex-1 flex items-center justify-center gap-2 bg-custom-light-maincolor text-white rounded-xl py-2 font-medium text-2xl transition-transform duration-200 hover:bg-[#3a3663] hover:scale-[1.03]"
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
