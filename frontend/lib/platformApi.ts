import { axiosInstance } from "./axiosInstance";

export const getPlatforms = async () => {
    const response = await axiosInstance('/sites');
    return response.data
}