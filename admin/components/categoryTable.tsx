import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { createCategory, createSubCategory, deleteSubCategoryApi, getAllCategories, updateCategory } from '../lib/categoryApi';
import { Plus, Search, Pencil, Trash2, Check, X, Image as ImageIcon, Eye, Edit3, AlertCircle, CheckCircle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useCustomToast, ToastManager } from './CustomToast';

export interface Subcategory {
  id?: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  imageUrl: string | File;
  subcategories: Subcategory[];
}

export interface FormDataProps {
  name: string;
  icon: File;
}

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  duration?: number;
}

const api = axios.create({ baseURL: process.env.BACKEND_URL });
api.interceptors.request.use((config) => {
  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('sanity_admin_token')
      : null;
  if (token) {
    config.headers = config.headers || {};
    config.headers['authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Convert flat data to nested categories
const groupByCategory = (data: any[]) => {
  const map: Record<string, Category> = {};
  data.forEach((item) => {
    if (!map[item.category]) {
      map[item.category] = {
        id: item.id,
        name: item.category,
        imageUrl: item.imageUrl || '',
        subcategories: [],
      };
    }
    map[item.category].subcategories.push({
      id: item.baseId,
      name: item.name,
    });
  });
  return Object.values(map);
};

export function CategoryTable() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Custom toast as backup
  const customToast = useCustomToast();

  // --- Add Category form state ---
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formCategoryName, setFormCategoryName] = useState('');
  const [formCategoryImage, setFormCategoryImage] = useState<File | null>(null);
  const [formSubcategories, setFormSubcategories] = useState<Subcategory[]>([]);

  // --- Category rename state ---
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState<string>('');
  const [editingCategoryImage, setEditingCategoryImage] = useState<File | null>(null);
  const [editingImagePreview, setEditingImagePreview] = useState<string | null>(null);

  // --- NEW: Add Subcategory state ---
  const [addingSubCatId, setAddingSubCatId] = useState<string | null>(null);
  const [newSubName, setNewSubName] = useState('');

  // --- Image preview state ---
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Helper function to show toast (try react-hot-toast first, fallback to custom)
  const showToast = (type: 'success' | 'error', message: string) => {
    try {
      if (type === 'success') {
        toast.success(message);
      } else {
        toast.error(message);
      }
    } catch (error) {
      // Fallback to custom toast
      if (type === 'success') {
        customToast.success(message);
      } else {
        customToast.error(message);
      }
    }
  };

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await getAllCategories();
      console.log(res)
      setCategories(groupByCategory(res));
    } catch (err) {
      console.error('Error fetching categories:', err);
      showToast('error', err instanceof Error ? err.message : 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  // ====== CREATE CATEGORY ======
  const addSubcategory = () => {
    setFormSubcategories([...formSubcategories, { name: '' }]);
  };

  const removeSubcategory = (index: number) => {
    setFormSubcategories(formSubcategories.filter((_, i) => i !== index));
  };

  const updateSubcategory = (index: number, field: keyof Subcategory, value: string) => {
    const updated = [...formSubcategories];
    updated[index] = { ...updated[index], [field]: value };
    setFormSubcategories(updated);
  };

  const createCategoryWithSubs = async () => {
    if (!formCategoryName.trim()) {
      showToast('error', 'Category name is required!');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('name', formCategoryName);
      if (formCategoryImage) {
        formData.append('image', formCategoryImage);
      }
      
      formSubcategories.forEach((sub, index) => {
        formData.append(`subCategories[${index}][name]`, sub.name);
      });

      await createCategory(formData);
      await refresh();
      setFormCategoryName('');
      setFormCategoryImage(null);
      setFormSubcategories([]);
      setIsFormVisible(false);
      showToast('success', 'Category created successfully!');
    } catch (err) {
      console.error('Error creating category:', err);
      showToast('error', err instanceof Error ? err.message : 'Failed to create category');
    } finally {
      setLoading(false);
    }
  };

  // ====== EDIT CATEGORY ======
  const startEditCategory = (category: Category) => {
    setEditingCategoryId(category.id);
    setEditingCategoryName(category.name);
    setEditingCategoryImage(null);
    setEditingImagePreview(category.imageUrl ? (typeof category.imageUrl === 'string' ? category.imageUrl : URL.createObjectURL(category.imageUrl)) : null);
  };

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditingCategoryImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditingImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveCategoryEdit = async () => {
    if (!editingCategoryId || !editingCategoryName.trim()) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('name', editingCategoryName);
      formData.append('categoryId', editingCategoryId);
      if (editingCategoryImage) {
        formData.append('image', editingCategoryImage);
      }
      
      await updateCategory(formData);
      await refresh();
      setEditingCategoryId(null);
      setEditingCategoryName('');
      setEditingCategoryImage(null);
      setEditingImagePreview(null);
      showToast('success', 'Category updated successfully!');
    } catch (err) {
      console.error('Error updating category:', err);
      showToast('error', err instanceof Error ? err.message : 'Failed to update category');
    } finally {
      setLoading(false);
    }
  };

  const cancelEditCategory = () => {
    setEditingCategoryId(null);
    setEditingCategoryName('');
    setEditingCategoryImage(null);
    setEditingImagePreview(null);
  };

  // ====== ADD SUBCATEGORY ======
  const addNewSubcategory = async () => {
    if (!addingSubCatId || !newSubName.trim()) {
      showToast('error', 'Subcategory name is required!');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('categoryId', addingSubCatId);
      formData.append('subCategoryName', newSubName);

      await createSubCategory(formData);
      await refresh();
      setAddingSubCatId(null);
      setNewSubName('');
      showToast('success', 'Subcategory added successfully!');
    } catch (err) {
      console.error('Error adding subcategory:', err);
      showToast('error', err instanceof Error ? err.message : 'Failed to add subcategory');
    } finally {
      setLoading(false);
    }
  };

  // ====== DELETE SUBCATEGORY ======
  const deleteSubcategory = async (categoryId: string, subcategoryId: string) => {
    if (!confirm('Delete this subcategory?')) return;

    try {
      setLoading(true);
      await deleteSubCategoryApi(subcategoryId);
      await refresh();
      showToast('success', 'Subcategory deleted successfully!');
    } catch (err) {
      console.error('Error deleting subcategory:', err);
      showToast('error', err instanceof Error ? err.message : 'Failed to delete subcategory');
    } finally {
      setLoading(false);
    }
  };

  // Handle image preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormCategoryImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Filter categories based on search term
  const filteredCategories = categories.filter((category) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      category.name.toLowerCase().includes(search) ||
      category.subcategories.some(sub => sub.name.toLowerCase().includes(search))
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Custom Toast Manager as backup */}
      <ToastManager toasts={customToast.toasts} onClose={customToast.removeToast} />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 1500,
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
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Category Management</h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Manage your 3D model categories and subcategories</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setIsFormVisible(!isFormVisible)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Plus size={20} />
                Add New Category
              </button>
            </div>
          </div>
        </div>

        {/* Search and Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search categories or subcategories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
              />
            </div>
            <button
              onClick={refresh}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {/* <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div> */}
              Refresh
            </button>
          </div>
        </div>

        {/* Create Category Form */}
        {isFormVisible && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Create New Category</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category Name</label>
                  <input
                    type="text"
                    placeholder="Enter category name"
                    value={formCategoryName}
                    onChange={(e) => setFormCategoryName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category Image</label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center hover:border-blue-400 transition-colors duration-200">
                    <input
                      type="file"
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden"
                      id="category-image"
                    />
                    <label htmlFor="category-image" className="cursor-pointer">
                      {imagePreview ? (
                        <div className="space-y-2">
                          <img src={imagePreview} alt="Preview" className="w-32 h-32 mx-auto rounded-lg object-cover" />
                          <p className="text-sm text-gray-600 dark:text-gray-400">Click to change image</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <ImageIcon className="w-12 h-12 mx-auto text-gray-400" />
                          <p className="text-sm text-gray-600 dark:text-gray-400">Click to upload image</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Subcategories</label>
                  <button
                    type="button"
                    onClick={addSubcategory}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                  >
                    <Plus size={16} />
                    Add Subcategory
                  </button>
                </div>
                
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {formSubcategories.map((sub, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder="Subcategory name"
                        value={sub.name}
                        onChange={(e) => updateSubcategory(index, 'name', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => removeSubcategory(index)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  {formSubcategories.length === 0 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No subcategories yet</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={createCategoryWithSubs}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl transition-all duration-200 disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    Create Category
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setIsFormVisible(false);
                  setFormCategoryName('');
                  setFormCategoryImage(null);
                  setFormSubcategories([]);
                  setImagePreview(null);
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-xl transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Categories Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading categories...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category) => (
              <div key={category.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-200">
                {/* Category Header with Image */}
                <div className="relative h-48 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-700 dark:to-gray-800">
                  {editingCategoryId === category.id ? (
                    // Edit mode - show editing image preview
                    editingImagePreview ? (
                      <img
                        src={editingImagePreview}
                        alt={editingCategoryName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      // <div className="w-full h-full flex items-center justify-center">
                      //   <ImageIcon className="w-16 h-16 text-gray-400" />
                      // </div>
                      <img
                        src={category.imageUrl ? (typeof category.imageUrl === 'string' ? category.imageUrl : URL.createObjectURL(category.imageUrl)) : '/placeholder-image.png'}
                        alt={category.name}                        
                        className = 'object-cover'
                      />
                    )
                  ) : (
                    // View mode - show current image
                    category.imageUrl ? (
                      <img
                        src={typeof category.imageUrl === 'string' ? category.imageUrl : URL.createObjectURL(category.imageUrl)}
                        alt={category.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={category.imageUrl}
                        alt={category.name}                        
                        className = 'object-cover'
                      />
                    )
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                    <div className="flex justify-between items-center">
                      {editingCategoryId === category.id ? (
                        <div className="flex items-center gap-2 flex-1">
                          <input
                            type="text"
                            value={editingCategoryName}
                            onChange={(e) => setEditingCategoryName(e.target.value)}
                            className="flex-1 px-3 py-1 bg-white/90 dark:bg-gray-800/90 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white"
                          />
                          <button
                            onClick={saveCategoryEdit}
                            className="text-green-600 hover:text-green-700 bg-white/90 dark:bg-gray-800/90 p-1 rounded"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={cancelEditCategory}
                            className="text-red-600 hover:text-red-700 bg-white/90 dark:bg-gray-800/90 p-1 rounded"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <>
                          <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                          <button
                            onClick={() => startEditCategory(category)}
                            className="text-white/80 hover:text-white bg-black/20 p-1 rounded transition-colors"
                          >
                            <Pencil size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Category Content */}
                <div className="p-4">
                  {/* Edit Image Section */}
                  {editingCategoryId === category.id && (
                    <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Update Category Image</label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="file"
                          onChange={handleEditImageChange}
                          accept="image/*"
                          className="flex-1 text-sm text-gray-600 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/20 dark:file:text-blue-300"
                        />
                        {editingImagePreview && (
                          <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
                            <img src={editingImagePreview} alt="Preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Subcategories Count */}
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {category.subcategories.length} subcategories
                    </span>
                    <button
                      onClick={() => setAddingSubCatId(addingSubCatId === category.id ? null : category.id)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                    >
                      <Plus size={14} />
                      Add Subcategory
                    </button>
                  </div>

                  {/* Add Subcategory Form */}
                  {addingSubCatId === category.id && (
                    <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Subcategory name"
                          value={newSubName}
                          onChange={(e) => setNewSubName(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                        />
                        <button
                          onClick={addNewSubcategory}
                          disabled={loading}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg transition-colors disabled:opacity-50 text-sm"
                        >
                          Add
                        </button>
                        <button
                          onClick={() => {
                            setAddingSubCatId(null);
                            setNewSubName('');
                          }}
                          className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-lg transition-colors text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Subcategories List */}
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {category.subcategories.length === 0 ? (
                      <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">No subcategories yet</p>
                    ) : (
                      category.subcategories.map((subcategory) => (
                        <div key={subcategory.id} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <span className="text-sm font-medium text-gray-900 dark:text-white truncate">{subcategory.name}</span>
                          <button
                            onClick={() => deleteSubcategory(category.id, subcategory.id!)}
                            className="text-red-600 hover:text-red-700 p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {!loading && filteredCategories.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <ImageIcon className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No categories yet</h3>
            <p className="text-gray-500 dark:text-gray-400">Start by creating your first category</p>
          </div>
        )}
      </div>
    </div>
  );
}
