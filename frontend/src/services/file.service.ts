import { apiClient } from "@/lib";

import { UserFile, UserFileAccess } from "@/types";

import axios from "axios";

interface CreateFileResponse {
  file: UserFile;
  uploadUrl: string;
  key: string;
  expiresIn: number;
}

const uploadFile = async (file: File, data: Partial<UserFile>) => {
  const createFileResponse = await apiClient.post<CreateFileResponse>(
    "/files",
    data,
  );

  const { uploadUrl } = createFileResponse.data;

  await axios.put(uploadUrl, file, {
    headers: {
      "Content-Type": file.type || "application/octet-stream",
    },
  });
};

const updateFile = async (id: string, data: Partial<UserFile>) => {
  await apiClient.patch(`/files/update/${id}`, data);
};

const deleteFile = async (id: string) => {
  await apiClient.delete(`/files/delete/${id}`);
};

const getFiles = async (filters?: { name?: string }) => {
  const response = await apiClient.get<UserFile[]>(`/files/get-all`, {
    params: filters,
  });

  return response.data;
};

const getFile = async (id: string) => {
  const response = await apiClient.get<UserFile>(`/files/get/${id}`);
  return response.data;
};

const getFileViewUrl = async (id: string) => {
  const response = await apiClient.get<{
    file: UserFile;
    viewUrl: string;
    expiresIn: number;
  }>(`/files/view/${id}`);

  return response.data;
};

const getFileAccess = async (id: string) => {
  const response = await apiClient.get<UserFileAccess[]>(
    `/files/get-access/${id}`,
  );
  return response.data;
};

const updateFileAccess = async (id: string, data: UserFileAccess[]) => {
  await apiClient.patch<UserFileAccess[]>(`/files/update-access/${id}`, data);
};

export const FileApiService = {
  uploadFile,
  getFiles,
  getFile,
  getFileViewUrl,
  updateFile,
  deleteFile,
  getFileAccess,
  updateFileAccess,
};
