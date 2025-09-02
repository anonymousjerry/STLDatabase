import axios from 'axios'

const BASE_URL = process.env.SANITY_STUDIO_BACKEND_URL;

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000, // 10 second timeout
})

axiosInstance.interceptors.request.use(
  (config) => {
    console.log("BASE_URL", BASE_URL);
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request for debugging
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    // Log successful responses for debugging
    return response;
  },
  (error) => {
    // Enhanced error handling
    if (error.response) {
      // Server responded with error status
      console.error('Response error:', {
        status: error.response.status,
        statusText: error.response.statusText,
        url: error.config?.url,
        data: error.response.data
      });
      
      // Handle specific error cases
      switch (error.response.status) {
        case 401:
          console.warn('Unauthorized access. Please check your authentication.');
          // Optionally redirect to login or signout
          break;
        case 403:
          console.warn('Access forbidden. You may not have permission for this action.');
          break;
        case 404:
          console.warn('Resource not found.');
          break;
        case 500:
          console.error('Internal server error occurred.');
          break;
        default:
          console.error(`HTTP error ${error.response.status}: ${error.response.statusText}`);
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network error: No response received from server', {
        url: error.config?.url,
        timeout: error.code === 'ECONNABORTED' ? 'Request timeout' : 'No response'
      });
    } else {
      // Something else happened
      console.error('Request setup error:', error.message);
    }
    
    return Promise.reject(error);
  }
);