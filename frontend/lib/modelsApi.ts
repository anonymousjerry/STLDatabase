import { axiosInstance } from "./axiosInstance";


type SearchParams = {
  key?: string;
  sourcesite?: string;
  category?: string;
  price?: string;
  favorited?: string;
  filters?: string[];
  page?: number;
  limit?: number;
};

// export const getModels = async () => {
//     const response = await axiosInstance.get('/models');
//     return response.data;
// }

export const getModels = async (page: number = 1, limit: number = 12) => {
  const response = await axiosInstance.get(`/models?page=${page}&limit=${limit}`);
  return response.data.models;
};

export const getTrendingModels = async () => {
    const response = await axiosInstance.get('/models/trending');
    return response.data.models;
}

export const getDailyModels = async () => {
    const response = await axiosInstance.get('/models/trending');
    return response.data.models;
}

export const searchModels = async ({key, sourcesite, category, price, favorited, filters = [], page = 1, limit = 12}: SearchParams) => {
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
    if (price) 
        params.append('price', price);
    if (favorited) 
        params.append('favorited', favorited);

    params.append('page', String(page));
    params.append('limit', String(limit));

    filters.forEach((filter) => {
        if (filter && filter !== 'All') {
        params.append('filter', filter); // e.g. /models?filter=Popular&filter=Trending
        }
    });


    const response = await axiosInstance.get(`/models?${params.toString()}`);
    return response.data;
}

export const likeModel = async(modelId: string, userId: string, token: string) => {
    const response = await axiosInstance.post(
        `/models/like`,
        {
            userId: userId,
            modelId: modelId,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }
    )
    return response.data;
}

export const saveModel = async(modelId: string, userId: string, token: string) => {
    const response = await axiosInstance.post(
        `/models/save`,
        {
            userId: userId,
            modelId: modelId,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }
    )
    return response.data;
}

export const getModel = async(modelId: string) => {
    const response = await axiosInstance.get(`/models/getModelbyId?modelId=${modelId}`);
    return response.data;
}

export const getSuggestionModels = async(modelId: string) => {
    const response = await axiosInstance.get(`/models/similar?modelId=${modelId}`);
    return response.data.similarModels;
}