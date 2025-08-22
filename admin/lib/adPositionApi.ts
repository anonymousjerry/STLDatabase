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
  try {
    console.log('Fetching all ad positions...');
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
    
    const result = await client.fetch(query);
    console.log('Ad positions fetched successfully:', result.length);
    return result;
  } catch (error: any) {
    console.error('Error fetching ad positions:', error);
    throw new Error(error.message || 'Failed to fetch ad positions');
  }
}

// Get ad positions by page
export const getAdPositionsByPage = async (page: string): Promise<AdPosition[]> => {
  try {
    console.log('Fetching ad positions by page:', page);
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
    
    const result = await client.fetch(query, { page });
    console.log('Page ad positions fetched successfully:', result.length);
    return result;
  } catch (error: any) {
    console.error('Error fetching ad positions by page:', error);
    throw new Error(error.message || 'Failed to fetch ad positions by page');
  }
}

// Get single ad position by ID
export const getAdPositionById = async (id: string): Promise<AdPosition | null> => {
  try {
    console.log('Fetching ad position by ID:', id);
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
    
    const result = await client.fetch(query, { id });
    console.log('Ad position fetched successfully:', result ? 'Found' : 'Not found');
    return result;
  } catch (error: any) {
    console.error('Error fetching ad position by ID:', error);
    throw new Error(error.message || 'Failed to fetch ad position');
  }
}

// Create new ad position
export const createAdPosition = async (adPosition: Omit<AdPosition, '_id' | '_type' | 'createdAt' | 'updatedAt'>): Promise<AdPosition> => {
  try {
    console.log('Creating new ad position:', adPosition);
    const doc = {
      _type: 'adPosition',
      ...adPosition,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    const result = await client.create(doc);
    console.log('Ad position created successfully:', result._id);
    return result as unknown as AdPosition;
  } catch (error: any) {
    console.error('Error creating ad position:', error);
    throw new Error(error.message || 'Failed to create ad position');
  }
}

// Update ad position
export const updateAdPosition = async (id: string, updates: Partial<AdPosition>): Promise<AdPosition> => {
  try {
    console.log('Updating ad position:', id, updates);
    const doc = {
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    
    const result = await client.patch(id).set(doc).commit();
    console.log('Ad position updated successfully:', result._id);
    return result as unknown as AdPosition;
  } catch (error: any) {
    console.error('Error updating ad position:', error);
    throw new Error(error.message || 'Failed to update ad position');
  }
}

// Delete ad position
export const deleteAdPosition = async (id: string): Promise<void> => {
  try {
    console.log('Deleting ad position:', id);
    await client.delete(id);
    console.log('Ad position deleted successfully:', id);
  } catch (error: any) {
    console.error('Error deleting ad position:', error);
    throw new Error(error.message || 'Failed to delete ad position');
  }
}

// Toggle ad position enabled status
export const toggleAdPosition = async (id: string, enabled: boolean): Promise<AdPosition> => {
  try {
    console.log('Toggling ad position enabled status:', id, enabled);
    const result = await client.patch(id).set({ enabled, updatedAt: new Date().toISOString() }).commit();
    console.log('Ad position status toggled successfully:', result._id);
    return result as unknown as AdPosition;
  } catch (error: any) {
    console.error('Error toggling ad position status:', error);
    throw new Error(error.message || 'Failed to toggle ad position status');
  }
}

// Get active ad positions (enabled and within date range)
export const getActiveAdPositions = async (page: string): Promise<AdPosition[]> => {
  try {
    console.log('Fetching active ad positions for page:', page);
    const now = new Date().toISOString();
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
    
    const result = await client.fetch(query, { page, now });
    console.log('Active ad positions fetched successfully:', result.length);
    return result;
  } catch (error: any) {
    console.error('Error fetching active ad positions:', error);
    throw new Error(error.message || 'Failed to fetch active ad positions');
  }
}

// Get ad positions by position type
export const getAdPositionsByType = async (adType: string): Promise<AdPosition[]> => {
  try {
    console.log('Fetching ad positions by type:', adType);
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
    
    const result = await client.fetch(query, { adType });
    console.log('Type ad positions fetched successfully:', result.length);
    return result;
  } catch (error: any) {
    console.error('Error fetching ad positions by type:', error);
    throw new Error(error.message || 'Failed to fetch ad positions by type');
  }
}

// Search ad positions
export const searchAdPositions = async (searchTerm: string): Promise<AdPosition[]> => {
  try {
    console.log('Searching ad positions:', searchTerm);
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
    
    const result = await client.fetch(query, { searchTerm });
    console.log('Ad positions search completed:', result.length);
    return result;
  } catch (error: any) {
    console.error('Error searching ad positions:', error);
    throw new Error(error.message || 'Failed to search ad positions');
  }
} 