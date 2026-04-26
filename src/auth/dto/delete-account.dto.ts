import { Transform } from "class-transformer";
import { IsString, MinLength } from "class-validator";

export class DeleteAccountDto {
  @Transform(({ value }) => typeof value === "string" ? value.trim() : value)
  @IsString()
  @MinLength(6)
  password!: string;
}
