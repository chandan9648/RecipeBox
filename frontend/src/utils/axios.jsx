import axios from "axios";

// Shared API client for backend
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://recipebox-gi57.onrender.com/api/",
  withCredentials: true,
});

// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    // Allow callers to explicitly skip attaching auth headers (useful for public endpoints)
    if (config?.skipAuth) return config;

    const token = localStorage.getItem('token');
    if (token && !config.headers?.Authorization) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
   
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default instance;
