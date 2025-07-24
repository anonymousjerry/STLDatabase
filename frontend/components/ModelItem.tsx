// *********************
// Role of the component: Product item component 
// Name of the component: ProductItem.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <ProductItem product={product} color={color} />
// Input parameters: { product: Product; color: string; }
// Output: Product item component that contains product image, title, link to the single product page, price, button...
// *********************
"use client"

import React, {useState} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FaCartShopping, } from "react-icons/fa6";
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { HiDownload, HiOutlineFolderDownload } from 'react-icons/hi';
import { useSession } from "next-auth/react";
import { FiShoppingCart } from 'react-icons/fi';
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
  const [liked, setLiked] = useState(model.likes?.some((like: Like) => like.id === userId) ?? false);
  const [likesCount, setLikesCount] = useState(model.likes?.length ?? 0);
  const isDisabled = status !== 'authenticated';
  const sourceSiteName = model.sourceSite?.name ?? "";

  const slugify = (text: string): string =>
    text
      .toLowerCase()
      .trim()
      .replace(/[\s&]+/g, '-')    // replace spaces and & with dash
      .replace(/[^\w-]+/g, '')   // remove all non-word chars except dash
      .replace(/--+/g, '-')      // replace multiple dashes with one
      .replace(/^-+|-+$/g, '');  // trim dashes from start/end
  const generateSlug = (category: string, subCategory: string, title: string) =>
  `${slugify(category)}/${slugify(subCategory)}/${slugify(title)}`;

  const handleModelOnClick = async (modelId: string) => {
    if (!userId) return;

    try {
      // Optimistic update
      if (!liked) {
        setLiked(true);
        setLikesCount((prev) => prev + 1);
      } else {
        setLiked(false);
        setLikesCount((prev) => Math.max(prev - 1, 0));
      }

      // Send request
      const data = await likeModel(modelId, userId, session?.accessToken || "");
      console.log('Liked successfully', data);

    } catch (err) {
      console.error('Like failed:', err);

      // Revert optimistic update on error
      setLiked((prev) => !prev);
      setLikesCount((prev) => liked ? prev + 1 : Math.max(prev - 1, 0));
    }
  };

  return (
    // <div className="flex flex-col items-center gap-y-2">
    //   <Link href={`/product/${product.slug}`}>
    //     <Image
    //       src={
    //         product.mainImage
    //           ? `/${product.mainImage}`
    //           : "/product_placeholder.jpg"
    //       }
    //       width="0"
    //       height="0"
    //       sizes="100vw"
    //       className="w-auto h-[300px]"
    //       alt={product?.title}
    //     />
    //   </Link>
    //   <Link
    //     href={`/product/${product.slug}`}
    //     className={
    //       color === "black"
    //         ? `text-xl text-black font-normal mt-2 uppercase`
    //         : `text-xl text-white font-normal mt-2 uppercase`
    //     }
    //   >
    //     {product.title}
    //   </Link>
    //   <p
    //     className={
    //       color === "black"
    //         ? "text-lg text-black font-semibold"
    //         : "text-lg text-white font-semibold"
    //     }
    //   >
    //     ${product.price}
    //   </p>

    //   <ProductItemRating productRating={product?.rating} />
    //   <Link
    //     href={`/product/${product?.slug}`}
    //     className="block flex justify-center items-center w-full uppercase bg-white px-0 py-2 text-base border border-black border-gray-300 font-bold text-blue-600 shadow-sm hover:bg-black hover:bg-gray-100 focus:outline-none focus:ring-2"
    //   >
    //     <p>View product</p>
    //   </Link>
    // </div>
    <div className="flex flex-col w-full bg-custom-light-containercolor  shadow-lg rounded-3xl border border-gray-200 overflow-hidden relative">
      {/* Like Button (top right) */}
      <div 
        className="absolute top-2 left-2 rounded-lg hover:bg-opacity-100 transition">
        <Image
          src={`/Platforms/${slugify(sourceSiteName)}.png`}
          alt={sourceSiteName}
          width={40}
          height={40}
          
        />
      </div>

      {/* Image */}
      <Link 
        href={`/explore/${generateSlug(model.category.name, model.subCategory.name, model.title)}`} >
        <img src={model.thumbnailUrl} alt={model.title} className="flex w-full h-48 object-cover" />
      </Link>

      {/* Details */}
      <div className="flex flex-col px-3 py-2 text-custom-light-maincolor gap-1">
        {/* Title */}
        <Link 
          href={`/explore/${generateSlug(model.category.name, model.subCategory.name, model.title)}`} >
          <h2 className="font-semibold text-2xl truncate max-w-full hover:underline" >{model.title}</h2>
        </Link>

        {/* Tag */}
        <div className="flex gap-2 flex-wrap">
            {model.tags.slice(0,2).map((tag: String, index: number) => 
                <span
                  key = {tag.toString() + index}
                  className="bg-custom-light-maincolor font-medium text-sm  text-white py-[1px] px-2 rounded-md"
                >
                  {tag}
                </span>
            )}
        </div>

        {/* Meta Info */}
        <div className="flex text-sm font-medium justify-between ">
            <div className="flex items-center gap-1">
                <HiOutlineFolderDownload className="text-base" size={24} />
                <span>{model.downloads} files</span>
            </div>
            <div className="flex items-center gap-1">
                <FaRegHeart className="text-base" size={20} />
                <span>{likesCount} likes</span>
            </div>
            <div className="font-semibold text-2xl">
              {model.price === "FREE" ? "Free" : `${model.price}`}
            </div>
        </div>
        
        <div className="flex items-center gap-2 pb-2">
          <button
            aria-label="Like"
            disabled={isDisabled}
            onClick={() => {handleModelOnClick(model.id)}}
            className={`flex items-center justify-center w-12 h-12 border rounded-xl 
              ${isDisabled
                ? 'border-gray-300 text-gray-300 cursor-not-allowed'
                : liked
                  ? 'border-red-500 text-red-500 bg-red-100'
                  : 'border-custom-light-maincolor text-custom-light-maincolor hover:bg-[#f0f0f0]'}`}
          >
            <span className="transition-all duration-300">
              {liked ? <FaHeart className="text-red-500 scale-110" size={30}/> : <FaRegHeart size={30}/>}
            </span>
          </button>
          <Link
            href={`/explore/${generateSlug(model.category.name, model.subCategory.name, model.title)}`}
            className="flex-1 flex items-center justify-center gap-2 bg-custom-light-maincolor text-white rounded-xl py-2 font-medium text-2xl hover:bg-[#3a3663]">
            <HiDownload/>
            Download
          </Link>
          {/* <button aria-label="Like" className="flex items-center justify-center w-10 h-10 border border-custom-light-maincolor rounded-xl hover:bg-[#f0f0f0]">
            <FiShoppingCart className="text-custom-light-maincolor" size={24} />
          </button> */}
        </div>

      </div>
    </div>
  );
};

export default ModelItem;
