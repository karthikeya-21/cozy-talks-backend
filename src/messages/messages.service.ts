import { BadRequestException, Injectable } from "@nestjs/common";
import { MessageType } from "@prisma/client";

import { ChatRequestsService } from "../chat-requests/chat-requests.service";
import { PrismaService } from "../prisma/prisma.service";
import { CreateMessageDto } from "./dto/create-message.dto";

@Injectable()
export class MessagesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly chatRequestsService: ChatRequestsService,
  ) {}

  async getConversation(currentUserId: number, otherUserId: number) {
    const isConnected = await this.chatRequestsService.areUsersConnected(
      currentUserId,
      otherUserId,
    );

    if (!isConnected) {
      throw new BadRequestException("Users must be connected before reading messages.");
    }

    const messages = await this.prisma.message.findMany({
      where: {
        OR: [
          {
            fromUserId: currentUserId,
            toUserId: otherUserId,
          },
          {
            fromUserId: otherUserId,
            toUserId: currentUserId,
          },
        ],
      },
      include: {
        fromUser: true,
      },
      orderBy: { createdAt: "asc" },
    });

    return messages.map((message) => ({
      id: message.id,
      fromUserId: message.fromUserId,
      toUserId: message.toUserId,
      senderName: message.fromUser.name,
      content: message.content,
      type: message.type,
      mediaUrl: message.mediaUrl,
      createdAt: message.createdAt,
    }));
  }

  async create(currentUserId: number, dto: CreateMessageDto) {
    const isConnected = await this.chatRequestsService.areUsersConnected(
      currentUserId,
      dto.toUserId,
    );

    if (!isConnected) {
      throw new BadRequestException("Users must be connected before sending messages.");
    }

    const message = await this.prisma.message.create({
      data: {
        fromUserId: currentUserId,
        toUserId: dto.toUserId,
        content: dto.content,
        type: dto.type ?? MessageType.TEXT,
        mediaUrl: dto.mediaUrl,
      },
      include: {
        fromUser: true,
      },
    });

    return {
      id: message.id,
      fromUserId: message.fromUserId,
      toUserId: message.toUserId,
      senderName: message.fromUser.name,
      content: message.content,
      type: message.type,
      mediaUrl: message.mediaUrl,
      createdAt: message.createdAt,
    };
  }
}
