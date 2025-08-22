import { axiosInstance } from "./axiosInstance";

export const getAllModels = async () => {
    try {
        console.log("Fetching all models...");
        const response = await axiosInstance.get('/models');
        console.log('Models fetched successfully:', response.data);
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
        console.log("Updating model with ID:", modelId, "Data:", modelData);
        const response = await axiosInstance.put('/model/update', 
            {
                modelId: modelId,
                ...modelData
            }
        );
        console.log('Model updated successfully:', response.data);
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
        console.log("Deleting model with ID:", modelId);
        const response = await axiosInstance.delete(`/model/delete?modelId=${modelId}`);
        console.log('Model deleted successfully:', response.data);
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