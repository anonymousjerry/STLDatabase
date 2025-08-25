import { axiosInstance } from './axiosInstance';
import { ScrapeJob } from '../sanity/types';

// Get all scrape jobs
export const getAllScrapeJobs = async (): Promise<ScrapeJob[]> => {
  try {
    const response = await axiosInstance.get('/scraper/getAll');
    return response.data;
  } catch (error) {
    console.error('Error fetching scrape jobs:', error);
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const err = error as { response?: any; request?: any };
      throw new Error(err.response?.data?.message || `Failed to fetch scrape jobs: ${err.response?.status}`);
    } else if (typeof error === 'object' && error !== null && 'request' in error) {
      throw new Error('Network error: Unable to connect to server');
    } else {
      throw new Error('An unexpected error occurred while fetching scrape jobs');
    }
  }
};

// Create new scrape job
export const createScrapeJob = async (jobData: Partial<ScrapeJob>): Promise<ScrapeJob> => {
  try {
    const response = await axiosInstance.post('/scraper/create', jobData);
    return response.data;
  } catch (error) {
    console.error('Error creating scrape job:', error);
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const err = error as { response?: any; request?: any };
      throw new Error(err.response?.data?.message || `Failed to create scrape job: ${err.response?.status}`);
    } else if (typeof error === 'object' && error !== null && 'request' in error) {
      throw new Error('Network error: Unable to connect to server');
    } else {
      throw new Error('An unexpected error occurred while creating scrape job');
    }
  }
};

// Update scrape job
export const updateScrapeJob = async (id: string, updates: Partial<ScrapeJob>): Promise<ScrapeJob> => {
  try {
    const response = await axiosInstance.post('/scraper/update', { id, updates });
    return response.data;
  } catch (error) {
    console.error('Error updating scrape job:', error);
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const err = error as { response?: any; request?: any };
      throw new Error(err.response?.data?.message || `Failed to update scrape job: ${err.response?.status}`);
    } else if (typeof error === 'object' && error !== null && 'request' in error) {
      throw new Error('Network error: Unable to connect to server');
    } else {
      throw new Error('An unexpected error occurred while updating scrape job');
    }
  }
};

// Delete scrape job
export const deleteScrapeJob = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/scraper/delete?id=${id}`);
  } catch (error) {
    console.error('Error deleting scrape job:', error);
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const err = error as { response?: any; request?: any };
      throw new Error(err.response?.data?.message || `Failed to delete scrape job: ${err.response?.status}`);
    } else if (typeof error === 'object' && error !== null && 'request' in error) {
      throw new Error('Network error: Unable to connect to server');
    } else {
      throw new Error('An unexpected error occurred while deleting scrape job');
    }
  }
};

// Toggle scrape job active status (ON/OFF)
export const toggleScrapeJobActive = async (id: string, enabled: boolean): Promise<ScrapeJob> => {
  try {
    const response = await axiosInstance.post('/scraper/update', 
      { 
        id, 
        updates: {
          isActive: enabled
        } 
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error toggling scrape job status:', error);
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const err = error as { response?: any; request?: any };
      throw new Error(err.response?.data?.message || `Failed to toggle scrape job status: ${err.response?.status}`);
    } else if (typeof error === 'object' && error !== null && 'request' in error) {
      throw new Error('Network error: Unable to connect to server');
    } else {
      throw new Error('An unexpected error occurred while toggling scrape job status');
    }
  }
};

// Update scrape job status
export const updateScrapeJobStatus = async (id: string, status: ScrapeJob['status']): Promise<ScrapeJob> => {
  try {
    const response = await axiosInstance.post('/scrapeJob/update', { id, updates: { status } });
    return response.data;
  } catch (error) {
    console.error('Error updating scrape job status:', error);
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const err = error as { response?: any; request?: any };
      throw new Error(err.response?.data?.message || `Failed to update scrape job status: ${err.response?.status}`);
    } else if (typeof error === 'object' && error !== null && 'request' in error) {
      throw new Error('Network error: Unable to connect to server');
    } else {
      throw new Error('An unexpected error occurred while updating scrape job status');
    }
  }
};

// // Get scrape jobs by platform
// export const getScrapeJobsByPlatform = async (platform: string): Promise<ScrapeJob[]> => {
//   try {
//     console.log('Fetching scrape jobs by platform:', platform);
//     const response = await axiosInstance.get(`/scrapeJob/platform/${encodeURIComponent(platform)}`);
//     console.log('Platform scrape jobs fetched successfully:', response.data?.length ?? 0);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching scrape jobs by platform:', error);
//     if (typeof error === 'object' && error !== null && 'response' in error) {
//       const err = error as { response?: any; request?: any };
//       throw new Error(err.response?.data?.message || `Failed to fetch scrape jobs by platform: ${err.response?.status}`);
//     } else if (typeof error === 'object' && error !== null && 'request' in error) {
//       throw new Error('Network error: Unable to connect to server');
//     } else {
//       throw new Error('An unexpected error occurred while fetching scrape jobs by platform');
//     }
//   }
// };

// // Get scrape jobs by status
// export const getScrapeJobsByStatus = async (status: string): Promise<ScrapeJob[]> => {
//   try {
//     console.log('Fetching scrape jobs by status:', status);
//     const response = await axiosInstance.get(`/scrapeJob/status/${encodeURIComponent(status)}`);
//     console.log('Status scrape jobs fetched successfully:', response.data?.length ?? 0);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching scrape jobs by status:', error);
//     if (typeof error === 'object' && error !== null && 'response' in error) {
//       const err = error as { response?: any; request?: any };
//       throw new Error(err.response?.data?.message || `Failed to fetch scrape jobs by status: ${err.response?.status}`);
//     } else if (typeof error === 'object' && error !== null && 'request' in error) {
//       throw new Error('Network error: Unable to connect to server');
//     } else {
//       throw new Error('An unexpected error occurred while fetching scrape jobs by status');
//     }
//   }
// };

// // Search scrape jobs
// export const searchScrapeJobs = async (searchTerm: string): Promise<ScrapeJob[]> => {
//   try {
//     console.log('Searching scrape jobs:', searchTerm);
//     const response = await axiosInstance.get(`/scrapeJob/search?q=${encodeURIComponent(searchTerm)}`);
//     console.log('Scrape jobs search completed:', response.data?.length ?? 0);
//     return response.data;
//   } catch (error) {
//     console.error('Error searching scrape jobs:', error);
//     if (typeof error === 'object' && error !== null && 'response' in error) {
//       const err = error as { response?: any; request?: any };
//       throw new Error(err.response?.data?.message || `Failed to search scrape jobs: ${err.response?.status}`);
//     } else if (typeof error === 'object' && error !== null && 'request' in error) {
//       throw new Error('Network error: Unable to connect to server');
//     } else {
//       throw new Error('An unexpected error occurred while searching scrape jobs');
//     }
//   }
// };
