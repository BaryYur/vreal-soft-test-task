import { IsOptional, IsString } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class FilterParamsDto {
  @ApiPropertyOptional({
    description: "Filter by name (case-insensitive partial match)",
    example: "document.pdf",
  })
  @IsOptional()
  @IsString()
  name?: string;
}
