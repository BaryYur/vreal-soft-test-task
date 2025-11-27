import { IsString, IsOptional, IsEmail, MinLength } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class SignInDto {
  @ApiProperty({
    description: "User email address",
    example: "user@example.com",
  })
  @IsEmail()
  @IsString()
  email: string;

  @ApiProperty({
    description: "User password (minimum 6 characters)",
    example: "password123",
    minLength: 6,
  })
  @MinLength(6)
  @IsString()
  password: string;
}

export class SignUpDto extends SignInDto {
  @ApiPropertyOptional({
    description: "User name",
    example: "John Doe",
  })
  @IsString()
  @IsOptional()
  name: string;
}
