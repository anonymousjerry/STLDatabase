"use client";
import React, { useEffect, useState } from "react";
import {
  deleteModelApi,
  getAllModels,
  updateModel,
} from "../lib/modelApi";
import {
  Trash2,
  Search,
  Pencil,
  Eye,
  Download,
  Heart,
  ExternalLink,
  X,
  Star,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import clsx from "clsx";
import { UserModal } from "./UserModal";
import { getAllCategories } from "../lib/categoryApi";
import { Category } from "../sanity/types";

export interface Model {
  id: string;
  title: string;
  description: string;
  category?: string;
  categoryId?: string;
  subCategory?: string;
  subCategoryId?: string;
  tags?: string[];
  likes?: Array<{ id: string; user: { id: string; username: string; email: string }; userId: string }>;
  downloads?: number;
  views?: number;
  thumbnailUrl?: string;
  sourceUrl?: string;
  websiteUrl?: string;
  price?: string;
  isFeatured?: boolean;
}

type SortField = 'title' | 'category' | 'downloads' | 'views' | 'price' | 'isFeatured';
type SortDirection = 'asc' | 'desc';

const normalizeCategories = (data: any[]): Category[] => {
  return data.map((cat) => ({
    id: cat.id,
    name: cat.name,
    imageUrl: cat.SVGUrl || '',
    subcategories: (cat.subCategories || []).map((sub: any) => ({
      id: sub.id,
      name: sub.name,
    })),
  }));
};

export function ModelTable() {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingModel, setEditingModel] = useState<Model | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('title');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [userModal, setUserModal] = useState<{
    isOpen: boolean;
    title: string;
    users: Array<{ id: string; username: string; email: string }>;
  }>({ isOpen: false, title: "", users: [] });
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");

  const pageSize = 20;

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAllModels();
      const cat = await getAllCategories();
      setCategories(normalizeCategories(cat));
      setModels(res || []);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to fetch models");
      toast.error("Failed to fetch models");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const saveEdit = async () => {
    if (!editingModel) return;
    if (!window.confirm("Update this model?")) return;

    try {
      setLoading(true);
      await updateModel(editingModel.id, editingModel);
      await refresh();
      toast.success("Model updated!");
      setEditingModel(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update model");
    } finally {
      setLoading(false);
    }
  };

  const deleteModel = async (id: string) => {
    if (!confirm("Delete this model?")) return;
    try {
      setLoading(true);
      await deleteModelApi(id);
      await refresh();
      toast.success("Model deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete model");
    } finally {
      setLoading(false);
    }
  };

  const showUserModal = (
    title: string,
    users: Array<{ id: string; username: string; email: string }>
  ) => setUserModal({ isOpen: true, title, users });

  const closeUserModal = () =>
    setUserModal({ isOpen: false, title: "", users: [] });

  const resetFilters = () => {
    setSelectedCategory("");
    setSelectedSubCategory("");
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handleCategoryChange = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setSelectedSubCategory(""); // Reset subcategory when category changes
    setCurrentPage(1);
  };

  const handleSubCategoryChange = (subCategoryName: string) => {
    setSelectedSubCategory(subCategoryName);
    setCurrentPage(1);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1); // Reset to first page when sorting
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ChevronUp className="w-4 h-4 text-gray-400" />;
    }
    return sortDirection === 'asc' 
      ? <ChevronUp className="w-4 h-4 text-blue-600" />
      : <ChevronDown className="w-4 h-4 text-blue-600" />;
  };

  const filteredModels = models.filter((model) => {
    const search = searchTerm.toLowerCase();
    const matchesCategory = selectedCategory ? model.category === selectedCategory : true;
    const matchesSubCategory = selectedSubCategory ? model.subCategory === selectedSubCategory : true;

    return (
      (!searchTerm ||
        model.title.toLowerCase().includes(search) ||
        model.description.toLowerCase().includes(search) ||
        (model.category || "").toLowerCase().includes(search) ||
        (model.subCategory || "").toLowerCase().includes(search) ||
        (model.tags || []).some((tag) => tag.toLowerCase().includes(search))) &&
      matchesCategory &&
      matchesSubCategory
    );
  });

  const sortedModels = [...filteredModels].sort((a, b) => {
    let aValue: any, bValue: any;
    
    switch (sortField) {
      case 'title':
        aValue = a.title || '';
        bValue = b.title || '';
        break;
      case 'category':
        aValue = a.category || '';
        bValue = b.category || '';
        break;
      case 'downloads':
        aValue = a.downloads || 0;
        bValue = b.downloads || 0;
        break;
      case 'views':
        aValue = a.views || 0;
        bValue = b.views || 0;
        break;
      case 'price':
        aValue = a.price || 'Free';
        bValue = b.price || 'Free';
        break;
      case 'isFeatured':
        aValue = a.isFeatured ? 1 : 0;
        bValue = b.isFeatured ? 1 : 0;
        break;
      default:
        return 0;
    }
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      const comparison = aValue.localeCompare(bValue);
      return sortDirection === 'asc' ? comparison : -comparison;
    } else {
      const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return sortDirection === 'asc' ? comparison : -comparison;
    }
  });

  const totalPages = Math.ceil(sortedModels.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentModels = sortedModels.slice(startIndex, endIndex);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 border-b border-gray-200 dark:border-gray-700 gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Model Management
        </h1>
        <div className="flex gap-4 w-full md:w-auto">
          {/* Category and Subcategory Filters */}
          <div className="flex gap-2 flex-1 md:flex-none">
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="px-3 py-2 pr-8 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm appearance-none bg-no-repeat"
              style={{
                // simple caret using currentColor so it matches light/dark
                backgroundImage:
                  'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 20 20\' fill=\'currentColor\'%3E%3Cpath d=\'M5.8 7.5a1 1 0 0 1 1.4 0L10 10.3l2.8-2.8a1 1 0 1 1 1.4 1.4l-3.5 3.5a1 1 0 0 1-1.4 0L5.8 8.9a1 1 0 0 1 0-1.4z\'/%3E%3C/svg%3E")',
                backgroundSize: '1rem 1rem',
                backgroundPosition: 'right 0.5rem center', // ≈ pr-2 for the arrow
              }}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
            
            <select
              value={selectedSubCategory}
              onChange={(e) => handleSubCategoryChange(e.target.value)}
              disabled={!selectedCategory}
              className="px-3 py-2 pr-8 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm appearance-none bg-no-repeat"
              style={{
                // simple caret using currentColor so it matches light/dark
                backgroundImage:
                  'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 20 20\' fill=\'currentColor\'%3E%3Cpath d=\'M5.8 7.5a1 1 0 0 1 1.4 0L10 10.3l2.8-2.8a1 1 0 1 1 1.4 1.4l-3.5 3.5a1 1 0 0 1-1.4 0L5.8 8.9a1 1 0 0 1 0-1.4z\'/%3E%3C/svg%3E")',
                backgroundSize: '1rem 1rem',
                backgroundPosition: 'right 0.5rem center', // ≈ pr-2 for the arrow
              }}
            >
              <option value="">All Subcategories</option>
              {selectedCategory && categories
                .find((cat) => cat.name === selectedCategory)
                ?.subcategories.map((sub: { id: string; name: string }) => (
                  <option key={sub.id} value={sub.name}>
                    {sub.name}
                  </option>
                ))}
            </select>
          </div>
          
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search models..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={resetFilters}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors text-sm"
              title="Reset all filters"
            >
              Reset
            </button>
            <button
              onClick={refresh}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Filter Summary */}
      {(selectedCategory || selectedSubCategory || searchTerm) && (
        <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">Active filters:</span>
            {selectedCategory && (
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full">
                Category: {selectedCategory}
              </span>
            )}
            {selectedSubCategory && (
              <span className="px-2 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 rounded-full">
                Subcategory: {selectedSubCategory}
              </span>
            )}
            {searchTerm && (
              <span className="px-2 py-1 bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 rounded-full">
                Search: "{searchTerm}"
              </span>
            )}
            <span className="text-gray-500 dark:text-gray-400">
              ({filteredModels.length} models found)
            </span>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600 dark:text-gray-400">
              Loading models...
            </span>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : (
          <table className="w-full min-w-[1000px] divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr className="text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                <th className="px-6 py-4 w-28">Thumbnail</th>
                <th 
                  className="px-6 py-4 w-96 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSort('title')}
                >
                  <div 
                    className="flex items-center gap-1"
                    >
                    Title
                    {getSortIcon('title')}
                  </div>
                </th>
                <th 
                  className="px-6 py-4 w-64 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSort('category')}
                >
                  <div className="flex items-center gap-1">
                    Category
                    {getSortIcon('category')}
                  </div>
                </th>
                <th className="px-6 py-4 w-48">Tags</th>
                <th className="px-6 py-4 w-48">Stats</th>
                <th 
                  className="px-6 py-4 w-48 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSort('price')}
                >
                  <div className="flex items-center gap-1">
                    Price
                    {getSortIcon('price')}
                  </div>
                </th>
                <th 
                  className="px-6 py-4 w-32 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSort('isFeatured')}
                >
                  <div className="flex items-center gap-1">
                    Featured
                    {getSortIcon('isFeatured')}
                  </div>
                </th>
                <th className="px-6 py-4 w-32">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {currentModels.map((model) => (
                <tr
                  key={model.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-6">
                    <img
                      src={
                        model.thumbnailUrl ||
                        "https://via.placeholder.com/96x96?text=No+Image"
                      }
                      alt={model.title || "No Title"}
                      className="w-20 h-20 rounded-lg object-cover shadow-sm"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://via.placeholder.com/96x96?text=No+Image";
                      }}
                    />
                  </td>
                  <td onClick={() => setEditingModel(model)} className="px-6 py-6 max-w-sm cursor-pointer">
                    <div 
                      
                      className="font-semibold text-gray-900 dark:text-white"
                    >
                      {model.title}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {model.description}
                    </div>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {model.category || "—"}
                    </span>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {model.subCategory || "—"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-row flex-wrap gap-1 max-w-xs">
                      {model.tags &&
                        model.tags.slice(0, 4).map((tag, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          >
                            {tag}
                          </span>
                        ))}

                      {model.tags && model.tags.length > 4 && (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                          +{model.tags.length - 4} more
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div
                      className="flex items-center gap-2 text-green-600 hover:underline text-sm"
                    >
                      <Download size={14} /> {model.downloads || 0}
                    </div>
                    <button
                      onClick={() =>
                        showUserModal("Likes", (model.likes || []).map((l) => l.user))
                      }
                      className="flex items-center gap-2 text-red-500 hover:underline text-sm"
                    >
                      <Heart size={14} /> {(model.likes || []).length}
                    </button>
                    <div
                      className="flex items-center gap-2 text-blue-600 hover:underline text-sm"
                    >
                      <Eye size={14} /> {(model.views || 0)}
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    {model.price ? (
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {model.price}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Free
                      </span>
                    )}
                    {model.sourceUrl && (
                      <a
                        href={model.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-600 hover:underline text-sm"
                      >
                        <ExternalLink size={14} /> Source
                      </a>
                    )}
                    {model.websiteUrl && (
                      <a
                        href={model.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-600 hover:underline text-sm"
                      >
                        <ExternalLink size={14} /> WebSite
                      </a>
                    )}
                  </td>
                  
                  <td className="px-6 py-6">
                    <span
                      className={clsx(
                        "inline-flex px-3 py-1 text-xs font-semibold rounded-full",
                        model.isFeatured
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                      )}
                    >
                      {model.isFeatured ? "Featured" : "Regular"}
                    </span>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap ">
                    <button
                      onClick={() => setEditingModel(model)}
                      className="p-2 mr-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => deleteModel(model.id)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && filteredModels.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            No models found
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col md:flex-row justify-between items-center px-6 py-4 border-t border-gray-200 dark:border-gray-700 gap-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing {startIndex + 1}-
            {Math.min(endIndex, sortedModels.length)} of{" "}
            {sortedModels.length}
          </p>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={clsx(
                  "px-3 py-1 rounded-lg text-sm",
                  currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "border text-gray-600 dark:text-gray-300"
                )}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Edit Drawer */}
      {editingModel && (
        <div className="fixed top-24 inset-0 bg-black bg-opacity-30 z-50 flex justify-end">
          <div className="w-full max-w-md bg-white dark:bg-gray-900 h-full flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold">Edit Model</h2>
              <button onClick={() => setEditingModel(null)}>
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-4">
              {/* Title */}
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium dark:text-gray-300">Title</label>
                <input
                  type="text"
                  value={editingModel.title || ""}
                  onChange={(e) =>
                    setEditingModel({ ...editingModel, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                  placeholder="Enter title"
                />
              </div>

              {/* Description */}
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium dark:text-gray-300">Description</label>
                <textarea
                  value={editingModel.description || ""}
                  onChange={(e) =>
                    setEditingModel({ ...editingModel, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                  rows={3}
                  placeholder="Enter description"
                />
              </div>

              {/* Category */}
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium dark:text-gray-300">Category</label>
                <select
                  value={editingModel.categoryId || ""}
                  onChange={(e) => {
                    const selected = categories.find(cat => cat.id === e.target.value);
                    setEditingModel({
                      ...editingModel,
                      category: selected?.name || "",
                      categoryId: selected?.id || "",
                      subCategory: "",
                      subCategoryId: "",
                    });
                  }}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Subcategory */}
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium dark:text-gray-300">Subcategory</label>
                <select
                  value={editingModel.subCategoryId || ""}
                  onChange={(e) => {
                    const selectedCat = categories.find(cat => cat.id === editingModel.categoryId);
                    const selectedSub = selectedCat?.subcategories.find((sub: { id: string; name: string }) => sub.id === e.target.value);
                    setEditingModel({
                      ...editingModel,
                      subCategory: selectedSub?.name || "",
                      subCategoryId: selectedSub?.id || "",
                    });
                  }}
                  disabled={!editingModel.categoryId}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white disabled:opacity-50"
                >
                  <option value="">Select Subcategory</option>
                  {categories
                    .find(cat => cat.id === editingModel.categoryId)
                    ?.subcategories.map((sub: { id: string; name: string }) => (
                      <option key={sub.id} value={sub.id}>{sub.name}</option>
                    ))}
                </select>
              </div>

              {/* Tags */}
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium dark:text-gray-300">Tags</label>
                <div className="flex flex-wrap items-center gap-2 border rounded-lg px-3 py-2 dark:bg-gray-700">
                  {(editingModel.tags || []).map((tag, idx) => (
                    <span
                      key={idx}
                      className="flex items-center gap-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full px-3 py-1 text-sm font-medium"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => {
                          const newTags = editingModel.tags?.filter((_, i) => i !== idx) || [];
                          setEditingModel({ ...editingModel, tags: newTags });
                        }}
                        className="text-blue-600 dark:text-blue-200 hover:text-red-600 dark:hover:text-red-400"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    placeholder="Add tag"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === ",") {
                        e.preventDefault();
                        const value = e.currentTarget.value.trim();
                        if (value && !(editingModel.tags || []).includes(value)) {
                          setEditingModel({
                            ...editingModel,
                            tags: [...(editingModel.tags || []), value],
                          });
                          e.currentTarget.value = "";
                        }
                      }
                    }}
                    className="flex-1 px-2 py-1 focus:outline-none dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              {/* Featured */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editingModel.isFeatured || false}
                  onChange={(e) =>
                    setEditingModel({ ...editingModel, isFeatured: e.target.checked })
                  }
                  className="w-5 h-5"
                />
                <label className="text-sm dark:text-gray-300">Featured</label>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-6 border-t">
              <button
                onClick={saveEdit}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Save
              </button>
              <button
                onClick={() => setEditingModel(null)}
                className="flex-1 border px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Modal */}
      <UserModal {...userModal} onClose={closeUserModal} />
      <Toaster position="top-right" />
    </div>
  );
}
