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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger";

import { Prisma } from "@prisma/client";

import { RequestWithUser } from "src/common/types";

import { FilterParamsDto } from "./dto";

import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { DirectoryService } from "./directory.service";

@ApiTags("directory")
@ApiBearerAuth("JWT-auth")
@Controller("directory")
export class DirectoryController {
  constructor(private readonly directoryService: DirectoryService) {}

  @UseGuards(JwtAuthGuard)
  @Get("/:id")
  @ApiOperation({ summary: "Get directory by ID" })
  @ApiParam({ name: "id", description: "Directory ID" })
  @ApiResponse({ status: 200, description: "Directory found" })
  @ApiResponse({ status: 404, description: "Directory not found" })
  public async getDirectory(@Param() param: { id: string }) {
    return await this.directoryService.getDirectory(param.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post("/create")
  @ApiOperation({ summary: "Create a new directory" })
  @ApiResponse({ status: 201, description: "Directory created successfully" })
  @ApiResponse({ status: 400, description: "Bad request" })
  public async createDirectory(
    @Body() dto: Prisma.DirectoryCreateInput,
    @Req() req: RequestWithUser,
  ) {
    return await this.directoryService.createDirectory(req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch("/update/:id")
  @ApiOperation({ summary: "Update directory" })
  @ApiParam({ name: "id", description: "Directory ID" })
  @ApiResponse({ status: 200, description: "Directory updated successfully" })
  @ApiResponse({ status: 404, description: "Directory not found" })
  public async updateDirectory(
    @Param() param: { id: string },
    @Body() dto: Prisma.DirectoryUpdateInput,
  ) {
    return await this.directoryService.updateDirectory(param.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post("/clone/:id")
  @ApiOperation({ summary: "Clone directory with all children" })
  @ApiParam({ name: "id", description: "Directory ID to clone" })
  @ApiResponse({ status: 201, description: "Directory cloned successfully" })
  @ApiResponse({ status: 404, description: "Directory not found" })
  public async cloneDirectory(@Param() param: { id: string }) {
    return await this.directoryService.cloneDirectory(param.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete("/delete/:id")
  @ApiOperation({ summary: "Delete directory" })
  @ApiParam({ name: "id", description: "Directory ID" })
  @ApiResponse({ status: 200, description: "Directory deleted successfully" })
  @ApiResponse({ status: 404, description: "Directory not found" })
  public async deleteDirectory(@Param() param: { id: string }) {
    return await this.directoryService.deleteDirectory(param.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get("/directories/all")
  @ApiOperation({ summary: "Get all directories with optional filters" })
  @ApiQuery({ name: "name", required: false, description: "Filter by name" })
  @ApiResponse({ status: 200, description: "List of directories" })
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
  @ApiOperation({ summary: "Get directory tree structure" })
  @ApiResponse({ status: 200, description: "Directory tree" })
  public async getDirectoryTree(@Req() req: RequestWithUser) {
    return await this.directoryService.getDirectoriesTree(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get("/directories/children/:id")
  @ApiOperation({ summary: "Get directory children (directories and files)" })
  @ApiParam({ name: "id", description: "Directory ID" })
  @ApiResponse({ status: 200, description: "Directory children" })
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
