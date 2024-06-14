import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: 'https://sit1opr4.finakon.in/api',
  // baseURL: 'https://sit1opr77.finakon.in/api',
  baseURL: "https://sit1opr5.finakon.in/api",
  // baseURL : 'http://162.255.87.101:8081/api'
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.error("Unauthorized", error.response.data);
          break;
        case 403:
          console.error("Forbidden", error.response.data);
          break;
        case 404:
          console.error("Not Found", error.response.data);
          break;
        case 500:
          console.error("Server Error", error.response.data);
          break;
        default:
          console.error("Error response", error.response.data);
      }
    } else if (error.request) {
      console.error("Error request", error.request);
    } else {
      console.error("Error message", error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;