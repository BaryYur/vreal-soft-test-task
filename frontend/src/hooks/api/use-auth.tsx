import { useRouter } from "next/navigation";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { AuthApiService } from "@/services";

import { SignInData, SignUpData } from "@/schemas";

import { handleToastError } from "@/errors";

import { routes } from "@/config";

import toast from "react-hot-toast";

export const useSignUp = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { ...mutationProps } = useMutation({
    mutationFn: (data: SignUpData) => AuthApiService.signUp(data),
    onSuccess: () => {
      toast.success("Successfully logged in");
      router.push(`/${routes.storageDashboard.index}`);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error) => {
      handleToastError(error);
    },
  });

  return mutationProps;
};

export const useSignIn = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { ...mutationProps } = useMutation({
    mutationFn: (data: SignInData) => AuthApiService.signIn(data),
    onSuccess: () => {
      toast.success("Successfully logged in");
      router.push(`/${routes.storageDashboard.index}`);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error) => {
      handleToastError(error);
    },
  });

  return mutationProps;
};
