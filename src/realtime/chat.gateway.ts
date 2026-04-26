import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { BadRequestException, UsePipes, ValidationPipe } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { MessageType, UserStatus } from "@prisma/client";
import { Server, Socket } from "socket.io";

import { PrismaService } from "../prisma/prisma.service";
import { MessagesService } from "../messages/messages.service";
import { RealtimeEventsService } from "./realtime-events.service";
import { SocketMessageDto } from "./dto/socket-message.dto";

@WebSocketGateway({
  namespace: "chat",
  cors: {
    origin: process.env.FRONTEND_URL ?? "http://localhost:3000",
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly messagesService: MessagesService,
    private readonly realtimeEvents: RealtimeEventsService,
  ) {}

  async handleConnection(client: Socket) {
    const token = this.extractToken(client);

    if (!token) {
      client.disconnect();
      return;
    }

    try {
      const payload = await this.jwtService.verifyAsync<{ sub: number; email: string }>(token);
      client.data.userId = payload.sub;
      client.join(this.userRoom(payload.sub));
      this.realtimeEvents.registerServer(this.server);

      await this.prisma.user.update({
        where: { id: payload.sub },
        data: {
          socketId: client.id,
          status: UserStatus.ONLINE,
          lastSeenAt: new Date(),
        },
      });

      this.server.emit("presence:update", {
        userId: payload.sub,
        status: UserStatus.ONLINE,
        lastSeenAt: new Date(),
      });
    } catch {
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    const userId = client.data.userId as number | undefined;

    if (!userId) {
      return;
    }

    const remainingSockets = await this.server.in(this.userRoom(userId)).fetchSockets();
    if (remainingSockets.length > 0) {
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          socketId: remainingSockets[0].id,
          status: UserStatus.ONLINE,
        },
      });
      return;
    }

    const disconnectedAt = new Date();

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        socketId: null,
        status: UserStatus.OFFLINE,
        lastSeenAt: disconnectedAt,
      },
    });

    this.server.emit("presence:update", {
      userId,
      status: UserStatus.OFFLINE,
      lastSeenAt: disconnectedAt,
    });
  }

  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @SubscribeMessage("message:send")
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: SocketMessageDto,
  ) {
    const fromUserId = client.data.userId as number | undefined;
    if (!fromUserId) {
      throw new BadRequestException("Unauthenticated socket connection.");
    }

    const message = await this.messagesService.create(fromUserId, {
      toUserId: payload.toUserId,
      content: payload.content,
      type: payload.type ?? MessageType.TEXT,
      mediaUrl: payload.mediaUrl,
    });

    this.server.to(this.userRoom(fromUserId)).emit("message:received", message);
    this.server.to(this.userRoom(payload.toUserId)).emit("message:received", message);

    return message;
  }

  private extractToken(client: Socket) {
    const authToken = client.handshake.auth?.token as string | undefined;
    if (authToken) {
      return authToken;
    }

    const authorizationHeader = client.handshake.headers.authorization;
    if (!authorizationHeader) {
      return null;
    }

    const [scheme, token] = authorizationHeader.split(" ");
    if (scheme?.toLowerCase() !== "bearer" || !token) {
      return null;
    }

    return token;
  }

  private userRoom(userId: number) {
    return `user:${userId}`;
  }
}
