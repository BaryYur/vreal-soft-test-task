import { Post, Controller, Body, Res } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from "@nestjs/swagger";
import { Response } from "express";

import { SignInDto, SignUpDto } from "./dto";

import { AuthService } from "./auth.service";

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
  public constructor(private readonly authService: AuthService) {}

  @Post("/sign-up")
  @ApiOperation({ summary: "Register a new user" })
  @ApiBody({ type: SignUpDto })
  @ApiResponse({
    status: 201,
    description: "User successfully registered",
    schema: {
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "Bad request - User already exists or validation failed",
  })
  public async signUp(
    @Body() dto: SignUpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken } = await this.authService.signUp(dto);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24,
      path: "/",
    });

    return { success: true };
  }

  @Post("/sign-in")
  @ApiOperation({ summary: "Sign in user" })
  @ApiBody({ type: SignInDto })
  @ApiResponse({
    status: 200,
    description: "User successfully signed in",
    schema: {
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Invalid credentials",
  })
  public async signIn(
    @Body() dto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken } = await this.authService.signIn(dto);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24,
      path: "/",
    });

    return { success: true };
  }
}
