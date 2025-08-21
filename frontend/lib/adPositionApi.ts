import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'vngrr2a1',
  dataset: 'production',
  apiVersion: '2025-01-01',
  useCdn: true,
})

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

// Get active ad positions by page
export const getActiveAdPositions = async (page: string): Promise<AdPosition[]> => {
  const now = new Date().toISOString()
  const query = `*[_type == "adPosition" && page == $page && enabled == true && 
    (startDate == null || startDate <= $now) && 
    (endDate == null || endDate >= $now)] | order(priority asc) {
    _id,
    _type,
    title,
    page,
    position,
    adType,
    size,
    enabled,
    priority,
    adSlot,
    fallbackContent,
    clientName,
    clientEmail,
    startDate,
    endDate,
    notes,
    createdAt,
    updatedAt
  }`
  
  return client.fetch(query, { page, now })
}

// Get ad positions by specific positions
export const getAdPositionsByPositions = async (positions: string[]): Promise<AdPosition[]> => {
  if (positions.length === 0) return []
  
  const now = new Date().toISOString()
  const query = `*[_type == "adPosition" && position in $positions && enabled == true && 
    (startDate == null || startDate <= $now) && 
    (endDate == null || endDate >= $now)] | order(priority asc) {
    _id,
    _type,
    title,
    page,
    position,
    adType,
    size,
    enabled,
    priority,
    adSlot,
    fallbackContent,
    clientName,
    clientEmail,
    startDate,
    endDate,
    notes,
    createdAt,
    updatedAt
  }`
  
  return client.fetch(query, { positions, now })
}

// Get all active ad positions
export const getAllActiveAdPositions = async (): Promise<AdPosition[]> => {
  const now = new Date().toISOString()
  const query = `*[_type == "adPosition" && enabled == true && 
    (startDate == null || startDate <= $now) && 
    (endDate == null || endDate >= $now)] | order(priority asc) {
    _id,
    _type,
    title,
    page,
    position,
    adType,
    size,
    enabled,
    priority,
    adSlot,
    fallbackContent,
    clientName,
    clientEmail,
    startDate,
    endDate,
    notes,
    createdAt,
    updatedAt
  }`
  
  return client.fetch(query, { now })
} 