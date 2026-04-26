import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from "@nestjs/common";

import { CurrentUser } from "../auth/current-user.decorator";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { ChatRequestsService } from "./chat-requests.service";
import { CreateChatRequestDto } from "./dto/create-chat-request.dto";
import { UpdateChatRequestDto } from "./dto/update-chat-request.dto";

@UseGuards(JwtAuthGuard)
@Controller("chat-requests")
export class ChatRequestsController {
  constructor(private readonly chatRequestsService: ChatRequestsService) {}

  @Get()
  list(@CurrentUser() user: { userId: number }) {
    return this.chatRequestsService.list(user.userId);
  }

  @Post()
  create(
    @CurrentUser() user: { userId: number },
    @Body() dto: CreateChatRequestDto,
  ) {
    return this.chatRequestsService.create(user.userId, dto);
  }

  @Patch(":id")
  update(
    @CurrentUser() user: { userId: number },
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateChatRequestDto,
  ) {
    return this.chatRequestsService.update(user.userId, id, dto.action);
  }
}
