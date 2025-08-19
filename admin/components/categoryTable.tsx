import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { createCategory, createSubCategory, deleteSubCategoryApi, getAllCategories, updateCategory } from '../lib/categoryApi';

export interface Subcategory {
  id?: string;
  name: string;
  iconUrl: string | File;
}

export interface Category {
  id: string;
  name: string;
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
        subcategories: [],
      };
    }
    map[item.category].subcategories.push({
      id: item.baseId,
      name: item.name,
      iconUrl: item.iconUrl,
    });
  });
  return Object.values(map);
};

export function CategoryTable() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // --- Add Category form state ---
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formCategoryName, setFormCategoryName] = useState('');
  const [formSubcategories, setFormSubcategories] = useState<Subcategory[]>([]);

  // --- Category rename state ---
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState<string>('');

  // --- Subcategory selection/edit state ---
  const [selectedSub, setSelectedSub] = useState<{ catId: string; subId: string } | null>(null);
  const [subEditForm, setSubEditForm] = useState<Subcategory | null>(null);

  // --- NEW: Add Subcategory state ---
  const [addingSubCatId, setAddingSubCatId] = useState<string | null>(null);
  const [newSubName, setNewSubName] = useState('');
  const [newSubIcon, setNewSubIcon] = useState<File | null>(null);

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await getAllCategories();
      setCategories(groupByCategory(res));
    } catch (err) {
      console.error(err);
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
    setFormSubcategories((prev) => [...prev, { name: '', iconUrl: '' }]);
  };

  const handleCreateSubChange = (index: number, field: 'name' | 'iconUrl', value: any) => {
    setFormSubcategories((prev) => {
      const next = [...prev];
      if (field === 'iconUrl') {
        if (value instanceof File) {
          next[index] = { ...next[index], iconUrl: value };
        }
      } else {
        next[index] = { ...next[index], name: value as string };
      }
      return next;
    });
  };

  const saveNewCategory = async () => {
    if (!formCategoryName.trim() || formSubcategories.length === 0) {
      showAlert('error', 'Category name and at least one subcategory are required.');
      return;
    }
    if (formSubcategories.some((s) => !s.name.trim())) {
      showAlert('error', 'All subcategories must have a name.');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('name', formCategoryName.trim());
      console.log(formCategoryName.trim())

      formSubcategories.forEach((sub, idx) => {
        formData.append(`subCategories[${idx}][name]`, sub.name);
        // console.log(sub.name)
        if (sub.iconUrl instanceof File) {
          // formData.append(`subcategories[${idx}][icon]`, sub.iconUrl);
          formData.append("image", sub.iconUrl);
          // console.log(sub.iconUrl)
        }
      });

      await createCategory(formData);

      showAlert('success', 'Category created!');
      setFormCategoryName('');
      setFormSubcategories([]);
      setIsFormVisible(false);
      await refresh();
    } catch (err: any) {
      console.error(err);
      showAlert('error', err?.response?.data?.error || 'Failed to create category');
    } finally {
      setLoading(false);
    }
  };

  // ====== ADD SUBCATEGORY ======
  const saveNewSubcategory = async (catId: string) => {
    console.log(catId)
    if (!newSubName.trim() || !newSubIcon) {
      showAlert('error', 'Subcategory name and icon are required.');
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('categoryId', catId)
      formData.append('subCategoryName', newSubName.trim());
      formData.append('image', newSubIcon);

      await createSubCategory(formData)

      showAlert('success', 'Subcategory added!');
      setAddingSubCatId(null);
      setNewSubName('');
      setNewSubIcon(null);
      await refresh();
    } catch (err: any) {
      console.error(err);
      showAlert('error', err?.response?.data?.error || 'Failed to add subcategory');
    } finally {
      setLoading(false);
    }
  };

  // ====== SUBCATEGORY SELECT / SAVE / DELETE ======
  const selectSubcategory = (catId: string, subId: string) => {
    setSelectedSub({ catId, subId });
    const sub = categories
      .find((c) => c.id === catId)
      ?.subcategories.find((s) => s.id === subId);
    setSubEditForm(sub ? { ...sub } : null);
  };

  const saveSubcategory = async () => {
    if (!selectedSub || !subEditForm) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('name', subEditForm.name);
      if (subEditForm.iconUrl instanceof File) {
        formData.append('image', subEditForm.iconUrl);
      }
      formData.append('subCategoryId', selectedSub.subId);

      await updateCategory(formData);

      showAlert('success', 'Subcategory updated!');
      setSelectedSub(null);
      setSubEditForm(null);
      await refresh();
    } catch (err: any) {
      console.error(err);
      showAlert('error', err?.response?.data?.error || 'Failed to update subcategory');
    } finally {
      setLoading(false);
    }
  };

  const deleteSubcategory = async () => {
    if (!selectedSub || !subEditForm) return;
    const { catId } = selectedSub;
    if (!confirm('Delete this subcategory?')) return;

    try {
      setLoading(true);
      // await api.delete(`/categories/${catId}/subcategories/${subEditForm.id}`);
      await deleteSubCategoryApi(selectedSub.subId);

      showAlert('success', 'Subcategory deleted!');
      setSelectedSub(null);
      setSubEditForm(null);
      await refresh();
    } catch (err: any) {
      console.error(err);
      showAlert('error', err?.response?.data?.error || 'Failed to delete subcategory');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow flex flex-col gap-4">
      {alert && (
        <div
          className={`px-4 py-2 rounded ${
            alert.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {alert.message}
        </div>
      )}

      {/* HEADER */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-bold">Categories</h2>
        <button
          onClick={() => setIsFormVisible((v) => !v)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          {isFormVisible ? 'Cancel' : 'Add Category'}
        </button>
      </div>

      {/* ADD CATEGORY FORM */}
      {isFormVisible && (
        <div className="border rounded-lg p-4 bg-gray-50 flex flex-col gap-3">
          <input
            type="text"
            placeholder="Category Name"
            value={formCategoryName}
            onChange={(e) => setFormCategoryName(e.target.value)}
            className="border px-3 py-2 rounded-md w-full"
          />

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Subcategories</span>
              <button
                type="button"
                onClick={addSubcategory}
                className="px-2 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
              >
                Add
              </button>
            </div>

            {formSubcategories.map((sub, idx) => (
              <div key={idx} className="flex gap-2 mb-2 items-center">
                <input
                  type="text"
                  placeholder="Subcategory Name"
                  value={sub.name}
                  onChange={(e) => handleCreateSubChange(idx, 'name', e.target.value)}
                  className="border px-2 py-1 rounded-md flex-1"
                />
                <input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files && e.target.files[0];
                    if (file) handleCreateSubChange(idx, 'iconUrl', file);
                  }}
                />
              </div>
            ))}
          </div>

          <button
            onClick={saveNewCategory}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 w-[140px] transition"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Category'}
          </button>
        </div>
      )}

      {/* CATEGORY LIST */}
      <div className="grid gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="border rounded-lg p-4 shadow hover:shadow-lg transition flex flex-col gap-3"
          >
            <div className="flex justify-between items-center">
              {editingCategoryId === cat.id ? (
                <input
                  type="text"
                  value={editingCategoryName}
                  onChange={(e) => setEditingCategoryName(e.target.value)}
                  className="border px-2 py-1 rounded-md"
                />
              ) : (
                <h3 className="text-lg font-semibold">{cat.name}</h3>
              )}
            </div>

            {/* Subcategories Grid */}
            <div className="flex flex-wrap gap-3">
              {cat.subcategories.map((sub, idx) => {
                const isSelected = selectedSub?.catId === cat.id && selectedSub?.subId === sub.id;
                return (
                  <div
                    key={sub.id || idx}
                    onClick={() => sub?.id && selectSubcategory(cat.id, sub?.id)}
                    className={`flex flex-col items-center w-24 text-center p-2 border rounded-md cursor-pointer
                      ${isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'}
                    `}
                  >
                    <img
                      src={sub.iconUrl instanceof File ? URL.createObjectURL(sub.iconUrl) : (sub.iconUrl as string)}
                      alt={sub.name}
                      className="w-12 h-12 object-cover rounded-md mb-1"
                    />
                    <span className="text-xs truncate w-full">{sub.name}</span>
                  </div>
                );
              })}
              <button
                onClick={() => setAddingSubCatId(cat.id)}
                className="w-24 h-24 flex items-center justify-center border border-dashed border-gray-300 rounded-md text-2xl text-gray-500 hover:border-blue-500 hover:text-blue-500"
              >
                +
              </button>
            </div>

            {/* Add Subcategory UI */}
            {addingSubCatId === cat.id ? (
              <div className="mt-3 border-t pt-3 bg-gray-50 p-3 rounded-md flex flex-col gap-2">
                <div className="font-medium text-sm">Add Subcategory</div>
                <input
                  type="text"
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                  placeholder="Subcategory Name"
                  className="border px-2 py-1 rounded-md w-full"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files && e.target.files[0];
                    if (file) setNewSubIcon(file);
                  }}
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => saveNewSubcategory(cat.id)}
                    className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700"
                    disabled={loading}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setAddingSubCatId(null);
                      setNewSubName('');
                      setNewSubIcon(null);
                    }}
                    className="px-3 py-1 bg-gray-300 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <></>
            )}

            {/* Subcategory Editing Form */}
            {selectedSub?.catId === cat.id && subEditForm && (
              <div className="mt-3 border-t pt-3 flex flex-col gap-2 bg-gray-50 p-3 rounded-md">
                <div className="font-medium text-sm">Edit Subcategory</div>
                <label className="text-xs">Name</label>
                <input
                  type="text"
                  value={subEditForm.name}
                  onChange={(e) => setSubEditForm({ ...subEditForm, name: e.target.value })}
                  className="border px-2 py-1 rounded-md w-full"
                  placeholder="Subcategory Name"
                />
                <label className="text-xs mt-2">Icon</label>
                <div className="flex items-center gap-3">
                  {subEditForm.iconUrl && (
                    <img
                      src={
                        subEditForm.iconUrl instanceof File
                          ? URL.createObjectURL(subEditForm.iconUrl)
                          : subEditForm.iconUrl
                      }
                      alt="current"
                      className="w-10 h-10 rounded object-cover border"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files && e.target.files[0];
                      if (file) setSubEditForm({ ...subEditForm, iconUrl: file });
                    }}
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={saveSubcategory}
                    className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700"
                    disabled={loading}
                  >
                    Save
                  </button>
                  <button
                    onClick={deleteSubcategory}
                    className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                    disabled={loading}
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => {
                      setSelectedSub(null);
                      setSubEditForm(null);
                    }}
                    className="px-3 py-1 bg-gray-300 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
