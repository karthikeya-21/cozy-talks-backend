import { CreateMessageDto } from "./dto/create-message.dto";
import { MessagesService } from "./messages.service";
export declare class MessagesController {
    private readonly messagesService;
    constructor(messagesService: MessagesService);
    getConversation(user: {
        userId: number;
    }, otherUserId: number): Promise<{
        id: number;
        fromUserId: number;
        toUserId: number;
        senderName: string;
        content: string;
        type: import(".prisma/client").$Enums.MessageType;
        mediaUrl: string | null;
        createdAt: Date;
    }[]>;
    create(user: {
        userId: number;
    }, dto: CreateMessageDto): Promise<{
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
