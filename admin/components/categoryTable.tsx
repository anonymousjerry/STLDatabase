import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { createCategory, createSubCategory, deleteSubCategoryApi, getAllCategories, updateCategory } from '../lib/categoryApi';
import { Plus, Search, Pencil, Trash2, Check, X } from 'lucide-react';

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
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // --- Add Category form state ---
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formCategoryName, setFormCategoryName] = useState('');
  const [formCategoryImage, setFormCategoryImage] = useState<File | null>(null);
  const [formSubcategories, setFormSubcategories] = useState<Subcategory[]>([]);

  // --- Category rename state ---
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState<string>('');

  // --- NEW: Add Subcategory state ---
  const [addingSubCatId, setAddingSubCatId] = useState<string | null>(null);
  const [newSubName, setNewSubName] = useState('');

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await getAllCategories();
      setCategories(groupByCategory(res));
    } catch (err) {
      console.error(err);
      setAlert({ type: 'error', message: 'Failed to fetch categories' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };

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
      showAlert('error', 'Category name is required!');
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
      showAlert('success', 'Category created successfully!');
    } catch (err) {
      showAlert('error', 'Failed to create category');
    } finally {
      setLoading(false);
    }
  };

  // ====== RENAME CATEGORY ======
  const startRenameCategory = (category: Category) => {
    setEditingCategoryId(category.id);
    setEditingCategoryName(category.name);
  };

  const saveCategoryRename = async () => {
    if (!editingCategoryId || !editingCategoryName.trim()) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('name', editingCategoryName);
      formData.append('categoryId', editingCategoryId);
      
      await updateCategory(formData);
      await refresh();
      setEditingCategoryId(null);
      setEditingCategoryName('');
      showAlert('success', 'Category renamed successfully!');
    } catch (err) {
      showAlert('error', 'Failed to rename category');
    } finally {
      setLoading(false);
    }
  };

  // ====== ADD SUBCATEGORY ======
  const addNewSubcategory = async () => {
    if (!addingSubCatId || !newSubName.trim()) {
      showAlert('error', 'Subcategory name is required!');
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
      showAlert('success', 'Subcategory added successfully!');
    } catch (err) {
      showAlert('error', 'Failed to add subcategory');
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
      showAlert('success', 'Subcategory deleted successfully!');
    } catch (err) {
      showAlert('error', 'Failed to delete subcategory');
    } finally {
      setLoading(false);
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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Category Management</h1>
        <button
          onClick={() => setIsFormVisible(!isFormVisible)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Add New Category
        </button>
      </div>

      {/* Alert */}
      {alert && (
        <div className={`p-4 mx-6 mt-4 rounded-lg ${
          alert.type === 'success' 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {alert.message}
        </div>
      )}

      {/* Search and Actions */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search categories or subcategories..."
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

      {/* Create Category Form */}
      {isFormVisible && (
        <div className="p-6 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Create New Category</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category Name</label>
              <input
                type="text"
                placeholder="Enter category name"
                value={formCategoryName}
                onChange={(e) => setFormCategoryName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category Image</label>
              <input
                type="file"
                onChange={(e) => setFormCategoryImage(e.target.files?.[0] || null)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Subcategories</label>
                <button
                  type="button"
                  onClick={addSubcategory}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  + Add Subcategory
                </button>
              </div>
              
              {formSubcategories.map((sub, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Subcategory name"
                    value={sub.name}
                    onChange={(e) => updateSubcategory(index, 'name', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => removeSubcategory(index)}
                    className="px-3 py-2 text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={createCategoryWithSubs}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Category"}
              </button>
              <button
                onClick={() => {
                  setIsFormVisible(false);
                  setFormCategoryName('');
                  setFormCategoryImage(null);
                  setFormSubcategories([]);
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Categories Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600 dark:text-gray-400">Loading categories...</span>
          </div>
        ) : (
          <div className="space-y-4 p-6">
            {filteredCategories.map((category) => (
              <div key={category.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                {/* Category Header */}
                <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    {category.imageUrl && (
                      <img
                        src={typeof category.imageUrl === 'string' ? category.imageUrl : URL.createObjectURL(category.imageUrl)}
                        alt={category.name}
                        className="w-8 h-8 rounded object-cover"
                      />
                    )}
                    {editingCategoryId === category.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editingCategoryName}
                          onChange={(e) => setEditingCategoryName(e.target.value)}
                          className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                        />
                        <button
                          onClick={saveCategoryRename}
                          className="text-green-600 hover:text-green-700"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => setEditingCategoryId(null)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{category.name}</h3>
                        <button
                          onClick={() => startRenameCategory(category)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Pencil size={16} />
                        </button>
                      </>
                    )}
                  </div>
                  <button
                    onClick={() => setAddingSubCatId(addingSubCatId === category.id ? null : category.id)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    + Add Subcategory
                  </button>
                </div>

                {/* Add Subcategory Form */}
                {addingSubCatId === category.id && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 px-4 py-3 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Subcategory name"
                        value={newSubName}
                        onChange={(e) => setNewSubName(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                      />
                      <button
                        onClick={addNewSubcategory}
                        disabled={loading}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors disabled:opacity-50"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => {
                          setAddingSubCatId(null);
                          setNewSubName('');
                        }}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Subcategories */}
                <div className="bg-white dark:bg-gray-800">
                  {category.subcategories.length === 0 ? (
                    <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                      No subcategories yet
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                      {category.subcategories.map((subcategory) => (
                        <div key={subcategory.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{subcategory.name}</span>
                          <button
                            onClick={() => deleteSubcategory(category.id, subcategory.id!)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {!loading && filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No categories found</p>
          </div>
        )}
      </div>
    </div>
  );
}
