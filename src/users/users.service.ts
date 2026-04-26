import { Injectable, Logger, NotFoundException, OnModuleInit } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import { ChatRequestStatus, UserStatus } from "@prisma/client";

import { PrismaService } from "../prisma/prisma.service";
import { COZY_BOT_EMAIL, COZY_BOT_NAME, isCozyBotEmail } from "./cozy-bot.constants";

@Injectable()
export class UsersService implements OnModuleInit {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    try {
      await this.ensureCozyBotUser();
      this.logger.log("Cozy Bot user ensured during startup.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown Cozy Bot startup error.";
      this.logger.error(`Failed to ensure Cozy Bot user during startup: ${message}`);
    }
  }

  async discoverUsers(currentUserId: number, query?: string) {
    await this.ensureCozyBotConnection(currentUserId);

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
    await this.ensureCozyBotConnection(currentUserId);

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

    const users = requests.map((request) => {
      const user = request.fromUserId === currentUserId ? request.toUser : request.fromUser;

      return this.serializeUser(user);
    });

    users.sort((left, right) => {
      const leftIsBot = isCozyBotEmail(left.email);
      const rightIsBot = isCozyBotEmail(right.email);

      if (leftIsBot && !rightIsBot) {
        return -1;
      }

      if (!leftIsBot && rightIsBot) {
        return 1;
      }

      return 0;
    });

    return users;
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

  async ensureCozyBotConnection(userId: number) {
    const botUser = await this.ensureCozyBotUser();
    if (botUser.id === userId) {
      return botUser;
    }

    const existingConnection = await this.prisma.chatRequest.findFirst({
      where: {
        OR: [
          {
            fromUserId: botUser.id,
            toUserId: userId,
          },
          {
            fromUserId: userId,
            toUserId: botUser.id,
          },
        ],
      },
    });

    if (existingConnection) {
      if (existingConnection.status !== ChatRequestStatus.APPROVED) {
        await this.prisma.chatRequest.update({
          where: { id: existingConnection.id },
          data: {
            status: ChatRequestStatus.APPROVED,
          },
        });
      }

      return botUser;
    }

    await this.prisma.chatRequest.create({
      data: {
        fromUserId: botUser.id,
        toUserId: userId,
        status: ChatRequestStatus.APPROVED,
      },
    });

    return botUser;
  }

  async ensureCozyBotUser() {
    const existingBot = await this.prisma.user.findUnique({
      where: { email: COZY_BOT_EMAIL },
    });

    if (existingBot) {
      if (
        existingBot.name !== COZY_BOT_NAME ||
        existingBot.status !== UserStatus.ONLINE ||
        !existingBot.lastSeenAt
      ) {
        return this.prisma.user.update({
          where: { id: existingBot.id },
          data: {
            name: COZY_BOT_NAME,
            status: UserStatus.ONLINE,
            lastSeenAt: new Date(),
          },
        });
      }

      return existingBot;
    }

    const passwordHash = await bcrypt.hash(randomBytes(32).toString("hex"), 10);

    return this.prisma.user.create({
      data: {
        name: COZY_BOT_NAME,
        email: COZY_BOT_EMAIL,
        passwordHash,
        avatarUrl: null,
        status: UserStatus.ONLINE,
        lastSeenAt: new Date(),
      },
    });
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
