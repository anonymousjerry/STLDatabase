import { axiosInstance } from "./axiosInstance";

export const getSubCategories = async () => {
    const response = await axiosInstance.get('/subcategories');
    return response.data;
}