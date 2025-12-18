import axios from "axios";

// Shared API client for backend
const instance = axios.create({
  baseURL: "https://recipebox-gi57.onrender.com/api/",
  withCredentials: true,
});

//interceptors

// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
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
