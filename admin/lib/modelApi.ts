import { axiosInstance } from "./axiosInstance";

export const getAllModels = async () => {
    try {
        const response = await axiosInstance.get('/models');
        return response.data;
    } catch (error: any) {
        console.error('Error fetching models:', error);
        if (error.response) {
            throw new Error(error.response.data?.message || `Failed to fetch models: ${error.response.status}`);
        } else if (error.request) {
            throw new Error('Network error: Unable to connect to server');
        } else {
            throw new Error('An unexpected error occurred while fetching models');
        }
    }
}

export const updateModel = async (modelId: string, modelData: any) => {
    try {
        const response = await axiosInstance.post('/model/update', 
            {
                modelId: modelId,
                model: modelData
            }
        );
        return response.data;
    } catch (error: any) {
        console.error('Error updating model:', error);
        if (error.response) {
            throw new Error(error.response.data?.message || `Failed to update model: ${error.response.status}`);
        } else if (error.request) {
            throw new Error('Network error: Unable to connect to server');
        } else {
            throw new Error('An unexpected error occurred while updating model');
        }
    }
}

export const deleteModelApi = async (modelId: string) => {
    try {
        const response = await axiosInstance.delete(`/model/delete?modelId=${modelId}`);
        return response.data;
    } catch (error: any) {
        console.error('Error deleting model:', error);
        if (error.response) {
            throw new Error(error.response.data?.message || `Failed to delete model: ${error.response.status}`);
        } else if (error.request) {
            throw new Error('Network error: Unable to connect to server');
        } else {
            throw new Error('An unexpected error occurred while deleting model');
        }
    }
}