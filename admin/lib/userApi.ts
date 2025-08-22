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
        console.log("Fetching all users...");
        const response = await axiosInstance.get('/users');
        console.log('Users fetched successfully:', response.data.length);
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
        console.log("Creating user with payload:", payload);
        const response = await axiosInstance.post(
            '/user/create',
            {
                payload: payload
            }
        );
        console.log('User created successfully:', response.data);
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
        console.log("Updating user with payload:", payload);
        const response = await axiosInstance.post(
            '/user/update',
            {
                payload: payload
            }
        );
        console.log('User updated successfully:', response.data);
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
        console.log("Deleting user with ID:", userId);
        const response = await axiosInstance.delete(`/user/delete?userId=${userId}`);
        console.log('User deleted successfully:', response.data);
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