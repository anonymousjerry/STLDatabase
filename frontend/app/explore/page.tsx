import { ExploreMainPageClient } from '@/components';
import { searchModels } from '@/lib/modelsApi';

interface ExplorePageProps {
  searchParams: {
    key?: string;
    tag?: string;
    sourcesite?: string;
    category?: string;
    subCategory?: string;
    price?: string;
    favourited?: string;
    liked?: string;
    userId?: string;
    currentPage?: number;
  };
}

const ExploreMainPage = async ({ searchParams }: ExplorePageProps) => {
  const { key, tag, sourcesite, category, subCategory, price, favourited, liked, userId, currentPage} =  await searchParams;

  const { models, totalPage, page, hasMore } = await searchModels({
    key: key || '',
    tag: tag || '',
    sourcesite: sourcesite || '',
    category: category || '',
    subCategory: subCategory || '',
    price: price || '',
    favourited: favourited || 'false',
    liked: liked || 'false',
    userId: userId || '',
    page: currentPage || 1,
    limit: 12,
  });

  return (
    <ExploreMainPageClient
      initialModels={models}
      totalPage={totalPage}
      currentPage={page}
      initialSearchParams={{ key, sourcesite, category, subCategory, price }}
    />
  );
};

export default ExploreMainPage;
