import { IsInt, Min } from "class-validator";

export class CreateChatRequestDto {
  @IsInt()
  @Min(1)
  targetUserId!: number;
}
