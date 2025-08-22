"use client";

import React, { useEffect, useState } from 'react';
import { getAllScrapeJobs, createScrapeJob, updateScrapeJob, deleteScrapeJob, toggleScrapeJobActive } from '../lib/scrapeJobApi';
import { ScrapeJob } from '../sanity/types';
import { Plus, Search, Pencil, Trash2, Check, X, Play, Pause } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

interface Alert {
  type: 'success' | 'error';
  message: string;
}

export default function ScrapeJobTable() {
  const [jobs, setJobs] = useState<ScrapeJob[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingJob, setEditingJob] = useState<ScrapeJob | null>(null);
  const [formData, setFormData] = useState({
    platform: 'Printables' as ScrapeJob['platform'],
    count: 10,
    startTime: '09:00',
    endTime: '17:00',
    isActive: false,
  });
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const refreshJobs = async () => {
    setLoading(true);
    try {
      const data = await getAllScrapeJobs();
      setJobs(data);
    } catch (err) {
      console.error('Error fetching scraping jobs:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to fetch scraping jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshJobs();
  }, []);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const createJob = async () => {
    if (!formData.platform || !formData.count) {
      toast.error('Platform and Count are required!');
      return;
    }

    try {
      setLoading(true);
      await createScrapeJob(formData);
      await refreshJobs();
      setFormData({
        platform: 'Printables' as ScrapeJob['platform'],
        count: 10,
        startTime: '09:00',
        endTime: '17:00',
        isActive: false,
      });
      setIsFormVisible(false);
      toast.success('Scraping job created successfully!');
    } catch (err) {
      console.error('Error creating scraping job:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to create scraping job');
    } finally {
      setLoading(false);
    }
  };

  const updateJob = async () => {
    if (!editingJob) return;

    try {
      setLoading(true);
      await updateScrapeJob(editingJob._id, formData);
      await refreshJobs();
      setEditingJob(null);
      setFormData({
        platform: 'Printables' as ScrapeJob['platform'],
        count: 10,
        startTime: '09:00',
        endTime: '17:00',
        isActive: false,
      });
      toast.success('Scraping job updated successfully!');
    } catch (err) {
      console.error('Error updating scraping job:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to update scraping job');
    } finally {
      setLoading(false);
    }
  };

  const deleteJob = async (id: string) => {
    if (!confirm('Are you sure you want to delete this scraping job?')) return;

    try {
      setLoading(true);
      await deleteScrapeJob(id);
      await refreshJobs();
      toast.success('Scraping job deleted successfully!');
    } catch (err) {
      console.error('Error deleting scraping job:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to delete scraping job');
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (id: string) => {
    try {
      setLoading(true);
      await toggleScrapeJobActive(id);
      await refreshJobs();
      toast.success('Job status toggled successfully!');
    } catch (err) {
      console.error('Error toggling job status:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to toggle job status');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (job: ScrapeJob) => {
    setEditingJob(job);
    setFormData({
      platform: job.platform,
      count: job.count,
      startTime: job.startTime,
      endTime: job.endTime,
      isActive: job.isActive,
    });
  };

  const cancelEdit = () => {
    setEditingJob(null);
    setFormData({
      platform: 'Printables' as ScrapeJob['platform'],
      count: 10,
      startTime: '09:00',
      endTime: '17:00',
      isActive: false,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'idle': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'running': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  // Filter jobs based on search term
  const filteredJobs = jobs.filter((job) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return job.platform.toLowerCase().includes(search);
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Scraping Job Management</h1>
        <button
          onClick={() => {
            setIsFormVisible(!isFormVisible);
            setEditingJob(null);
            setFormData({
              platform: 'Printables' as ScrapeJob['platform'],
              count: 10,
              startTime: '09:00',
              endTime: '17:00',
              isActive: false,
            });
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Add New Scraping Job
        </button>
      </div>

      {/* Alert */}
      {/* The alert state was removed, so this block is no longer relevant. */}

      {/* Search and Actions */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search scraping jobs by platform..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          <button
            onClick={refreshJobs}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Create/Edit Form */}
      {(isFormVisible || editingJob) && (
        <div className="p-6 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            {editingJob ? 'Edit Scraping Job' : 'Create New Scraping Job'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <select
              value={formData.platform}
              onChange={(e) => handleInputChange('platform', e.target.value as ScrapeJob['platform'])}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
            >
              <option value="Printables">Printables</option>
              <option value="Thangs">Thangs</option>
              <option value="Thingiverse">Thingiverse</option>
              <option value="CGTrader">CGTrader</option>
              <option value="Makerworld">Makerworld</option>
              <option value="Pinshape">Pinshape</option>
            </select>

            <input
              type="number"
              placeholder="Count"
              value={formData.count}
              onChange={(e) => handleInputChange('count', parseInt(e.target.value))}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
            />

            <select
              value={formData.startTime}
              onChange={(e) => handleInputChange('startTime', e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                  {`${i.toString().padStart(2, '0')}:00`}
                </option>
              ))}
            </select>

            <select
              value={formData.endTime}
              onChange={(e) => handleInputChange('endTime', e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                  {`${i.toString().padStart(2, '0')}:00`}
                </option>
              ))}
            </select>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => handleInputChange('isActive', e.target.checked)}
                className="mr-2"
              />
              <label className="text-sm text-gray-700 dark:text-gray-300">Active (ON/OFF)</label>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            {editingJob ? (
              <>
                <button
                  onClick={updateJob}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? "Updating..." : "Update Job"}
                </button>
                <button
                  onClick={cancelEdit}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={createJob}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Create Job"}
                </button>
                <button
                  onClick={() => {
                    setIsFormVisible(false);
                    setFormData({
                      platform: 'Printables' as ScrapeJob['platform'],
                      count: 10,
                      startTime: '09:00',
                      endTime: '17:00',
                      isActive: false,
                    });
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Jobs Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600 dark:text-gray-400">Loading scraping jobs...</span>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Platform</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Count</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Start Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">End Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Active</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Last Run</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total Runs</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredJobs.map((job) => (
                <tr key={job._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{job.platform}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{job.count}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{job.startTime}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{job.endTime}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(job.status)}`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleActive(job._id)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        job.isActive 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-200' 
                          : 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-200'
                      }`}
                    >
                      {job.isActive ? <Play size={14} /> : <Pause size={14} />}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs">
                    <div className="text-sm text-gray-900 dark:text-white">{formatDate(job.lastRun)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {job.totalRuns} ({job.totalModelsScraped} models)
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(job)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => deleteJob(job._id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        
        {!loading && filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No scraping jobs found</p>
          </div>
        )}
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1f2937',
            color: '#fff',
            border: '1px solid #374151',
            borderRadius: '8px',
            padding: '12px 16px',
            fontSize: '14px',
            fontWeight: '500',
            zIndex: 9999,
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
            style: {
              background: '#065f46',
              border: '1px solid #047857',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
            style: {
              background: '#7f1d1d',
              border: '1px solid #dc2626',
            },
          },
        }}
        containerStyle={{
          top: 80,
          right: 20,
        }}
      />
    </div>
  );
}
