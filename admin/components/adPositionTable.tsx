import React, { useEffect, useState } from "react";
import { 
  createAdPosition, 
  deleteAdPosition, 
  getAllAdPositions, 
  updateAdPosition, 
  toggleAdPosition
} from "../lib/adPositionApi";
import { AdPosition } from "../sanity/types";
import { Search, Plus } from "lucide-react";
import toast, { Toaster } from 'react-hot-toast';
import { AdPositionForm } from "./AdPositionForm";
import { AdPositionEditModal } from "./AdPositionEditModal";
import { AdPositionTableRow } from "./AdPositionTableRow";
import { AdPositionFormData } from "./adPositionValidation";

export function AdPositionTable() {
  const [adPositions, setAdPositions] = useState<AdPosition[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingAdPosition, setEditingAdPosition] = useState<AdPosition | null>(null);

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

  const handleCreate = async (formData: AdPositionFormData) => {
    try {
      setLoading(true);
      await createAdPosition({
        title: formData.title!,
        page: formData.page!,
        position: formData.position!,
        adType: formData.adType!,
        size: formData.size!,
        enabled: formData.enabled ?? true,
        priority: formData.priority!,
        adSlot: formData.adSlot,
        clientName: formData.clientName,
        clientEmail: formData.clientEmail,
        startDate: formData.startDate,
        endDate: formData.endDate,
      });
      await refresh();
      toast.success("Ad position created successfully!");
      setIsFormVisible(false);
    } catch (err) {
      console.error('Error creating ad position:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to create ad position');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: string, updates: Partial<AdPosition>) => {
    try {
      setLoading(true);
      await updateAdPosition(id, updates);
      await refresh();
      toast.success("Ad position updated successfully!");
    } catch (err) {
      console.error("Error updating ad position:", err);
      toast.error(err instanceof Error ? err.message : "Failed to update ad position");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleEditModalSubmit = async (formData: AdPositionFormData) => {
    if (!editingAdPosition) return;

    try {
      setLoading(true);
      await updateAdPosition(editingAdPosition.id, {
        title: formData.title!,
        page: formData.page!,
        position: formData.position!,
        adType: formData.adType!,
        size: formData.size!,
        enabled: formData.enabled ?? true,
        priority: formData.priority!,
        adSlot: formData.adSlot,
        clientName: formData.clientName,
        clientEmail: formData.clientEmail,
        startDate: formData.startDate,
        endDate: formData.endDate,
      });
      await refresh();
      toast.success("Ad position updated successfully!");
      setEditingAdPosition(null);
    } catch (err) {
      console.error("Error updating ad position:", err);
      toast.error(err instanceof Error ? err.message : "Failed to update ad position");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
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

  const handleToggle = async (id: string, enabled: boolean) => {
    try {
      setLoading(true);
      await toggleAdPosition(id, enabled);
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
          <AdPositionForm
            onSubmit={handleCreate}
            onCancel={() => {
              setIsFormVisible(false);
            }}
            loading={loading}
          />
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ad Slot</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Start</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">End</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredAdPositions.map((ad) => (
                <AdPositionTableRow
                  key={ad.id}
                  ad={ad}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                  onToggle={handleToggle}
                  loading={loading}
                />
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

      {/* Edit Modal */}
      <AdPositionEditModal
        adPosition={editingAdPosition}
        onClose={() => setEditingAdPosition(null)}
        onSubmit={handleEditModalSubmit}
        loading={loading}
      />

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 1500,
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
              duration: 1500,
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
              duration: 1500,
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