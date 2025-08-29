import React from "react";
import { getModel } from "@/lib/modelsApi";
import { ClientExplorePage } from "@/components";
import { Metadata } from "next";

interface ExploreDetailPageProps {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Dynamic metadata
export async function generateMetadata({
  params,
  searchParams,
}: ExploreDetailPageProps): Promise<Metadata> {
  const awaitedSearchParams = await searchParams;
  const id = awaitedSearchParams.id as string;

  if (!id) {
    return { title: "Model Detail - 3D Database" };
  }

  const model = await getModel(id);

  if (!model) {
    return { title: "Model Not Found - 3D Database" };
  }

  return {
    title: `${model.title} | 3D Printable Model - 3D Database`,
    description: model.description || `Download and explore ${model.title}, a high-quality 3D printable model.`,
    openGraph: {
      title: `${model.title} | 3D Printable Model - 3D Database`,
      description: model.description || `Download and explore ${model.title}, a high-quality 3D printable model.`,
      type: "website",
      url: `https://3ddatabase.com/model/${id}`,
      images: model.image ? [{ url: model.image, alt: model.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${model.title} | 3D Printable Model - 3D Database`,
      description: model.description || `Download and explore ${model.title}, a high-quality 3D printable model.`,
      images: model.image ? [model.image] : undefined,
    },
  };
}

export default async function ExplorePage(props: ExploreDetailPageProps) {
  // Await both params and searchParams
  const awaitedParams = await props.params;
  const slug = awaitedParams.slug ?? [];
  const [category, subCategory, title] = slug;

  const awaitedSearchParams = await props.searchParams;
  const id = awaitedSearchParams.id as string;
  const liked = awaitedSearchParams.liked === "true";

  const result = await getModel(id);

  return (
    <ClientExplorePage
      result={result}
      category={category}
      subCategory={subCategory}
      title={title}
      id={id}
    />
  );
}
