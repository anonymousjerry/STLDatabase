import { axiosInstance } from "./axiosInstance";

export const getAllCategories = async () => {
    const response = await axiosInstance.get('/categories');
    console.log(response.data)
    return response.data;
}
