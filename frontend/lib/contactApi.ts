import { axiosInstance } from "./axiosInstance";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  company?: string;
  website?: string;
  adType?: string;
  budget?: string;
}

export const updateContactApi = async (formData: ContactFormData) => {
    try {
        console.log(formData)
        const response = await axiosInstance.post('/contact', formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        console.log(response)
        return response.data;
    } catch (error) {
        console.error('Error creating subcategory:', error);
        if (typeof error === "object" && error !== null && "response" in error) {
            const err = error as { response?: any; request?: any };
            throw new Error(err.response?.data?.message || `Failed to send contact message: ${err.response?.status}`);
        } else if (typeof error === "object" && error !== null && "request" in error) {
            throw new Error('Network error: Unable to connect to server');
        } else {
            throw new Error('An unexpected error occurred while sending contact message');
        }
    }
}