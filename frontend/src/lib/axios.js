import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "/",          // 🔥 REQUIRED for single deployment
  withCredentials: true
});
