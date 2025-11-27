import { AxiosError } from "axios";

export const handleApiError = (error: unknown) => {
  const axiosError = error as AxiosError<{ message?: string }>;

  if (axiosError.response?.data) {
    throw new Error(
      axiosError.response.data.message || "Something went wrong.",
    );
  }

  throw new Error("Server connection error");
};
