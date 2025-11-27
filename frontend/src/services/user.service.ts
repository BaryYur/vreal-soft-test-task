import { apiClient } from "@/lib";

export const getUser = async () => {
  const response = await apiClient.get("/user/user-info");

  return response.data;
};

export const UserApiService = {
  getUser,
};
