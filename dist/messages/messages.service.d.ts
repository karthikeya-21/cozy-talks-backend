import { AiService } from "../ai/ai.service";
import { ChatRequestsService } from "../chat-requests/chat-requests.service";
import { PrismaService } from "../prisma/prisma.service";
import { RealtimeEventsService } from "../realtime/realtime-events.service";
import { UsersService } from "../users/users.service";
import { CreateMessageDto } from "./dto/create-message.dto";
export declare class MessagesService {
    private readonly prisma;
    private readonly chatRequestsService;
    private readonly usersService;
    private readonly aiService;
    private readonly realtimeEvents;
    private readonly logger;
    constructor(prisma: PrismaService, chatRequestsService: ChatRequestsService, usersService: UsersService, aiService: AiService, realtimeEvents: RealtimeEventsService);
    getConversation(currentUserId: number, otherUserId: number): Promise<{
        id: number;
        fromUserId: number;
        toUserId: number;
        senderName: string;
        content: string;
        type: import(".prisma/client").$Enums.MessageType;
        mediaUrl: string | null;
        createdAt: Date;
    }[]>;
    create(currentUserId: number, dto: CreateMessageDto): Promise<{
        id: number;
        fromUserId: number;
        toUserId: number;
        senderName: string;
        content: string;
        type: import(".prisma/client").$Enums.MessageType;
        mediaUrl: string | null;
        createdAt: Date;
    }>;
    private maybeReplyAsCozyBot;
}
