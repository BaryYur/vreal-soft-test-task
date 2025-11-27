import { apiClient } from "@/lib";

import { SignInData, SignUpData } from "@/schemas";

const signUp = async (data: SignUpData) => {
  const response = await apiClient.post("/auth/sign-up", data);

  return response.data;
};

const signIn = async (data: SignInData) => {
  const response = await apiClient.post("/auth/sign-in", data);

  return response.data;
};

export const AuthApiService = {
  signUp,
  signIn,
};
