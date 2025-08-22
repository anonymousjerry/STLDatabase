import { axiosInstance } from "./axiosInstance";


type SearchParams = {
  key?: string;
  sourcesite?: string;
  category?: string;
  price?: string;
  favourited?: string;
  userId?: string;
  filters?: string[];
  page?: number;
  limit?: number;
};


// export const getModels = async (page: number = 1, limit: number = 12) => {
//   const response = await axiosInstance.get(`/models?page=${page}&limit=${limit}`);
//   return response.data.models;
// };

// export const getTrendingModels = async () => {
//     const response = await axiosInstance.get('/models/trending');
//     console.log(response.data.models)
//     return response.data.models;
// }

export const getDailyModels = async (page: number = 1, limit: number = 12) => {
    try {
        console.log('Fetching daily models:', { page, limit });
        const response = await axiosInstance.get(`/models/dailyDiscover?page=${page}&limit=${limit}`);
        console.log('Daily models fetched successfully:', response.data.models.length);
        return response.data.models;
    } catch (error: any) {
        console.error('Error fetching daily models:', error);
        if (error.response) {
            throw new Error(error.response.data?.message || `Failed to fetch daily models: ${error.response.status}`);
        } else if (error.request) {
            throw new Error('Network error: Unable to connect to server');
        } else {
            throw new Error('An unexpected error occurred while fetching daily models');
        }
    }
}

export const searchModels = async ({key, sourcesite, category, price, favourited, userId, filters = [], page = 1, limit = 12}: SearchParams) => {
    try {
        console.log('Searching models with params:', { key, sourcesite, category, price, favourited, userId, filters, page, limit });
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
        if (favourited) 
            params.append('favourited', favourited);
        if (userId)
            params.append('userId', userId);

        params.append('page', String(page));
        params.append('limit', String(limit));

        filters.forEach((filter) => {
            if (filter && filter !== 'All') {
            params.append('sortby', filter);
            }
        });
        console.log('Search params:', params.toString());

        const response = await axiosInstance.get(`/models?${params.toString()}`);
        console.log('Models search completed successfully:', response.data.models?.length || 0);
        return response.data;
    } catch (error: any) {
        console.error('Error searching models:', error);
        if (error.response) {
            throw new Error(error.response.data?.message || `Failed to search models: ${error.response.status}`);
        } else if (error.request) {
            throw new Error('Network error: Unable to connect to server');
        } else {
            throw new Error('An unexpected error occurred while searching models');
        }
    }
}

export const likeModel = async(modelId: string, userId: string, token: string) => {
    try {
        console.log('Liking model:', { modelId, userId });
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
        );
        console.log('Model liked successfully');
        return response.data;
    } catch (error: any) {
        console.error('Error liking model:', error);
        if (error.response) {
            throw new Error(error.response.data?.message || `Failed to like model: ${error.response.status}`);
        } else if (error.request) {
            throw new Error('Network error: Unable to connect to server');
        } else {
            throw new Error('An unexpected error occurred while liking model');
        }
    }
}

export const saveModel = async(modelId: string, userId: string, token: string) => {
    try {
        console.log('Saving model:', { modelId, userId });
        const response = await axiosInstance.post(
            `/models/favourite`,
            {
                userId: userId,
                modelId: modelId,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
        );
        console.log('Model saved successfully');
        return response.data;
    } catch (error: any) {
        console.error('Error saving model:', error);
        if (error.response) {
            throw new Error(error.response.data?.message || `Failed to save model: ${error.response.status}`);
        } else if (error.request) {
            throw new Error('Network error: Unable to connect to server');
        } else {
            throw new Error('An unexpected error occurred while saving model');
        }
    }
}

export const downloadModel = async(modelId: string, token: string) => {
    try {
        console.log('Downloading model:', modelId);
        const response = await axiosInstance.post(
            `/models/download`,
            {
                modelId: modelId,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
        );
        console.log('Model download initiated successfully');
        return response.data;
    } catch (error: any) {
        console.error('Error downloading model:', error);
        if (error.response) {
            throw new Error(error.response.data?.message || `Failed to download model: ${error.response.status}`);
        } else if (error.request) {
            throw new Error('Network error: Unable to connect to server');
        } else {
            throw new Error('An unexpected error occurred while downloading model');
        }
    }
}

export const viewModel = async(modelId: string, token: string) => {
    const response = await axiosInstance.post(
        `/models/view`,
        {
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
    console.log(response.data.similarModels)
    return response.data.similarModels;
}