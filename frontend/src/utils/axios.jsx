import axios from "axios";

function resolveBaseUrl() {
  const configured = import.meta.env.VITE_API_BASE_URL;
  const fallbackProd = "https://recipebox-gi57.onrender.com/api/";

  // In production, never try to call localhost from a public origin
  if (import.meta.env.PROD) {
    if (!configured) return fallbackProd;
    if (/^https?:\/\/localhost\b/i.test(configured)) return fallbackProd;
    if (/^https?:\/\/127\.0\.0\.1\b/i.test(configured)) return fallbackProd;
    return configured;
  }

  // In dev, allow local backend
  return configured || "http://localhost:3000/api/";
}

// Shared API client for backend
const instance = axios.create({
  baseURL: resolveBaseUrl(),
  withCredentials: true,
});

//interceptors

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
    // console.log("request----->", config?.method, config?.url);
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    // console.log("response---->", response?.status, response?.config?.url);
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default instance;
