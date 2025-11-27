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

import { FileService } from "./file.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

import { RequestWithUser } from "src/common/types";

import { FilterParamsDto } from "./dto";

import { CreateFileDto } from "./dto/create-file.dto";
import { UpdateFileDto } from "./dto/update-file.dto";
import { UpdateFileAccessDto } from "./dto/update-file-access.dto";

@Controller("files")
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createFile(@Body() dto: CreateFileDto) {
    return this.fileService.createFile(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch("/update/:id")
  async updateFile(@Param("id") id: string, @Body() dto: UpdateFileDto) {
    return this.fileService.updateFile(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete("/delete/:id")
  async removeFile(@Param("id") id: string) {
    return this.fileService.removeFile(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get("/get/:id")
  async getFile(@Req() req: RequestWithUser, @Param("id") id: string) {
    return this.fileService.getFile(req.user.id, id);
  }

  @UseGuards(JwtAuthGuard)
  @Get("/view/:id")
  async getFileViewUrl(@Req() req: RequestWithUser, @Param("id") id: string) {
    return this.fileService.getFileViewUrl(req.user.id, id);
  }

  @UseGuards(JwtAuthGuard)
  @Get("/get-all")
  async getAllFiles(
    @Req() req: RequestWithUser,
    @Query() paramsDto: FilterParamsDto,
  ) {
    return this.fileService.getAllFiles(req.user.id, paramsDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get("/get-access/:id")
  async getFileAccess(@Param("id") id: string) {
    return this.fileService.getFileAccess(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch("/update-access/:id")
  async updateFileAccess(
    @Param("id") id: string,
    @Body() dto: UpdateFileAccessDto[],
  ) {
    return this.fileService.updateFileAccess(id, dto);
  }
}
