import { Controller, Get, UseGuards, Req } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";

import { RequestWithUser } from "src/common/types";

import { UserService } from "./user.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@ApiTags("User")
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
        id: { type: "string", example: "clx1234567890abcdef" },
        email: { type: "string", example: "user@example.com" },
        name: { type: "string", example: "John Doe" },
        createdAt: { type: "string", format: "date-time" },
      },
    },
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  public async getUserInfo(@Req() req: RequestWithUser) {
    return req.user;
  }
}
