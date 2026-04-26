import { OnGatewayConnection, OnGatewayDisconnect } from "@nestjs/websockets";
import { JwtService } from "@nestjs/jwt";
import { Server, Socket } from "socket.io";
import { PrismaService } from "../prisma/prisma.service";
import { MessagesService } from "../messages/messages.service";
import { RealtimeEventsService } from "./realtime-events.service";
import { SocketMessageDto } from "./dto/socket-message.dto";
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly jwtService;
    private readonly prisma;
    private readonly messagesService;
    private readonly realtimeEvents;
    server: Server;
    constructor(jwtService: JwtService, prisma: PrismaService, messagesService: MessagesService, realtimeEvents: RealtimeEventsService);
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): Promise<void>;
    handleMessage(client: Socket, payload: SocketMessageDto): Promise<{
        id: number;
        fromUserId: number;
        toUserId: number;
        senderName: string;
        content: string;
        type: import(".prisma/client").$Enums.MessageType;
        mediaUrl: string | null;
        createdAt: Date;
    }>;
    private extractToken;
    private userRoom;
}
