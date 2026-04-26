import { IsEnum } from "class-validator";

export enum ChatRequestAction {
  APPROVE = "APPROVE",
  REJECT = "REJECT",
}

export class UpdateChatRequestDto {
  @IsEnum(ChatRequestAction)
  action!: ChatRequestAction;
}
