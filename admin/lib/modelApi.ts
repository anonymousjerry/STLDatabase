import { axiosInstance } from "./axiosInstance";

export const getAllModels = async () => {
    console.log("send request")
    const response = await axiosInstance.get('/models');
    console.log(response.data)
    return response.data;
}


export const updateModel = async (modelId: string, modelData: any) => {
    const response = await axiosInstance.put('/model/update', 
        {
            modelId: modelId,
            ...modelData
        }
    );
    return response.data;
}

export const deleteModelApi = async (modelId: string) => {
    const response = await axiosInstance.delete(`/model/delete?modelId=${modelId}`);
    return response.data;
}