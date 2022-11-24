import axios from "axios";

const AxiosInstance = axios.create({
  baseURL: process.env.PRODUCTION_BASE_URL || "",
});

AxiosInstance.interceptors.request.use(
  function (config) {
    // Put token into header
    if (localStorage.getItem("token") !== null) {
      const token = localStorage.getItem("token");
      config.headers.Authorization = `JWT ${token}`;
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default AxiosInstance;
