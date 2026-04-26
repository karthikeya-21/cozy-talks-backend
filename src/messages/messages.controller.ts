import { Body, Controller, Get, ParseIntPipe, Post, Query, UseGuards } from "@nestjs/common";

import { CurrentUser } from "../auth/current-user.decorator";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CreateMessageDto } from "./dto/create-message.dto";
import { MessagesService } from "./messages.service";

@UseGuards(JwtAuthGuard)
@Controller("messages")
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get("conversation")
  getConversation(
    @CurrentUser() user: { userId: number },
    @Query("userId", ParseIntPipe) otherUserId: number,
  ) {
    return this.messagesService.getConversation(user.userId, otherUserId);
  }

  @Post()
  create(
    @CurrentUser() user: { userId: number },
    @Body() dto: CreateMessageDto,
  ) {
    return this.messagesService.create(user.userId, dto);
  }
}
