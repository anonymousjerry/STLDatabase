import { axiosInstance } from "./axiosInstance";

export const getModels = async () => {
    const response = await axiosInstance.get('/models');
    return response.data;
}