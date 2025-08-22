import React, { useEffect, useState } from "react";
import { 
  createAdPosition, 
  deleteAdPosition, 
  getAllAdPositions, 
  updateAdPosition, 
  toggleAdPosition
} from "../lib/adPositionApi";
import { AdPosition } from "../sanity/types";
import { Pencil, Trash2, Check, X, Eye, EyeOff, Search, Plus } from "lucide-react";
import toast, { Toaster } from 'react-hot-toast';

export function AdPositionTable() {
  const [adPositions, setAdPositions] = useState<AdPosition[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<AdPosition>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await getAllAdPositions();
      setAdPositions(res);
    } catch (err) {
      console.error('Error fetching ad positions:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to fetch ad positions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const startEdit = (ad: AdPosition) => {
    setEditingId(ad._id);
    setForm({
      title: ad.title,
      page: ad.page,
      position: ad.position,
      adType: ad.adType,
      size: ad.size,
      enabled: ad.enabled,
      priority: ad.priority,
      adSlot: ad.adSlot,
      fallbackContent: ad.fallbackContent,
      clientName: ad.clientName,
      clientEmail: ad.clientEmail,
      startDate: ad.startDate,
      endDate: ad.endDate,
      notes: ad.notes,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({});
  };

  const createAd = async () => {
    if (!form.title || !form.page || !form.position || !form.adType || !form.size) {
      toast.error("Title, Page, Position, Ad Type, and Size are required!");
      return;
    }
    try {
      setLoading(true);
      await createAdPosition({
        title: form.title,
        page: form.page,
        position: form.position,
        adType: form.adType,
        size: form.size,
        enabled: form.enabled ?? true,
        priority: form.priority ?? 1,
        adSlot: form.adSlot,
        fallbackContent: form.fallbackContent,
        clientName: form.clientName,
        clientEmail: form.clientEmail,
        startDate: form.startDate,
        endDate: form.endDate,
        notes: form.notes,
      });
      await refresh();
      setForm({});
      toast.success("Ad position created successfully!");
      setIsFormVisible(false);
    } catch (err) {
      console.error('Error creating ad position:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to create ad position');
    } finally {
      setLoading(false);
    }
  };

  const updateAd = async () => {
    if (!editingId) return;
    try {
      setLoading(true);
      await updateAdPosition(editingId, form);
      await refresh();
      cancelEdit();
      toast.success("Ad position updated successfully!");
    } catch (err) {
      console.error('Error updating ad position:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to update ad position');
    } finally {
      setLoading(false);
    }
  };

  const deleteAd = async (id: string) => {
    if (!confirm("Delete this ad position?")) return;
    try {
      setLoading(true);
      await deleteAdPosition(id);
      await refresh();
      toast.success("Ad position deleted successfully!");
    } catch (err) {
      console.error('Error deleting ad position:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to delete ad position');
    } finally {
      setLoading(false);
    }
  };

  const toggleAd = async (id: string) => {
    try {
      setLoading(true);
      await toggleAdPosition(id, form.enabled ?? false);
      await refresh();
      toast.success("Ad position toggled successfully!");
    } catch (err) {
      console.error('Error toggling ad position:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to toggle ad position');
    } finally {
      setLoading(false);
    }
  };

  // Filter ad positions based on search term
  const filteredAdPositions = adPositions.filter((ad) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      ad.title.toLowerCase().includes(search) ||
      ad.page.toLowerCase().includes(search) ||
      ad.position.toLowerCase().includes(search) ||
      ad.adType.toLowerCase().includes(search) ||
      (ad.clientName && ad.clientName.toLowerCase().includes(search)) ||
      (ad.clientEmail && ad.clientEmail.toLowerCase().includes(search))
    );
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Ad Position Management</h1>
        <button
          onClick={() => setIsFormVisible(!isFormVisible)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Add New Ad Position
        </button>
      </div>

      {/* Alert */}
      {/* The alert component is removed as per the new_code, but the Toaster is added. */}

      {/* Search and Actions */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search ad positions by title, page, position, type, or client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          <button
            onClick={refresh}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Create Ad Position Form */}
      {isFormVisible && (
        <div className="p-6 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Create New Ad Position</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Title"
              value={form.title || ""}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
            />
            
            <select
              value={form.page || ""}
              onChange={(e) => setForm({ ...form, page: e.target.value as "homepage" | "detail" | "explore" })}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
            >
              <option value="">Select Page</option>
              <option value="homepage">Homepage</option>
              <option value="detail">Detail</option>
              <option value="explore">Explore</option>
            </select>

            <input
              type="text"
              placeholder="Position"
              value={form.position || ""}
              onChange={(e) => setForm({ ...form, position: e.target.value })}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
            />

            <select
              value={form.adType || ""}
              onChange={(e) => setForm({ ...form, adType: e.target.value as "banner" | "sidebar" | "sponsored-model" })}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
            >
              <option value="">Select Ad Type</option>
              <option value="banner">Banner</option>
              <option value="sidebar">Sidebar</option>
              <option value="sponsored">Sponsored</option>
            </select>

            <input
              type="text"
              placeholder="Size (e.g., 728x90)"
              value={form.size || ""}
              onChange={(e) => setForm({ ...form, size: e.target.value as "728x90" | "300x250" | "300x600" | "native" })}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
            />

            <input
              type="text"
              placeholder="Ad Slot ID"
              value={form.adSlot || ""}
              onChange={(e) => setForm({ ...form, adSlot: e.target.value })}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
            />

            <input
              type="text"
              placeholder="Client Name"
              value={form.clientName || ""}
              onChange={(e) => setForm({ ...form, clientName: e.target.value })}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
            />

            <input
              type="email"
              placeholder="Client Email"
              value={form.clientEmail || ""}
              onChange={(e) => setForm({ ...form, clientEmail: e.target.value })}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
            />

            <input
              type="date"
              placeholder="Start Date"
              value={form.startDate || ""}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
            />

            <input
              type="date"
              placeholder="End Date"
              value={form.endDate || ""}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
            />

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={form.enabled ?? true}
                onChange={(e) => setForm({ ...form, enabled: e.target.checked })}
                className="mr-2"
              />
              <label className="text-sm text-gray-700 dark:text-gray-300">Enabled</label>
            </div>
          </div>

          <div className="mt-4">
            <textarea
              placeholder="Fallback Content (HTML)"
              value={form.fallbackContent || ""}
              onChange={(e) => setForm({ ...form, fallbackContent: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
              rows={3}
            />
          </div>

          <div className="mt-4">
            <textarea
              placeholder="Notes"
              value={form.notes || ""}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
              rows={2}
            />
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={createAd}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Ad Position"}
            </button>
            <button
              onClick={() => {
                setIsFormVisible(false);
                setForm({});
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Ad Positions Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600 dark:text-gray-400">Loading ad positions...</span>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Page</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Position</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Size</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredAdPositions.map((ad) => (
                <tr key={ad._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === ad._id ? (
                      <input
                        type="text"
                        value={form.title || ""}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        className="w-full px-3 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                      />
                    ) : (
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{ad.title}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      ad.page === 'homepage' 
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                        : ad.page === 'detail'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                    }`}>
                      {ad.page}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{ad.position}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      ad.adType === 'banner' 
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' 
                        : ad.adType === 'sidebar'
                        ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
                        : 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200'
                    }`}>
                      {ad.adType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{ad.size}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleAd(ad._id)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        ad.enabled 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-200' 
                          : 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-200'
                      }`}
                    >
                      {ad.enabled ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {ad.clientName && <div className="font-medium">{ad.clientName}</div>}
                      {ad.clientEmail && <div className="text-gray-500 dark:text-gray-400">{ad.clientEmail}</div>}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {editingId === ad._id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={updateAd}
                          disabled={loading}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(ad)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => deleteAd(ad._id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        
        {!loading && filteredAdPositions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No ad positions found</p>
          </div>
        )}
      </div>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
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