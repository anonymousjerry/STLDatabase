"use client"

import React from "react";
import ModelItem from "./ModelItem";

const SearchResultPart = ({models}: {models: Model[]}) => {
    return (
        <div className="grid grid-cols-3 justify-between gap-x-12 gap-y-8 max-xl:grid-cols-2 max-md:grid-cols-2 max-sm:grid-cols-1 pt-5">
            {models.map((model: Model) => (
                <ModelItem key={model.id} model={model} color="white" />
            ))}
        </div>
    )
}

export default SearchResultPart;