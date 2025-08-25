import { axiosInstance } from "./axiosInstance";

export const getAllCategories = async () => {
    const response = await axiosInstance.get('/categories');
    return response.data;
}

export const getTopCategories = async () => {
    const response = await axiosInstance.get('/categories/topCategories');
    return response.data;
}