import { axiosInstance } from "./axiosInstance";
import { User } from "../sanity/types";

export interface CreateUserPayload {
    username: string;
    email: string;
    role: 'user' | 'admin';
}

export interface UpdateUserPayload {
    id: string;
    username: string;
    email: string;
    role: 'user' | 'admin';
}

export const getAllUser = async () => {
    try {
        const response = await axiosInstance.get('/users');
        return response.data;
    } catch (error: any) {
        console.error('Error fetching users:', error);
        if (error.response) {
            throw new Error(error.response.data?.message || `Failed to fetch users: ${error.response.status}`);
        } else if (error.request) {
            throw new Error('Network error: Unable to connect to server');
        } else {
            throw new Error('An unexpected error occurred while fetching users');
        }
    }
}

export const createUserApi = async (payload: CreateUserPayload) => {
    try {
        const response = await axiosInstance.post(
            '/user/create',
            {
                payload: payload
            }
        );
        return response.data;
    } catch (error: any) {
        console.error('Error creating user:', error);
        if (error.response) {
            throw new Error(error.response.data?.message || `Failed to create user: ${error.response.status}`);
        } else if (error.request) {
            throw new Error('Network error: Unable to connect to server');
        } else {
            throw new Error('An unexpected error occurred while creating user');
        }
    }
}

export const updateUserApi = async (payload: UpdateUserPayload) => {
    try {
        const response = await axiosInstance.post(
            '/user/update',
            {
                payload: payload
            }
        );
        return response.data;
    } catch (error: any) {
        console.error('Error updating user:', error);
        if (error.response) {
            throw new Error(error.response.data?.message || `Failed to update user: ${error.response.status}`);
        } else if (error.request) {
            throw new Error('Network error: Unable to connect to server');
        } else {
            throw new Error('An unexpected error occurred while updating user');
        }
    }
}

export const deleteUserApi = async (userId: string) => {
    try {
        const response = await axiosInstance.delete(`/user/delete?userId=${userId}`);
        return response.data;
    } catch (error: any) {
        console.error('Error deleting user:', error);
        if (error.response) {
            throw new Error(error.response.data?.message || `Failed to delete user: ${error.response.status}`);
        } else if (error.request) {
            throw new Error('Network error: Unable to connect to server');
        } else {
            throw new Error('An unexpected error occurred while deleting user');
        }
    }
}