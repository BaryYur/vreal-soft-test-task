import { IsNotEmpty, IsOptional, IsEnum, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

import { FileVisibility } from "@prisma/client";

export class CreateFileDto {
  @ApiProperty({
    description: "File name",
    example: "document.pdf",
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: "Owner user ID",
    example: "clx1234567890abcdef",
  })
  @IsNotEmpty()
  @IsString()
  ownerId: string;

  @ApiPropertyOptional({
    description: "File visibility",
    enum: ["public", "private"],
    default: "private",
    example: "private",
  })
  @IsOptional()
  @IsEnum(["public", "private"])
  visibility?: FileVisibility | "public" | "private";

  @ApiPropertyOptional({
    description: "Parent directory ID",
    example: "clx1234567890abcdef",
    nullable: true,
  })
  @IsOptional()
  @IsString()
  directoryId?: string | null;

  @ApiPropertyOptional({
    description: "File content type (MIME type)",
    example: "application/pdf",
    nullable: true,
  })
  @IsOptional()
  @IsString()
  contentType?: string | null;
}
