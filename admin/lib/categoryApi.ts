import { axiosInstance } from "./axiosInstance";

export interface FormDataProps {
  name: string;
  icon: File;
}

export const getAllCategories = async () => {
    const response = await axiosInstance.get('/categories');
    console.log(response.data)
    return response.data;
}

export const updateCategory = async (formData: FormData) => {
    console.log("send")
    const response = await axiosInstance.post('/subCategory/update', formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
}

export const createSubCategory = async (formData: FormData) => {
    
    const response = await axiosInstance.post('/subcategory/create', formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
}

export const createCategory = async (formData: FormData) => {
    
    const response = await axiosInstance.post('/category/create', formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
}

export const deleteSubCategoryApi = async (subCategoryId: string) => {
    console.log("dele", subCategoryId);
    const response = await axiosInstance.delete(`/subCategory/delete?subCategoryId=${subCategoryId}`);
    return response.data;
}