import { IsOptional, IsEnum, IsString } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { FileVisibility } from "@prisma/client";

export class UpdateFileDto {
  @ApiPropertyOptional({
    description: "File name",
    example: "updated-document.pdf",
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: "File visibility",
    enum: ["public", "private"],
    example: "public",
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
