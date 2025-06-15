import axios from "axios";
import Cookies from 'js-cookie';

// Axios instance
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000",
  timeout: 10000, // Timeout if desired
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config: any) => {
    // Add token to request headers if available
    // const token = localStorage.getItem("authToken");
    const token = Cookies.get("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response: any) => {
    return response;
  },
  (error: any) => {
    if (error.response && error.response.status === 401) {
      // For example, handle 401 errors by redirecting to login
      // window.location.href = '/login';
    } else if (error.response && error.response.status === 403) {
      // Handle forbidden errors
      console.error("Access Denied");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
