import { Directory, DirectoryNode, UserFile } from "@/types";

import { apiClient } from "@/lib";

const createDirectory = async (data: Partial<Directory>) => {
  await apiClient.post("/directory/create", data);
};

const getDirectory = async (id: string) => {
  const response = await apiClient.get<Directory>(`/directory/${id}`);

  return response.data;
};

const updateDirectory = async (id: string, data: Partial<Directory>) => {
  await apiClient.patch(`/directory/update/${id}`, data);
};

const deleteDirectory = async (id: string) => {
  await apiClient.delete(`/directory/delete/${id}`);
};

const getDirectories = async (filters?: { name?: string }) => {
  const response = await apiClient.get<Directory[]>(
    "/directory/directories/all",
    {
      params: filters,
    },
  );

  return response.data;
};

const getDirectoriesTree = async () => {
  const response = await apiClient.get<DirectoryNode[]>(
    "/directory/directories/tree",
  );

  return response.data;
};

const cloneDirectory = async (id: string) => {
  await apiClient.post(`/directory/clone/${id}`);
};

const getDirectoryChildren = async (id: string) => {
  const response = await apiClient.get<{
    directories: Directory[];
    files: UserFile[];
  }>(`/directory/directories/children/${id}`);

  return response.data;
};

export const DirectoryApiService = {
  createDirectory,
  getDirectory,
  updateDirectory,
  deleteDirectory,
  getDirectories,
  getDirectoriesTree,
  cloneDirectory,
  getDirectoryChildren,
};
