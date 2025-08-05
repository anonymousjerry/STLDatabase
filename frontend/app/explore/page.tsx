import { ExploreMainPageClient } from '@/components';
import { searchModels } from '@/lib/modelsApi';

interface ExplorePageProps {
  searchParams: {
    key?: string;
    sourcesite?: string;
    category?: string;
    price?: string;
    favourited?: string;
    userId?: string;
    currentPage?: number;
  };
}

const ExploreMainPage = async ({ searchParams }: ExplorePageProps) => {
  const { key, sourcesite, category, price, favourited, userId, currentPage} =  await searchParams;

  const { models, totalPage, page, hasMore } = await searchModels({
    key: key || '',
    sourcesite: sourcesite || '',
    category: category || '',
    price: price || '',
    favourited: favourited || 'false',
    userId: userId || '',
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
