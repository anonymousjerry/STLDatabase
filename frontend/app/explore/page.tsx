import ExploreMainPageClient from '@/components/ExploreMaiPageClient';
import { searchModels } from '@/lib/modelsApi';

interface ExplorePageProps {
  searchParams: {
    key?: string;
    sourcesite?: string;
    category?: string;
    price?: string;
    favorited?: string;
  };
}

const ExploreMainPage = async ({ searchParams }: ExplorePageProps) => {
  const { key, sourcesite, category, price, favorited } = await searchParams;

    const models = await searchModels({
        key: key || "",
        sourcesite: sourcesite || "",
        category: category || "",
        price: price || "",
        favorited: favorited || "false",
    });

  return (
    <ExploreMainPageClient
      initialModels={models}
      initialSearchParams={{ key, sourcesite, category, price }}
    />
  );
};

export default ExploreMainPage;