import axios from "axios";
import { toast } from "react-toastify";
import { ResponseInterceptor } from "../helpers/ResponseInterceptor";

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

AxiosInstance.interceptors.response.use(undefined, function (error) {
  if (error.response) {
    const { message } = ResponseInterceptor.filterError(error);
    toast.error(message);
  }

  return Promise.reject(error);
});

export default AxiosInstance;
