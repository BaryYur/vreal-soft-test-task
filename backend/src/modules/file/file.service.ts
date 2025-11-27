import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from "@nestjs/common";

import { DatabaseService } from "../database/database.service";
import { S3Service } from "../aws/aws.service";

import { CreateFileDto } from "./dto/create-file.dto";
import { UpdateFileDto } from "./dto/update-file.dto";
import { FilterParamsDto } from "./dto/filter-params.dto";
import { UpdateFileAccessDto } from "./dto/update-file-access.dto";

@Injectable()
export class FileService {
  constructor(
    private database: DatabaseService,
    private s3: S3Service,
  ) {}

  async createFile(dto: CreateFileDto) {
    if (dto.directoryId) {
      const dir = await this.database.directory.findUnique({
        where: { id: dto.directoryId },
      });
      if (!dir) throw new BadRequestException("Directory not found");
    }

    const file = await this.database.file.create({
      data: {
        ownerId: dto.ownerId,
        name: dto.name,
        visibility: dto.visibility ?? "private",
        directoryId: dto.directoryId ?? null,
      },
    });

    const key = this.s3.buildKey(dto.ownerId, file.id, dto.name);
    await this.database.file.update({
      where: { id: file.id },
      data: { s3Key: key },
    });

    const uploadUrl = await this.s3.getPresignedPutUrl(
      key,
      dto.contentType ?? undefined,
    );

    return {
      file: { ...file, s3Key: key },
      uploadUrl,
      key,
      expiresIn: Number(process.env.S3_URL_EXP_SECONDS ?? 900),
    };
  }

  async updateFile(fileId: string, dto: UpdateFileDto) {
    const file = await this.database.file.findUnique({ where: { id: fileId } });
    if (!file) throw new NotFoundException("File not found");

    if (dto.directoryId !== undefined && dto.directoryId !== null) {
      const dir = await this.database.directory.findUnique({
        where: { id: dto.directoryId },
      });

      if (!dir) throw new BadRequestException("Directory not found");
    }

    let newS3Key = file.s3Key;
    if (dto.name && dto.name !== file.name) {
      const sourceKey =
        file.s3Key ?? this.s3.buildKey(file.ownerId, file.id, file.name);
      const destKey = this.s3.buildKey(file.ownerId, file.id, dto.name);

      try {
        await this.s3.copyObject(sourceKey, destKey);
        await this.s3.deleteObject(sourceKey);
        newS3Key = destKey;
      } catch (e) {
        throw new InternalServerErrorException("Failed to rename file in S3");
      }
    }

    const updated = await this.database.file.update({
      where: { id: fileId },
      data: {
        name: dto.name ?? file.name,
        visibility: dto.visibility ?? file.visibility,
        directoryId:
          dto.directoryId === undefined ? file.directoryId : dto.directoryId,
        s3Key: newS3Key,
      },
    });

    if (dto.contentType) {
      const key =
        updated.s3Key ??
        this.s3.buildKey(updated.ownerId, updated.id, updated.name);
      const uploadUrl = await this.s3.getPresignedPutUrl(key, dto.contentType);
      return {
        file: updated,
        uploadUrl,
        key,
        expiresIn: Number(process.env.S3_URL_EXP_SECONDS ?? 900),
      };
    }

    return { file: updated };
  }

  async removeFile(fileId: string) {
    const file = await this.database.file.findUnique({ where: { id: fileId } });
    if (!file) throw new NotFoundException("File not found");

    const key =
      file.s3Key ?? this.s3.buildKey(file.ownerId, file.id, file.name);
    try {
      await this.s3.deleteObject(key);
    } catch (error) {
      console.log(error);
    }

    await this.database.file.delete({ where: { id: fileId } });

    return { ok: true };
  }

  async getAllFiles(userId: string, paramsDto: FilterParamsDto) {
    try {
      const files = await this.database.file.findMany({
        where: {
          ownerId: userId,
          name: {
            contains: paramsDto.name,
            mode: "insensitive",
          },
        },
      });

      return files;
    } catch (error) {
      throw new InternalServerErrorException("Failed to get all files");
    }
  }

  async getFile(userId: string, fileId: string) {
    const file = await this.database.file.findUnique({
      where: { id: fileId, ownerId: userId },
    });

    if (!file) {
      throw new NotFoundException("File not found");
    }

    return file;
  }

  async getFileViewUrl(userId: string, fileId: string) {
    const user = await this.database.user.findUnique({
      where: { id: userId },
    });

    const file = await this.database.file.findUnique({
      where: { id: fileId },
      include: {
        access: true,
      },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (!file) {
      throw new NotFoundException("File not found");
    }

    const isUserHasAccess = file.access.some(
      (access) => access.email === user.email,
    );

    if (!isUserHasAccess && file.ownerId !== userId) {
      throw new NotFoundException("File not found");
    }

    const key =
      file.s3Key ?? this.s3.buildKey(file.ownerId, file.id, file.name);
    const viewUrl = await this.s3.getPresignedGetUrl(key);

    return {
      file,
      viewUrl,
      expiresIn: 900,
    };
  }

  async getFileAccess(fileId: string) {
    const fileAccess = await this.database.userFileAccess.findMany({
      where: { fileId },
    });

    return fileAccess;
  }

  async updateFileAccess(fileId: string, dto: UpdateFileAccessDto[]) {
    const file = await this.database.file.findUnique({ where: { id: fileId } });

    if (!file) throw new NotFoundException("File not found");

    return this.database.$transaction(async (tx) => {
      await tx.userFileAccess.deleteMany({
        where: { fileId },
      });

      if (dto.length > 0) {
        await tx.userFileAccess.createMany({
          data: dto.map((item) => ({
            fileId,
            email: item.email,
            access: item.access,
          })),
        });
      }

      return tx.userFileAccess.findMany({
        where: { fileId },
      });
    });
  }
}
