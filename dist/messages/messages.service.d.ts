import { ChatRequestsService } from "../chat-requests/chat-requests.service";
import { PrismaService } from "../prisma/prisma.service";
import { CreateMessageDto } from "./dto/create-message.dto";
export declare class MessagesService {
    private readonly prisma;
    private readonly chatRequestsService;
    constructor(prisma: PrismaService, chatRequestsService: ChatRequestsService);
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
}
