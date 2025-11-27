import { Injectable, NotFoundException } from "@nestjs/common";

import { Directory, File as UserFile, Prisma } from "@prisma/client";

import { DatabaseService } from "../database";

import { DirectoryNode } from "src/common/types";

import { FilterParamsDto } from "./dto";

@Injectable()
export class DirectoryService {
  constructor(private database: DatabaseService) {}

  async getDirectory(id: string): Promise<Directory> {
    const directory = await this.database.directory.findUnique({
      where: {
        id,
      },
    });

    if (!directory) {
      throw new NotFoundException("Directory wasn't found");
    }

    return directory;
  }

  async createDirectory(
    userId: string,
    dto: { name: string; parentId?: string },
  ) {
    try {
      return await this.database.directory.create({
        data: {
          name: dto.name,
          owner: { connect: { id: userId } },
          parent: dto.parentId ? { connect: { id: dto.parentId } } : undefined,
        },
      });
    } catch (error) {
      if (error.code === "P2003") {
        throw new NotFoundException("Owner or parent directory not found");
      }

      throw error;
    }
  }

  async updateDirectory(id: string, dto: Prisma.DirectoryUpdateInput) {
    try {
      return await this.database.directory.update({
        where: { id },
        data: dto,
      });
    } catch (error) {
      if (error.code === "P2025") {
        throw new NotFoundException("Directory wasn't found");
      }

      throw error;
    }
  }

  async deleteDirectory(id: string) {
    try {
      await this.database.directory.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === "P2025") {
        throw new NotFoundException("Directory wasn't found");
      }

      throw error;
    }
  }

  async getAllDirectories(
    userId: string,
    paramsDto: FilterParamsDto,
  ): Promise<Directory[]> {
    const directories = await this.database.directory.findMany({
      where: {
        ownerId: userId,
        name: {
          contains: paramsDto.name,
          mode: "insensitive",
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    if (!directories) {
      throw new NotFoundException("Directories weren't found");
    }

    return directories;
  }

  async cloneDirectory(id: string) {
    const directory = await this.database.directory.findUnique({
      where: {
        id,
      },
    });

    if (!directory) {
      throw new NotFoundException("Directory not found");
    }

    try {
      return await this.database.directory.create({
        data: {
          name: `${directory.name} (copy)`,
          owner: { connect: { id: directory.ownerId } },
          parent: directory.parentId
            ? { connect: { id: directory.parentId } }
            : undefined,
        },
      });
    } catch (error) {
      if (error.code === "P2003") {
        throw new NotFoundException("Owner or parent directory not found");
      }

      throw error;
    }
  }

  async getDirectoryTopChildren(
    userId: string,
    directoryId: string,
  ): Promise<{ directories: Directory[]; files: UserFile[] }> {
    const directories = await this.database.directory.findMany({
      where: {
        parentId: directoryId,
        ownerId: userId,
      },
    });

    if (!directories) {
      throw new NotFoundException("Directories weren't found");
    }

    const files = await this.database.file.findMany({
      where: {
        directoryId: directoryId,
      },
    });

    return { directories: directories, files: files };
  }

  async getDirectoriesTree(ownerId: string): Promise<DirectoryNode[]> {
    const rows = await this.database.directory.findMany({
      where: { ownerId },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        name: true,
        parentId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const map = new Map<string, DirectoryNode>();
    const roots: DirectoryNode[] = [];

    for (const row of rows) {
      map.set(row.id, { ...row, children: [] });
    }

    for (const row of rows) {
      const node = map.get(row.id)!;

      if (row.parentId) {
        const parent = map.get(row.parentId);

        if (parent) {
          parent.children!.push(node);
        } else {
          roots.push(node);
        }
      } else {
        roots.push(node);
      }
    }

    const pruneEmptyChildren = (n: DirectoryNode) => {
      if (n.children && n.children.length === 0) {
        delete n.children;
      } else {
        n.children?.forEach(pruneEmptyChildren);
      }
    };

    roots.forEach(pruneEmptyChildren);

    return roots;
  }
}
