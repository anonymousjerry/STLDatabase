"use client";

import React, { useEffect, useState } from 'react';
import {
  getAllScrapeJobs,
  createScrapeJob,
  updateScrapeJob,
  deleteScrapeJob,
  toggleScrapeJobActive
} from '../lib/scrapeJobApi';
import { ScrapeJob } from '../sanity/types';
import { Plus, Search, Pencil, Trash2, Play, Pause } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { setupSocketListeners } from '../sanity/plugins/socketListener';

interface Alert {
  type: 'success' | 'error';
  message: string;
}

export default function ScrapeJobTable() {
  const [jobs, setJobs] = useState<ScrapeJob[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingJob, setEditingJob] = useState<ScrapeJob | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [socketConnected, setSocketConnected] = useState(false);
  const [updatingJobs, setUpdatingJobs] = useState<Set<string>>(new Set());
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const [formData, setFormData] = useState({
    platform: 'Printables' as ScrapeJob['platform'],
    count: 10,
    startTime: '09:00',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    isActive: false,
  });

  const [alert, setAlert] = useState<Alert | null>(null);

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 1500);
  };

  const refreshJobs = async () => {
    setLoading(true);
    try {
      const data = await getAllScrapeJobs();
      setJobs(data);
      setLastRefresh(new Date());
    } catch (err) {
      console.error('Error fetching scraping jobs:', err);
      showAlert('error', err instanceof Error ? err.message : 'Failed to fetch scraping jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshJobs();
  }, []);

  // Socket integration for real-time status updates
  useEffect(() => {
    const handleStatusUpdate = (id: string, status: string, platform: string) => {
      console.log(`Updating job ${id} status to ${status} for platform ${platform}`);
      
      // Add job to updating set
      setUpdatingJobs(prev => new Set(prev).add(id));
      
      // Update local state directly (backend already updated the database)
      setJobs(prevJobs => 
        prevJobs.map(job => 
          job.id === id 
            ? { ...job, status: status as ScrapeJob['status'] }
            : job
        )
      );
            
      // Remove job from updating set after a delay to show the update effect
      setTimeout(() => {
        setUpdatingJobs(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      }, 2000);
    };

    // Setup socket listeners
    setupSocketListeners(
      (status, message) => {
        // Handle general notifications
        if (status === 'success') {
          toast.success(message);
        } else if (status === 'error') {
          toast.error(message);
        } else if (status === 'warning') {
          toast(message, { icon: '⚠️' });
        } else {
          toast(message);
        }
      },
      handleStatusUpdate
    );

    // Track socket connection status
    const checkSocketConnection = () => {
      // This is a simple way to track if socket is working
      // In a real implementation, you might want to expose connection status from socketListener
      setSocketConnected(true);
    };

    // Set connected after a short delay to simulate connection
    const connectionTimer = setTimeout(checkSocketConnection, 1000);
    
    return () => {
      clearTimeout(connectionTimer);
    };
  }, []);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const createJob = async () => {
    if (!formData.platform || !formData.count) {
      showAlert('error', 'Platform and Count are required!');
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
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        isActive: false,
      });
      setIsFormVisible(false);
      showAlert('success', 'Scraping job created successfully!');
    } catch (err) {
      console.error('Error creating scraping job:', err);
      showAlert('error', err instanceof Error ? err.message : 'Failed to create scraping job');
    } finally {
      setLoading(false);
    }
  };

  const updateJob = async () => {
    if (!editingJob) return;

    try {
      setLoading(true);
      await updateScrapeJob(editingJob.id, formData);
      await refreshJobs();
      setEditingJob(null);
      setFormData({
        platform: 'Printables' as ScrapeJob['platform'],
        count: 10,
        startTime: '09:00',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        isActive: false,
      });
      showAlert('success', 'Scraping job updated successfully!');
    } catch (err) {
      console.error('Error updating scraping job:', err);
      showAlert('error', err instanceof Error ? err.message : 'Failed to update scraping job');
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
      showAlert('success', 'Scraping job deleted successfully!');
    } catch (err) {
      console.error('Error deleting scraping job:', err);
      showAlert('error', err instanceof Error ? err.message : 'Failed to delete scraping job');
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (id: string, enabled: boolean) => {
    try {
      // Update local state immediately for better UX
      setJobs(prevJobs => 
        prevJobs.map(job => 
          job.id === id 
            ? { ...job, isActive: enabled }
            : job
        )
      );
      
      // Make API call in background
      await toggleScrapeJobActive(id, enabled);
      
      // Show success message
      showAlert('success', `Job ${enabled ? 'activated' : 'deactivated'} successfully!`);
    } catch (err) {
      // Revert local state if API call fails
      setJobs(prevJobs => 
        prevJobs.map(job => 
          job.id === id 
            ? { ...job, isActive: !enabled }
            : job
        )
      );
      
      console.error('Error toggling job status:', err);
      showAlert('error', err instanceof Error ? err.message : 'Failed to toggle job status');
    }
  };

  const startEdit = (job: ScrapeJob) => {
    setEditingJob(job);
    setFormData({
      platform: job.platform,
      count: job.count,
      startTime: job.startTime,
      timezone: job.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
      isActive: job.isActive,
    });
  };

  const cancelEdit = () => {
    setEditingJob(null);
    setFormData({
      platform: 'Printables' as ScrapeJob['platform'],
      count: 10,
      startTime: '09:00',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
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

  const filteredJobs = jobs.filter(job => {
    if (!searchTerm) return true;
    return job.platform.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Scraping Job Management</h1>
        </div>
        <button
          onClick={() => {
            setIsFormVisible(!isFormVisible);
            setEditingJob(null);
            setFormData({
              platform: 'Printables' as ScrapeJob['platform'],
              count: 10,
              startTime: '09:00',
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
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
      {alert && (
        <div
          className={`fixed top-24 right-4 z-50 px-6 py-3 rounded-lg font-medium shadow-lg text-white ${
            alert.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}
        >
          {alert.message}
        </div>
      )}

      {/* Search */}
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
          <div className="flex flex-col items-end gap-1">
            <button
              onClick={refreshJobs}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Refresh
            </button>
            {lastRefresh && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Last updated: {lastRefresh.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Create/Edit Form */}
      {(isFormVisible || editingJob) && (
        <div className="p-6 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            {editingJob ? 'Edit Scraping Job' : 'Create New Scraping Job'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Platform */}
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

            {/* Count */}
            <input
              type="number"
              placeholder="Count"
              value={formData.count}
              onChange={(e) => handleInputChange('count', parseInt(e.target.value))}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
            />

            {/* Start Time */}
            <input
              type="time"
              value={formData.startTime}
              onChange={(e) => handleInputChange('startTime', e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
            />

            {/* Timezone */}
            <select
              value={formData.timezone}
              onChange={(e) => handleInputChange('timezone', e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
            >
              {Intl.supportedValuesOf("timeZone").map((tz) => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>

            {/* Active */}
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

          {/* Form Actions */}
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
                      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Active</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredJobs.map((job) => (
                <tr 
                  key={job.id} 
                  className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 ${
                    updatingJobs.has(job.id) 
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500' 
                      : ''
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{job.platform}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{job.count}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{job.startTime}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{job.timezone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(job.status)}`}>
                        {job.status}
                      </span>
                      {updatingJobs.has(job.id) && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleActive(job.id, !job.isActive)}
                      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-200 ${
                        job.isActive 
                          ? 'bg-green-100 text-green-700 border border-green-300 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700' 
                          : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600'
                      }`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${job.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      {job.isActive ? 'ON' : 'OFF'}
                    </button>
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
                        onClick={() => deleteJob(job.id)}
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
    </div>
  );
}
