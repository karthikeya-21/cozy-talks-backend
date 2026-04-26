import { Server } from "socket.io";
export declare class RealtimeEventsService {
    private server;
    registerServer(server: Server): void;
    emitToUser(userId: number, event: string, payload: unknown): void;
    emitToUsers(userIds: number[], event: string, payload: unknown): void;
    private userRoom;
}
