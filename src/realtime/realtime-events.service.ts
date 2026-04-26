import { Injectable } from "@nestjs/common";
import { Server } from "socket.io";

@Injectable()
export class RealtimeEventsService {
  private server: Server | null = null;

  registerServer(server: Server) {
    this.server = server;
  }

  emitToUser(userId: number, event: string, payload: unknown) {
    this.server?.to(this.userRoom(userId)).emit(event, payload);
  }

  emitToUsers(userIds: number[], event: string, payload: unknown) {
    const uniqueUserIds = Array.from(new Set(userIds));
    for (const userId of uniqueUserIds) {
      this.emitToUser(userId, event, payload);
    }
  }

  private userRoom(userId: number) {
    return `user:${userId}`;
  }
}
