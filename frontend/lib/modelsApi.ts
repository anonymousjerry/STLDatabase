import { axiosInstance } from "./axiosInstance";


type SearchParams = {
  key?: string;
  sourcesite?: string;
  category?: string;
};

// export const getModels = async () => {
//     const response = await axiosInstance.get('/models');
//     return response.data;
// }

export const getModels = async (page: number = 1, limit: number = 12) => {
    console.log(page)
  const response = await axiosInstance.get(`/models?page=${page}&limit=${limit}`);
  console.log(response.data.models)
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


    const response = await axiosInstance.get(`/models?${params.toString()}`);
    return response.data.models;
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