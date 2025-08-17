import { axiosInstance } from "./axiosInstance";

export const getAllModels = async () => {
    console.log("send request")
    const response = await axiosInstance.get('/models');
    console.log(response.data)
    return response.data;
}