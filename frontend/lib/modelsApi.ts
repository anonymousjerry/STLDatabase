import { axiosInstance } from "./axiosInstance";

export const getModels = async () => {
    const response = await axiosInstance.get('/models');
    return response.data;
}

export const getTrendingModels = async () => {
    const response = await axiosInstance.get('/trendingmodels');
    return response.data;
}

export const getDailyModels = async () => {
    const response = await axiosInstance.get('/dailymodels');
    return response.data;
}

export const searchModels = async (query: string) => {
    const response = await axiosInstance.get(`/models?q=${query}`);
    return response.data;
}

export const searchModelsByCategories = async (query: string) => {
    const response = await axiosInstance.get(`/models?q=${query}`);
    return response.data;
}