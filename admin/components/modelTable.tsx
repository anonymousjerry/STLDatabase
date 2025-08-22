import React, { useEffect, useState } from 'react';
import { deleteModelApi, getAllModels, updateModel } from '../lib/modelApi';
import { Trash2, Plus, Search, Pencil, Check, X } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export interface Model {
  id: string;
  title: string;
  description: string;
  source: string;
  category: string;
  subCategory: string;
  tags: string[];
  download: number;
  view: number;
  like: number;
  thumbnailUrl: string;
  sourceUrl: string;
  price: string;
  isFeatured: boolean;
}

export function ModelTable() {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingCell, setEditingCell] = useState<{ id: string; field: keyof Model } | null>(null);
  const [form, setForm] = useState<Partial<Model>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await getAllModels();
      setModels(res);
    } catch (err) {
      console.error('Error fetching models:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to fetch models');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, []);

  const startEdit = (m: Model, field: keyof Model) => {
    setEditingCell({ id: m.id, field });
    setForm({ ...m, tags: [...m.tags] });
  };

  const saveEdit = async () => {
    console.log("Saving edit for cell:", editingCell);
    if (!editingCell) return;
    const { id, field } = editingCell;

    if (field === "title" || field === "description" || field === "isFeatured") {
      const confirmed = window.confirm(
        `Are you sure you want to update the ${field}?`
      );
      if (!confirmed) {
        cancelEdit();
        return;
      }
    }

    try {
      setLoading(true);
      await updateModel(id, { ...form });
      await refresh();
      toast.success('Model updated successfully!');
    } catch (err) {
      console.error('Error updating model:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to update model');
    } finally {
      setEditingCell(null);
      setForm({});
      setLoading(false);
    }
  };

  const cancelEdit = () => { setEditingCell(null); setForm({}); };

  const deleteModel = async (id: string) => {
    if (!confirm('Delete this model?')) return;
    try {
      setLoading(true);
      await deleteModelApi(id);
      await refresh();
      toast.success('Model deleted successfully!');
    } catch (err) {
      console.error('Error deleting model:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to delete model');
    } finally {
      setLoading(false);
    }
  };

  // Filter models based on search term
  const filteredModels = models.filter((model) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      model.title.toLowerCase().includes(search) ||
      model.description.toLowerCase().includes(search) ||
      model.category.toLowerCase().includes(search) ||
      model.subCategory.toLowerCase().includes(search) ||
      model.tags.some(tag => tag.toLowerCase().includes(search))
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredModels.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentModels = filteredModels.slice(startIndex, endIndex);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Model Management</h1>
        
      </div>

      {/* Alert */}
      {/* The alert state was removed, so this block is no longer needed. */}

      {/* Search and Actions */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search models by title, description, category, or tags..."
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

      {/* Models Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600 dark:text-gray-400">Loading models...</span>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Thumbnail</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Source</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Stats</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Featured</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {currentModels.map((model) => (
                <tr key={model.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={model.thumbnailUrl}
                      alt={model.title}
                      className="w-12 h-12 rounded object-cover"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingCell?.id === model.id && editingCell?.field === 'title' ? (
                      <input
                        type="text"
                        value={form.title || ''}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        className="w-full px-3 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                      />
                    ) : (
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{model.title}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      <div className="font-medium">{model.category}</div>
                      <div className="text-gray-500 dark:text-gray-400">{model.subCategory}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{model.source}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      <div>👁️ {model.view}</div>
                      <div>⬇️ {model.download}</div>
                      <div>❤️ {model.like}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingCell?.id === model.id && editingCell?.field === 'isFeatured' ? (
                      <select
                        value={form.isFeatured?.toString() || 'false'}
                        onChange={(e) => setForm({ ...form, isFeatured: e.target.value === 'true' })}
                        className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                      >
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    ) : (
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        model.isFeatured 
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' 
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                      }`}>
                        {model.isFeatured ? 'Featured' : 'Regular'}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {editingCell?.id === model.id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={saveEdit}
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
                          onClick={() => startEdit(model, 'title')}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          title="Edit Title"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => startEdit(model, 'isFeatured')}
                          className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                          title="Toggle Featured"
                        >
                          ⭐
                        </button>
                        <button
                          onClick={() => deleteModel(model.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          title="Delete Model"
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
        
        {!loading && filteredModels.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No models found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredModels.length)} of {filteredModels.length} models
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

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
