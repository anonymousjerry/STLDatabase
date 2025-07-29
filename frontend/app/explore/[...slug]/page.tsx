import React, { useState, useEffect } from "react";
import { getModel } from "@/lib/modelsApi";
import ClientExplorePage from "@/components/ClientExplorePage";

export default async function ExplorePage({ params }: { params: { slug: string[] } }) {
  const [category, subCategory, title, id, liked] = await params.slug || [];
  const result = await getModel(id);
  return (
    <ClientExplorePage
      category={category}
      subCategory={subCategory}
      title={title}
      id={id}
      result={result}
      like={liked === "true"}
    />
  );
}