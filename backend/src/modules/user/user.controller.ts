import { Controller, Get, UseGuards, Req } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";

import { RequestWithUser } from "src/common/types";

import { UserService } from "./user.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@ApiTags("user")
@ApiBearerAuth("JWT-auth")
@Controller("user")
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get("/user-info")
  @ApiOperation({ summary: "Get current user information" })
  @ApiResponse({
    status: 200,
    description: "User information",
    schema: {
      type: "object",
      properties: {
        id: { type: "string" },
        email: { type: "string" },
        name: { type: "string" },
      },
    },
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  public async getUserInfo(@Req() req: RequestWithUser) {
    return req.user;
  }
}
