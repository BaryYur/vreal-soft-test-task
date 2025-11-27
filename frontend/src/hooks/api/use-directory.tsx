import { Directory } from "@/types";

import { DirectoryApiService } from "@/services";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { handleToastError } from "@/errors";

import toast from "react-hot-toast";

export const useGetDirectory = (id: string | null, enabled = true) => {
  return useQuery({
    queryFn: () =>
      id !== null ? DirectoryApiService.getDirectory(id) : undefined,
    queryKey: ["directory", id],
    enabled: !!id && enabled,
    staleTime: 5_000_000,
  });
};

export const useCreateDirectory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Directory>) =>
      DirectoryApiService.createDirectory(data),
    onSuccess: () => {
      toast.success("Directory created successfully");
      queryClient.invalidateQueries({ queryKey: ["directories-tree"] });
      queryClient.invalidateQueries({ queryKey: ["directories"] });
      queryClient.invalidateQueries({ queryKey: ["directory-children"] });
    },
    onError: (error) => {
      handleToastError(error);
    },
  });
};

export const useUpdateDirectory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { id: string; directory: Partial<Directory> }) =>
      DirectoryApiService.updateDirectory(data.id, data.directory),
    onSuccess: () => {
      toast.success("Directory updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["directories-tree"],
      });
      queryClient.invalidateQueries({ queryKey: ["directories"] });
      queryClient.invalidateQueries({ queryKey: ["directory-children"] });
    },
    onError: (error) => {
      handleToastError(error);
    },
  });
};

export const useDeleteDirectory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { id: string }) =>
      DirectoryApiService.deleteDirectory(data.id),
    onSuccess: () => {
      toast.success("Directory deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["directories-tree"] });
      queryClient.invalidateQueries({ queryKey: ["directories"] });
      queryClient.invalidateQueries({ queryKey: ["directory-children"] });
    },
    onError: (error) => {
      handleToastError(error);
    },
  });
};

export const useGetDirectories = (filters?: { name?: string }) => {
  return useQuery({
    queryFn: () => DirectoryApiService.getDirectories(filters),
    queryKey: ["directories"],
    staleTime: 5_000_000,
  });
};

export const useGetDirectoriesTree = () => {
  return useQuery({
    queryFn: () => DirectoryApiService.getDirectoriesTree(),
    queryKey: ["directories-tree"],
    staleTime: 5_000_000,
  });
};

export const useCloneDirectory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { id: string }) =>
      DirectoryApiService.cloneDirectory(data.id),
    onSuccess: () => {
      toast.success("Directory cloned successfully");
      queryClient.invalidateQueries({ queryKey: ["directories-tree"] });
      queryClient.invalidateQueries({ queryKey: ["directories"] });
      queryClient.invalidateQueries({ queryKey: ["directory-children"] });
    },
    onError: (error) => {
      handleToastError(error);
    },
  });
};

export const useGetDirectoryChildren = (id: string | null) => {
  return useQuery({
    queryFn: () =>
      id !== null ? DirectoryApiService.getDirectoryChildren(id) : undefined,
    queryKey: ["directory-children", id],
    staleTime: 5_000_000,
  });
};
