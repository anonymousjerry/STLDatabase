// *********************
// Role of the component: products section intended to be on the home page
// Name of the component: ProductsSection.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <ProductsSection slug={slug} />
// Input parameters: no input parameters
// Output: products grid
// *********************

"use client"

import React from "react";
// import axiosInstance from "@/lib/axios";
// import { AxiosInstance } from "@/lib/axios-instance";
import { getModels } from "@/lib/modelsApi";
import ModelItem from "./ModelItem";
// import { modelLists } from "@/lib/utils";
import { useState, useEffect } from "react";

const ProductsSection = () => {
  const [models, setModels] = useState([]);

  useEffect(() => {
    getModels().then(setModels).catch(console.error)
  }, [])

  return (
    <div className="py-10 px-52 max-xl:px-20 max-lg:px-10 max-md:px-6 bg-gray-100 ">
        <div className="grid grid-cols-4 justify-between  gap-x-12  gap-y-8 max-xl:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1">
            {models.map((model: Model) => (
                <ModelItem key={model.id} model={model} color="white" />
            ))}
        </div>
    </div>
  );
};

export default ProductsSection;
