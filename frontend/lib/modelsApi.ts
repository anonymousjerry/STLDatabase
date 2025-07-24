import { axiosInstance } from "./axiosInstance";

type SearchParams = {
  key?: string;
  sourcesite?: string;
  category?: string;
};

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



export const searchModels = async ({key, sourcesite, category}: SearchParams) => {
    const params = new URLSearchParams();

    if (key) params.append('key', key);
    if (sourcesite && sourcesite !== 'All') 
        params.append('sourcesite', sourcesite);
    else if (sourcesite && sourcesite === 'All')
        params.append('sourcesite', '');
    if (category && category !== 'All') 
        params.append('category', category);
    else if (category && category === 'All')
        params.append('category', '');

    console.log(params);

    const response = await axiosInstance.get(`/models?${params.toString()}`);
    return response.data;
}