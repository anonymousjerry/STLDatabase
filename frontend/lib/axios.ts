import axios from 'axios'
import {IAuthTokens} from '@/types/token.api'
import {parseCookies, setCookie} from 'nookies'

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL + '/auth'

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosInstance.interceptors.request.use(
  (config) => {
    const cookies = parseCookies()
    const token = cookies.authToken

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error.response.data?.message)
  }
)

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const cookies = parseCookies()
        const refreshToken = cookies.refreshToken

        if (refreshToken) {
          const response = await axios.post(`${API_URL}/refresh-tokens`, {refreshToken})
          console.log('⏰⏰⏰⏰⏰⏰⏰', response.data)
          const tokens = response.data.tokens as IAuthTokens

          setCookie(undefined, 'authToken', tokens.access.token, {
            maxAge: 60 * 60,
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
          })

          originalRequest.headers.Authorization = `Bearer ${tokens.access.token}`
          return axiosInstance(originalRequest)
        }
      } catch (refreshError) {
        window.location.href = '/sign-in'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error.response?.data?.message)
  }
)
