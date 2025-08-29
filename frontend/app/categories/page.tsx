import { Metadata } from 'next';
import { getAllCategories } from '@/lib/categoryApi';
import CategoriesPageClient from '@/components/CategoriesPageClient';
import Container from '@/components/Container';

export const metadata: Metadata = {
  title: 'Categories STL Files | Download 3D Printable Models by Category - 3DDatabase',
  description: 'Browse 3D printable models by category. Find STL files for 3D printing across all categories including household items, toys, art, tools, and more. Download free and premium 3D models.',
  keywords: '3D models, STL files, 3D printing, categories, download, printable models, household, toys, art, tools',
  openGraph: {
    title: 'Categories STL Files | Download 3D Printable Models by Category - 3DDatabase',
    description: 'Browse 3D printable models by category. Find STL files for 3D printing across all categories.',
    type: 'website',
    url: 'https://3ddatabase.com/categories',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Categories STL Files | Download 3D Printable Models by Category - 3DDatabase',
    description: 'Browse 3D printable models by category. Find STL files for 3D printing across all categories.',
  },
};

interface CategoriesPageProps {
  searchParams: Promise<{
    category?: string;
  }>;
}

const CategoriesPage = async ({ searchParams }: CategoriesPageProps) => {
  const { category } = await searchParams;

  // Fetch all categories
  const categories = await getAllCategories();

  // Generate dynamic metadata for specific category pages
  if (category) {
    const categoryData = categories.find((cat: { name: string }) => cat.name.toLowerCase() === category.toLowerCase());
    if (categoryData) {
      const categoryName = categoryData.name;
      metadata.title = `${categoryName} STL Files | Download 3D Printable ${categoryName} Models - 3DDatabase`;
      metadata.description = `Download high-quality ${categoryName} STL files for 3D printing. Browse our collection of ${categoryName.toLowerCase()} models, ready to print. Free and premium ${categoryName} 3D models available.`;
      metadata.keywords = `${categoryName}, 3D models, STL files, 3D printing, ${categoryName.toLowerCase()}, download, printable models`;
    }
  }

  return (
    // <Container>
      <CategoriesPageClient 
        categories={categories}
        selectedCategory={category}
      />
    // </Container>
  );
};

export default CategoriesPage;
