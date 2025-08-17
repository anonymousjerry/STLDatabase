import { axiosInstance } from "./axiosInstance";
import { User } from "../sanity/types";

export interface UserPayload {
  username: string;
  email: string;
  role: 'user' | 'admin';
}

export const getAllUser = async () => {
    console.log("send request")
    const response = await axiosInstance.get('/users');
    console.log(response.data)
    return response.data;
}

export const createUserApi = async (payload: UserPayload) => {
    console.log("create request")
    console.log(payload)
    const response = await axiosInstance.post(
        '/user/create',
        {
            payload: payload
        }
    );
    return response.data;
}

export const updateUserApi = async (payload: UserPayload) => {
    console.log("update request")
    const response = await axiosInstance.post(
        '/user/update',
        {
            payload: payload
        }
    );
    return response.data;
}

export const deleteUserApi = async (userId: string) => {
    console.log("delete request")
    const response = await axiosInstance.delete(`/user/delete?userId=${userId}`);
    return response.data;
}