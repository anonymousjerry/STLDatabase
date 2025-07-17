"use client"; // If using hooks or client-side data fetching

import React, { useEffect, useState } from "react";
import ProductItem from "./ProductItem";
import Heading from "./Heading";
import { axiosInstance } from "@/lib/axios";

// interface Product {
//   id: string;
//   title: string;
//   // Add other relevant fields as per your product model
// }

const ProductsSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get("/models");
        setProducts(response.data); // Axios already parses JSON
      } catch (err: any) {
        console.error("Error fetching products:", err);
        setError("Failed to load products.");
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="flex flex-row pt-10 px-32 max-xl:px-20 max-lg:px-10 max-md:px-6 bg-gray-100">
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid grid-cols-4 justify-items-center gap-x-6 gap-y-8 max-xl:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1">
        {products.map((product) => (
          <ProductItem key={product.id} product={product} color="white" />
        ))}
      </div>
    </div>
  );
};

export default ProductsSection;