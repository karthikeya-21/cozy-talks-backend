import { Injectable, NotFoundException } from "@nestjs/common";
import { ChatRequestStatus } from "@prisma/client";

import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async discoverUsers(currentUserId: number, query?: string) {
    const [users, relatedRequests] = await Promise.all([
      this.prisma.user.findMany({
        where: {
          id: { not: currentUserId },
          ...(query
            ? {
                name: {
                  contains: query,
                  mode: "insensitive",
                },
              }
            : {}),
        },
        orderBy: { name: "asc" },
      }),
      this.prisma.chatRequest.findMany({
        where: {
          status: {
            in: [ChatRequestStatus.PENDING, ChatRequestStatus.APPROVED],
          },
          OR: [{ fromUserId: currentUserId }, { toUserId: currentUserId }],
        },
      }),
    ]);

    const blockedUserIds = new Set<number>();
    for (const request of relatedRequests) {
      blockedUserIds.add(request.fromUserId === currentUserId ? request.toUserId : request.fromUserId);
    }

    return users
      .filter((user) => !blockedUserIds.has(user.id))
      .map((user) => this.serializeUser(user));
  }

  async getConnections(currentUserId: number) {
    const requests = await this.prisma.chatRequest.findMany({
      where: {
        status: ChatRequestStatus.APPROVED,
        OR: [
          { fromUserId: currentUserId },
          { toUserId: currentUserId },
        ],
      },
      include: {
        fromUser: true,
        toUser: true,
      },
      orderBy: { updatedAt: "desc" },
    });

    return requests.map((request) => {
      const user =
        request.fromUserId === currentUserId ? request.toUser : request.fromUser;

      return this.serializeUser(user);
    });
  }

  async findById(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException("User not found.");
    }

    return user;
  }

  private serializeUser(user: {
    id: number;
    name: string;
    email: string;
    avatarUrl: string | null;
    status: unknown;
    lastSeenAt: Date | null;
  }) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      status: user.status,
      lastSeenAt: user.lastSeenAt,
    };
  }
}
