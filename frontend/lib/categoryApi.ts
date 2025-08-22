import { axiosInstance } from "./axiosInstance";

export const getSubCategories = async () => {
    const response = await axiosInstance.get('/subcategories');
    // console.log(response.data)
    return response.data;
}

export const getCategories = async () => {
    const response = await axiosInstance.get('/categories');
    // console.log(response.data)
    return response.data;
}