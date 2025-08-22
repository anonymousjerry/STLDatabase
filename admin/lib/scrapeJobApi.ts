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
  return result as ScrapeJob[];
};

// Get active scrape jobs
export const getActiveScrapeJobs = async (): Promise<ScrapeJob[]> => {
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
  return result as ScrapeJob[];
};

// Get scrape job by ID
export const getScrapeJobById = async (id: string): Promise<ScrapeJob | null> => {
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
  return result as ScrapeJob | null;
};

// Create new scrape job
export const createScrapeJob = async (jobData: Partial<ScrapeJob>): Promise<ScrapeJob> => {
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
  return result as unknown as ScrapeJob;
};

// Update scrape job
export const updateScrapeJob = async (id: string, updates: Partial<ScrapeJob>): Promise<ScrapeJob> => {
  const doc = {
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  const result = await client.patch(id).set(doc).commit();
  return result as unknown as ScrapeJob;
};

// Delete scrape job
export const deleteScrapeJob = async (id: string): Promise<void> => {
  await client.delete(id);
};

// Toggle scrape job active status
export const toggleScrapeJobActive = async (id: string): Promise<ScrapeJob> => {
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

  return result as unknown as ScrapeJob;
};

// Update scrape job status
export const updateScrapeJobStatus = async (id: string, status: ScrapeJob['status']): Promise<ScrapeJob> => {
  const result = await client.patch(id)
    .set({ 
      status,
      updatedAt: new Date().toISOString()
    })
    .commit();

  return result as unknown as ScrapeJob;
};

// Update scrape job run statistics
export const updateScrapeJobRunStats = async (
  id: string, 
  modelsScraped: number
): Promise<ScrapeJob> => {
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

  return result as unknown as ScrapeJob;
};

// Get scrape jobs by platform
export const getScrapeJobsByPlatform = async (platform: string): Promise<ScrapeJob[]> => {
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
  return result as ScrapeJob[];
};

// Get scrape jobs by status
export const getScrapeJobsByStatus = async (status: string): Promise<ScrapeJob[]> => {
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
  return result as ScrapeJob[];
};

// Search scrape jobs
export const searchScrapeJobs = async (searchTerm: string): Promise<ScrapeJob[]> => {
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
  return result as ScrapeJob[];
};

// Get scrape jobs that need to run (active jobs within their schedule)
export const getScrapeJobsToRun = async (): Promise<ScrapeJob[]> => {
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
  return jobs.filter(job => {
    return currentTime >= job.startTime && currentTime <= job.endTime;
  });
};
