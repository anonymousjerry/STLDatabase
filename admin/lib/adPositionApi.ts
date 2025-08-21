import { createClient } from '@sanity/client'
import { AdPosition } from '../sanity/types'

const client = createClient({
  projectId: 'vngrr2a1',
  dataset: 'production',
  apiVersion: '2025-01-01',
  token: process.env.SANITY_API_TOKEN || '',
  useCdn: false,
})

// Get all ad positions
export const getAllAdPositions = async (): Promise<AdPosition[]> => {
  const query = `*[_type == "adPosition"] | order(priority asc, createdAt desc) {
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
  
  return client.fetch(query)
}

// Get ad positions by page
export const getAdPositionsByPage = async (page: string): Promise<AdPosition[]> => {
  const query = `*[_type == "adPosition" && page == $page && enabled == true] | order(priority asc) {
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
  
  return client.fetch(query, { page })
}

// Get single ad position by ID
export const getAdPositionById = async (id: string): Promise<AdPosition | null> => {
  const query = `*[_type == "adPosition" && _id == $id][0] {
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
  
  return client.fetch(query, { id })
}

// Create new ad position
export const createAdPosition = async (adPosition: Omit<AdPosition, '_id' | '_type' | 'createdAt' | 'updatedAt'>): Promise<AdPosition> => {
  const doc = {
    _type: 'adPosition',
    ...adPosition,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  
  const result = await client.create(doc)
  return result as unknown as AdPosition
}

// Update ad position
export const updateAdPosition = async (id: string, updates: Partial<AdPosition>): Promise<AdPosition> => {
  const doc = {
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  
  const result = await client.patch(id).set(doc).commit()
  return result as unknown as AdPosition
}

// Delete ad position
export const deleteAdPosition = async (id: string): Promise<void> => {
  await client.delete(id)
}

// Toggle ad position enabled status
export const toggleAdPosition = async (id: string, enabled: boolean): Promise<AdPosition> => {
  const result = await client.patch(id).set({ enabled, updatedAt: new Date().toISOString() }).commit()
  return result as unknown as AdPosition
}

// Get active ad positions (enabled and within date range)
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

// Get ad positions by position type
export const getAdPositionsByType = async (adType: string): Promise<AdPosition[]> => {
  const query = `*[_type == "adPosition" && adType == $adType] | order(priority asc) {
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
  
  return client.fetch(query, { adType })
}

// Search ad positions
export const searchAdPositions = async (searchTerm: string): Promise<AdPosition[]> => {
  const query = `*[_type == "adPosition" && 
    (title match "*" + $searchTerm + "*" || 
     clientName match "*" + $searchTerm + "*" || 
     clientEmail match "*" + $searchTerm + "*" ||
     position match "*" + $searchTerm + "*")] | order(priority asc, createdAt desc) {
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
  
  return client.fetch(query, { searchTerm })
} 