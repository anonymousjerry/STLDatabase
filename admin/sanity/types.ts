export interface User {
  username: string
  id: string
  email: string
  role: 'user' | 'admin'
}

export interface Like {
  id: string;
  userId: string;
  modelId: string;
}

export interface SourceSite {
  id: string;
  name: string;
  url: string;
}

export interface SubCategory {
  id: string;
  name: string;
  categoryId: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Model {
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