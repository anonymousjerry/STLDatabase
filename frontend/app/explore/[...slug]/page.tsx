import React, { useState, useEffect } from "react";
import { getModel } from "@/lib/modelsApi";
import { ClientExplorePage } from "@/components"

export default async function ExplorePage({
  params,
  searchParams,
}: {
  params: { slug?: string[] };
  searchParams: { [key: string]: string | string[] | undefined};
}) {
  const awaitedParams = await params;
  const slug = awaitedParams.slug ?? [];
  const [category, subCategory, title] = slug;

  const awaitedSearchParams = await searchParams;
  const id = awaitedSearchParams.id as string;
  const liked = awaitedSearchParams.liked === "true";

  const result = await getModel(id);
  return (
    <ClientExplorePage
      result={result}
      category={category}
      subCategory={subCategory}
      title={title}
      id = {id}
    />
  );
}