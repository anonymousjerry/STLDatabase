import axios from 'axios'
import {IAuthTokens} from '@/types/token.api'
import {parseCookies, setCookie} from 'nookies'
import { getSession } from 'next-auth/react'

const BASE_URL = process.env.NEXT_PUBLIC_BACKENDPART_URL

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// export const publicApi = axios.create({
//   baseURL: BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Private instance – auth required
// export const privateApi = axios.create({
//   baseURL: BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// privateApi.interceptors.request.use(
//   async (config) => {
//     const session = await getSession();
//     if (session?.accessToken) {
//       config.headers.Authorization = `Bearer ${session.accessToken}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// privateApi.interceptors.response.use(
//   (response) => response, // just return if successful
//   (error) => {
//     if (error.response?.status === 401) {
//       // Unauthorized — token might be expired
//       // You could call signOut() from 'next-auth/react' here or redirect
//       console.warn("Unauthorized! Token might be expired.");
//       // signOut();
//     }
//     return Promise.reject(error);
//   }
// );
