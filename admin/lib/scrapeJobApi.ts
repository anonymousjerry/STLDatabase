import { createClient } from '@sanity/client';
import { ScrapeJob } from '../sanity/types';

const client = createClient({
  projectId: 'your-project-id', // Replace with your actual project ID
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN || '',
  useCdn: false,
});

// Get all scrape jobs
export const getAllScrapeJobs = async (): Promise<ScrapeJob[]> => {
  try {
    console.log('Fetching all scrape jobs...');
    const query = `*[_type == "scrapeJob"] | order(createdAt desc) {
      _id,
      _type,
      platform,
      count,
      startTime,
      endTime,
      isActive,
      lastRun,
      status,
      totalRuns,
      totalModelsScraped,
      createdAt,
      updatedAt
    }`;

    const result = await client.fetch(query);
    console.log('Scrape jobs fetched successfully:', result.length);
    return result as ScrapeJob[];
  } catch (error: any) {
    console.error('Error fetching scrape jobs:', error);
    throw new Error(error.message || 'Failed to fetch scrape jobs');
  }
};

// Get active scrape jobs
export const getActiveScrapeJobs = async (): Promise<ScrapeJob[]> => {
  try {
    console.log('Fetching active scrape jobs...');
    const query = `*[_type == "scrapeJob" && isActive == true] | order(createdAt desc) {
      _id,
      _type,
      platform,
      count,
      startTime,
      endTime,
      isActive,
      lastRun,
      status,
      totalRuns,
      totalModelsScraped,
      createdAt,
      updatedAt
    }`;

    const result = await client.fetch(query);
    console.log('Active scrape jobs fetched successfully:', result.length);
    return result as ScrapeJob[];
  } catch (error: any) {
    console.error('Error fetching active scrape jobs:', error);
    throw new Error(error.message || 'Failed to fetch active scrape jobs');
  }
};

// Get scrape job by ID
export const getScrapeJobById = async (id: string): Promise<ScrapeJob | null> => {
  try {
    console.log('Fetching scrape job by ID:', id);
    const query = `*[_type == "scrapeJob" && _id == $id][0] {
      _id,
      _type,
      platform,
      count,
      startTime,
      endTime,
      isActive,
      lastRun,
      status,
      totalRuns,
      totalModelsScraped,
      createdAt,
      updatedAt
    }`;

    const result = await client.fetch(query, { id });
    console.log('Scrape job fetched successfully:', result ? 'Found' : 'Not found');
    return result as ScrapeJob | null;
  } catch (error: any) {
    console.error('Error fetching scrape job by ID:', error);
    throw new Error(error.message || 'Failed to fetch scrape job');
  }
};

// Create new scrape job
export const createScrapeJob = async (jobData: Partial<ScrapeJob>): Promise<ScrapeJob> => {
  try {
    console.log('Creating new scrape job:', jobData);
    const doc = {
      _type: 'scrapeJob',
      platform: jobData.platform,
      count: jobData.count || 10,
      startTime: jobData.startTime,
      endTime: jobData.endTime,
      isActive: jobData.isActive || false,
      status: 'idle',
      totalRuns: 0,
      totalModelsScraped: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = await client.create(doc);
    console.log('Scrape job created successfully:', result._id);
    return result as unknown as ScrapeJob;
  } catch (error: any) {
    console.error('Error creating scrape job:', error);
    throw new Error(error.message || 'Failed to create scrape job');
  }
};

// Update scrape job
export const updateScrapeJob = async (id: string, updates: Partial<ScrapeJob>): Promise<ScrapeJob> => {
  try {
    console.log('Updating scrape job:', id, updates);
    const doc = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const result = await client.patch(id).set(doc).commit();
    console.log('Scrape job updated successfully:', result._id);
    return result as unknown as ScrapeJob;
  } catch (error: any) {
    console.error('Error updating scrape job:', error);
    throw new Error(error.message || 'Failed to update scrape job');
  }
};

// Delete scrape job
export const deleteScrapeJob = async (id: string): Promise<void> => {
  try {
    console.log('Deleting scrape job:', id);
    await client.delete(id);
    console.log('Scrape job deleted successfully:', id);
  } catch (error: any) {
    console.error('Error deleting scrape job:', error);
    throw new Error(error.message || 'Failed to delete scrape job');
  }
};

// Toggle scrape job active status
export const toggleScrapeJobActive = async (id: string): Promise<ScrapeJob> => {
  try {
    console.log('Toggling scrape job active status:', id);
    const job = await getScrapeJobById(id);
    if (!job) {
      throw new Error('Scrape job not found');
    }

    const result = await client.patch(id)
      .set({ 
        isActive: !job.isActive,
        updatedAt: new Date().toISOString()
      })
      .commit();

    console.log('Scrape job status toggled successfully:', result._id);
    return result as unknown as ScrapeJob;
  } catch (error: any) {
    console.error('Error toggling scrape job status:', error);
    throw new Error(error.message || 'Failed to toggle scrape job status');
  }
};

// Update scrape job status
export const updateScrapeJobStatus = async (id: string, status: ScrapeJob['status']): Promise<ScrapeJob> => {
  try {
    console.log('Updating scrape job status:', id, status);
    const result = await client.patch(id)
      .set({ 
        status,
        updatedAt: new Date().toISOString()
      })
      .commit();

    console.log('Scrape job status updated successfully:', result._id);
    return result as unknown as ScrapeJob;
  } catch (error: any) {
    console.error('Error updating scrape job status:', error);
    throw new Error(error.message || 'Failed to update scrape job status');
  }
};

// Update scrape job run statistics
export const updateScrapeJobRunStats = async (
  id: string, 
  modelsScraped: number
): Promise<ScrapeJob> => {
  try {
    console.log('Updating scrape job run stats:', id, modelsScraped);
    const job = await getScrapeJobById(id);
    if (!job) {
      throw new Error('Scrape job not found');
    }

    const result = await client.patch(id)
      .set({
        lastRun: new Date().toISOString(),
        totalRuns: job.totalRuns + 1,
        totalModelsScraped: job.totalModelsScraped + modelsScraped,
        status: 'completed',
        updatedAt: new Date().toISOString()
      })
      .commit();

    console.log('Scrape job run stats updated successfully:', result._id);
    return result as unknown as ScrapeJob;
  } catch (error: any) {
    console.error('Error updating scrape job run stats:', error);
    throw new Error(error.message || 'Failed to update scrape job run stats');
  }
};

// Get scrape jobs by platform
export const getScrapeJobsByPlatform = async (platform: string): Promise<ScrapeJob[]> => {
  try {
    console.log('Fetching scrape jobs by platform:', platform);
    const query = `*[_type == "scrapeJob" && platform == $platform] | order(createdAt desc) {
      _id,
      _type,
      platform,
      count,
      startTime,
      endTime,
      isActive,
      lastRun,
      status,
      totalRuns,
      totalModelsScraped,
      createdAt,
      updatedAt
    }`;

    const result = await client.fetch(query, { platform });
    console.log('Platform scrape jobs fetched successfully:', result.length);
    return result as ScrapeJob[];
  } catch (error: any) {
    console.error('Error fetching scrape jobs by platform:', error);
    throw new Error(error.message || 'Failed to fetch scrape jobs by platform');
  }
};

// Get scrape jobs by status
export const getScrapeJobsByStatus = async (status: string): Promise<ScrapeJob[]> => {
  try {
    console.log('Fetching scrape jobs by status:', status);
    const query = `*[_type == "scrapeJob" && status == $status] | order(createdAt desc) {
      _id,
      _type,
      platform,
      count,
      startTime,
      endTime,
      isActive,
      lastRun,
      status,
      totalRuns,
      totalModelsScraped,
      createdAt,
      updatedAt
    }`;

    const result = await client.fetch(query, { status });
    console.log('Status scrape jobs fetched successfully:', result.length);
    return result as ScrapeJob[];
  } catch (error: any) {
    console.error('Error fetching scrape jobs by status:', error);
    throw new Error(error.message || 'Failed to fetch scrape jobs by status');
  }
};

// Search scrape jobs
export const searchScrapeJobs = async (searchTerm: string): Promise<ScrapeJob[]> => {
  try {
    console.log('Searching scrape jobs:', searchTerm);
    const query = `*[_type == "scrapeJob" && platform match "*${searchTerm}*"] | order(createdAt desc) {
      _id,
      _type,
      platform,
      count,
      startTime,
      endTime,
      isActive,
      lastRun,
      status,
      totalRuns,
      totalModelsScraped,
      createdAt,
      updatedAt
    }`;

    const result = await client.fetch(query);
    console.log('Scrape jobs search completed:', result.length);
    return result as ScrapeJob[];
  } catch (error: any) {
    console.error('Error searching scrape jobs:', error);
    throw new Error(error.message || 'Failed to search scrape jobs');
  }
};

// Get scrape jobs that need to run (active jobs within their schedule)
export const getScrapeJobsToRun = async (): Promise<ScrapeJob[]> => {
  try {
    console.log('Fetching scrape jobs to run...');
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM format

    const query = `*[_type == "scrapeJob" && isActive == true && status != "running"] {
      _id,
      _type,
      platform,
      count,
      startTime,
      endTime,
      isActive,
      lastRun,
      status,
      totalRuns,
      totalModelsScraped,
      createdAt,
      updatedAt
    }`;

    const result = await client.fetch(query);
    const jobs = result as ScrapeJob[];

    // Filter jobs that are within their schedule time
    const jobsToRun = jobs.filter(job => {
      return currentTime >= job.startTime && currentTime <= job.endTime;
    });

    console.log('Scrape jobs to run fetched successfully:', jobsToRun.length);
    return jobsToRun;
  } catch (error: any) {
    console.error('Error fetching scrape jobs to run:', error);
    throw new Error(error.message || 'Failed to fetch scrape jobs to run');
  }
};
