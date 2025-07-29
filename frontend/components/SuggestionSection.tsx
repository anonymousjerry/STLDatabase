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

import React, { useCallback, useRef } from "react";
import { getTrendingModels } from "@/lib/modelsApi";
import ModelItem from "./ModelItem";
import { useState, useEffect } from "react";
import { getSuggestionModels } from "@/lib/modelsApi";

type SuggestionSectionProps = {
  modelId: string;
}

const SuggestionSection = ({modelId}: SuggestionSectionProps) => {
  const [suggestionModels, setSuggestionModels] = useState<Model[]>([]);
  useEffect(() => {
    getSuggestionModels(modelId).then(setSuggestionModels).catch(console.error);
  }, [])

  return (
    <div className="py-10 bg-custom-light-secondcolor dark:bg-custom-dark-secondcolor">
      <div className="grid grid-cols-4 justify-between gap-x-12 gap-y-8 max-xl:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1">
        {suggestionModels.map((model: Model) => (
          <ModelItem key={model.id} model={model} color="white" />
        ))}
      </div>
    </div>
  );
};

export default SuggestionSection;
