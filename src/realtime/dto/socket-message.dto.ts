import { Transform } from "class-transformer";
import { MessageType } from "@prisma/client";
import { IsEnum, IsInt, IsOptional, IsString, Min, MinLength } from "class-validator";

export class SocketMessageDto {
  @IsInt()
  @Min(1)
  toUserId!: number;

  @Transform(({ value }) => typeof value === "string" ? value.trim() : value)
  @IsString()
  @MinLength(1)
  content!: string;

  @Transform(({ value }) => typeof value === "string" ? value.trim() : value)
  @IsOptional()
  @IsEnum(MessageType)
  type?: MessageType;

  @Transform(({ value }) => typeof value === "string" ? value.trim() : value)
  @IsOptional()
  @IsString()
  mediaUrl?: string;
}
