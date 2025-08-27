import type { PortableTextBlock } from '@portabletext/types'

export interface User {
  id: string
  username: string
  email: string
  role: string
  createdAt: string
  updatedAt: string
  likes: Like
}

export interface Category {
  id: string;
  name: string;
  imageUrl: string | File;
  subcategories: Subcategory[];
}

export interface Subcategory {
  id?: string;
  name: string;
}

export interface Model {
  id: string
  title: string
  description: string
  sourceSite: SourceSite
  sourceSiteId: string
  category: Category
  categoryId: string
  subCategory: Subcategory
  subCategoryId: string
  tags: string[]
  likes: Like[]
  deleted: boolean
  downloads: number
  thumbnailUrl: string
  sourceUrl: string
  imagesUrl: string[]
  price: string
  websiteUrl?: string;
  createdAt: string
  updatedAt: string
}

export interface SourceSite {
  id: string
  name: string
  url: string
  models: Model[]
}



export interface Like {
  id: string
  userId: string
  model: Model
  modelId: string
  createdAt: string
}

export interface ScrapeJob {
  id: string
  _type: 'scrapeJob'
  platform: 'Thingiverse' | 'CGTrader' | 'Makerworld' | 'Pinshape' | 'Thangs' | 'Printables'
  count: number
  startTime: string
  // startDateTime?: string; // full ISO timestamp
  timezone?: string;
  isActive: boolean
  status: 'idle' | 'running' | 'completed' | 'failed'
  createdAt?: string
  updatedAt?: string
}

export interface AdPosition {
  id: string
  _type: 'adPosition'
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