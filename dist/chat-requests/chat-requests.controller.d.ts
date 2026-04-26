import { ChatRequestsService } from "./chat-requests.service";
import { CreateChatRequestDto } from "./dto/create-chat-request.dto";
import { UpdateChatRequestDto } from "./dto/update-chat-request.dto";
export declare class ChatRequestsController {
    private readonly chatRequestsService;
    constructor(chatRequestsService: ChatRequestsService);
    list(user: {
        userId: number;
    }): Promise<{
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
    create(user: {
        userId: number;
    }, dto: CreateChatRequestDto): Promise<{
        id: number;
        status: import(".prisma/client").$Enums.ChatRequestStatus;
        createdAt: Date;
        updatedAt: Date;
        toUserId: number;
        fromUserId: number;
    }>;
    update(user: {
        userId: number;
    }, id: number, dto: UpdateChatRequestDto): Promise<{
        id: number;
        status: import(".prisma/client").$Enums.ChatRequestStatus;
        createdAt: Date;
        updatedAt: Date;
        toUserId: number;
        fromUserId: number;
    }>;
}
