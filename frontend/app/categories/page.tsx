import { Metadata } from 'next';
import { getAllCategories } from '@/lib/categoryApi';
import CategoriesPageClient from '@/components/CategoriesPageClient';

// Dynamic metadata generation
export async function generateMetadata({ 
  searchParams 
}: { 
  searchParams: Promise<{
    category?: string;
  }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const { category } = params;

  // Fetch all categories
  const categories = await getAllCategories();

  // Default metadata
  let title = 'Browse 3D Models by Category - 3DDatabase';
  let description = 'Browse 3D printable models by category. Find STL files for 3D printing across all categories including household items, toys, art, tools, and more. Download free and premium 3D models.';

  // Category-specific metadata
  if (category) {
    const categoryData = categories.find((cat: { name: string }) => cat.name.toLowerCase() === category.toLowerCase());
    if (categoryData) {
      const categoryName = categoryData.name;
      title = `3D Printable ${categoryName} STL Files - 3DDatabase`;
      description = `Discover free and premium 3D printable ${categoryName} STL files. Download popular ${categoryName} models, explore unique designs, and start printing today.`;
    }
  }

  return {
    title,
    description,
    keywords: `${category || '3D models'}, STL files, 3D printing, categories, download, printable models`,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://3ddatabase.com/categories${category ? `?category=${category}` : ''}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

interface CategoriesPageProps {
  searchParams: Promise<{
    category?: string;
  }>;
}

const CategoriesPage = async ({ searchParams }: CategoriesPageProps) => {
  const { category } = await searchParams;

  // Fetch all categories
  const categories = await getAllCategories();

  return (
    <CategoriesPageClient 
      categories={categories}
      selectedCategory={category}
    />
  );
};

export default CategoriesPage;
