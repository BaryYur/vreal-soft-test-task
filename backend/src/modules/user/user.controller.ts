import { Controller, Get, UseGuards, Req } from "@nestjs/common";

import { RequestWithUser } from "src/common/types";

import { UserService } from "./user.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("user")
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get("/user-info")
  public async getUserInfo(@Req() req: RequestWithUser) {
    return req.user;
  }
}
