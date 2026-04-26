import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { MessageType } from "@prisma/client";

import { AiService } from "../ai/ai.service";
import { ChatRequestsService } from "../chat-requests/chat-requests.service";
import { PrismaService } from "../prisma/prisma.service";
import { RealtimeEventsService } from "../realtime/realtime-events.service";
import { UsersService } from "../users/users.service";
import { CreateMessageDto } from "./dto/create-message.dto";

@Injectable()
export class MessagesService {
  private readonly logger = new Logger(MessagesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly chatRequestsService: ChatRequestsService,
    private readonly usersService: UsersService,
    private readonly aiService: AiService,
    private readonly realtimeEvents: RealtimeEventsService,
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

    const serializedMessage = {
      id: message.id,
      fromUserId: message.fromUserId,
      toUserId: message.toUserId,
      senderName: message.fromUser.name,
      content: message.content,
      type: message.type,
      mediaUrl: message.mediaUrl,
      createdAt: message.createdAt,
    };

    void this.maybeReplyAsCozyBot(serializedMessage).catch((error: unknown) => {
      const errorMessage = error instanceof Error ? error.message : "Unknown Cozy Bot reply error.";
      this.logger.error(`Failed to create Cozy Bot reply: ${errorMessage}`);
    });

    return serializedMessage;
  }

  private async maybeReplyAsCozyBot(message: {
    id: number;
    fromUserId: number;
    toUserId: number;
    senderName: string;
    content: string;
    type: MessageType;
    mediaUrl: string | null;
    createdAt: Date;
  }) {
    const cozyBot = await this.usersService.ensureCozyBotUser();
    if (message.toUserId !== cozyBot.id || message.fromUserId === cozyBot.id) {
      return;
    }

    const conversation = await this.prisma.message.findMany({
      where: {
        OR: [
          {
            fromUserId: message.fromUserId,
            toUserId: cozyBot.id,
          },
          {
            fromUserId: cozyBot.id,
            toUserId: message.fromUserId,
          },
        ],
      },
      include: {
        fromUser: true,
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    const botReply = await this.aiService.generateCozyBotReply({
      userName: message.senderName,
      conversation: conversation.reverse().map((item) => ({
        role: item.fromUserId === cozyBot.id ? "assistant" : "user",
        content:
          item.type === MessageType.IMAGE
            ? `[Image message]${item.content && item.content !== "Image" ? ` ${item.content}` : ""}`
            : item.content,
      })),
    });

    const botMessage = await this.prisma.message.create({
      data: {
        fromUserId: cozyBot.id,
        toUserId: message.fromUserId,
        content: botReply,
        type: MessageType.TEXT,
      },
      include: {
        fromUser: true,
      },
    });

    const serializedReply = {
      id: botMessage.id,
      fromUserId: botMessage.fromUserId,
      toUserId: botMessage.toUserId,
      senderName: botMessage.fromUser.name,
      content: botMessage.content,
      type: botMessage.type,
      mediaUrl: botMessage.mediaUrl,
      createdAt: botMessage.createdAt,
    };

    this.realtimeEvents.emitToUsers(
      [serializedReply.fromUserId, serializedReply.toUserId],
      "message:received",
      serializedReply,
    );
  }
}
