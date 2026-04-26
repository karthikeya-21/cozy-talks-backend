import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from "@nestjs/common";
import { ChatRequestStatus, Prisma } from "@prisma/client";

import { PrismaService } from "../prisma/prisma.service";
import { RealtimeEventsService } from "../realtime/realtime-events.service";
import { CreateChatRequestDto } from "./dto/create-chat-request.dto";
import { ChatRequestAction } from "./dto/update-chat-request.dto";

@Injectable()
export class ChatRequestsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => RealtimeEventsService))
    private readonly realtimeEvents: RealtimeEventsService,
  ) {}

  async create(currentUserId: number, dto: CreateChatRequestDto) {
    if (currentUserId === dto.targetUserId) {
      throw new BadRequestException("You cannot send a chat request to yourself.");
    }

    const existingRequest = await this.prisma.chatRequest.findFirst({
      where: {
        OR: [
          {
            fromUserId: currentUserId,
            toUserId: dto.targetUserId,
          },
          {
            fromUserId: dto.targetUserId,
            toUserId: currentUserId,
          },
        ],
      },
    });

    if (existingRequest) {
      throw new ConflictException("A chat request or connection already exists for these users.");
    }

    let createdRequest;
    try {
      createdRequest = await this.prisma.chatRequest.create({
        data: {
          fromUserId: currentUserId,
          toUserId: dto.targetUserId,
          status: ChatRequestStatus.PENDING,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new ConflictException("A chat request or connection already exists for these users.");
      }

      throw error;
    }

    this.realtimeEvents.emitToUsers(
      [currentUserId, dto.targetUserId],
      "chat-request:created",
      {
        id: createdRequest.id,
        fromUserId: createdRequest.fromUserId,
        toUserId: createdRequest.toUserId,
        status: createdRequest.status,
      },
    );

    return createdRequest;
  }

  async list(currentUserId: number) {
    const items = await this.prisma.chatRequest.findMany({
      where: {
        status: ChatRequestStatus.PENDING,
        OR: [
          { fromUserId: currentUserId },
          { toUserId: currentUserId },
        ],
      },
      include: {
        fromUser: true,
        toUser: true,
      },
      orderBy: { createdAt: "asc" },
    });

    return items.map((item) => {
      const isSender = item.fromUserId === currentUserId;
      const otherUser = isSender ? item.toUser : item.fromUser;

      return {
        id: item.id,
        fromUserId: item.fromUserId,
        toUserId: item.toUserId,
        status: item.status,
        notificationType: isSender ? "Send Request" : "Receive Request",
        user: {
          id: otherUser.id,
          name: otherUser.name,
          email: otherUser.email,
          avatarUrl: otherUser.avatarUrl,
        },
      };
    });
  }

  async update(currentUserId: number, requestId: number, action: ChatRequestAction) {
    const request = await this.prisma.chatRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      throw new NotFoundException("Chat request not found.");
    }

    if (request.toUserId !== currentUserId) {
      throw new BadRequestException("Only the receiving user can process this request.");
    }

    if (request.status !== ChatRequestStatus.PENDING) {
      throw new ConflictException("This chat request has already been processed.");
    }

    const updatedRequest = await this.prisma.chatRequest.update({
      where: { id: requestId },
      data: {
        status:
          action === ChatRequestAction.APPROVE
            ? ChatRequestStatus.APPROVED
            : ChatRequestStatus.REJECTED,
      },
    });

    this.realtimeEvents.emitToUsers(
      [updatedRequest.fromUserId, updatedRequest.toUserId],
      "chat-request:updated",
      {
        id: updatedRequest.id,
        fromUserId: updatedRequest.fromUserId,
        toUserId: updatedRequest.toUserId,
        status: updatedRequest.status,
      },
    );

    return updatedRequest;
  }

  async areUsersConnected(firstUserId: number, secondUserId: number) {
    const request = await this.prisma.chatRequest.findFirst({
      where: {
        status: ChatRequestStatus.APPROVED,
        OR: [
          { fromUserId: firstUserId, toUserId: secondUserId },
          { fromUserId: secondUserId, toUserId: firstUserId },
        ],
      },
    });

    return Boolean(request);
  }
}
