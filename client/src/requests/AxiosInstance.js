import axios from "axios";

const AxiosInstance = axios.create({
  baseURL: process.env.PRODUCTION_BASE_URL || "",
});

export default AxiosInstance;
