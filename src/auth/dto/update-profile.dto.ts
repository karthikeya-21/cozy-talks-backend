import { Transform } from "class-transformer";
import { IsEmail, IsOptional, IsString } from "class-validator";

export class UpdateProfileDto {
  @Transform(({ value }) => typeof value === "string" ? value.trim() : value)
  @IsOptional()
  @IsString()
  name?: string;

  @Transform(({ value }) => typeof value === "string" ? value.trim().toLowerCase() : value)
  @IsOptional()
  @IsEmail()
  email?: string;

  @Transform(({ value }) => typeof value === "string" ? value.trim() : value)
  @IsOptional()
  @IsString()
  avatarUrl?: string | null;
}
