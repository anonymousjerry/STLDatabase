import { axiosInstance } from "./axiosInstance";

export interface FormDataProps {
  name: string;
  icon: File;
}

export const getAllCategories = async () => {
    try {
        const response = await axiosInstance.get('/categories');
        console.log('Categories fetched successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        if (error.response) {
            // Server responded with error status
            throw new Error(error.response.data?.message || `Failed to fetch categories: ${error.response.status}`);
        } else if (error.request) {
            // Request was made but no response received
            throw new Error('Network error: Unable to connect to server');
        } else {
            // Something else happened
            throw new Error('An unexpected error occurred while fetching categories');
        }
    }
}

export const updateCategory = async (formData: FormData) => {
    try {
        console.log("Updating category with data:", Object.fromEntries(formData.entries()));
        const response = await axiosInstance.post('/subCategory/update', formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        console.log('Category updated successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error updating category:', error);
        if (error.response) {
            throw new Error(error.response.data?.message || `Failed to update category: ${error.response.status}`);
        } else if (error.request) {
            throw new Error('Network error: Unable to connect to server');
        } else {
            throw new Error('An unexpected error occurred while updating category');
        }
    }
}

export const createSubCategory = async (formData: FormData) => {
    try {
        console.log("Creating subcategory with data:", Object.fromEntries(formData.entries()));
        const response = await axiosInstance.post('/subcategory/create', formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        console.log('Subcategory created successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error creating subcategory:', error);
        if (error.response) {
            throw new Error(error.response.data?.message || `Failed to create subcategory: ${error.response.status}`);
        } else if (error.request) {
            throw new Error('Network error: Unable to connect to server');
        } else {
            throw new Error('An unexpected error occurred while creating subcategory');
        }
    }
}

export const createCategory = async (formData: FormData) => {
    try {
        console.log("Creating category with data:", Object.fromEntries(formData.entries()));
        const response = await axiosInstance.post('/category/create', formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        console.log('Category created successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error creating category:', error);
        if (error.response) {
            throw new Error(error.response.data?.message || `Failed to create category: ${error.response.status}`);
        } else if (error.request) {
            throw new Error('Network error: Unable to connect to server');
        } else {
            throw new Error('An unexpected error occurred while creating category');
        }
    }
}

export const deleteSubCategoryApi = async (subCategoryId: string) => {
    try {
        console.log("Deleting subcategory with ID:", subCategoryId);
        const response = await axiosInstance.delete(`/subCategory/delete?subCategoryId=${subCategoryId}`);
        console.log('Subcategory deleted successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error deleting subcategory:', error);
        if (error.response) {
            throw new Error(error.response.data?.message || `Failed to delete subcategory: ${error.response.status}`);
        } else if (error.request) {
            throw new Error('Network error: Unable to connect to server');
        } else {
            throw new Error('An unexpected error occurred while deleting subcategory');
        }
    }
}