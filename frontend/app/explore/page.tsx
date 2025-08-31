import { ExploreMainPageClient } from '@/components';
import Container from '@/components/Container';
import { searchModels } from '@/lib/modelsApi';
import { Metadata } from 'next';

// Dynamic metadata generation
export async function generateMetadata({ 
  searchParams 
}: { 
  searchParams: Promise<{
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
  }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const { category, subCategory, tag } = params;

  // Default metadata
  let title = 'Explore Models - 3D Database';
  let description = 'Discover free and premium 3D printable STL files. Download popular models, explore unique designs, and start printing today.';

  // Category-specific metadata
  if (category && category !== 'All') {
    const categoryName = category.replace(/\b\w/g, (char) => char.toUpperCase());
    title = `3D Printable ${categoryName} STL Files - 3DDatabase`;
    description = `Discover free and premium 3D printable ${categoryName} STL files. Download popular ${categoryName} models, explore unique designs, and start printing today.`;
  }

  // Subcategory-specific metadata
  if (subCategory) {
    const subCategoryName = subCategory.replace(/\b\w/g, (char) => char.toUpperCase());
    title = `3D Printable ${subCategoryName} STL Files - 3DDatabase`;
    description = `Discover free and premium 3D printable ${subCategoryName} STL files. Download popular ${subCategoryName} models, explore unique designs, and start printing today.`;
  }

  // Tag-specific metadata
  if (tag) {
    const tagName = tag.replace(/\b\w/g, (char) => char.toUpperCase());
    title = `3D Printable ${tagName} STL Files - 3DDatabase`;
    description = `Discover free and premium 3D printable ${tagName} STL files. Download popular ${tagName} models, explore unique designs, and start printing today.`;
  }

  return {
    title,
    description,
    keywords: `${category || '3D models'}, STL files, 3D printing, download, printable models, ${tag || ''}`,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://3ddatabase.com/explore${category ? `?category=${category}` : ''}${subCategory ? `&subCategory=${subCategory}` : ''}${tag ? `&tag=${tag}` : ''}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

interface ExplorePageProps {
  searchParams: Promise<{
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
  }>;
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
    <Container>
      <ExploreMainPageClient
        initialModels={models}
        totalPage={totalPage}
        currentPage={page}
        initialSearchParams={{ key, sourcesite, category, subCategory, price }}
      />
    </Container>
  );
};

export default ExploreMainPage;
