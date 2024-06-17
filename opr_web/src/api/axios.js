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

export default axiosInstance;