export enum UserFileVisibility {
  PUBLIC = "public",
  PRIVATE = "private",
}

export interface UserFileAccess {
  id: string;
  email: string;
  access: "change" | "watch";
}

export interface UserFile {
  id: string;
  name: string;
  s3Key: string;
  ownerId: string;
  directoryId: string | null;
  visibility: UserFileVisibility;
  createdAt: Date;
  updatedAt: Date;
  access: UserFileAccess[];
}
