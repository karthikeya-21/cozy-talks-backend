import { Transform } from "class-transformer";
import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";

export class RegisterDto {
  @Transform(({ value }) => typeof value === "string" ? value.trim() : value)
  @IsString()
  name!: string;

  @Transform(({ value }) => typeof value === "string" ? value.trim().toLowerCase() : value)
  @IsEmail()
  email!: string;

  @Transform(({ value }) => typeof value === "string" ? value.trim() : value)
  @IsString()
  @MinLength(6)
  password!: string;

  @Transform(({ value }) => typeof value === "string" ? value.trim() : value)
  @IsOptional()
  @IsString()
  avatarUrl?: string;
}
