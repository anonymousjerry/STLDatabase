// *********************
// Role of the component: products section intended to be on the home page
// Name of the component: ProductsSection.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <ProductsSection slug={slug} />
// Input parameters: no input parameters
// Output: products grid
// *********************

import React from "react";
import ProductItem from "./ProductItem";
import Heading from "./Heading";

const ProductsSection = async () => {
  // sending API request for getting all products
  const data = await fetch(`${process.env.NEXT_PUBLIC_BACKENDPART_URL}/models`);
  const products = await data.json();
  return (
    <div className="flex flex-row pt-10 px-32 max-xl:px-20 max-lg:px-10 max-md:px-6 bg-gray-100">
        <div className="grid grid-cols-4 justify-items-center  gap-x-6  gap-y-8 max-xl:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1">
          {products.map((product: Product) => (
            <ProductItem key={product.id} product={product} color="white" />
          ))}
        </div>
    </div>
  );
};

export default ProductsSection;
