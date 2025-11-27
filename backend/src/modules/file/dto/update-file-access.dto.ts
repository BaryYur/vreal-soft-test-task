import { IsEnum, IsEmail } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

import { FileAccess } from "@prisma/client";

export class UpdateFileAccessDto {
  @ApiProperty({
    description: "User email to grant access",
    example: "user@example.com",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "Access type",
    enum: FileAccess,
    example: "change",
  })
  @IsEnum(FileAccess)
  access: FileAccess;
}
