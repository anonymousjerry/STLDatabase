import { axiosInstance } from "./axiosInstance";

export interface FormDataProps {
  name: string;
  icon: File;
}

export const getAllCategories = async () => {
    try {
        const response = await axiosInstance.get('/categories');
        return response.data;
    } catch (error) {
        console.error('Error creating subcategory:', error);
        if (typeof error === "object" && error !== null && "response" in error) {
            const err = error as { response?: any; request?: any };
            throw new Error(err.response?.data?.message || `Failed to create subcategory: ${err.response?.status}`);
        } else if (typeof error === "object" && error !== null && "request" in error) {
            throw new Error('Network error: Unable to connect to server');
        } else {
            throw new Error('An unexpected error occurred while creating subcategory');
        }
    }
}

export const updateCategory = async (formData: FormData) => {
    try {
        const response = await axiosInstance.post('/category/update', formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating subcategory:', error);
        if (typeof error === "object" && error !== null && "response" in error) {
            const err = error as { response?: any; request?: any };
            throw new Error(err.response?.data?.message || `Failed to create subcategory: ${err.response?.status}`);
        } else if (typeof error === "object" && error !== null && "request" in error) {
            throw new Error('Network error: Unable to connect to server');
        } else {
            throw new Error('An unexpected error occurred while creating subcategory');
        }
    }
}

export const deleteCategoryApi = async (categoryId: string) => {
    try {
        const response = await axiosInstance.delete(`/category/delete?categoryId=${categoryId}`);
        return response.data;
    } catch (error) {
        console.error('Error creating subcategory:', error);
        if (typeof error === "object" && error !== null && "response" in error) {
            const err = error as { response?: any; request?: any };
            throw new Error(err.response?.data?.message || `Failed to create subcategory: ${err.response?.status}`);
        } else if (typeof error === "object" && error !== null && "request" in error) {
            throw new Error('Network error: Unable to connect to server');
        } else {
            throw new Error('An unexpected error occurred while creating subcategory');
        }
    }
}

export const createSubCategory = async (addingSubCatId: string, subCategoryName: string) => {
    try {
        const response = await axiosInstance.post('/subCategory/create', 
            {
                categoryId: addingSubCatId,
                subCategoryName: subCategoryName
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error creating subcategory:', error);
        if (typeof error === "object" && error !== null && "response" in error) {
            const err = error as { response?: any; request?: any };
            throw new Error(err.response?.data?.message || `Failed to create subcategory: ${err.response?.status}`);
        } else if (typeof error === "object" && error !== null && "request" in error) {
            throw new Error('Network error: Unable to connect to server');
        } else {
            throw new Error('An unexpected error occurred while creating subcategory');
        }
    }
}

export const updateSubCategoryApi = async(subCategoryId: string, name: string) => {
    try{
        const response = await axiosInstance.post('/subCategory/update', 
            {
                subCategoryId: subCategoryId,
                name: name
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error creating subcategory:', error);
        if (typeof error === "object" && error !== null && "response" in error) {
            const err = error as { response?: any; request?: any };
            throw new Error(err.response?.data?.message || `Failed to create subcategory: ${err.response?.status}`);
        } else if (typeof error === "object" && error !== null && "request" in error) {
            throw new Error('Network error: Unable to connect to server');
        } else {
            throw new Error('An unexpected error occurred while creating subcategory');
        }
    }
}

export const createCategory = async (formData: FormData) => {
    try {
        const response = await axiosInstance.post('/category/create', formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating subcategory:', error);
        if (typeof error === "object" && error !== null && "response" in error) {
            const err = error as { response?: any; request?: any };
            throw new Error(err.response?.data?.message || `Failed to create subcategory: ${err.response?.status}`);
        } else if (typeof error === "object" && error !== null && "request" in error) {
            throw new Error('Network error: Unable to connect to server');
        } else {
            throw new Error('An unexpected error occurred while creating subcategory');
        }
    }
}

export const deleteSubCategoryApi = async (subCategoryId: string) => {
    try {
        const response = await axiosInstance.delete(`/subCategory/delete?subCategoryId=${subCategoryId}`);
        return response.data;
    } catch (error) {
        console.error('Error creating subcategory:', error);
        if (typeof error === "object" && error !== null && "response" in error) {
            const err = error as { response?: any; request?: any };
            throw new Error(err.response?.data?.message || `Failed to create subcategory: ${err.response?.status}`);
        } else if (typeof error === "object" && error !== null && "request" in error) {
            throw new Error('Network error: Unable to connect to server');
        } else {
            throw new Error('An unexpected error occurred while creating subcategory');
        }
    }
}