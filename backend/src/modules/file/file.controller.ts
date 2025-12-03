import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Req,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger";

import { FileService } from "./file.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

import { RequestWithUser } from "src/common/types";

import { FilterParamsDto } from "./dto";

import { CreateFileDto } from "./dto/create-file.dto";
import { UpdateFileDto } from "./dto/update-file.dto";
import { UpdateFileAccessDto } from "./dto/update-file-access.dto";

@ApiTags("files")
@ApiBearerAuth("JWT-auth")
@Controller("files")
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: "Create a new file and get upload URL" })
  @ApiResponse({
    status: 201,
    description: "File created, returns upload URL",
    schema: {
      type: "object",
      properties: {
        file: { type: "object" },
        uploadUrl: { type: "string" },
        key: { type: "string" },
        expiresIn: { type: "number" },
      },
    },
  })
  async createFile(@Body() dto: CreateFileDto) {
    return this.fileService.createFile(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch("/update/:id")
  @ApiOperation({ summary: "Update file metadata" })
  @ApiParam({ name: "id", description: "File ID" })
  @ApiResponse({ status: 200, description: "File updated successfully" })
  @ApiResponse({ status: 404, description: "File not found" })
  async updateFile(@Param("id") id: string, @Body() dto: UpdateFileDto) {
    return this.fileService.updateFile(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete("/delete/:id")
  @ApiOperation({ summary: "Delete file" })
  @ApiParam({ name: "id", description: "File ID" })
  @ApiResponse({ status: 200, description: "File deleted successfully" })
  @ApiResponse({ status: 404, description: "File not found" })
  async removeFile(@Param("id") id: string) {
    return this.fileService.removeFile(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get("/get/:id")
  @ApiOperation({ summary: "Get file by ID" })
  @ApiParam({ name: "id", description: "File ID" })
  @ApiResponse({ status: 200, description: "File found" })
  @ApiResponse({ status: 404, description: "File not found" })
  async getFile(@Req() req: RequestWithUser, @Param("id") id: string) {
    return this.fileService.getFile(req.user.id, id);
  }

  @UseGuards(JwtAuthGuard)
  @Get("/view/:id")
  @ApiOperation({ summary: "Get file view URL (presigned S3 URL)" })
  @ApiParam({ name: "id", description: "File ID" })
  @ApiResponse({
    status: 200,
    description: "Returns presigned URL for viewing file",
    schema: {
      type: "object",
      properties: {
        file: { type: "object" },
        viewUrl: { type: "string" },
        expiresIn: { type: "number" },
      },
    },
  })
  async getFileViewUrl(@Req() req: RequestWithUser, @Param("id") id: string) {
    return this.fileService.getFileViewUrl(req.user.id, id);
  }

  @UseGuards(JwtAuthGuard)
  @Get("/get-all")
  @ApiOperation({ summary: "Get all files with optional filters" })
  @ApiQuery({ name: "name", required: false, description: "Filter by name" })
  @ApiResponse({ status: 200, description: "List of files" })
  async getAllFiles(
    @Req() req: RequestWithUser,
    @Query() paramsDto: FilterParamsDto,
  ) {
    return this.fileService.getAllFiles(req.user.id, paramsDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get("/get-access/:id")
  @ApiOperation({ summary: "Get file access list" })
  @ApiParam({ name: "id", description: "File ID" })
  @ApiResponse({ status: 200, description: "File access list" })
  async getFileAccess(@Param("id") id: string) {
    return this.fileService.getFileAccess(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch("/update-access/:id")
  @ApiOperation({ summary: "Update file access permissions" })
  @ApiParam({ name: "id", description: "File ID" })
  @ApiResponse({ status: 200, description: "File access updated successfully" })
  @ApiResponse({ status: 404, description: "File not found" })
  async updateFileAccess(
    @Param("id") id: string,
    @Body() dto: UpdateFileAccessDto[],
  ) {
    return this.fileService.updateFileAccess(id, dto);
  }
}
