import {
  Controller,
  UseGuards,
  Get,
  Post,
  Patch,
  Delete,
  Req,
  Param,
  Body,
  Query,
} from "@nestjs/common";

import { Prisma } from "@prisma/client";

import { RequestWithUser } from "src/common/types";

import { FilterParamsDto } from "./dto";

import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { DirectoryService } from "./directory.service";

@Controller("directory")
export class DirectoryController {
  constructor(private readonly directoryService: DirectoryService) {}

  @UseGuards(JwtAuthGuard)
  @Get("/:id")
  public async getDirectory(@Param() param: { id: string }) {
    return await this.directoryService.getDirectory(param.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post("/create")
  public async createDirectory(
    @Body() dto: Prisma.DirectoryCreateInput,
    @Req() req: RequestWithUser,
  ) {
    return await this.directoryService.createDirectory(req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch("/update/:id")
  public async updateDirectory(
    @Param() param: { id: string },
    @Body() dto: Prisma.DirectoryUpdateInput,
  ) {
    return await this.directoryService.updateDirectory(param.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post("/clone/:id")
  public async cloneDirectory(@Param() param: { id: string }) {
    return await this.directoryService.cloneDirectory(param.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete("/delete/:id")
  public async deleteDirectory(@Param() param: { id: string }) {
    return await this.directoryService.deleteDirectory(param.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get("/directories/all")
  public async getAllDirectories(
    @Req() req: RequestWithUser,
    @Query() paramsDto: FilterParamsDto,
  ) {
    return await this.directoryService.getAllDirectories(
      req.user.id,
      paramsDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get("/directories/tree")
  public async getDirectoryTree(@Req() req: RequestWithUser) {
    return await this.directoryService.getDirectoriesTree(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get("/directories/children/:id")
  public async getDirectoryChildren(
    @Req() req: RequestWithUser,
    @Param() param: { id: string },
  ) {
    return await this.directoryService.getDirectoryTopChildren(
      req.user.id,
      param.id,
    );
  }
}
