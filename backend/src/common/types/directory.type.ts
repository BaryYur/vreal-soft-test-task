export interface DirectoryNode {
  id: string;
  name: string;
  parentId?: string | null;
  createdAt: Date;
  updatedAt: Date;
  children?: DirectoryNode[];
}