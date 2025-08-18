import { axiosInstance } from "./axiosInstance";

export const getPlatforms = async () => {
    const response = await axiosInstance('/sites');
    console.log(response.data)
    return response.data
}