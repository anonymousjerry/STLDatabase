import { axiosInstance } from "./axiosInstance";
import { AdPosition } from '../sanity/types';

// Get all ad positions
export const getAllAdPositions = async (): Promise<AdPosition[]> => {
  try {
    const response = await axiosInstance.get('/advertisements');
    return response.data;
  } catch (error) {
    console.error('Error fetching ad positions:', error);
    if (typeof error === "object" && error !== null && "response" in error) {
      const err = error as { response?: any; request?: any };
      throw new Error(err.response?.data?.message || `Failed to fetch ad positions: ${err.response?.status}`);
    } else if (typeof error === "object" && error !== null && "request" in error) {
      throw new Error('Network error: Unable to connect to server');
    } else {
      throw new Error('An unexpected error occurred while fetching ad positions');
    }
  }
}

// Create new ad position
export const createAdPosition = async (adPosition: Omit<AdPosition, 'id' | '_type' | 'createdAt' | 'updatedAt'>): Promise<AdPosition> => {
  try {
    const response = await axiosInstance.post('/advertisement/create', adPosition);
    return response.data;
  } catch (error) {
    console.error('Error creating ad position:', error);
    if (typeof error === "object" && error !== null && "response" in error) {
      const err = error as { response?: any; request?: any };
      throw new Error(err.response?.data?.message || `Failed to create ad position: ${err.response?.status}`);
    } else if (typeof error === "object" && error !== null && "request" in error) {
      throw new Error('Network error: Unable to connect to server');
    } else {
      throw new Error('An unexpected error occurred while creating ad position');
    }
  }
}

// Update ad position
export const updateAdPosition = async (id: string, updates: Partial<AdPosition>): Promise<AdPosition> => {
  try {
    const response = await axiosInstance.post('advertisement/update', {id, updates});
    return response.data;
  } catch (error) {
    console.error('Error updating ad position:', error);
    if (typeof error === "object" && error !== null && "response" in error) {
      const err = error as { response?: any; request?: any };
      throw new Error(err.response?.data?.message || `Failed to update ad position: ${err.response?.status}`);
    } else if (typeof error === "object" && error !== null && "request" in error) {
      throw new Error('Network error: Unable to connect to server');
    } else {
      throw new Error('An unexpected error occurred while updating ad position');
    }
  }
}

// Delete ad position
export const deleteAdPosition = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/advertisement/delete?id=${id}`);
  } catch (error) {
    console.error('Error deleting ad position:', error);
    if (typeof error === "object" && error !== null && "response" in error) {
      const err = error as { response?: any; request?: any };
      throw new Error(err.response?.data?.message || `Failed to delete ad position: ${err.response?.status}`);
    } else if (typeof error === "object" && error !== null && "request" in error) {
      throw new Error('Network error: Unable to connect to server');
    } else {
      throw new Error('An unexpected error occurred while deleting ad position');
    }
  }
}

// Toggle ad position enabled status
export const toggleAdPosition = async (id: string, enabled: boolean): Promise<AdPosition> => {
  try {
    const response = await axiosInstance.post(`/advertisement/update`, 
      { 
        id, 
        updates: {
          enabled: enabled
        } 
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error toggling ad position status:', error);
    if (typeof error === "object" && error !== null && "response" in error) {
      const err = error as { response?: any; request?: any };
      throw new Error(err.response?.data?.message || `Failed to toggle ad position status: ${err.response?.status}`);
    } else if (typeof error === "object" && error !== null && "request" in error) {
      throw new Error('Network error: Unable to connect to server');
    } else {
      throw new Error('An unexpected error occurred while toggling ad position status');
    }
  }
}


