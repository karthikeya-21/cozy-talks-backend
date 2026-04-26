import { PrismaService } from "../prisma/prisma.service";
import { RealtimeEventsService } from "../realtime/realtime-events.service";
import { CreateChatRequestDto } from "./dto/create-chat-request.dto";
import { ChatRequestAction } from "./dto/update-chat-request.dto";
export declare class ChatRequestsService {
    private readonly prisma;
    private readonly realtimeEvents;
    constructor(prisma: PrismaService, realtimeEvents: RealtimeEventsService);
    create(currentUserId: number, dto: CreateChatRequestDto): Promise<{
        id: number;
        status: import(".prisma/client").$Enums.ChatRequestStatus;
        createdAt: Date;
        updatedAt: Date;
        toUserId: number;
        fromUserId: number;
    }>;
    list(currentUserId: number): Promise<{
        id: number;
        fromUserId: number;
        toUserId: number;
        status: import(".prisma/client").$Enums.ChatRequestStatus;
        notificationType: string;
        user: {
            id: number;
            name: string;
            email: string;
            avatarUrl: string | null;
        };
    }[]>;
    update(currentUserId: number, requestId: number, action: ChatRequestAction): Promise<{
        id: number;
        status: import(".prisma/client").$Enums.ChatRequestStatus;
        createdAt: Date;
        updatedAt: Date;
        toUserId: number;
        fromUserId: number;
    }>;
    areUsersConnected(firstUserId: number, secondUserId: number): Promise<boolean>;
}
