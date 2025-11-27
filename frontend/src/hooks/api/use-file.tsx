import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { UserFile, UserFileAccess } from "@/types";

import { FileApiService } from "@/services";

import { handleToastError } from "@/errors";

import toast from "react-hot-toast";

export const useUploadFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { file: File; data: Partial<UserFile> }) =>
      FileApiService.uploadFile(data.file, data.data),
    onSuccess: () => {
      toast.success("File uploaded successfully");
      queryClient.invalidateQueries({ queryKey: ["files"] });
      queryClient.invalidateQueries({ queryKey: ["directory-children"] });
    },
    onError: (error) => {
      handleToastError(error);
    },
  });
};

export const useDeleteFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { id: string }) => FileApiService.deleteFile(data.id),
    onSuccess: () => {
      toast.success("File deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["files"] });
      queryClient.invalidateQueries({ queryKey: ["directory-children"] });
      queryClient.invalidateQueries({ queryKey: ["directory"] });
    },
    onError: (error) => {
      handleToastError(error);
    },
  });
};

export const useGetFiles = (params?: { name?: string }) => {
  return useQuery({
    queryFn: () => FileApiService.getFiles(params),
    queryKey: ["files"],
    staleTime: 5_000_000,
  });
};

export const useGetFile = (id: string | null) => {
  return useQuery({
    queryFn: () => (id ? FileApiService.getFile(id) : undefined),
    queryKey: ["file", id],
    enabled: !!id,
    staleTime: 5_000_000,
  });
};

export const useGetFileViewUrl = (id: string | null) => {
  return useQuery({
    queryFn: () => (id ? FileApiService.getFileViewUrl(id) : undefined),
    queryKey: ["file-view", id],
    enabled: !!id,
    staleTime: 5_000_000,
  });
};

export const useGetFileAccess = (id: string | null) => {
  return useQuery({
    queryFn: () => (id ? FileApiService.getFileAccess(id) : undefined),
    queryKey: ["file-access", id],
    enabled: !!id,
    staleTime: 5_000_000,
  });
};

export const useUpdateFileAccess = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { id: string; data: UserFileAccess[] }) =>
      FileApiService.updateFileAccess(data.id, data.data),
    onSuccess: () => {
      toast.success("File access updated successfully");
      queryClient.invalidateQueries({ queryKey: ["file-access"] });
    },
  });
};
