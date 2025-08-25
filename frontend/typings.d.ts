
interface Like {
  id: string;
  userId: string;
  modelId: string;
}

interface SourceSite {
  id: string;
  name: string;
  iconBigUrl: string;
  iconSmallUrl: String;
  url: string;
}

interface SubCategory {
  id: string;
  name: string;
  // categoryId: string;
}

interface Category {
  id: string;
  name: string;
  SVGUrl: string;
}


interface GroupedCategory {
  group: string;       // Category name
  items: { id: string; name: string }[];     // Subcategory names
  icon?: string;       // Category SVGUrl
}

interface Model {
  id: string;
  title: string;
  description: string;
  sourceSiteId: string;
  categoryId: string;
  category: Category;
  subCategoryId: string;
  subCategory: SubCategory;
  tags: string[];
  likes: Like[];
  views: number;
  deleted: Boolean;
  price: string;
  downloads: number;
  imagesUrl: string[];
  thumbnailUrl: string;
  websiteUrl: string;
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

interface AdPosition {
  _id: string | undefined;
  id?: string
  _type?: 'adPosition'
  title: string
  page: 'homepage' | 'detail' | 'explore'
  position: string
  adType: 'banner' | 'sidebar' | 'sponsored-model'
  size: '728x90' | '300x250' | '300x600' | 'native'
  enabled: boolean
  priority: number
  adSlot?: string
  clientName?: string
  clientEmail?: string
  startDate?: string
  endDate?: string
  createdAt?: string
  updatedAt?: string
}