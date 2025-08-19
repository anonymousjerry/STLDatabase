import React, { useEffect, useState } from 'react';
import { deleteModelApi, getAllModels, updateModel } from '../lib/modelApi';
import { Trash2 } from 'lucide-react';

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
  const [filter, setFilter] = useState('');
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false); // For Add Model modal
  const pageSize = 20;

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await getAllModels();
      setModels(res);
    } catch {
      setAlert({ type: 'error', message: 'Failed to fetch models' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, []);

  const addModel = async () => {
    try {
      setLoading(true);
      // Replace with your API call
      // await addModelApi(form);
      await refresh();
      setAlert({ type: 'success', message: 'Model added!' });
      setShowAddModal(false);
      setForm({});
    } catch {
      setAlert({ type: 'error', message: 'Failed to add model' });
    } finally {
      setLoading(false);
    }
  };

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
      setAlert({ type: 'success', message: 'Model updated!' });
    } catch {
      setAlert({ type: 'error', message: 'Failed to update model' });
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
      setAlert({ type: 'success', message: 'Model deleted!' });
    } catch {
      setAlert({ type: 'error', message: 'Failed to delete model' });
    } finally {
      setLoading(false);
    }
  };

  const filtered = models.filter((m) => {
    if (!filter) return true;
    const s = filter.toLowerCase();
    return (
      m.title.toLowerCase().includes(s) ||
      m.description.toLowerCase().includes(s) ||
      m.category.toLowerCase().includes(s) ||
      m.subCategory.toLowerCase().includes(s)
    );
  });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginatedModels = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const renderCell = (m: Model, field: keyof Model, children: React.ReactNode) => {
    const isEditing = editingCell?.id === m.id && editingCell.field === field;
    const baseClass =
      "px-3 py-1 max-w-xs whitespace-nowrap overflow-hidden text-ellipsis";
    const isCheckbox = field === "isFeatured";

    return (
      <td
        className={`${baseClass} cursor-text hover:bg-gray-50`}
        onDoubleClick={(e) => {
          e.stopPropagation();
          startEdit(m, field);
        }}
      >
        {isEditing ? (
          isCheckbox ? (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={Boolean(form[field])}
                onChange={(e) =>
                  setForm((f) => ({ ...f, [field]: e.target.checked }))
                }
              />
              <button
                className="px-2 py-1 bg-blue-500 text-white rounded"
                onClick={saveEdit}
              >
                Save
              </button>
              <button
                className="px-2 py-1 bg-gray-300 rounded"
                onClick={cancelEdit}
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                autoFocus
                className="bg-white border border-gray-300 rounded px-2 py-1 w-full focus:outline-none focus:ring focus:ring-blue-200"
                value={(form[field] as string) || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, [field]: e.target.value }))
                }
              />
              <button
                className="px-2 py-1 bg-blue-500 text-white rounded"
                onClick={saveEdit}
              >
                Save
              </button>
              <button
                className="px-2 py-1 bg-gray-300 rounded"
                onClick={cancelEdit}
              >
                Cancel
              </button>
            </div>
          )
        ) : isCheckbox ? (
          <span className="flex items-center justify-center">
            {m.isFeatured ? (
              <span className="text-green-600">✔</span>
            ) : (
              <span className="text-gray-400">✖</span>
            )}
          </span>
        ) : (
          children
        )}
      </td>
    );
  };

  return (
    <div className="p-4 bg-white text-gray-900 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <input
          className="bg-gray-50 text-gray-900 border border-gray-300 rounded px-3 py-2 text-sm 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Search..."
          value={filter}
          onChange={(e) => { setFilter(e.target.value); setCurrentPage(1); }}
        />
      </div>

      {alert && (
        <div className={`mb-4 px-4 py-2 rounded ${alert.type === 'success' ? 'bg-green-800 text-green-200' : 'bg-red-800 text-red-200'}`}>
          {alert.message}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white text-left text-sm text-gray-700">
          <thead className="bg-gray-100 sticky top-0 z-10 shadow-sm">
            <tr>
              {['ID','Title','Description','Source','Category','SubCategory','Tags','Download','View','Like','Thumbnail','SourceUrl','Price','Featured', 'Action'].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 border-t border-gray-100">
            {paginatedModels.map((m) => (
              <tr key={m.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                <td className="px-3 py-1">{m.id}</td>
                {renderCell(m, 'title', m.title)}
                {renderCell(m, 'description', m.description)}
                <td className="px-3 py-1">{m.source}</td>
                <td className="px-3 py-1 min-w-[150px]">{m.category}</td>
                <td className="px-3 py-1 min-w-[150px]">{m.subCategory}</td>
                <td className="px-3 py-1 max-w-xs whitespace-nowrap overflow-hidden text-ellipsis">{m.tags.join(', ')}</td>
                <td className="px-3 py-1 text-center">{m.download}</td>
                <td className="px-3 py-1 text-center">{m.view}</td>
                <td className="px-3 py-1 text-center">{m.like}</td>
                <td className="px-3 py-1 justify-center flex">
                  <img src={m.thumbnailUrl} alt="" className="w-8 h-8 object-cover rounded" />
                </td>
                {renderCell(m, 'sourceUrl',
                  <a href={m.sourceUrl} target="_blank" rel="noreferrer" className="text-blue-400">{m.sourceUrl}</a>
                )}
                <td className="px-3 py-1">{m.price}</td>
                {renderCell(m, 'isFeatured', m.isFeatured)}
                  <td className="px-3 py-2 flex justify-center">
                    <button
                      onClick={() => deleteModel(m.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete model"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-4 space-x-2">
        <button
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((page) => page === 1 || page === totalPages || (page >= currentPage - 2 && page <= currentPage + 2))
          .map((page, idx, arr) => {
            if (idx > 0 && page - arr[idx - 1] > 1) return <span key={`dots-${page}`} className="px-2">...</span>;
            return (
              <button
                key={page}
                className={`px-3 py-1 rounded ${page === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                onClick={() => goToPage(page)}
              >
                {page}
              </button>
            );
          })}

        <button
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {/* Add Model Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-20">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <h2 className="text-lg font-semibold mb-4">Add New Model</h2>

            <div className="grid grid-cols-1 gap-3">
              <input
                className="border px-3 py-2 rounded"
                placeholder="Title"
                value={form.title || ''}
                onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
              />
              <input
                className="border px-3 py-2 rounded"
                placeholder="Description"
                value={form.description || ''}
                onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
              />
              <input
                className="border px-3 py-2 rounded"
                placeholder="Source"
                value={form.source || ''}
                onChange={(e) => setForm(f => ({ ...f, source: e.target.value }))}
              />
              <input
                className="border px-3 py-2 rounded"
                placeholder="Category"
                value={form.category || ''}
                onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))}
              />
              <input
                className="border px-3 py-2 rounded"
                placeholder="SubCategory"
                value={form.subCategory || ''}
                onChange={(e) => setForm(f => ({ ...f, subCategory: e.target.value }))}
              />
              <input
                className="border px-3 py-2 rounded"
                placeholder="Tags (comma separated)"
                value={form.tags ? form.tags.join(', ') : ''}
                onChange={(e) => setForm(f => ({ ...f, tags: e.target.value.split(',').map(t => t.trim()) }))}
              />
              <input
                className="border px-3 py-2 rounded"
                placeholder="Price"
                value={form.price || ''}
                onChange={(e) => setForm(f => ({ ...f, price: e.target.value }))}
              />
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={form.isFeatured || false}
                  onChange={(e) => setForm(f => ({ ...f, isFeatured: e.target.checked }))}
                />
                <span>Featured</span>
              </label>
            </div>

            <div className="flex justify-end mt-4 space-x-2">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => { setShowAddModal(false); setForm({}); }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={addModel}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
