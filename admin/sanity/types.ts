import type { PortableTextBlock } from '@portabletext/types'

export interface User {
  id: string
  username: string
  email: string
  role: string
  createdAt: string
  updatedAt: string
}

export interface Model {
  id: string
  title: string
  description: string
  sourceSite: SourceSite
  sourceSiteId: string
  category: Category
  categoryId: string
  subCategory: SubCategory
  subCategoryId: string
  tags: string[]
  likes: Like[]
  favourites: Favourite[]
  deleted: boolean
  downloads: number
  thumbnailUrl: string
  sourceUrl: string
  imagesUrl: string[]
  price: string
  createdAt: string
  updatedAt: string
}

export interface SourceSite {
  id: string
  name: string
  url: string
  models: Model[]
}

export interface Category {
  id: string
  name: string
  models: Model[]
  subCategories: SubCategory[]
}

export interface SubCategory {
  id: string
  name: string
  category: Category
  categoryId: string
  models: Model[]
}

export interface Like {
  id: string
  user: User
  userId: string
  model: Model
  modelId: string
}

export interface Favourite {
  id: string
  user: User
  userId: string
  model: Model
  modelId: string
}

export interface ScrapeJob {
  _id: string
  _type: 'scrapeJob'
  platform: 'Thingiverse' | 'CGTrader' | 'Makerworld' | 'Pinshape' | 'Thangs' | 'Printables'
  count: number
  startTime: string
  endTime: string
  isActive: boolean
  lastRun?: string
  status: 'idle' | 'running' | 'completed' | 'failed'
  totalRuns: number
  totalModelsScraped: number
  createdAt?: string
  updatedAt?: string
}

export interface AdPosition {
  _id: string
  _type: 'adPosition'
  title: string
  page: 'homepage' | 'detail' | 'explore'
  position: string
  adType: 'banner' | 'sidebar' | 'sponsored-model'
  size: '728x90' | '300x250' | '300x600' | 'native'
  enabled: boolean
  priority: number
  adSlot?: string
  fallbackContent?: string
  clientName?: string
  clientEmail?: string
  startDate?: string
  endDate?: string
  notes?: string
  createdAt?: string
  updatedAt?: string
}