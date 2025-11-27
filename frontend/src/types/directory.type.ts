export interface Directory {
  id: string;
  ownerId: string;
  name: string;
  parentId: string | null;
  hasAccess: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DirectoryNode {
  id: string;
  name: string;
  parentId?: string | null;
  createdAt: Date;
  updatedAt: Date;
  children?: DirectoryNode[];
}
