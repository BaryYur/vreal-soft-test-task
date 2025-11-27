import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";

import { ExtractJwt, Strategy } from "passport-jwt";

import { UserService } from "../user/user.service";

const cookieExtractor = (req: any) => {
  if (!req || !req.cookies) return null;

  return req.cookies.accessToken || null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UserService,
    private config: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      ignoreExpiration: false,
      secretOrKey: config.get<string>("JWT_SECRET") || "",
    });
  }

  async validate(payload: any) {
    const user = await this.usersService.findUserById(payload.sub);
    if (!user) return null;
    const { password, ...rest } = user;
    return rest;
  }
}
