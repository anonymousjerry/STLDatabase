import { ExploreMainPageClient } from '@/components';
import { searchModels } from '@/lib/modelsApi';

interface ExplorePageProps {
  searchParams: {
    key?: string;
    sourcesite?: string;
    category?: string;
    price?: string;
    favorited?: string;
    currentPage?: number;
  };
}

const ExploreMainPage = async ({ searchParams }: ExplorePageProps) => {
  const { key, sourcesite, category, price, favorited, currentPage} =  await searchParams;

  const { models, totalPage, page, hasMore } = await searchModels({
    key: key || '',
    sourcesite: sourcesite || '',
    category: category || '',
    price: price || '',
    favorited: favorited || 'false',
    page: currentPage || 1,
    limit: 12,
  });

  return (
    <ExploreMainPageClient
      initialModels={models}
      totalPage={totalPage}
      currentPage={page}
      initialSearchParams={{ key, sourcesite, category, price }}
    />
  );
};

export default ExploreMainPage;
