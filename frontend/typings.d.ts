
interface Like {
  id: string;
  userId: string;
  modelId: string;
}

interface SourceSite {
  id: string;
  name: string;
  url: string;
}

interface SubCategory {
  id: string;
  name: string;
  categoryId: string;
}

interface Category {
  id: string;
  name: string;
}

interface Model {
  id: string;
  title: string;
  description: string;
  sourceSiteId: string;
  categoryId: string;
  subCategoryId: string;
  category: Category;
  subCategory: SubCategory;
  tags: string[];
  likes: Like[];
  views: number;
  deleted: Boolean;
  price: string;
  downloads: number;
  imagesUrl: string[];
  thumbnailUrl: string;
  sourceUrl: string;
  createdAt: string;
  updatedAt: string;
  sourceSite: SourceSite;
}

interface User {
  id: string;
  email: string;
  password: string | null;
  role: string;
}