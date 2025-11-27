import axios from "axios";

import { handleApiError } from "@/errors";

export const apiPath =
  process.env.NEXT_PUBLIC_API_PATH || "http://localhost:4000/api";

export const apiClient = axios.create({
  baseURL: apiPath,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    handleApiError(error);
    return Promise.reject(error); 
  },
);
