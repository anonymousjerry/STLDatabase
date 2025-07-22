// *********************
// Role of the component: Product item component 
// Name of the component: ProductItem.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <ProductItem product={product} color={color} />
// Input parameters: { product: Product; color: string; }
// Output: Product item component that contains product image, title, link to the single product page, price, button...
// *********************

import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FaCartShopping, } from "react-icons/fa6";
import { FaRegHeart } from 'react-icons/fa';
import { HiDownload, HiOutlineFolderDownload } from 'react-icons/hi';
import { FiShoppingCart } from 'react-icons/fi';

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
    <div className="flex flex-col w-full bg-custom-light-containercolor  shadow-lg rounded-3xl border border-gray-200 overflow-hidden relative">
      {/* Like Button (top right) */}
      <button className="absolute top-2 right-2 border-white border-2 p-2 rounded-lg hover:bg-opacity-100 transition">
        <FaRegHeart className="text-gray-600" color="white" size={20} />
      </button>

      {/* Image */}
      <img src={model.imageUrl} alt={model.title} className="flex w-full h-48 object-cover" />

      {/* Details */}
      <div className="flex flex-col px-3 py-2 text-custom-light-maincolor">
        {/* Title */}
        <h2 className="font-medium text-lg" >{model.title}</h2>

        {/* Tag */}
        {/* <div className="flex gap-2 flex-wrap">
            {model.tags.map((tag: String, index: number) => 
                <span
                  key = {tag.toString() + index}
                  className="bg-custom-light-maincolor text-sm  text-white py-[1px] px-2 rounded-md"
                >
                  {tag}
                </span>
            )}
        </div> */}

        {/* Meta Info */}
        <div className="flex text-sm justify-between ">
            <div className="flex items-center gap-1">
                <HiOutlineFolderDownload className="text-base" size={24} />
                <span>{model.downloads} files</span>
            </div>
            <div className="flex items-center gap-1">
                <FaRegHeart className="text-base" />
                <span>{model.likes} likes</span>
            </div>
            <div className="font-semibold text-2xl">
              {model.price === "FREE" ? "Free" : `$${model.price}`}
            </div>
        </div>
        
        {/* <div className="flex items-center gap-2 pb-2">
          <button aria-label="Like" className="flex items-center justify-center w-10 h-10 border border-custom-light-maincolor rounded-xl hover:bg-[#f0f0f0]">
            <FaRegHeart className="text-custom-light-maincolor" size={24} />
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 bg-custom-light-maincolor text-white rounded-xl py-2 font-semibold hover:bg-[#3a3663]">
            <HiDownload/>
            Download
          </button>
          <button aria-label="Like" className="flex items-center justify-center w-10 h-10 border border-custom-light-maincolor rounded-xl hover:bg-[#f0f0f0]">
            <FiShoppingCart className="text-custom-light-maincolor" size={24} />
          </button>
        </div> */}

      </div>
    </div>
  );
};

export default ModelItem;
