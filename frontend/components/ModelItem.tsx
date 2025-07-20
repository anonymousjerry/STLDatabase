// *********************
// Role of the component: Product item component 
// Name of the component: ProductItem.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <ProductItem product={product} color={color} />
// Input parameters: { product: Product; color: string; }
// Output: Product item component that contains product image, title, link to the single product page, price, button...
// *********************

import Image from "next/image";
import React from "react";
import Link from "next/link";
import ProductItemRating from "./ProductItemRating";
import { FaHeart, FaDownload } from 'react-icons/fa';

const ModelItem = ({
  model,
  color,
}: {
  model: Model;
  color: string;
}) => {
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
    <div className="flex flex-col w-full bg-white rounded-xl shadow-md overflow-hidden relative">
      {/* Like Button (top right) */}
      <button className="absolute top-2 right-2 bg-white bg-opacity-70 p-2 rounded-full hover:bg-opacity-100 transition">
        <FaHeart className="text-gray-600" />
      </button>

      {/* Image */}
      <img src={`${model.imageUrl}`} alt={`${model.title}`} className="flex w-full h-48 object-cover" />

      {/* Details */}
      <div className="flex flex-col p-4 gap-2">
        {/* Title */}
        <h2 className="text-lg font-medium text-gray-800">{model.title}</h2>
        <div className="flex flex-row gap-3">
            {model.tags.map((tag: String) => (
                <div className="bg-custom-maincolor font-light text-white py-1 px-1">{tag}</div>
            ))}
        </div>

        {/* Meta Info */}
        <div className="flex items-center justify-between text-sm text-gray-600 ">
            <div className="flex items-center gap-2">
                <FaDownload className="text-base" />
                <span>{model.downloads} files</span>
            </div>
            <div className="flex items-center gap-2">
                <FaHeart className="text-base" />
                <span>{model.likes} likes</span>
            </div>
            {model.price === "FREE" ?
                <div className="text-right items-center text-[#4A457A] font-bold text-[25px]">
                    {model.price}
                </div>
                :<div className="text-right text-[#4A457A] font-bold text-[25px]">
                    ${model.price}
                </div>
            }
        </div>
        
        <div className="flex">
            <button>
                asdf
            </button>
        </div>

      </div>
    </div>
  );
};

export default ModelItem;
